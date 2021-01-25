export function chgStatus (state, payload) {
  const data = payload.split(':')
  state.status[data[0]].status = Number(data[1])
}

export function updateSelected (state, payload) {
  state.selected = payload
  console.log(state.selected)
}
