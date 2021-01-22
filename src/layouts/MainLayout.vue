<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <q-toolbar class="bg-grey-9">
        <q-btn
          flat
          dense
          round
          dark
          icon="play_circle"
          aria-label="Menu"
        />

        <q-toolbar-title>
          <div class="text-weight-medium text-title">
            PLAYER
          </div>
        </q-toolbar-title>

        <div class="q-mr-md">
          <q-tabs
            class="text-grey"
            v-model="tab"
            active-color="white"
            @input="changeTab"
          >
            <q-tab class="menutab" name="player" label="player" />
            <q-tab class="menutab" name="scheduler" label="Scheduler" />
            <q-tab class="menutab" name="settings" label="Settings" />
          </q-tabs>
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer  class="bg-grey-8 text-white">
      <CompenntPlayer />
    </q-footer>
  </q-layout>
</template>

<script>
import CompenntPlayer from '../components/Player'

export default {
  name: 'MainLayout',
  components: {
    CompenntPlayer
  },
  data () {
    return {
      tab: 'player'
    }
  },
  methods: {
    changeTab (value) {
      this.$router.push(value)
    }
  }
}
</script>

<style>
.text-title {
  font-size: 0.8em;
}
.menutab .q-tab__label {
  font-weight: 300;
  text-transform: capitalize;
}
</style>
