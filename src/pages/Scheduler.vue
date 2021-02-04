<template>
  <q-page>
    <div>
      <q-table
        dense
        title="Scheduler"
        :data="scheduleList"
        :columns="columns"
        :filter="filter"
        :rows-per-page-options="[0, 10, 20, 50]"
      >
        <!-- HEADER -->
        <template v-slot:top-right>
          <!-- add schedule -->
          <q-btn
            flat
            round
            icon="playlist_add"
            @click="addSchedule"
          >
            <q-tooltip
              anchor="top middle"
              self="bottom middle"
              :offset="[10, 10]"
            >
              Add Playlist
            </q-tooltip>
          </q-btn>
          <!-- remove all schedule -->
          <q-btn
            flat
            round
            class="q-mr-md"
            icon="delete"
            @click="removeAllSchedule"
          >
            <q-tooltip
              anchor="top middle"
              self="bottom middle"
              :offset="[10, 10]"
            >
              Remove all schedule
            </q-tooltip>
          </q-btn>
          <q-input
            class="q-mx-xs"
            style="height: 20px"
            borderless
            dense
            debounce="300"
            v-model="filter"
            placeholder="Search"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>

        <!-- Table Body -->
        <template v-slot:body-cell-nom="props">
          <q-td :props="props">
            {{ props.rowIndex + 1 }}
          </q-td>
        </template>
        <!-- file row -->
        <template v-slot:body-cell-file="props">
          <q-td :props="props">
            {{ props.row.file.name }}
          </q-td>
        </template>

        <!-- zone row -->
        <template v-slot:body-cell-zones="props">
          <q-td :props="props">
            {{ zonesNameString(props.row.zones) }}
          </q-td>
        </template>

        <!-- zone row -->
        <template v-slot:body-cell-mode="props">
          <q-td :props="props">
            {{ displayMode(props.row.mode, props.row.weeks) }}
          </q-td>
        </template>

        <!-- enable switch row -->
        <template v-slot:body-cell-enable="props">
          <q-td :props="props">
            <q-toggle
              checked-icon="check"
              color="green"
              unchecked-icon="clear"
              :value="props.row.enable"
              @input="editEnable(props.row)"
            />
          </q-td>
        </template>

        <!-- Actions row -->
        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <q-btn
              flat
              round
              size="sm"
              icon="create"
              @click="editSchedule(props.row)"
            />
            <q-btn
              flat
              round
              size="sm"
              icon="delete"
              @click="delSchedule(props.row)"
            />
          </q-td>
        </template>
      </q-table>
    </div>
    <q-dialog v-model="add" persistent transition-show="scale" transition-hide="scale">
      <addSchedule
        :mode="mode"
        :schedule="schedule"
        @refresh="updateList"
        @close="add=!add"
        @onReset="onReset"
      />
    </q-dialog>
  </q-page>
</template>

<script>
import { mapState } from 'vuex'
import addSchedule from '../components/ScheduleDialog'
import moment from 'moment'
import { remote } from 'electron'
import { log } from '../mixins/log'
const dbScheduler = remote.getGlobal('dbScheduler')

export default {
  name: 'PageScheduler',
  mixins: [log],
  components: { addSchedule },
  data () {
    return {
      filter: '',
      columns: [
        { name: 'nom', align: 'center', label: 'No.', sortable: true },
        { name: 'name', align: 'center', label: 'Name', field: 'name', sortable: true },
        { name: 'file', align: 'center', label: 'File', field: 'file', sortable: true },
        { name: 'zones', align: 'center', label: 'Zones', field: 'zones', sortable: true },
        { name: 'mode', align: 'center', label: 'Repeat Mode', field: 'mode', sortable: true },
        { name: 'time', align: 'center', label: 'Time', field: 'time', sortable: true },
        { name: 'enable', align: 'center', label: 'Enable', field: 'enable', sortable: true },
        { name: 'actions', align: 'center', label: 'Actions', field: 'actions' }
      ],
      add: false,
      schedule: null,
      scheduleList: [],
      mode: 'Add Schedule'
    }
  },
  computed: {
    ...mapState({
      status: state => state.status.status
    })
  },
  async mounted () {
    // dbScheduler.remove({}, { multi: true })
    this.$root.$on('refreshPlaylist', () => {
      this.updateList()
    })
    this.updateList()
  },
  methods: {
    async updateList () {
      const result = await dbScheduler.find().sort({ createdAt: 1 })
      this.scheduleList = result
      this.$store.commit('scheduler/updateSchedule', result)
    },
    async editEnable (item) {
      const enable = !item.enable
      dbScheduler.update({ _id: item._id }, { $set: { enable: enable } }, { upsert: true })
      this.updateList()
      this.logSchedule('Change Status', item)
    },
    addSchedule () {
      this.mode = 'Add Schedule'
      this.add = true
    },
    removeAllSchedule () {
      this.$q.dialog({
        title: 'Warning',
        message: 'Do you want to remove all schedule?',
        cancel: true,
        persistent: true
      }).onOk(async () => {
        await dbScheduler.remove({}, { multi: true })
        this.updateList()
        this.logSend('Schedule', 'Remove all schedule')
      })
    },
    editSchedule (data) {
      this.mode = 'Edit Schedule'
      this.schedule = data
      this.add = true
    },
    async delSchedule (item) {
      await dbScheduler.remove({ _id: item._id })
      this.updateList()
      this.logSchedule('Delete', item)
    },
    zonesNameString (zones) {
      const zoneNameArray = []
      zones.forEach(zone => {
        zoneNameArray.push(zone.name)
      })
      return zoneNameArray.join(',')
    },
    displayMode (mode, week) {
      if (mode === 'Weeks') {
        return week.map(e => e.label).join(', ')
      } else {
        return mode
      }
    },
    onReset () {
      this.schedule = {
        name: 'event',
        file: null,
        zones: [],
        mode: 'Once',
        weeks: [],
        time: moment().format('HH:mm'),
        enable: true
      }
    }
  }
}
</script>
