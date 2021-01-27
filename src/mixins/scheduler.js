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
    timeNow: (newVal, oldVal) => {
      this.scheduleParcer(newVal)
    }
  },
  methods: {
    scheduleParcer (time) {
      console.log(this.scheduleList)
    }
  }
}
