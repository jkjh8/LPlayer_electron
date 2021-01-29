export default function () {
  return {
    player: {
      file: null,
      meta: null,
      source: '',
      playing: false,
      globalPlaying: false,
      playMode: 'File',
      playlistLoop: false,
      duration: 0,
      brocastZone: null
    }
  }
}
