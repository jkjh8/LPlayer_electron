<template>
  <div>
    <q-splitter
      v-model="splitterModel"
      reverse
      unit="px"
      style="height: calc(100vh - 165px)"
    >

      <template v-slot:before>
        <Status />
      </template>

      <template v-slot:after>
        <Playlist />
      </template>

    </q-splitter>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Status from '../components/Status'
import Playlist from '../components/Playlist'

export default {
  name: 'PageIndex',
  components: {
    Status, Playlist
  },
  computed: {
    ...mapState({
      playlistPlay: state => state.playlist.playlistPlay
    })
  },
  data () {
    return {
      splitterModel: 350
    }
  },
  methods: {
    scrollHandler (position) {
      console.log(position)
    }
  }
}
</script>
