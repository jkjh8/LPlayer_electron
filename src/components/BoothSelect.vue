<template>
  <q-card square class="column q-my-md">
    <q-card-section style="background: gray; color: white">
      Select Booth
    </q-card-section>
    <q-card-section>
      <div class="q-mx-auto">
        <q-select v-model="sel" :options="options" label="Booth" @input="chgBooth"></q-select>
      </div>
    </q-card-section>
  </q-card>
</template>
<script>
import { mapState } from 'vuex'
import { ipcRenderer, remote } from 'electron'
const dbStatus = remote.getGlobal('dbStatus')

export default {
  computed: {
    ...mapState({
      status: state => state.status.status
    })
  },
  data () {
    return {
      sel: null,
      options: [
        '1', '2', '3', '4', '5', '6', '7', '8', '9'
      ]
    }
  },
  mounted () {
    this.sel = this.status.booth - 9
  },
  methods: {
    async chgBooth (idx) {
      const boothNum = Number(idx) + 9
      await dbStatus.update({ id: 'booth' }, { id: 'booth', value: boothNum }, { upsert: true })
      this.$store.commit('status/changeBooth', boothNum)
      ipcRenderer.send('udpsendreset', boothNum)
    }
  }
}
</script>
