export default function () {
  return {
    player: {
      file: null,
      meta: null,
      loop: false,
      mute: false,
      volume: 100,
      source: '',
      playing: false,
      globalPlaying: false,
      playMode: 'File',
      playlistLoop: false,
      duration: 0,
      broadcastZone: ''
    }
  }
}
