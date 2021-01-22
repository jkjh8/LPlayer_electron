export function updatePlayFile (state, payload) {
  state.currentFile = payload
  state.source = `http://localhost:8082/stream?file=${encodeURIComponent(payload.path)}`
}
