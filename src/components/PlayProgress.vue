<template>
  <q-card
    square
    style="min-width: 400px"
  >
    <q-card-section style="background: gray; color: white">
      Play Progress
    </q-card-section>
    <q-card-section class="flex flex-center">
      <q-circular-progress
        show-value
        font-size="12px"
        :value="currentTime"
        :min="0"
        :max="duration"
        size="120px"
        :thickness="0.22"
        color="teal"
        track-color="blue-grey-3"
        class="q-ma-md"
      >
        {{ msToHms(currentTime * 1000) }}
      </q-circular-progress>
    </q-card-section>
    <q-card-actions align="right">
      <q-btn flat>Pause</q-btn>
      <q-btn flat>Stop</q-btn>
    </q-card-actions>
  </q-card>
</template>

<script>
import { ms, h, m, s } from 'time-convert'

export default {
  props: ['duration', 'currentTime'],
  data () {
    return {
      value: 81
    }
  },
  methods: {
    msToHms (time) {
      return ms.to(h, m, s)(time).map(n => n < 10 ? '0' + n : n.toString()).join(':')
    }
  }
}
</script>
