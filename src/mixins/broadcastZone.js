export const BroadcastZone = {
  methods: {
    selectZonesToString (state) {
      const zones = []
      const zonesName = []
      const overlapZone = []
      if (this.status.selected) {
        this.status.selected.forEach(item => {
          if (state) {
            zones.push(`${item.id}:${this.status.booth}`)
            if (this.status.zones[item.id - 1].status) {
              overlapZone.push(this.status.zones[item.id - 1].status)
            }
          } else {
            zones.push(`${item.id}:0`)
          }
          zonesName.push(item.name)
        })
        this.$store.commit('playFile/updateBroadcastZone', {
          idx: `t:onair,${zones.join(',')},!`,
          name: zonesName.join(','),
          selected: this.status.selected,
          overlap: overlapZone
        })
      } else {
        this.$store.commit('playFile/updateBroadcastZone', null)
      }
    }
  }
}
