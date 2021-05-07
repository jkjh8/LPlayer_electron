<template>
  <q-card square class="column q-my-md">
    <q-card-section style="background: gray; color: white">
      Server Ip Address
    </q-card-section>
    <q-card-section>
      <div>
        <q-input
          v-model="ipaddr"
          label="Server IP Addr"
          @keyup.enter="setIp"
        ></q-input>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import { mapState } from 'vuex'
import { remote } from 'electron'
import { log } from '../mixins/log'
const dbStatus = remote.getGlobal('dbStatus')

export default {
  mixins: [log],
  computed: {
    ...mapState({
      status: state => state.status.status
    })
  },
  data () {
    return {
      ipaddr: ''
    }
  },
  async mounted () {
    const result = await dbStatus.findOne({ id: 'ipaddr' })
    if (result) {
      this.ipaddr = result.value
    }
  },
  methods: {
    selPlayLock (value) {
      this.$store.commit('status/updatePlaylock', value)
      dbStatus.update(
        { id: 'playlock' },
        { id: 'playlock', value: value },
        { upsert: true }
      )
      this.logSend('System', `Change PlayLock: ${value}`)
    },
    setIp () {
      dbStatus.update(
        { id: 'ipaddr' },
        { $set: { value: this.ipaddr } },
        { upsert: true }
      )
      this.logSend('System', `Change ServerIp: ${this.ipaddr}`)
    }
  }
}
</script>
