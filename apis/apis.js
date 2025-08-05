import { requestUtil } from './index.js'

const apis = {
  login(data) {
    return requestUtil.urlRequest('wx/user/login', data, 'post')
  },
  phoneLogin(data) {
    return requestUtil.urlRequest('wx/user/checkSmsCode', data, 'post')
  },
  // 保存用户手机
  saveUserPhone(data) {
    return requestUtil.urlRequest('wx/user/phone', data, 'get')
  },
  // 保存用户信息
  setUserInfo(data) {
    return requestUtil.urlRequest('wx/user/userSave', data, 'post')
  },
  // 获取用户信息
  getUserInfo(data) {
    return requestUtil.urlRequest('wx/user/userInfo', data, 'get')
  },

  // 获取用户手机
  getPhone(data) {
    return requestUtil.urlRequest('/api/wechat/phone', data, 'POST')
  },
}

export {
  apis
}