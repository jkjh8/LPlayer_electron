<template>
  <q-card style="width: 50%">
    <q-card-section>
      <div class="text-h6">Add Schedule</div>
    </q-card-section>
    <q-card-section>
      <div class="q-mx-md" style="max-width: 90%">
        <q-input v-model="name" label="Schedule Name" />
        <q-file v-model="file" label="Select File" />
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
export default {
  data () {
    return {
      name: '',
      file: ''
    }
  }
}
</script>
