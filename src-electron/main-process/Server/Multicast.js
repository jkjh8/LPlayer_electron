import dgram from 'dgram'
const mCast = dgram.createSocket('udp4')
const port = 5007
const mCastIp = '224.1.128.128'

mCast.on('listening', function () {
  const address = mCast.address()
  console.log('UDP mCast listening on ' + address.address + ':' + address.port)
})

mCast.bind(port, '0.0.0.0', () => {
  mCast.setBroadcast(true)
  mCast.setMulticastTTL(128)
  mCast.addMembership(mCastIp)
  console.log('create mCast')
})

global.mCast = mCast