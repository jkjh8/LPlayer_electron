export function chgStatus (state, payload) {
  const data = payload.split(':')
  if (data[0] < 57) {
    state.status.zones[data[0] - 1].status = Number(data[1])
  }
}

export function updateZones (state, payload) {
  state.status.zones = payload
}

export function updateSelected (state, payload) {
  state.status.selected = payload
}

export function updatePlaylock (state, payload) {
  state.status.playlock = payload
}

export function changeBooth (state, payload) {
  state.status.booth = payload
}
