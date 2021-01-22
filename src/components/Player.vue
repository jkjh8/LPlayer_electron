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
        <q-btn flat round icon="skip_previous" />
        <q-btn v-if="!played" flat round icon="play_arrow" @click="$refs.audio.play()" />
        <q-btn v-else flat round icon="pause" @click="$refs.audio.pause()" />
        <q-btn flat round icon="skip_next" />
        <q-btn flat round icon="loop" />
        <q-btn flat round icon="eject" @click="$refs.file.pickFiles()" />
      </div>
    </div>

    <audio
      ref="audio"
      @playing="played=true"
      @ended="ended"
      @timeupdate="onTimeUpdate"
      @loadeddata="ready"
      @pause="played=false"
    >
      <source :src="source">
    </audio>

    <q-file v-show="false" ref="file" accept='audio/*' @input="open"></q-file>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'
const { ms, h, m, s } = require('time-convert')
import { mapState } from 'vuex'

export default {
  name: 'componetPlayer',
  data () {
    return {
      currentTime: null,
      hCurrentTime: 0,
      duration: 100,
      hDration: 0,
      played: false,
      source: '',
      meta: null
    }
  },
  computed: {
    ...mapState({
      file: state => state.playFile.currentFile
    })
  },
  mounted () {
    ipcRenderer.on('returnMeta', (event, fileMeta) => {
      this.meta = fileMeta
      console.log(this.meta)
    })
  },
  methods: {
    async open (data) {
      this.$store.dispatch('playFile/updatePlayFile', data)
      this.source = `http://localhost:8082/stream?file=${encodeURIComponent(this.file.path)}`
      ipcRenderer.send('reqMeta', this.file.path)
      this.$refs.audio.load()
      this.played = false
    },
    ended () {
      console.log('end')
    },
    onTimeUpdate () {
      this.currentTime = this.$refs.audio.currentTime
      this.hCurrentTime = this.msToHms(this.currentTime * 1000) + '/' + this.hDration
    },
    playing (e) {
      console.log('playing', e)
    },
    ready () {
      this.duration = this.$refs.audio.duration
      this.hDration = this.msToHms(this.duration * 1000)
    },
    changeTime (value) {
      this.$refs.audio.currentTime = value
    },
    msToHms (time) {
      return ms.to(h, m, s)(time).map(n => n < 10 ? '0' + n : n.toString()).join(':')
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
