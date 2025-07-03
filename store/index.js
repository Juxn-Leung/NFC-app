import Vue from 'vue'
import Vuex from 'vuex'
import user from './user'
import content from './content'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    user,
    content
  },
})

export default store

