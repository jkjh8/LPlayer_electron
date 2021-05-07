<template>
  <q-page class="flex flex-center">
    <div class="q-ma-md">
      <PlayMode />
      <BoothSelector />
      <AudioOutSel />
      <IpAddr />
    </div>
  </q-page>
</template>

<script>
import PlayMode from '../components/PlayMode'
import BoothSelector from '../components/BoothSelect'
import AudioOutSel from '../components/AudioOutSel'
import IpAddr from '../components/Ipaddr'
export default {
  name: 'PageSetting',
  components: { PlayMode, BoothSelector, AudioOutSel, IpAddr }
}
</script>
