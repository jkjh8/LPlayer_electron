<template>
  <q-page>
    <div>
      <q-table
        dense
        title="Scheduler"
        :data="schedule"
        :columns="columns"
        :filter="filter"
      >
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
      </q-table>
    </div>
    <q-dialog v-model="add" persistent transition-show="scale" transition-hide="scale">
      <addSchedule @close="add=!add"></addSchedule>
    </q-dialog>
  </q-page>
</template>

<script>
import addSchedule from '../components/ScheduleDialog'

export default {
  name: 'PageScheduler',
  components: { addSchedule },
  data () {
    return {
      filter: '',
      schedule: [],
      columns: [
        { name: 'name', align: 'center', label: 'Name', field: 'name' },
        { name: 'file', align: 'center', label: 'File', field: 'file' },
        { name: 'repeat', align: 'center', label: 'Repeat Mode', field: 'repeat' },
        { name: 'time', align: 'center', label: 'Time', field: 'time' },
        { name: 'enable', align: 'center', label: 'Enable', field: 'enable' },
        { name: 'actions', align: 'center', label: 'Actions', field: 'actions' }
      ],
      add: false
    }
  },
  methods: {
    addSchedule () {
      this.add = true
    }
  }
}
</script>
