<template>
  <div class="row no-wrap">
    <!-- previous button -->
    <q-btn
      v-if="player.playMode==='Playlist'"
      flat
      round
      icon="skip_previous"
      @click="$root.$emit('playlist-previous', {})"
    />
    <!-- play btn -->
    <q-btn
      flat
      round
      :color="player.playing ? 'green' : ''"
      :icon="player.playing ? 'pause' : 'play_arrow'"
      @click="$root.$emit('play', {})"
    >
      <q-tooltip>Start the broadcast process</q-tooltip>
    </q-btn>
    <!-- stop btn -->
    <q-btn
      flat
      round
      icon="stop"
      @click="$root.$emit('stop', {})"
    >
      <q-tooltip>Stop the broadcast process</q-tooltip>
    </q-btn>
    <!-- next button -->
    <q-btn
      v-if="player.playMode==='Playlist'"
      flat
      round
      icon="skip_next"
      @click="$root.$emit('playlist-next', {})"
    />
    <!-- loop button  -->
    <q-btn
      :color="player.loop ? 'yellow' : ''"
      flat
      round
      icon="repeat_one"
      @click="$store.commit('playFile/updateLoop')"
    >
      <q-tooltip>One file is played repeatedly</q-tooltip>
    </q-btn>
    <!-- loop all playlist button-->
    <q-btn
      v-show="player.playMode === 'Playlist'"
      :color="player.playlistLoop ? 'orange' : ''"
      flat
      round
      icon="repeat"
      @click="$store.commit('playFile/updatePlaylistLoop')"
    >
      <q-tooltip>Playlist play repeatedly</q-tooltip>
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
