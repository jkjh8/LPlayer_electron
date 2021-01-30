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

export function playMode (state, payload) {
  state.player.playMode = payload
}

export function updateMeta (state, payload) {
  state.player.meta = payload
}

export function updateDuration (state, payload) {
  state.player.duration = payload
}

export function updateBroadcastZone (state, payload) {
  state.player.broadcastZone = payload
}

export function updateMute (state) {
  state.player.mute = !state.player.mute
}

export function updateVol (state, payload) {
  state.player.volume = payload
}

export function updateLoop (state) {
  state.player.loop = !state.player.loop
}
