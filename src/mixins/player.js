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
      ipcRenderer.send('reqMeta', this.player.file.path)
    },
    async loadFile () {
      await this.$refs.audio.load()
      this.$store.dispatch('playFile/playing', false)
    },
    selectZonesToString (state) {
      const zones = []
      const zonesName = []
      if (this.status.selected) {
        this.status.selected.forEach(item => {
          if (state) {
            zones.push(`${item.id}:${this.status.booth}`)
          } else {
            zones.push(`${item.id}:0`)
          }
          zonesName.push(item.name)
        })
        return {
          string: `t:onair,${zones.join(',')},!`,
          names: zonesName.join(',')
        }
      } else {
        return null
      }
    },
    msToHms (time) {
      return ms.to(h, m, s)(time).map(n => n < 10 ? '0' + n : n.toString()).join(':')
    }
  }
}
