<template>
  <q-card style="width: 50%">
    <q-card-section>
      <div class="text-h6">Add Schedule</div>
    </q-card-section>
    <q-card-section>
      <div class="q-mx-md" style="max-width: 90%">
        <q-form>
          <q-input
            v-model="name"
            label="Schedule Name"
            hint="Type event name"
            placeholder="event"
          />
          <q-file
            v-model="file"
            label="Select File"
            hint="Select audio file"
            lazy-rules
            :rules="[val => !!val || 'Please select some file']"
          />
          <q-select
            v-model="selectedZones"
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

          <q-select v-model="mode" :options="modeOptions" label="Repeat Mode" />
          <q-select
            v-if="mode === 'Weeks'"
            v-model="weeks"
            multiple
            use-chips
            stack-label
            :options="weekOptions"
            lazy-rules
            :rules="[val => val.length > 0 || 'Please select weeldays']"
            label="Weeks"
          />
          <q-input v-model="time" mask="time" :rules="['time']" label="Time">
            <template v-slot:append>
              <q-icon name="access_time" class="q-py-none cursor-pointer">
                <q-popup-proxy transition-show="scale" transition-hide="scale">
                  <q-time v-model="time">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-time>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          </q-form>
      </div>
    </q-card-section>
    <q-card-actions align="right">
      <q-btn>Summit</q-btn>
      <q-btn @click="$emit('close')">Cancel</q-btn>
    </q-card-actions>
  </q-card>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data () {
    return {
      name: '',
      file: null,
      selectedZones: [],
      mode: 'Once',
      modeOptions: ['Once', 'Every Day', 'Weeks'],
      weeks: [],
      weekOptions: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      time: '12:00'
    }
  },
  computed: {
    ...mapState({
      zones: state => state.status.status.zones
    })
  },
  mounted () {
    this.stringOptions = this.zones
  }
}
</script>
