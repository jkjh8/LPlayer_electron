<template>
  <div class="row no-wrap">
    <q-btn v-if="player.playMode==='Playlist'" flat round icon="skip_previous" @click="$root.$emit('playlist-previous')" />
    <!-- play btn -->
    <q-btn v-if="!player.playing" flat round icon="play_arrow" @click="$root.$emit('play')">
      <q-tooltip>Start the broadcast process</q-tooltip>
    </q-btn>
    <q-btn v-else flat round color="green" icon="pause" @click="$root.$emit('pause')" />
    <!-- stop btn -->
    <q-btn flat round icon="stop" @click="$root.$emit('stop')">
      <q-tooltip>Stop the broadcast process</q-tooltip>
    </q-btn>

    <q-btn v-if="player.playMode==='Playlist'" flat round icon="skip_next" @click="$root.$emit('playlist-next')" />
    <!-- loop button  -->
    <q-btn v-if="player.loop" color="yellow" flat round icon="loop" @click="$store.commit('playFile/updateLoop')">
      <q-tooltip>One file is played repeatedly</q-tooltip>
    </q-btn>
    <q-btn v-else flat round icon="loop" @click="$store.commit('playFile/updateLoop')">
      <q-tooltip>One file is played repeatedly</q-tooltip>
    </q-btn>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState({
      player: state => state.playFile.player
    })
  }
}
</script>
