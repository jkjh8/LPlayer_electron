import { app, BrowserWindow, nativeTheme, ipcMain } from 'electron'
import mediainfo from 'node-mediainfo'
const webApi = require('./web/webApi')

webApi.listen(8082)

try {
  if (process.platform === 'win32' && nativeTheme.shouldUseDarkColors === true) {
    require('fs').unlinkSync(require('path').join(app.getPath('userData'), 'DevTools Extensions'))
  }
} catch (_) { }

if (process.env.PROD) {
  global.__statics = __dirname
}

let mainWindow

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 600,
    useContentSize: true,
    webPreferences: {
      nodeIntegration: process.env.QUASAR_NODE_INTEGRATION,
      nodeIntegrationInWorker: process.env.QUASAR_NODE_INTEGRATION
    }
  })

  mainWindow.loadURL(process.env.APP_URL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

import dgram from 'dgram'
const mCast = dgram.createSocket('udp4')
mCast.bind(5007, '0.0.0.0', () => {
  mCast.setBroadcast(true)
  mCast.setMulticastTTL(128)
  mCast.addMembership('224.1.128.128')
})

mCast.on('listening', () => {
  const address = mCast.address()
  console.log(`UDP Multicat on ${address.address} : ${address.port}`)
})

mCast.on('message', (data, rinfo) => {
  console.log(`Message from ${rinfo.address} : ${data.toString()}`)
  mainWindow.webContents.send('status', data.toString())
})

ipcMain.on('reqMeta', async (event, filePath) => {
  const result = await mediainfo(filePath)
  console.log(result)
  event.reply('returnMeta', result)
})
