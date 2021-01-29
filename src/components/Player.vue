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
      <PlayerNameTag />
      <div class="col-sx-12 col-sm-5 respBtns">
        <q-btn v-if="player.playlistPlay" color="red" flat round icon="playlist_play" @click="setPlaylistPlay">
          <q-tooltip>Play with Playlist</q-tooltip>
        </q-btn>
        <q-btn v-else flat round color="white" icon="playlist_play" @click="setPlaylistPlay">
          <q-tooltip>Play with Playlist</q-tooltip>
        </q-btn>
        <q-btn v-if="player.playlistPlay" flat round icon="skip_previous" @click="previous" />
        <!-- play btn -->
        <q-btn v-if="!player.playing" flat round icon="play_arrow" @click="play()">
          <q-tooltip>Start the broadcast process</q-tooltip>
        </q-btn>
        <q-btn v-else flat round color="green" icon="pause" @click="$refs.audio.pause()" />
        <!-- stop btn -->
        <q-btn flat round icon="stop" @click="stop">
          <q-tooltip>Stop the broadcast process</q-tooltip>
        </q-btn>

        <q-btn v-if="player.playlistPlay" flat round icon="skip_next" @click="next" />
        <!-- loop button  -->
        <q-btn v-if="loop" color="yellow" flat round icon="loop" @click="setLoop">
          <q-tooltip>One file is played repeatedly</q-tooltip>
        </q-btn>
        <q-btn v-else color="white" flat round icon="loop" @click="setLoop">
          <q-tooltip>One file is played repeatedly</q-tooltip>
        </q-btn>
        <q-btn flat round icon="eject" @click="$refs.file.pickFiles()">
          <q-tooltip>Open file for play</q-tooltip>
        </q-btn>
      </div>
      <div class="row no-wrap col-sx-12 col-sm-3 respBtns">
        <q-separator class="q-mx-md" vertical />
        <q-btn v-if="!mute" flat round icon="volume_up" @click="setMute"></q-btn>
        <q-btn v-else color="red" flat round icon="volume_off" @click="setMute"></q-btn>
        <q-slider
          class="q-mx-sm"
          style="max-width: 150px"
          v-model="volume"
          :min="0"
          :max="100"
          label
          color="teal"
          @input="changeVol"
        />
      </div>
    </div>
    <q-dialog v-model="progressDialog">
      <PlayProgress
        :currentTime="currentTime"
        :duration="duration"
        :timeLabel="timeLabel"
        :player="player"
        @changeTime="changeTime"
        @pause="$refs.audio.pause()"
        @play="play"
        @stop="stop"
        @close="progressDialog=!progressDialog"
      />
    </q-dialog>
    <audio
      ref="audio"
      :loop='loop'
      :muted="mute"
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
import { Scheduler } from '../mixins/scheduler'
import PlayerNameTag from './PlayerNameTag'
import PlayProgress from './PlayProgress'

export default {
  name: 'componetPlayer',
  mixins: [Player, Scheduler],
  components: { PlayerNameTag, PlayProgress },
  data () {
    return {
      currentTime: null,
      timeLabel: 0,
      duration: 100,
      loop: false,
      volume: 0,
      mute: false,
      progressDialog: false
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
    this.$root.$on('change-audiooutput', (current) => {
      this.$refs.audio.setSinkId(current.deviceId)
    })
    ipcRenderer.on('returnMeta', (event, meta) => {
      this.$store.commit('playFile/updateMeta', meta)
    })
    this.volume = this.$refs.audio.volume * 100
  },
  methods: {
    async open (data) {
      await this.openFile(data)
      this.$refs.audio.load()
    },
    async ended () {
      this.stop()
    },
    async play () {
      const brocastZones = await this.selectZonesToString(true)
      if (this.player.globalPlaying) {
        this.$refs.audio.play()
      } else if (!this.player.file) {
        this.$refs.file.pickFiles()
      } else if (this.status.selected.length === 0) {
        this.$q.dialog({
          title: 'Alert',
          message: 'Please select broadcast zones'
        })
      } else {
        this.$q.dialog({
          title: 'Play',
          message: `
            <div class="q-mx-md">
              <div class="q-my-sm">
                <span class="text-weight-bold">Play File : </span>
                <span>${this.player.file.name}</span>
              </div>
              <div class="q-my-sm">
                <span class="text-weight-bold">Zones : </span>
                <span>${brocastZones.names}</span>
              </div>
            </div>  
            `,
          html: true,
          cancel: true
        }).onOk(async () => {
          await ipcRenderer.sendSync('udpsend', brocastZones.string)
          if (this.status.playlock) {
            this.progressDialog = true
          }
          this.$store.commit('playFile/play', true)
          this.$refs.audio.play()
        })
      }
    },
    async stop () {
      await this.$refs.audio.pause()
      this.progressDialog = false
      if (this.player.globalPlaying) {
        const brocastZones = await this.selectZonesToString(false)
        const result = await ipcRenderer.sendSync('udpsend', brocastZones.string)
        console.log(result)
        this.$store.commit('playFile/play', false)
      }
      this.$refs.audio.currentTime = 0
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
    setLoop () {
      if (this.player.playerlistLoop) {
        this.loop = false
      } else {
        this.loop = !this.loop
      }
    },
    setMute () {
      this.mute = !this.mute
      this.$refs.audio.muted = this.mute
    },
    changeVol (value) {
      this.$refs.audio.volume = value / 100
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
