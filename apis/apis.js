import { requestUtil } from './index.js'

const apis = {
  // 获取用户手机
  getPhone(data) {
    return requestUtil.urlRequest(`/api/wechat/phone?code=${data}`, {}, 'POST')
  },
  // 根據手機號碼獲取用戶信息
  getByPhone(data) {
    return requestUtil.urlRequest(`/api/wechat/getByPhone`, data, 'POST')
  },
  // 用戶註冊
  wxRegister(data) {
    return requestUtil.urlRequest(`/api/wechat/wxRegister`, data, 'POST')
  },
  patternList(data) {
    return requestUtil.urlRequest(`/wx/pattern/list`, data, 'POST')
  },
  patternOne(data) {
    return requestUtil.urlRequest(`/wx/pattern/one`, data, 'POST')
  },
  picList(data) {
    return requestUtil.urlRequest(`/wx/pic/list`, data, 'POST')
  }
}

export {
  apis
}