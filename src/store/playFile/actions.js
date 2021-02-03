// import { ipcRenderer } from 'electron'

export function updatePlayFile ({ commit }, payload) {
  commit('updatePlayFile', payload)
  commit('playing', false)
  // ipcRenderer('reqMeta', state.player.file.path)
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

export function updateMute ({ commit }) {
  commit('updateMute')
}

export function updateMeta ({ commit }, payload) {
  commit('updateMeta', payload)
}
