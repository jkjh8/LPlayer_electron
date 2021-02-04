<template>
  <q-card square class="column q-my-md">
    <q-card-section style="background: gray; color: white">
      Player Mode Setup
    </q-card-section>
    <q-card-section>
      <div class="fit row inline  justify-between">
        <span class="self-center">Play Lock</span>
        <span>
          <q-toggle
            v-model="playlock"
            checked-icon="check"
            color="green"
            unchecked-icon="clear"
            @input="selPlayLock"
          />
        </span>
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
      playlock: false
    }
  },
  async mounted () {
    const result = await dbStatus.findOne({ id: 'playlock' })
    if (result) {
      this.playlock = result.value
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
    }
  }
}
</script>
