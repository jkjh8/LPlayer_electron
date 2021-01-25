export function updatePlayFile ({ commit }, payload) {
  commit('updatePlayFile', payload)
}

export function play ({ commit }, payload) {
  commit('play', payload)
}

export function playing ({ commit }, payload) {
  commit('playing', payload)
}

export function playlistPlay ({ commit }, payload) {
  commit('playlistPlay', payload)
}
