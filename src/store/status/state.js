import zone from '../../../Zone.json'

export default function () {
  return {
    status: {
      zones: zone,
      selected: [],
      booth: 1
    }
  }
}
