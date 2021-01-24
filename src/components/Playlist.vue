<template>
  <q-page>
    <q-card square>
      <!-- card title -->
      <q-card-section class="q-pa-none">
        <div class="q-pa-sm row">
          <spanß
            style="display: flex; align-items: center;"
          >
            Playlist
          </spanß>
          <q-space />
          <q-btn
            flat
            round
            size="sm"
            icon='playlist_add'
            @click="$refs.file.pickFiles()"
          >
            <q-tooltip
              anchor="center left"
              self="center end"
              content-style="opacity: 0.7;"
            >
              Add Playlist
            </q-tooltip>
          </q-btn>
        </div>
      </q-card-section>
      <q-separator />
      <!-- playlist -->
      <q-card-section class="q-pa-none">
        <q-list bordered>
          <q-item
            v-for="(file, idx) in files"
            :key="idx"
            clickable
            v-ripple
            :active="current === file"
            active-class="my-menu-link"
            class="menu-link"
            @click="selectPlaylist(file, idx)"
          >

            <q-item-section>
              <q-item-label>{{ file.name }}</q-item-label>
              <q-item-label caption lines="1">
                {{ file.path }}
                <q-tooltip :delay="1000" content-style="opacity: 0.7;">
                  {{ file.path }}
                </q-tooltip>
              </q-item-label>
            </q-item-section>

            <q-item-section side>
              <q-btn flat round size="sm" icon="delete" color="red" @click="delPlaylilstFile(file)" />
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>

  <!-- floating button for add plaulist -->
      <q-page-sticky position="bottom-right" :offset="fabPos">
        <q-btn
          fab
          icon="add"
          color="accent"
          outline
          style="font-size: 20px"
          :disable="draggingFab"
          v-touch-pan.prevent.mouse="moveFab"
          @click="$refs.file.pickFiles()"
        >
          <q-tooltip anchor="top middle" :delay="1000" content-style="opacity: 0.7; width: 100px;" :offset="[0, 100]">
            Add playlist items!
            You can move the position by dragging this button.
          </q-tooltip>
        </q-btn>
      </q-page-sticky>
      <!-- add files -->
      <q-file v-show="false" multiple ref="file" accept='audio/*' @input="addPlaylistFile"></q-file>
    </q-card>
  </q-page>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data () {
    return {
      idx: 150,
      current: null,
      draggingFab: false,
      fabPos: [18, 18]
    }
  },
  computed: {
    ...mapState({
      files: state => state.playlist.currentPlaylist
    })
  },
  mounted () {
    this.$root.$on('playlist-next', () => {
      if (this.idx < this.files.length - 1) {
        this.idx = this.idx + 1
        this.current = this.files[this.idx]
      } else {
        this.idx = 0
        this.current = this.files[0]
      }
      this.$root.$emit('changePlayFile', this.current)
    })
    this.$root.$on('playlist-previous', () => {
      if (this.idx === 0) {
        this.idx = this.files.length - 1
        this.current = this.files[this.idx]
      } else {
        this.idx = this.idx - 1
        this.current = this.files[this.idx]
      }
      this.$root.$emit('changePlayFile', this.current)
    })
  },
  methods: {
    moveFab (ev) {
      this.draggingFab = ev.isFirst !== true && ev.isFinal !== true

      this.fabPos = [
        this.fabPos[0] - ev.delta.x,
        this.fabPos[1] - ev.delta.y
      ]
    },
    delPlaylilstFile (file) {
      console.log(file)
      this.$store.dispatch('playlist/delPlaylist', file)
    },
    addPlaylistFile (files) {
      if (this.files.length === 0) {
        this.idx = 0
        this.current = files[0]
      }
      console.log(files)
      files.forEach(file => {
        this.$store.dispatch('playlist/addPlaylist', file)
      })
    },
    async selectPlaylist (file, idx) {
      this.idx = idx
      this.current = file
      this.$root.$emit('changePlayFile', file)
    }
  }
}
</script>

<style lang="sass">
.menu-link .q-item__label--caption
  body.screen--sm &
    max-width: 599
  body.screen--md &
    max-width: 400px
.my-menu-link
  color: white
  background: #F2C037
.my-menu-link .q-item__label--caption
  color: white
  body.screen--sm &
    max-width: 599
  body.screen--md &
    max-width: 400px
</style>
