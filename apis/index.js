const requestUtil = {
  appId: 'wx695ff6c8b81fc8e3',
  apiurl: 'http://192.168.21.181:8999/',
  // 参数： url: 接口路径  param：请求参数  methods：请求方式 callBack：回调函数
  urlRequest: function (url, params, methods) {
    return new Promise((resolve, reject) => {
      uni.request({
        url: this.apiurl + url,
        method: methods,
        data: params,
        dataType: "json",
        header: {
          'Content-Type': 'application/json',
          'token': uni.getStorageSync('token')
        },
        success: (res) => {
          resolve(res.data)
        },
        fail: (e) => {
          reject(e)
        },
        complete() {
        }
      })
    })
  },
}

export {
  requestUtil
}
