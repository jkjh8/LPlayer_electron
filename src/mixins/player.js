import { ipcRenderer } from 'electron'
import { ms, h, m, s } from 'time-convert'

export const Player = {
  methods: {
    async chgPlayFile (file) {
      this.$store.dispatch('playFile/updatePlayFile', file)
      await this.$refs.audio.load()
      this.$store.dispatch('playFile/playing', false)
    },
    async openFile (file) {
      await this.$store.dispatch('playFile/updatePlayFile', file)
      ipcRenderer.send('reqMeta', this.play.file.path)
    },
    async loadFile () {
      await this.$refs.audio.load()
      this.$store.dispatch('playFile/playing', false)
    },
    playProcess () {
      this.$refs.audio.play()
    },
    msToHms (time) {
      return ms.to(h, m, s)(time).map(n => n < 10 ? '0' + n : n.toString()).join(':')
    }
  }
}
