import { setInterval } from 'core-js'
import { mapState } from 'vuex'
import moment from 'moment'
import { ipcRenderer } from 'electron'

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
      await this.$store.commit('status/updateSelected', this.schedule.zones)
      const brocastZones = await this.selectZonesToString(true)
      await this.chgPlayFile(this.schedule.file)
      await ipcRenderer.sendSync('udpsend', brocastZones.string)
      this.progressDialog = true
      this.$store.commit('playFile/play', true)
      this.$refs.audio.play()
    }
  }
}
