export function addPlaylist ({ commit }, payload) {
  commit('addPlaylist', payload)
}

export function delPlaylist ({ state, commit }, payload) {
  const idx = state.playlist.findIndex(function (item) { return item === payload })
  commit('delPlaylist', idx)
}
