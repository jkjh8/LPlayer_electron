export function addSchedule (state, payload) {
  state.scheduleList.push(payload)
}

export function updateSchedule (state, payload) {
  state.scheduleList = payload
}

export function delSchedule (state, payload) {
  state.scheduleList.splice(payload, 1)
}

export function editSchedule (state, payload) {
  Object.assign(state.scheduleList[payload.idx], payload.schedule)
}

export function enableUpdate (state, idx) {
  state.scheduleList[idx].enable = !state.scheduleList[idx].enable
}

export function updateCurrentSchedule (state, payload) {
  state.currentSchedule = payload
}
