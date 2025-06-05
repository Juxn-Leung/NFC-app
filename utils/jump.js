// 封装跳转
function jumpUtils(action, url, backNum) {
  switch (action) {
    case 'push':
      uni.navigateTo({ url });    // 跳转到目标页面
      break;
    case 'replace':
      uni.redirectTo({ url });       // 替换当前页面跳转到目标页面
      break;
    case 'back':
      uni.navigateBack({          // 返回到指定层数的页面
        delta: backNum || 1
      });
      break;
    case 'switch':
      uni.switchTab({ url }); // 跳转到目标页面（只能跳转到tabBar页面）
      break;
    case 'reLaunch':
      uni.reLaunch({ url });   // 关闭所有页面并跳转到目标页面
      break;
  }
}
export {
  jumpUtils
}