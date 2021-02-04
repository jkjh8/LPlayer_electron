<template>
  <q-card
    square
    style="min-width: 400px; max-width: 600px;"
  >
    <q-card-section style="background: gray; color: white;">
      <div class="row no-wrap" style="height: 100px">
        <div class="text-h5 self-center">
          PLAY
        </div>
        <div>
          <q-circular-progress
            v-show="player.playing"
            indeterminate
            size="25px"
            :thickness="0.4"
            font-size="10px"
            color="lime"
            track-color="grey-3"
            center-color="grey-8"
            class="q-mx-sm full-height vertical-middle"
          >
          </q-circular-progress>
        </div>
      </div>
    </q-card-section>
    <q-card-section class="fit wrap column inline">
      <div class="self-center">
        <span class="text-h6 text-weight-bold">Mode </span>
        <span class="text-body1">{{ player.playMode }} </span>
      </div>
      <div>
        <TimeSlider />
        <PlayBtns class="justify-center" />
        <Volume class="justify-center" :popup="true" />
      </div>
    </q-card-section>
    <q-card-section>
      <div class="q-mx-auto">
        <div>
          <span class="text-h6 text-weight-bold">File </span>
          <span class="text-body2 text-weight-light">{{ player.file.name }}</span>
        </div>
        <div>
          <span class="text-h6 text-weight-bold">Zones </span>
          <span class="text-body2 text-weight-light">{{ player.broadcastZone }}</span>
        </div>
      </div>
    </q-card-section>
    <q-card-actions align="right">
      <q-btn flat @click="stop">Stop</q-btn>
    </q-card-actions>
  </q-card>
</template>

<script>
import { mapState } from 'vuex'
import { msToHms } from '../../mixins/msToHMS'
import TimeSlider from './timeSlider'
import PlayBtns from './PlayBtns'
import Volume from './Volume'

export default {
  components: { TimeSlider, PlayBtns, Volume },
  mixins: [msToHms],
  computed: {
    ...mapState({
      player: state => state.playFile.player
    })
  },
  methods: {
    stop () {
      this.$root.$emit('stop', {})
    }
  }
}
</script>
