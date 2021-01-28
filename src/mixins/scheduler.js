import { setInterval } from 'core-js'
import { mapState } from 'vuex'
import moment from 'moment'

export const Scheduler = {
  computed: {
    ...mapState({
      scheduleList: state => state.scheduler.scheduleList
    })
  },
  data () {
    return {
      timeNow: ''
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
          console.log(schedule)
          if (schedule.enable && schedule.time === time) {
            if (schedule.mode === 'Weeks') {
              schedule.weeks.forEach(week => {
                if (week.value === weekday) {
                  console.log('week event', schedule)
                }
              })
            } else {
              console.log('nomal event', schedule)
            }
          }
        })
      }
    }
  }
}
