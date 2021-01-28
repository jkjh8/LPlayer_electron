<template>
  <div>
    <q-stepper
      v-model="step"
      ref="stepper"
      alternative-labels
      color="primary"
      animated
    >
      <q-step
        :name="1"
        title="Select Booth"
        icon="settings"
        :done="step > 1"
      >
        <BoothSelect />
      </q-step>

      <q-step
        :name="2"
        title="Select Audio Output"
        icon="create_new_folder"
        :done="step > 2"
      >
        <AudioOutSel />
      </q-step>

      <q-step
        :name="3"
        title="Start Audio Player"
        icon="add_comment"
      >
        Start Audio Player
      </q-step>

      <template v-slot:navigation>
        <q-stepper-navigation>
          <q-btn v-if="step < 3" @click="$refs.stepper.next()" color="primary" label="Continue" />
          <q-btn v-else @click="startup" color="primary" label="Finish" />
          <q-btn v-if="step > 1" flat color="primary" @click="$refs.stepper.previous()" label="Back" class="q-ml-sm" />
        </q-stepper-navigation>
      </template>
    </q-stepper>
  </div>
</template>

<script>
import BoothSelect from './BoothSelect'
import AudioOutSel from './AudioOutSel'

export default {
  components: { BoothSelect, AudioOutSel },
  data () {
    return {
      step: 1
    }
  },
  methods: {
    startup () {
      this.$emit('close')
    }
  }
}
</script>
