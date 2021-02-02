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

export default {
  mixins: [msToHms],
  computed: {
    ...mapState({
      player: state => state.playFile.player
    })
  },
  created () {
    this.$root.$on('updatePlayTime', (value) => {
      this.time = value
    })
  },
  data () {
    return {
      time: 0,
      timeLabel: '0/0'
    }
  },
  methods: {
    changeTime (value) {
      this.$root.$emit('changePlayTime', value)
    },
    slideClickEvent (phase) {
      console.log(phase)
    }
  }
}
</script>
