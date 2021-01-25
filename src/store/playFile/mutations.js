export function updatePlayFile (state, payload) {
  state.player.file = payload
  state.player.source = `http://localhost:8082/stream?file=${encodeURIComponent(payload.path)}`
}

export function play (state, payload) {
  state.player.globalPlaying = payload
}

export function playing (state, payload) {
  state.player.playing = payload
}

export function playlistPlay (state, payload) {
  state.player.playlistPlay = payload
}

export function updateMeta (state, payload) {
  state.player.meta = payload
}
