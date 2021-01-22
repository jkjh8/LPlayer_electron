<template>
  <div>
    <div class="fit row">
      <div class="col-xs-12 col-sm-8">
        <Status />
      </div>
      <div class="col-sx-12 col-sm-4">
        <Playlist />
      </div>
    </div>
  </div>
</template>

<script>
import Status from '../components/Status'
import Playlist from '../components/Playlist'

export default {
  name: 'PageIndex',
  components: {
    Status, Playlist
  },
  data () {
    return {
      right: false
    }
  }
}
</script>
