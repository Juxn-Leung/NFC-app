const content = {
  namespaced: true,
  state: {
    message: '',
    background: '',
    mode: '',
  },
  mutations: {
    changeMessage(state, data) {
      state.message = data
    },
    changeBackground(state, data) {
      state.background = data
    },
    changeMode(state, data) {
      state.mode = data
    },
  },
  actions: {},
}

export default content

