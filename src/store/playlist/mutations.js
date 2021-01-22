export function addPlaylist (state, payload) {
  state.currentPlaylist.push(payload)
}

export function delPlaylist (state, payload) {
  state.currentPlaylist.splice(payload, 1)
}

export function playlistPlay (state, payload) {
  state.playlistPlay = payload
}

export function playlistLoop (state, payload) {
  state.playlistLoop = payload
}
