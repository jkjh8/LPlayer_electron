export function addPlaylist (state, payload) {
  state.playlist.push(payload)
}

export function delPlaylist (state, payload) {
  state.playlist.splice(payload, 1)
}

export function updatePlaylistIdx (state, payload) {
  state.playlistIdx = payload
}
