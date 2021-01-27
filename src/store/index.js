import Vue from 'vue'
import Vuex from 'vuex'

// import example from './module-example'

Vue.use(Vuex)

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */
import playFile from './playFile'
import playlist from './playlist'
import status from './status'
import scheduler from './scheduler'

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      playFile,
      playlist,
      status,
      scheduler
    },

    // enable strict mode (adds overhead!)
    // for dev mode and --debug builds only
    strict: process.env.DEBUGGING
  })

  return Store
}
