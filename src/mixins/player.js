import { ipcRenderer } from 'electron'
import { ms, h, m, s } from 'time-convert'

export const Player = {
  methods: {
    previous () {
      this.$root.$emit('playlist-previous')
    },
    next () {
      this.$root.$emit('playlist-next')
    },
    async chgPlayFile (file) {
      await this.$store.dispatch('playFile/updatePlayFile', file)
      this.$store.dispatch('playFile/playing', false)
      this.$refs.audio.load()
    },
    async openFile (file) {
      await this.$store.dispatch('playFile/updatePlayFile', file)
      ipcRenderer.send('reqMeta', this.player.file.path)
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
