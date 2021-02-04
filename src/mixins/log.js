import { ipcRenderer } from 'electron'

export const log = {
  methods: {
    logSend (category, message) {
      const msg = {
        source: `Player ${this.status.booth - 9}`,
        category: category,
        message: message
      }
      ipcRenderer.send('log', msg)
    },
    logSchedule (action, message) {
      const msg = {
        source: `Player ${this.status.booth - 9}`,
        category: 'Schedule',
        message: `Schedule ${action}, Mode: ${message.mode}, Weeks: ${message.weeks.map(e => e.label).join(',')}, Time: ${message.time}, file: ${message.file.path}, Zone: ${message.zones.map(e => e.name).join(',')}, Eanble: ${message.enable}`
      }
      ipcRenderer.send('log', msg)
    }
  }
}
