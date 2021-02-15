import { setInterval } from 'core-js'
import { mapState } from 'vuex'
import { remote, ipcRenderer } from 'electron'
import moment from 'moment'
const dbScheduler = remote.getGlobal('dbScheduler')

export const Scheduler = {
  computed: {
    ...mapState({
      scheduleList: state => state.scheduler.scheduleList,
      currentSchedule: state => state.scheduler.currentSchedule
    })
  },
  data () {
    return {
      timeNow: '',
      schdeule: null
    }
  },
  mounted () {
    setInterval(() => {
      this.timeNow = moment().format('HH:mm')
    }, 1000)
  },
  watch: {
    timeNow: {
      handler (newVal, oldVal) {
        this.scheduleParcer(newVal)
      },
      immediate: true
    }
  },
  methods: {
    scheduleParcer (time) {
      if (this.scheduleList) {
        const weekday = moment().day()
        this.scheduleList.forEach(schedule => {
          console.log(schedule.enable)
          if (schedule.enable && schedule.time === time) {
            // this.schedule = schedule
            this.$store.commit('scheduler/updateCurrentSchedule', schedule)
            if (schedule.mode === 'Weeks') {
              schedule.weeks.forEach(week => {
                if (week.value === weekday) {
                  this.schedulePlay()
                  console.log('week event', schedule)
                }
              })
            } else {
              this.schedulePlay()
              console.log('nomal event', schedule)
            }
          }
        })
      }
    },
    async schedulePlay () {
      if (this.currentSchedule.mode === 'Once') {
        this.updateScheduleEnable()
      }
      await this.$root.$emit('changePlayFile', this.currentSchedule.file)
      const result = await ipcRenderer.sendSync('checkFile', this.player.file.path)
      if (!result) {
        const msg = {
          type: 'negative',
          position: 'top',
          message: 'Please check file!'
        }
        this.logSend('Schedule', 'The schedule didnt work. The file does not exist.')
        return this.$q.notify(msg)
      }
      const overlap = await this.checkOverlapZones(this.currentSchedule.zones)
      if (overlap) {
        this.$q.notify({
          type: 'negative',
          position: 'top',
          message: `Please check zones ${overlap.map(e => e.name).join(',')}`
        })
        this.logSend('Schedule', `Overlap Zone: ${overlap.map(e => e.name).join(',')}`)
      } else {
        await this.$store.commit('playFile/playMode', 'Schedule')
        await this.$store.commit('status/updateSelected', this.currentSchedule.zones)
        const broadcastZones = await this.calZoneSelect('play', this.status.selected)
        this.$store.commit('playFile/updateBroadcastZone', broadcastZones.map(e => e.name).join(','))
        await ipcRenderer.sendSync('udpsend', `t:onair,${broadcastZones.map(e => e.idx).join(',')}`)
        this.progressDialog = true
        this.$store.commit('playFile/play', true)
        this.$refs.audio.play()
        this.logSchedule('Play', this.currentSchedule)
      }
    },
    async updateScheduleEnable () {
      const enable = !this.currentSchedule.enable
      await dbScheduler.update({ _id: this.currentSchedule._id }, { $set: { enable: enable } }, { upsert: true })
      this.$root.$emit('refreshPlaylist')
    }
  }
}
