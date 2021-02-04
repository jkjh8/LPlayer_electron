<template>
  <q-card square class="column q-my-md">
    <q-card-section style="background: gray; color: white">
      Audio Output Devices
    </q-card-section>
    <q-card-section>
      <div>
        <q-select
          v-model="sel"
          :options="options"
          option-value="deviceId"
          label="Audio Output Devcices"
          @input="chgAudioOut"
        />
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import { mapState } from 'vuex'
import { log } from '../mixins/log'
import { remote } from 'electron'
const dbStatus = remote.getGlobal('dbStatus')

export default {
  mixins: [log],
  data () {
    return {
      sel: null,
      options: []
    }
  },
  computed: {
    ...mapState({
      status: state => state.status.status
    })
  },
  async mounted () {
    const devices = await navigator.mediaDevices.enumerateDevices()
    const aduiooutput = await devices.filter(device => device.kind === 'audiooutput')
    this.options = aduiooutput
    const current = await dbStatus.findOne({ id: 'device' })
    if (current) {
      this.sel = current.value
    }
  },
  methods: {
    async chgAudioOut (device) {
      await dbStatus.update(
        { id: 'device' },
        { id: 'device', value: device },
        { upsert: true }
      )
      this.$root.$emit('change-audiooutput', device)
      this.logSend('System', `Change audio device: ${device.label}`)
    }
  }
}
</script>
