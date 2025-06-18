// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({ env: process.env.ENV_ID })

// 云函数入口函数
exports.main = async (event) => {
  const wxContext = cloud.getWXContext()
  return {
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
  }
}