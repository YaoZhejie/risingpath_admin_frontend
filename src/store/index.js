import Vue from 'vue'
import Vuex from 'vuex'
import configure from './configure'
import user from './user'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    configure,
    user,
  }
})

export default store
