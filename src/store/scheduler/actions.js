export function delSchedule ({ state, commit }, payload) {
  const idx = state.scheduleList.findIndex(function (item) { return item === payload })
  commit('delSchedule', idx)
}

export function editSchedule ({ commit }, payload) {
  commit('editSchedule', payload)
}
