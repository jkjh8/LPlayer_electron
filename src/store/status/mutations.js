export function chgStatus (state, payload) {
  const data = payload.split(':')
  state.status.zones[data[0] - 1].status = Number(data[1])
}

export function updateSelected (state, payload) {
  state.status.selected = payload
}

export function changeBooth (state, payload) {
  state.status.booth = payload
}
