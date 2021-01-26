<template>
  <div>
    <div class="row">
      <q-slider
        class="q-mx-md"
        v-model="currentTime"
        :max="duration"
        snap
        label
        :label-value="timeLabel"
        color="pink"
        @input="changeTime"
      />
    </div>
    <div class="q-ma-md row justify-center items-center content-center">
      <div v-if="player.file" class="col-xs-12 col-sm-6">
        <div v-if="player.playlistPlay">
          Playlist Play
        </div>
        <div
          v-if="player.meta && player.meta.media.track[0].Title"
          class="text-weight-bold respText"
        >
          {{ player.meta.media.track[0].Title }}
        </div>
        <div
          v-else-if="player.meta && player.meta.media.track[0].Track"
          class="text-weight-bold respText"
        >
          {{ player.meta.media.track[0].Track }}
        </div>
        <div
          v-else
          class="text-weight-bold respText"
        >
          {{ player.file.name }}
        </div>

        <div
          v-if="player.meta && player.meta.media.track[0].Director"
         class="text-grey respText"
        >
          {{ player.meta.media.track[0].Director }}
        </div>
        <div
          v-else-if="player.meta && player.meta.media.track[0].Album"
          class="text-grey respText"
        >
          {{ player.meta.media.track[0].Album }}
        </div>
        <div
          v-else-if="player.meta && player.meta.media.track[0].OriginalSourceForm_Name"
          class="text-grey respText"
        >
          {{ player.meta.media.track[0].OriginalSourceForm_Name }}
        </div>
        <div
          v-else-if="player.meta && player.meta.media.track[0].Performer"
          class="text-grey respText"
        >
          {{ player.meta.media.track[0].Performer }}
        </div>
        <div
          v-else
          class="text-grey respText"
        >
          {{ player.file.name }}
        </div>
      </div>
      <div v-else class="col-xs-12 col-sm-6">
        <div class="text-weight-bold respText">None</div>
        <div class="text-grey respText">None</div>
      </div>
      <div class="col-sx-12 col-sm-6 respBtns">
        <q-btn v-if="player.playlistPlay" color="red" flat round icon="playlist_play" @click="setPlaylistPlay" />
        <q-btn v-else flat round color="white" icon="playlist_play" @click="setPlaylistPlay" />
        <q-btn v-if="player.playlistPlay" flat round icon="skip_previous" @click="previous" />
        <!-- play btn -->
        <q-btn v-if="!player.playing" flat round icon="play_arrow" @click="play()" />
        <q-btn v-else flat round icon="pause" @click="$refs.audio.pause()" />
        <!-- stop btn -->
        <q-btn flat round icon="stop" @click="stop"></q-btn>

        <q-btn v-if="player.playlistPlay" flat round icon="skip_next" @click="next" />
        <!-- loop button  -->
        <q-btn v-if="loop" color="yellow" flat round icon="loop" @click="setLoop" />
        <q-btn v-else color="white" flat round icon="loop" @click="setLoop" />

        <q-btn flat round icon="eject" @click="$refs.file.pickFiles()" />
      </div>
    </div>

    <audio
      ref="audio"
      :loop='loop'
      @playing="$store.dispatch('playFile/playing', true)"
      @ended="ended"
      @timeupdate="onTimeUpdate"
      @loadeddata="ready"
      @pause="$store.dispatch('playFile/playing', false)"
    >
      <source :src="player.source">
    </audio>

    <q-file v-show="false" ref="file" accept='audio/*' @input="open"></q-file>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'
import { mapState } from 'vuex'
import { Player } from '../mixins/player'

export default {
  name: 'componetPlayer',
  mixins: [Player],
  data () {
    return {
      currentTime: null,
      timeLabel: 0,
      duration: 100,
      loop: false
    }
  },
  computed: {
    ...mapState({
      player: state => state.playFile.player,
      playlist: state => state.playlist.playlist,
      status: state => state.status.status
    })
  },
  mounted () {
    this.$root.$on('changePlayFile', async (file) => {
      this.chgPlayFile(file)
    })
    ipcRenderer.on('returnMeta', (event, meta) => {
      this.$store.commit('playFile/updateMeta', meta)
    })
  },
  methods: {
    async open (data) {
      await this.openFile(data)
      await this.loadFile()
      this.$store.dispatch('playlist/playlistPlay', false)
    },
    async ended () {
      const brocastZones = await this.selectZonesToString(false)
      const result = await ipcRenderer.sendSync('udpsend', brocastZones.string)
      console.log(result)
      await this.$store.dispatch('playFile/updatePlayFile', null)
      this.loadFile()
      this.currentTime = null
    },
    async play () {
      if (!this.player.file) {
        return this.$refs.file.pickFiles()
      }
      const brocastZones = await this.selectZonesToString(true)
      if (this.player.globalPlaying) {
        this.$refs.audio.play()
      } else {
        this.$q.dialog({
          title: 'Play',
          message: `
            <div class="text-center">
              <div>Play ${this.player.file.name}</div>
              <div>At</div>
              <div>${brocastZones.names}</div>
            </div>  
            `,
          html: true,
          cancel: true
        }).onOk(async () => {
          const result = await ipcRenderer.sendSync('udpsend', brocastZones.string)
          console.log(result)
          this.$store.commit('playFile/play', true)
          this.$refs.audio.play()
        })
      }
    },
    async stop () {
      await this.$refs.audio.pause()
      if (this.player.globalPlaying) {
        const brocastZones = await this.selectZonesToString(false)
        const result = await ipcRenderer.sendSync('udpsend', brocastZones.string)
        console.log(result)
        this.$store.commit('playFile/play', false)
      }
      setTimeout(() => {
        this.$refs.audio.currentTime = 0
      }, 100)
    },
    ready () {
      this.duration = this.$refs.audio.duration
    },
    changeTime (value) {
      this.$refs.audio.currentTime = value
    },
    onTimeUpdate () {
      this.currentTime = this.$refs.audio.currentTime
      this.timeLabel = this.msToHms(this.currentTime * 1000) + '/' + this.msToHms(this.duration * 1000)
    },
    previous () {
      this.$root.$emit('playlist-previous')
    },
    next () {
      this.$root.$emit('playlist-next')
    },
    setLoop () {
      if (this.player.playerlistLoop) {
        this.loop = false
      } else {
        this.loop = !this.loop
      }
    },
    setPlaylistPlay () {
      this.$store.dispatch('playFile/playlistPlay', !this.player.playlistPlay)
    }
  }
}
</script>

<style>
@media (max-width: 599px) {
  .respText {
    text-align: center;
  }
  .respBtns {
    text-align: center;
  }
}
@media (min-width: 600px) {
  .respBtns {
    text-align: right;
  }
}
</style>
