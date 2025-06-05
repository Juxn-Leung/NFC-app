const tipsUtils = {
  // 阻止多次弹出
  needLoadingRequestCount: 0,
  needModelRequestCount: 0,
  showLoading(title) {
    if (this.needLoadingRequestCount === 0) {
      // setTimeout(() => {
      uni.showLoading({
        title: title || '',
        mask: true,
        // });
      }, 200);
    }
    this.needLoadingRequestCount++;
  },
  hideLoading() {
    if (this.needLoadingRequestCount <= 0) return;
    this.needLoadingRequestCount--;
    if (this.needLoadingRequestCount === 0) {
      uni.hideLoading()
    }
  },
  toast(test, duration) {
    uni.showToast({
      title: test,
      icon: 'none',
      duration: duration || 2000
    });
  },
  showModal(content, callBack) {
    let _this = this
    if (_this.needModelRequestCount === 0) {
      uni.showModal({
        title: '提示',
        content: content,
        success: function (res) {
          if (res.confirm) {
            // console.log('用户点击确定');
            _this.needModelRequestCount = 0
            callBack();
          } else if (res.cancel) {
            _this.needModelRequestCount = 0
            console.log('用户点击取消');
          }
        }
      });
    }
    _this.needModelRequestCount++;
  },
  // hideModal() {
  //     if (this.needLoadingRequestCount <= 0) return;
  //     this.needLoadingRequestCount--;
  //     if (this.needLoadingRequestCount === 0) {
  //         uni.hideLoading()
  //     }
  // },
  // 預覽單張圖片
  previewImage(tempSrc) {
    let tempArr = [];
    tempArr.push(tempSrc);
    uni.previewImage({
      urls: tempArr
    });
  }
}

export {
  tipsUtils
}