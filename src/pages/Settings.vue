<template>
  <q-page class="flex flex-center">
    <div class="q-ma-md">
      <PlayMode />
      <BoothSelector />
      <AudioOutSel />
    </div>
  </q-page>
</template>

<script>
import PlayMode from '../components/PlayMode'
import BoothSelector from '../components/BoothSelect'
import AudioOutSel from '../components/AudioOutSel'
export default {
  name: 'PageSetting',
  components: { PlayMode, BoothSelector, AudioOutSel }
}
</script>
