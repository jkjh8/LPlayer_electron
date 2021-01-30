import { setInterval } from 'core-js'
import { mapState } from 'vuex'
import { remote, ipcRenderer } from 'electron'
import moment from 'moment'
const dbScheduler = remote.getGlobal('dbScheduler')

export const Scheduler = {
  computed: {
    ...mapState({
      scheduleList: state => state.scheduler.scheduleList
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
            this.schedule = schedule
            if (schedule.mode === 'Weeks') {
              schedule.weeks.forEach(week => {
                if (week.value === weekday) {
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
      if (this.schedule.mode === 'Once') {
        this.updateScheduleEnable()
      }
      await this.selectZonesToString(true)
      if (this.player.broadcastZone.overlap.length > 0) {
        this.$q.notify({
          type: 'negative',
          position: 'top',
          message: `Please check zones ${this.player.broadcastZone.overlap.join(',')}`
        })
      } else {
        await this.$store.commit('playFile/playMode', 'Schedule')
        await this.$store.commit('status/updateSelected', this.schedule.zones)
        await this.selectZonesToString(true)
        await this.chgPlayFile(this.schedule.file)
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
