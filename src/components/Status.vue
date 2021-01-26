<template>
  <div class="q-pa-md">
    <q-table
      grid
      dense
      title="Status"
      :data="status"
      :columns="columns"
      row-key="name"
      selection="multiple"
      :selected.sync="selected"
      :filter="filter"
      hide-header
      :pagination.sync="pagination"
      :rows-per-page-options="[0, 5, 10 ,20, 30]"
      @update:selected="selectedCallback"
    >
      <template v-slot:top-right>
        <q-btn
          flat
          round
          class="q-mx-xs"
          icon="spellcheck"
          @click="selAll"
        >
          <q-tooltip
            anchor="top middle"
            self="bottom middle"
            :offset="[10, 10]"
          >
            Select All Zone
          </q-tooltip>
        </q-btn>
        <q-btn
          flat
          round
          class="q-mx-xs"
          icon="loop"
          @click="selNone"
        >
          <q-tooltip
            anchor="top middle"
            self="bottom middle"
            :offset="[10, 10]"
          >
            Clear Select Zone
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

      <template v-slot:item="props">
        <div
          class="q-ma-sm grid-style-transition"
          :style="props.selected ? 'transform: scale(0.95)' : ''"
        >
          <q-btn
            padding="0"
            :disable="props.row.status||globalPlaying ? true : false"
            @click="props.selected=!props.selected">
            <q-card
              :class="props.selected ? 'bg-blue-grey-10 status' : 'bg-white status'"
              :style="props.selected ? 'color: white' : 'color: black' "
            >
              <q-list>
                <q-item>
                  <!-- badge -->
                  <q-badge
                    v-if="props.row.status"
                    color="red"
                    floating
                  >
                    <q-icon name="block"></q-icon>
                  </q-badge>
                  <q-item-section>
                    <q-item-label>
                      <span>{{ props.row.name }}</span>
                    </q-item-label>
                    <q-item-label :style="props.selected ? 'color: white' : 'color: black'"
                      caption
                    >
                      {{ statusConvert(props.row.status) }}
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card>
          </q-btn>
        </div>
      </template>
    </q-table>
    <!-- <q-fab v-show="scrollFab" color="secondary" icon="keyboard-arrow-up"></q-fab> -->
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { ipcRenderer } from 'electron'

export default {
  data () {
    return {
      filter: '',
      selected: [],
      pagination: {
        page: 1,
        rowsPerPage: 0
      },
      columns: [
        { name: 'name', required: true, label: 'Name', field: 'name' },
        { name: 'status', align: 'center', label: 'Status', field: 'status' }
      ]
    }
  },
  computed: {
    ...mapState({
      status: state => state.status.status.zones,
      globalPlaying: state => state.playFile.player.globalPlaying
    }),
    btnStatus (id) {
      if (id) { return true } else { return false }
    }
  },
  mounted () {
    console.log(this.status)
    ipcRenderer.on('status', (event, data) => {
      this.parceData(data)
    })
  },
  methods: {
    selAll () {
      this.selected = this.status
      this.selectedCallback(this.selected)
    },
    selNone () {
      this.selected = []
      this.selectedCallback(this.selected)
    },
    statusConvert (status) {
      if (status === 0) {
        return 'Waiting'
      } else if (status > 0 && status < 10) {
        return `Booth ${status}`
      } else if (status > 9 && status < 19) {
        return `Player ${status - 9}`
      }
    },
    parceData (data) {
      if (data.startsWith('t:onair')) {
        data = data.replace(/t:onair,|,!/gi, '')
        const arr = data.split(',')
        arr.forEach(zone => {
          zone = zone.trim()
          this.$store.dispatch('status/chgStatus', zone)
        })
      }
    },
    selectedCallback (data) {
      this.$store.commit('status/updateSelected', data)
    }
  }
}
</script>

<style lang="sass">
.grid-style-transition
  transition: transform .28s, background-color .28s
.status
  width: 150px
.q-checkbox
  height: 5px
</style>
