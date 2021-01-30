<template>
  <div>
    <TimeSlider />
    <div class="q-ma-md row self-end">
      <PlayerNameTag />
      <div class="row no-wrap col-sx-12 col-sm-5 respBtns">
        <q-btn
          v-if="player.playMode==='Playlist'"
          color="red"
          flat
          round
          icon="playlist_play"
          @click="$store.commit('playFile/playMode', 'File')"
        >
          <q-tooltip>Play with Playlist</q-tooltip>
        </q-btn>
        <q-btn
          v-else
          flat
          round
          color="white"
          icon="playlist_play"
          @click="$store.commit('playFile/playMode', 'Playlist')"
        >
          <q-tooltip>Play with Playlist</q-tooltip>
        </q-btn>
        <PlayBtns />
        <q-btn flat round icon="eject" @click="$refs.file.pickFiles()">
          <q-tooltip>Open file for play</q-tooltip>
        </q-btn>
      </div>
      <div class="row no-wrap col-sx-12 col-sm-3 respBtns">
        <Volume />
      </div>
    </div>
    <q-dialog v-model="progressDialog">
      <PlayProgress
        :player="player"
        @pause="$refs.audio.pause()"
        @play="play"
        @stop="stop"
        @close="progressDialog=!progressDialog"
      />
    </q-dialog>
    <q-dialog v-model="playconfirmDialog">
      <PlayConfirm
        @play="play"
        @close="playconfirmDialog=!playconfirmDialog"
      />
    </q-dialog>
    <audio
      ref="audio"
      :loop="player.loop"
      :muted="player.mute"
      @playing="$store.dispatch('playFile/playing', true)"
      @ended="ended"
      @timeupdate="$root.$emit('updatePlayTime', $refs.audio.currentTime)"
      @loadeddata="$store.commit('playFile/updateDuration', $refs.audio.duration)"
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
import { BroadcastZone } from '../../mixins/broadcastZone'
import { msToHms } from '../../mixins/msToHMS'
import { Scheduler } from '../../mixins/scheduler'
import TimeSlider from './timeSlider'
import PlayerNameTag from './PlayerNameTag'
import PlayProgress from './PlayProgress'
import PlayConfirm from './PlayConfirm'
import PlayBtns from './PlayBtns'
import Volume from './Volume'

export default {
  name: 'componetPlayer',
  mixins: [BroadcastZone, Scheduler, msToHms],
  components: { TimeSlider, PlayerNameTag, PlayProgress, PlayConfirm, PlayBtns, Volume },
  data () {
    return {
      loop: false,
      volume: 0,
      progressDialog: false,
      playconfirmDialog: false
    }
  },
  computed: {
    ...mapState({
      player: state => state.playFile.player,
      playlist: state => state.playlist.playlist,
      idx: state => state.playlist.playlistIdx,
      status: state => state.status.status
    })
  },
  mounted () {
    this.$root.$on('changePlayFile', async (file) => {
      this.chgPlayFile(file)
    })
    this.$root.$on('pause', () => {
      this.$refs.audio.pause()
    })
    this.$root.$on('play', () => {
      this.playConfirm()
    })
    this.$root.$on('stop', () => {
      this.stop()
    })
    this.$root.$on('mute', async () => {
      this.$store.commit('playFile/updateMute')
      this.$refs.audio.muted = this.player.mute
    })
    this.$root.$on('vol', (value) => {
      this.$store.commit('playFile/updateVol', value)
      this.$refs.audio.volume = value / 100
      console.log(this.player.mute)
    })
    this.$root.$on('changePlayTime', (value) => {
      this.$refs.audio.currentTime = value
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
      await this.$store.dispatch('playFile/playing', false)
      await this.openFile(data)
      await this.$refs.audio.load()
    },
    async ended () {
      if (this.player.playMode === 'Playlist') {
        if (this.playlist.length - 1 === this.idx) {
          this.stop()
        } else {
          this.$root.$emit('playlist-next')
        }
      } else if (this.player.playMode === 'Schedule') {
        this.stop()
      }
      // this.stop()
      console.log('ended')
    },
    async playConfirm () {
      await this.selectZonesToString(true)
      if (this.player.globalPlaying) {
        this.$refs.audio.play()
      } else if (!this.player.file) {
        this.$refs.file.pickFiles()
      } else if (this.status.selected.length === 0) {
        this.$q.notify({
          type: 'negative',
          position: 'top',
          message: 'Please select broadcast zones!'
        })
      } else if (this.player.broadcastZone.overlap.length > 0) {
        this.$q.notify({
          type: 'negative',
          position: 'top',
          message: `Please check zones ${this.player.broadcastZone.overlap.join(',')}`
        })
      } else {
        this.playconfirmDialog = true
      }
    },
    async play () {
      await ipcRenderer.sendSync('udpsend', this.player.broadcastZone.idx)
      if (this.status.playlock) {
        this.progressDialog = true
      }
      this.$store.commit('playFile/play', true)
      this.$refs.audio.play()
    },
    async stop () {
      await this.$refs.audio.pause()
      this.progressDialog = false
      if (this.player.globalPlaying) {
        await this.selectZonesToString(false)
        const result = await ipcRenderer.sendSync('udpsend', this.player.broadcastZone.idx)
        console.log(result)
        this.$store.commit('playFile/play', false)
      }
      this.$refs.audio.currentTime = 0
    },
    changeTime (value) {
      this.$refs.audio.currentTime = value
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
    previous () {
      this.$root.$emit('playlist-previous')
    },
    next () {
      this.$root.$emit('playlist-next')
    },
    chgPlayFile (file) {
      this.$store.dispatch('playFile/updatePlayFile', file)
      this.$store.dispatch('playFile/playing', false)
      ipcRenderer.send('reqMeta', this.player.file.path)
      this.$refs.audio.load()
      if (this.player.globalPlaying) {
        this.$refs.audio.play()
      }
    },
    async openFile (file) {
      await this.$store.dispatch('playFile/updatePlayFile', file)
      ipcRenderer.send('reqMeta', this.player.file.path)
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
    justify-content: center;
  }
}
@media (min-width: 600px) {
  .respBtns {
    justify-content: flex-end;
  }
}
</style>
