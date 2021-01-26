import { app, BrowserWindow, nativeTheme, ipcMain } from 'electron'
import mediainfo from 'node-mediainfo'
require('./db/db')

// udp sender
const dgram = require('dgram')
const client = dgram.createSocket('udp4')
const host = '192.168.1.19'
const port = 5008

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
    width: 1600,
    height: 600,
    useContentSize: true,
    webPreferences: {
      nodeIntegration: process.env.QUASAR_NODE_INTEGRATION,
      nodeIntegrationInWorker: process.env.QUASAR_NODE_INTEGRATION,
      enableRemoteModule: true
    }
  })

  mainWindow.loadURL(process.env.APP_URL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('before-quit', () => {
  const message = 't:booth10,!'
  client.send(message, 0, message.length, port, host, (err, bytes) => {
    if (err) event.returnValue = 'error'
    console.log(`UDP message send to ${host}:${port} message: ${message}`)
  })
})

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

// multicast server
require('./Server/Multicast')
mCast.on('message', (data, rinfo) => {
  console.log(`Message from ${rinfo.address} : ${data.toString()}`)
  mainWindow.webContents.send('status', data.toString())
})

ipcMain.on('reqMeta', async (event, filePath) => {
  const result = await mediainfo(filePath)
  console.log(result)
  event.reply('returnMeta', result)
})

ipcMain.on('udpsend', async (event, message) => {
  console.log(message)
  client.send(message, 0, message.length, port, host, (err, bytes) => {
    if (err) event.returnValue = 'error'
    console.log(`UDP message send to ${host}:${port} message: ${message}`)
    event.returnValue = 'OK'
  })
})

ipcMain.on('udpsendgetstatus', async (event) => {
  const message = 't:request,!'
  client.send(message, 0, message.length, port, host, (err, bytes) => {
    if (err) event.returnValue = 'error'
    console.log(`UDP message send to ${host}:${port} message: ${message}`)
  })
})

ipcMain.on('udpsendreset', async (event, booth) => {
  const message = `t:booth${booth},!`
  client.send(message, 0, message.length, port, host, (err, bytes) => {
    if (err) event.returnValue = 'error'
    console.log(`UDP message send to ${host}:${port} message: ${message}`)
  })
})
