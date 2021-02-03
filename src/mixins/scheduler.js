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
      const overlap = await this.checkOverlapZones(this.currentSchedule.zones)
      if (overlap.length > 0) {
        this.$q.notify({
          type: 'negative',
          position: 'top',
          message: `Please check zones ${overlap.map(e => e.name).join(',')}`
        })
      } else {
        await this.$store.commit('playFile/playMode', 'Schedule')
        await this.$store.commit('status/updateSelected', this.currentSchedule.zones)
        await this.selectZonesToString(true)
        await this.chgPlayFile(this.currentSchedule.file)
        await ipcRenderer.sendSync('udpsend', this.player.broadcastZone.idx)
        this.progressDialog = true
        this.$store.commit('playFile/play', true)
        this.$refs.audio.play()
      }
    },
    async updateScheduleEnable () {
      const enable = !this.schedule.enable
      await dbScheduler.update({ _id: this.schedule._id }, { $set: { enable: enable } }, { upsert: true })
      this.$root.$emit('refreshPlaylist')
    }
  }
}
