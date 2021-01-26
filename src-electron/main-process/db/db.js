import { app } from 'electron'
const Datastore = require('nedb-promises')

const dbPath = `${app.getPath('userData')}/LPlayer/status.db`
const dbStatus = Datastore.create({
  filename: dbPath,
  autoload: true
})

const dbSchedulerPath = `${app.getPath('userData')}/LPlayer/status.db`
const dbScheduler = Datastore.create({
  filename: dbSchedulerPath,
  timestampData: true,
  autoload: true
})

global.dbStatus = dbStatus
global.dbScheduler = dbScheduler
