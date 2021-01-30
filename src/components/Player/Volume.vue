<template>
  <div class="row no-wrap">
    <q-separator v-show="!popup" class="q-mx-md" vertical />
    <q-btn v-if="!player.mute" flat round icon="volume_up" @click="$root.$emit('mute')"></q-btn>
    <q-btn v-else color="red" flat round icon="volume_off" @click="$root.$emit('mute')"></q-btn>
    <q-slider
      class="q-mx-sm"
      style="max-width: 150px; min-width: 100px;"
      :value="player.volume"
      :min="0"
      :max="100"
      label
      color="teal"
      @input="$root.$emit('vol', $event)"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  props: ['popup'],
  computed: {
    ...mapState({
      player: state => state.playFile.player
    })
  }
}
</script>
