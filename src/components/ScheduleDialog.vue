<template>
  <q-card style="width: 50%">
    <q-card-section>
      <div class="text-h6">{{ mode }}</div>
    </q-card-section>
    <q-card-section>
      <div class="q-mx-md" style="max-width: 90%">
        <q-input
          v-model="data.name"
          label="Schedule Name"
          hint="Type event name"
          placeholder="event"
        />
        <q-file
          v-model="data.file"
          label="Select File"
          hint="Select audio file"
        />
        <q-select
          v-model="data.zones"
          :options="zones"
          option-label="name"
          multiple
          use-chips
          stack-label
          popup-content-style="height: 400px"
          label="Zones"
        >
        </q-select>
        <q-select v-model="data.mode" :options="modeOptions" label="Repeat Mode" />
        <q-select
          v-if="data.mode === 'Weeks'"
          v-model="data.weeks"
          multiple
          use-chips
          stack-label
          :options="weekOptions"
          label="Weeks"
        />
        <q-input v-model="data.time" mask="time" :rules="['time']" label="Time">
          <template v-slot:append>
            <q-icon name="access_time" class="q-py-none cursor-pointer">
              <q-popup-proxy transition-show="scale" transition-hide="scale">
                <q-time v-model="data.time">
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
      <q-btn flat label="Submit" @click="onSubmit"></q-btn>
      <q-btn flat label="Reset" @click="onReset"></q-btn>
      <q-btn flat label="Cancel" @click="close"></q-btn>
    </q-card-actions>
  </q-card>
</template>

<script>
import { mapState } from 'vuex'
import { remote } from 'electron'
import moment from 'moment'
const dbScheduler = remote.getGlobal('dbScheduler')

export default {
  props: {
    mode: { type: String, default: 'Add Schedule' },
    schedule: {
      type: Object,
      default: () => {
        return {
          name: '',
          file: null,
          zones: [],
          mode: 'Once',
          weeks: [],
          time: moment().format('HH:mm'),
          enable: true
        }
      }
    }
  },
  data () {
    return {
      data: Object.assign({}, this.schedule),
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
    async onSubmit () {
      const result = await dbScheduler.findOne({ time: this.data.time })
      if (result) {
        console.log(result)
        if (result.name === this.data.name || result.file === this.data.file || result.zones === this.data.zones) {
          console.log('pass')
        } else {
          return this.$q.notify({
            type: 'negative',
            message: `There is already a broadcast reservation at ${this.data.time}`
          })
        }
      }
      if (this.mode === 'Add Schedule') {
        await dbScheduler.insert(this.data)
      } else {
        await dbScheduler.update({ _id: this.schedule._id }, this.data)
      }
      this.$emit('refresh')
      this.close()
    },
    onReset () {
      this.data = {
        name: 'event',
        file: null,
        zones: [],
        mode: 'Once',
        weeks: [],
        time: moment().format('HH:mm'),
        enable: true
      }
    },
    async close () {
      await this.$emit('onReset')
      this.$emit('close')
    }
  }
}
</script>
