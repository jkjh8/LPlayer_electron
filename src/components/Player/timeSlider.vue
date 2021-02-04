<template>
  <div class="fit row">
    <q-slider
      class="q-mx-md"
      v-model="time"
      :max="player.duration"
      snap
      label
      :label-value="`${msToHms(time * 1000)}/${msToHms(player.duration * 1000)}`"
      color="pink"
      @input="changeTime"
      @pan="slideClickEvent"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { msToHms } from '../../mixins/msToHMS'
import { log } from '../../mixins/log'

export default {
  mixins: [msToHms, log],
  computed: {
    ...mapState({
      player: state => state.playFile.player,
      status: state => state.status.status
    })
  },
  created () {
    this.$root.$on('updatePlayTime', this.updateTime)
  },
  data () {
    return {
      time: 0,
      timeLabel: '0/0'
    }
  },
  methods: {
    updateTime (value) {
      this.time = value
    },
    changeTime (value) {
      this.$root.$emit('changePlayTime', value)
    },
    slideClickEvent (phase) {
      if (phase === 'end') {
        this.logSend('Live', `Time Slide Change at: ${this.time}`)
      }
    }
  }
}
</script>
