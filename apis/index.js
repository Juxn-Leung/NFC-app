const requestUtil = {
  appId: 'wx8e596e926cad1a62',
  apiurl: 'https://fyzs.hwqnb.top/fidelityApi',
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
