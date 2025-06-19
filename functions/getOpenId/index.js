exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext(); // 获取用户上下文
  return {
    openid: wxContext.OPENID, // 用户在当前小程序的唯一标识
    appid: wxContext.APPID,   // 小程序 appid
  };
};