export function addPlaylist (state, payload) {
  state.playlist.push(payload)
}

export function delPlaylist (state, payload) {
  state.playlist.splice(payload, 1)
}
