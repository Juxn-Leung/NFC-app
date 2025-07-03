const user = {
  namespaced: true,
  state: {
    token: uni.getStorageSync('token') || null,
    userInfo: uni.getStorageSync('userInfo') || {
      name: '',
      phone: '',
      status: ''
    },
  },
  mutations: {
    changeToken(state, data) {
      state.token = data
      uni.setStorageSync('token', data)
    },
    changeUserInfo(state, data) {
      state.userInfo = data
      uni.setStorageSync('userInfo', data)
    },
  },
  actions: {},
}

export default user

