<template>
  <q-page>
    <div>
      <q-table
        dense
        title="Scheduler"
        :data="scheduleList"
        :columns="columns"
        :filter="filter"
      >
        <!-- HEADER -->
        <template v-slot:top-right>
          <q-btn
            flat
            round
            class="q-mx-xs"
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
              :value="props.row.enable"
              @input="$store.commit('scheduler/enableUpdate', props.rowIndex)"
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
              @click="editSchedule(props.rowIndex, props.row)"
            />
            <q-btn
              flat
              round
              size="sm"
              icon="delete"
              @click="$store.dispatch('scheduler/delSchedule', props.row)"
            />
          </q-td>
        </template>
      </q-table>
    </div>
    <q-dialog v-model="add" persistent transition-show="scale" transition-hide="scale">
      <addSchedule :scheduleData="scheduleData" @close="add=!add" ></addSchedule>
    </q-dialog>
  </q-page>
</template>

<script>
import { mapState } from 'vuex'
import addSchedule from '../components/ScheduleDialog'
import moment from 'moment'

export default {
  name: 'PageScheduler',
  components: { addSchedule },
  data () {
    return {
      filter: '',
      columns: [
        { name: 'nom', align: 'center', label: 'No.' },
        { name: 'name', align: 'center', label: 'Name', field: 'name' },
        { name: 'file', align: 'center', label: 'File', field: 'file' },
        { name: 'zones', align: 'center', label: 'Zones', field: 'zones' },
        { name: 'mode', align: 'center', label: 'Repeat Mode', field: 'mode' },
        { name: 'time', align: 'center', label: 'Time', field: 'time' },
        { name: 'enable', align: 'center', label: 'Enable', field: 'enable' },
        { name: 'actions', align: 'center', label: 'Actions', field: 'actions' }
      ],
      add: false,
      scheduleData: null,
      defaultSchedule: {
        name: '',
        file: null,
        zones: [],
        mode: 'Once',
        weeks: [],
        time: '12:00',
        enable: true
      }
    }
  },
  computed: {
    ...mapState({
      scheduleList: state => state.scheduler.scheduleList
    })
  },
  methods: {
    addSchedule () {
      this.scheduleData = {
        mode: 'new',
        name: 'Add Schdeule',
        rowIndex: null,
        schedule: this.defaultSchedule
      }
      this.scheduleData.schedule.time = moment().format('HH:mm')
      this.add = true
    },
    editSchedule (idx, data) {
      this.scheduleData = {
        mode: 'edit',
        name: 'Edit Schdeule',
        rowIndex: idx,
        schedule: data
      }
      this.add = true
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
        const toStr = []
        week.forEach(item => {
          toStr.push(item.label)
        })
        return toStr.join(', ')
      } else {
        return mode
      }
    }
  }
}
</script>
