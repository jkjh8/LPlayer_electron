<template>
  <div>
    <div class="row">
      <q-slider
        class="q-mx-md"
        v-model="currentTime"
        :max="duration"
        snap
        label
        :label-value="hCurrentTime"
        color="pink"
        @input="changeTime"
      />
    </div>
    <div class="q-ma-md row justify-center items-center content-center">
      <div v-if="file" class="col-xs-12 col-sm-6">
        <div v-if="playlistPlay">
          Playlist Play
        </div>
        <div
          v-if="meta && meta.media.track[0].Title"
          class="text-weight-bold respText"
        >
          {{ meta.media.track[0].Title }}
        </div>
        <div
          v-else-if="meta && meta.media.track[0].Track"
          class="text-weight-bold respText"
        >
          {{ meta.media.track[0].Track }}
        </div>
        <div
          v-else
          class="text-weight-bold respText"
        >
          {{ file.name }}
        </div>

        <div
          v-if="meta && meta.media.track[0].Director"
         class="text-grey respText"
        >
          {{ meta.media.track[0].Director }}
        </div>
        <div
          v-else-if="meta && meta.media.track[0].Album"
          class="text-grey respText"
        >
          {{ meta.media.track[0].Album }}
        </div>
        <div
          v-else-if="meta && meta.media.track[0].OriginalSourceForm_Name"
          class="text-grey respText"
        >
          {{ meta.media.track[0].OriginalSourceForm_Name }}
        </div>
        <div
          v-else-if="meta && meta.media.track[0].Performer"
          class="text-grey respText"
        >
          {{ meta.media.track[0].Performer }}
        </div>
        <div
          v-else
          class="text-grey respText"
        >
          {{ file.name }}
        </div>
      </div>
      <div v-else class="col-xs-12 col-sm-6">
        <div class="text-weight-bold respText">None</div>
        <div class="text-grey respText">None</div>
      </div>
      <div class="col-sx-12 col-sm-6 respBtns">
        <q-btn v-if="playlistPlay" color="red" flat round icon="playlist_play" @click="setPlaylistPlay" />
        <q-btn v-else flat round color="white" icon="playlist_play" @click="setPlaylistPlay" />
        <q-btn v-if="playlistPlay" flat round icon="skip_previous" @click="previous" />
        <!-- play btn -->
        <q-btn v-if="!playing" flat round icon="play_arrow" @click="play()" />
        <q-btn v-else flat round icon="pause" @click="$refs.audio.pause()" />
        <!-- stop btn -->
        <q-btn flat round icon="stop" @click="stop"></q-btn>

        <q-btn v-if="playlistPlay" flat round icon="skip_next" @click="next" />
        <!-- loop button  -->
        <q-btn v-if="loop" color="yellow" flat round icon="loop" @click="setLoop" />
        <q-btn v-else color="white" flat round icon="loop" @click="setLoop" />

        <q-btn flat round icon="eject" @click="$refs.file.pickFiles()" />
      </div>
    </div>

    <audio
      ref="audio"
      :loop='loop'
      @playing="playing=true"
      @ended="ended"
      @timeupdate="onTimeUpdate"
      @loadeddata="ready"
      @pause="playing=false"
    >
      <source :src="source">
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
      hCurrentTime: 0,
      duration: 100,
      hDration: 0,
      playing: false,
      meta: null,
      loop: false,
      playAndZoneSel: false
    }
  },
  computed: {
    ...mapState({
      file: state => state.playFile.currentFile,
      source: state => state.playFile.source,
      playlistLoop: state => state.playlist.playlistLoop,
      playlistPlay: state => state.playlist.playlistPlay,
      currentPlaylist: state => state.playlist.currentPlaylist,
      selected: state => state.status.selected,
      status: state => state.status.status
    })
  },
  mounted () {
    this.$root.$on('changePlayFile', async (file) => {
      this.chgPlayFile(file)
    })
    ipcRenderer.on('returnMeta', (event, fileMeta) => {
      this.meta = fileMeta
    })
  },
  methods: {
    async open (data) {
      await this.openFile(data)
      await this.loadFile()
      this.$store.dispatch('playlist/playlistPlay', false)
    },
    async ended () {
      await this.$store.dispatch('playFile/updatePlayFile', null)
      this.loadFile()
      this.currentTime = null
    },
    play () {
      if (this.playAndZoneSel) {
        this.$refs.audio.play()
      } else {
        this.$q.dialog({
          title: 'Play',
          message: `<div>Play ${this.file.name}</div><div>At ETC...</div>`,
          html: true,
          cancel: true
        }).onOk(async () => {
          this.playAndZoneSel = true
          this.$refs.audio.play()
        })
      }
    },
    playingCallback (e) {
      console.log('playing', e)
      this.playing = true
    },
    async stop () {
      await this.$refs.audio.pause()
      if (this.playAndZoneSel) {
        this.$q.notify({
          type: 'info',
          message: `Player Stop Play ${this.file.name}.`
        })
        this.playAndZoneSel = false
      }
      setTimeout(() => {
        this.currentTime = 0
      }, 100)
    },
    ready () {
      this.duration = this.$refs.audio.duration
      this.hDration = this.msToHms(this.duration * 1000)
    },
    changeTime (value) {
      this.$refs.audio.currentTime = value
    },
    previous () {
      this.$root.$emit('playlist-previous')
    },
    next () {
      this.$root.$emit('playlist-next')
    },
    setLoop () {
      if (this.playlistLoop) {
        this.loop = false
      } else {
        this.loop = !this.loop
      }
    },
    setPlaylistPlay () {
      this.$store.dispatch('playlist/playlistPlay', !this.playlistPlay)
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
