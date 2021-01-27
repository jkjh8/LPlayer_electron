<template>
  <q-card style="width: 50%">
    <q-form
      @submit="onSubmit"
      @reset="onReset"
    >
      <q-card-section>
        <div class="text-h6">{{ scheduleData.name }}</div>
      </q-card-section>
      <q-card-section>
        <div class="q-mx-md" style="max-width: 90%">
          <q-input
            v-model="schedule.name"
            label="Schedule Name"
            hint="Type event name"
            placeholder="event"
          />
          <q-file
            v-model="schedule.file"
            label="Select File"
            hint="Select audio file"
            lazy-rules
            :rules="[val => !!val || 'Please select some file']"
          />
          <q-select
            v-model="schedule.zones"
            :options="zones"
            option-label="name"
            multiple
            use-chips
            stack-label
            lazy-rules
            :rules="[val => val.length > 0 || 'Please select zones']"
            popup-content-style="height: 400px"
            label="Zones"
          >
          </q-select>
          <q-select v-model="schedule.mode" :options="modeOptions" label="Repeat Mode" />
          <q-select
            v-if="schedule.mode === 'Weeks'"
            v-model="schedule.weeks"
            multiple
            use-chips
            stack-label
            :options="weekOptions"
            lazy-rules
            :rules="[val => val.length > 0 || 'Please select weeldays']"
            label="Weeks"
          />
          <q-input v-model="schedule.time" mask="time" :rules="['time']" label="Time">
            <template v-slot:append>
              <q-icon name="access_time" class="q-py-none cursor-pointer">
                <q-popup-proxy transition-show="scale" transition-hide="scale">
                  <q-time v-model="schedule.time">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-time>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Submit" type="submit"></q-btn>
        <q-btn flat label="Reset" type="reset"></q-btn>
        <q-btn flat label="Cancel" type="reset" @click="close"></q-btn>
      </q-card-actions>
    </q-form>
  </q-card>
</template>

<script>
import { mapState } from 'vuex'

export default {
  props: ['name', 'scheduleData'],
  data () {
    return {
      schedule: Object.assign({}, this.scheduleData.schedule),
      modeOptions: ['Once', 'Every Day', 'Weeks'],
      weekOptions: [
        { label: 'Sun', value: 0 },
        { label: 'Mon', value: 1 },
        { label: 'Tue', value: 2 },
        { label: 'Wed', value: 3 },
        { label: 'Thu', value: 4 },
        { label: 'Fri', value: 5 },
        { label: 'Sat', value: 6 }
      ]
    }
  },
  computed: {
    ...mapState({
      zones: state => state.status.status.zones
    })
  },
  methods: {
    onSubmit () {
      console.log(this.scheduleData)
      if (this.scheduleData.mode === 'new') {
        console.log('new', this.schedule)
        this.$store.commit('scheduler/addSchedule', this.schedule)
      } else {
        console.log('edit', this.schedule)
        this.$store.dispatch('scheduler/editSchedule', {
          idx: this.scheduleData.rowIndex,
          schedule: this.schedule
        })
      }
      this.onReset()
      this.$emit('close')
    },
    onReset () {
      this.schedule = {
        name: 'event',
        file: null,
        zones: [],
        mode: 'Once',
        weeks: [],
        time: '12:00',
        enable: true
      }
    },
    close () {
      this.onReset()
      this.$emit('close')
    }
  }
}
</script>
