import { ipcRenderer } from 'electron'

export const playerEvent = {
  mounted () {
    ipcRenderer.on('returnMeta', this.updateMeta)
  },
  methods: {
    setAudioDevice (current) {
      this.$refs.audio.setSinkId(current.deviceId)
    },
    updateMeta (e, meta) {
      this.$store.dispatch('playFile/updateMeta', meta)
    },
    setPlayMode () {
      if (this.player.playMode === 'Playlist') {
        this.$store.commit('playFile/playMode', 'File')
      } else {
        this.$store.commit('playFile/playMode', 'Playlist')
      }
    }
  }
}
