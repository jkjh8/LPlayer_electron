<template>
  <q-card
    square
    style="min-width: 400px; max-width: 600px;"
  >
    <q-card-section style="background: gray; color: white;">
      <div class="flex row no-wrap" style="height: 100px">
        <div class="text-h5 self-center">
          PLAY CONFIRM
          <q-icon round color="green" size="md" name="check_circle_outline" />
        </div>
      </div>
    </q-card-section>
    <q-card-section class="flex flex-center">
      <div>
        <span class="text-h6 text-weight-bold">Mode </span>
        <span class="text-body1">{{ player.playMode }} </span>
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
          <span class="text-body2 text-weight-light">{{ player.broadcastZone.name }}</span>
        </div>
      </div>
    </q-card-section>
    <q-card-actions align="right">
      <q-btn flat @click="$emit('close')">CANCEL</q-btn>
      <q-btn flat @click="play">OK</q-btn>
    </q-card-actions>
  </q-card>
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState({
      player: state => state.playFile.player
    })
  },
  methods: {
    play () {
      this.$emit('close')
      this.$emit('play')
    }
  }
}
</script>
