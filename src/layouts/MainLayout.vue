<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <q-toolbar class="bg-blue-grey-10">
        <q-btn
          flat
          dense
          round
          dark
          icon="play_circle"
          aria-label="Menu"
        />

        <q-toolbar-title>
          <div class="text-weight-medium text-title">
            <span>PLAYER</span>
            <span class="q-mx-lg text-body2">Booth {{ status.booth - 9 }}</span>
            <span class="q-mx-lg text-body2">{{ time }}</span>
          </div>
        </q-toolbar-title>

        <div class="q-mr-md">
          <q-tabs
            class="text-grey"
            v-model="tab"
            active-color="white"
            @input="changeTab"
          >
            <q-tab class="menutab" name="player" label="player" />
            <q-tab class="menutab" name="scheduler" label="Scheduler" />
            <q-tab class="menutab" name="settings" label="Settings" />
          </q-tabs>
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer elevated class="bg-grey-8 text-white">
      <CompenntPlayer />
    </q-footer>

    <q-dialog
      v-model="startupDialog"
      persistent
    >
      <Startup @close="startupDialog=!startupDialog" />
    </q-dialog>
  </q-layout>
</template>

<script>
import zones from '../Zone.json'
import moment from 'moment'
import { mapState } from 'vuex'
import { ipcRenderer, remote } from 'electron'
import CompenntPlayer from '../components/Player'
import Startup from '../components/Start'
const dbStatus = remote.getGlobal('dbStatus')
const dbScheduler = remote.getGlobal('dbScheduler')

export default {
  name: 'MainLayout',
  components: { CompenntPlayer, Startup },
  computed: {
    ...mapState({
      status: state => state.status.status
    })
  },
  data () {
    return {
      tab: 'player',
      startupDialog: false,
      time: ''
    }
  },
  async mounted () {
    // await dbStatus.update({ id: 'booth' }, { $set: { value: 10 } })
    const booth = await dbStatus.findOne({ id: 'booth' })
    await this.$store.commit('status/updateZones', zones)
    await this.$store.commit('status/changeBooth', booth.value)
    await ipcRenderer.send('udpsendreset', this.status.booth)
    this.startupDialog = true
    const schedule = await dbScheduler.find().sort({ createAt: 1 })
    this.$store.commit('scheduler/updateSchedule', schedule)
    const result = await dbStatus.findOne({ id: 'playlock' })
    if (result) {
      this.$store.commit('status/updatePlaylock', result.value)
    }
    this.clock()
  },
  beforeDestroy () {
    ipcRenderer.send('udpsendreset', this.status.booth)
  },
  methods: {
    changeTab (value) {
      this.$router.push(value)
    },
    clock () {
      setInterval(() => {
        this.time = moment().format('YYYY/MM/D HH:mm:ss')
      }, 1000)
    }
  }
}
</script>

<style>
.text-title {
  font-size: 0.8em;
}
.menutab .q-tab__label {
  font-weight: 300;
  text-transform: capitalize;
}
</style>
