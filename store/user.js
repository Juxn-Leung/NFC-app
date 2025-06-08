const user = {
  namespaced: true,
  state: {
    token: uni.getStorageSync('token') || null,
    userInfo: uni.getStorageSync('userInfo') || { frisUser: { name: '' } },
    userOrganization: uni.getStorageSync('userOrganization') || {},
    agreement: uni.getStorageSync('agreement') || false,
    userOrganization: uni.getStorageSync('userOrganization') || {},
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
    changeUserOrganization(state, data) {
      state.userOrganization = data
      uni.setStorageSync('userOrganization', data)
    },
    changeAgreement(state, data) {
      console.log('>>>>>>>>>>>>', data);
      state.agreement = data
      uni.setStorageSync('agreement', data)
    },
    changeUserOrganization(state, data) {
      state.userOrganization = data
      uni.setStorageSync('userOrganization', data)
    },
  },
  actions: {},
}

export default user

