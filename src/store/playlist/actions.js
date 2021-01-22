export function addPlaylist ({ commit }, payload) {
  commit('addPlaylist', payload)
}

export function delPlaylist ({ state, commit }, payload) {
  const idx = state.currentPlaylist.findIndex(function (item) { return item === payload })
  commit('delPlaylist', idx)
}

export function playlistPlay ({ commit }, payload) {
  commit('playlistPlay', payload)
}

export function playlistLoop ({ commit }, payload) {
  commit('playlistLoop', payload)
}
