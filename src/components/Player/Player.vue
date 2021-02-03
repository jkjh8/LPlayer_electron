<template>
  <div>
    <TimeSlider />
    <div class="q-ma-md row self-end">
      <PlayerNameTag />
      <div class="row no-wrap col-sx-12 col-sm-3 col-md-4 col-xl-5 respBtns">
        <q-btn
          :color="player.playMode==='Playlist' ? 'red' : ''"
          flat
          round
          icon="playlist_play"
          @click="setPlayMode"
        >
          <q-tooltip>Play with Playlist</q-tooltip>
        </q-btn>
        <PlayBtns />
        <q-btn flat round icon="eject" @click="$refs.file.pickFiles()">
          <q-tooltip>Open file for play</q-tooltip>
        </q-btn>
      </div>
      <div class="row no-wrap col-sx-12 col-sm-3 col-md-2 col-xl-1 respBtns">
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
import { playerEvent } from '../../mixins/playEvnet'
import TimeSlider from './timeSlider'
import PlayerNameTag from './PlayerNameTag'
import PlayProgress from './PlayProgress'
import PlayConfirm from './PlayConfirm'
import PlayBtns from './PlayBtns'
import Volume from './Volume'

export default {
  name: 'componetPlayer',
  mixins: [BroadcastZone, Scheduler, msToHms, playerEvent],
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
  mounted: function () {
    this.$root.$on('changePlayFile', this.chgPlayFile)
    this.$root.$on('play', this.playConfirm)
    this.$root.$on('stop', this.stop)
    this.$root.$on('mute', this.mute)
    this.$root.$on('vol', this.updateVol)
    this.$root.$on('changePlayTime', this.changeTime)
    this.$root.$on('change-audiooutput', this.setAudioDevice)
    this.volume = this.$refs.audio.volume * 100
  },
  methods: {
    async open (data) {
      await this.$store.dispatch('playFile/playing', false)
      await this.openFile(data)
      await this.$refs.audio.load()
    },
    async playConfirm () {
      // if playing
      if (this.player.playing) {
        return this.$refs.audio.pause()
      }
      // if none select file
      if (!this.player.file) {
        return this.$refs.file.pickFiles()
      }
      // if no select broadcast zone
      if (this.status.selected.length === 0) {
        const msg = {
          type: 'negative',
          position: 'top',
          message: 'Please select broadcast zones!'
        }
        return this.$q.notify(msg)
      }
      // breadcast zones overlap check
      const overlap = await this.checkOverlapZones(this.status.selected)
      console.log('overlap', overlap)
      if (overlap) {
        const msg = {
          type: 'negative',
          position: 'top',
          message: 'Please check broadcast zones'
        }
        return this.$q.notify(msg)
      }
      this.playconfirmDialog = true
      // if (this.player.globalPlaying) {
      //   this.$refs.audio.play()
      // } else {
      //   this.playconfirmDialog = true
      // }
    },
    async play () {
      const result = await this.calZoneSelect('start', this.status.selected)
      console.log(result)
      await ipcRenderer.sendSync('udpsend', this.player.broadcastZone.idx)
      if (this.status.playlock) {
        this.progressDialog = true
      }
      this.$store.commit('playFile/play', true)
      setTimeout(() => {
        this.$refs.audio.play()
      }, 1000)
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
    async ended () {
      if (this.player.playMode === 'Playlist') {
        if (this.playlist.length - 1 === this.idx) {
          if (this.player.playlistLoop) {
            return this.$root.$emit('playlist-next')
          }
          this.stop()
        } else {
          this.$root.$emit('playlist-next')
        }
      } else if (this.player.playMode === 'Schedule') {
        this.stop()
      } else {
        this.stop()
      }
      console.log('ended')
    },
    changeTime (value) {
      this.$refs.audio.currentTime = value
    },
    async mute () {
      await this.$store.dispatch('playFile/updateMute')
      this.$refs.audio.muted = this.player.mute
    },
    updateVol (value) {
      this.$store.commit('playFile/updateVol', value)
      this.$refs.audio.volume = value / 100
    },
    async chgPlayFile (file) {
      await this.$store.dispatch('playFile/updatePlayFile', file)
      await ipcRenderer.send('reqMeta', this.player.file.path)
      await this.$refs.audio.load()
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
