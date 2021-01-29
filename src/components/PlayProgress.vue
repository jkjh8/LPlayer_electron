<template>
  <q-card
    square
    style="min-width: 400px"
  >
    <q-card-section style="background: gray; color: white">
      <q-circular-progress
        v-show="player.playing"
        indeterminate
        size="25px"
        :thickness="0.4"
        font-size="10px"
        color="lime"
        track-color="grey-3"
        center-color="grey-8"
        class="q-mx-sm"
      >
      </q-circular-progress>
      Play Progress
    </q-card-section>
    <q-card-section class="flex flex-center">
      <div>
        Mode: {{ player.playlistPlay ? 'Playlist' : 'File' }}
      </div>
      <div class="fit row">
        <q-slider
          class="q-mx-md"
          v-model="currentTime"
          :max="duration"
          snap
          label
          :label-value="timeLabel"
          color="pink"
          @input="$emit('changeTime', $event)"
        />
      </div>
    </q-card-section>
    <q-card-actions align="right">
      <q-btn v-if="player.playing" flat @click="$emit('pause')">Pause</q-btn>
      <q-btn v-else flat @click="$emit('play')">Play</q-btn>
      <q-btn flat @click="stop">Stop</q-btn>
    </q-card-actions>
  </q-card>
</template>

<script>
import { ms, h, m, s } from 'time-convert'

export default {
  props: ['duration', 'currentTime', 'timeLabel', 'player'],
  data () {
    return {
      value: 81
    }
  },
  methods: {
    stop () {
      this.$emit('stop')
      this.$emit('close')
    },
    msToHms (time) {
      return ms.to(h, m, s)(time).map(n => n < 10 ? '0' + n : n.toString()).join(':')
    }
  }
}
</script>
