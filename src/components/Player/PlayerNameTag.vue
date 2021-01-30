<template>
  <div class="row no-wrap col-xs-12 col-sm-4 q-px-md">
    <div
      v-show="player.playMode === 'Playlist'"
      class="q-mt-xs q-mx-md text-overline respText"
      style="line-height: 110%; text-align: center; color: #5F9EA0;"
    >
      <q-icon name="playlist_play"></q-icon>
      Playlist<br>Play
    </div>
    <div v-if="player.file">
      <div
        v-if="player.meta && player.meta.media.track[0].Title"
        class="text-weight-bold respText"
      >
        {{ player.meta.media.track[0].Title }}
      </div>
      <div
        v-else-if="player.meta && player.meta.media.track[0].Track"
        class="text-weight-bold respText"
      >
        {{ player.meta.media.track[0].Track }}
      </div>
      <div
        v-else
        class="text-weight-bold respText"
      >
        {{ player.file.name }}
      </div>

      <div
        v-if="player.meta && player.meta.media.track[0].Director"
        class="text-grey respText"
      >
        {{ player.meta.media.track[0].Director }}
      </div>
      <div
        v-else-if="player.meta && player.meta.media.track[0].Album"
        class="text-grey respText"
      >
        {{ player.meta.media.track[0].Album }}
      </div>
      <div
        v-else-if="player.meta && player.meta.media.track[0].OriginalSourceForm_Name"
        class="text-grey respText"
      >
        {{ player.meta.media.track[0].OriginalSourceForm_Name }}
      </div>
      <div
        v-else-if="player.meta && player.meta.media.track[0].Performer"
        class="text-grey respText"
      >
        {{ player.meta.media.track[0].Performer }}
      </div>
      <div
        v-else
        class="text-grey respText"
      >
        {{ player.file.name }}
      </div>
    </div>
    <div v-else>
      <div class="text-weight-bold respText">None</div>
      <div class="text-grey respText">None</div>
    </div>
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

<style>
@media (max-width: 599px) {
  .respText {
    text-align: center;
    white-space: nowrap;
  }
}
@media (min-width: 599px) {
  .respText {
    white-space: nowrap;
  }
}
</style>
