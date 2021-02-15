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
      <Player />
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
import { log } from '../mixins/log'
import Player from '../components/Player/Player'
import Startup from '../components/Start'
const dbStatus = remote.getGlobal('dbStatus')
const dbScheduler = remote.getGlobal('dbScheduler')

export default {
  name: 'MainLayout',
  mixins: [log],
  components: { Player, Startup },
  computed: {
    ...mapState({
      status: state => state.status.status
    })
  },
  data () {
    return {
      tab: 'player',
      startupDialog: false,
      time: '',
      booth: null
    }
  },
  async mounted () {
    this.$store.commit('status/updateZones', zones)
    // await dbStatus.update({ id: 'booth' }, { $set: { value: 10 } })
    // this.booth = await dbStatus.findOne({ id: 'booth' })
    // if (!this.booth) {
    //   this.booth = 10
    //   await dbStatus.update({ id: 'booth', value: 10 })
    //   await dbStatus.update({ id: 'playlock', value: true })
    //   console.log(this.booth)
    // }
    //   await this.$store.commit('status/changeBooth', this.booth.value)
    //   const result = await dbStatus.findOne({ id: 'playlock' })
    //   this.$store.commit('status/updatePlaylock', result.value)
    // }
    // await this.$store.commit('status/updateZones', zones)
    // await ipcRenderer.send('udpsendreset', this.status.booth)
    await this.callBooth()
    await this.lunchSchedule()
    await this.callPlayLock()
    this.clock()
    // this.logSend('System', 'Start Event Player')
    await this.callStartup()
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
    },
    async callBooth () {
      const booth = await dbStatus.findOne({ id: 'booth' })
      if (booth) {
        this.booth = booth.value
        this.$store.commit('status/changeBooth', this.booth)
      } else {
        this.booth = 10
        await dbStatus.update({ id: 'booth', value: 10 })
      }
    },
    async callPlayLock () {
      const lock = await dbStatus.findOne({ id: 'playlock' })
      if (lock) {
        this.$store.commit('status/updatePlaylock', lock.value)
      } else {
        this.$store.commit('status/updatePlaylock', true)
        dbStatus.update({ id: 'playlock', value: true })
      }
    },
    callStartup () {
      this.startupDialog = true
    },
    async lunchSchedule () {
      const schedule = await dbScheduler.find().sort({ createAt: 1 })
      this.$store.commit('scheduler/updateSchedule', schedule)
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
