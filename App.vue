<script>
export default {
  methods: {},
  onLaunch: function () {
    console.log('App Launch')
    // wx.loadFontFace({
    //   family: 'PingFangQingChunTi',
    //   source: 'url("https://fyzs.hwqnb.top/PingFangQingChunTi-2.ttf")',
    //   success: function (res) {
    //     console.log('字体加载成功');
    //   },
    //   fail: function (res) {
    //     console.error('字体加载失败', res);
    //   }
    // });
    // uni.setStorageSync('userInfo', {
    //   name: '',
    //   phone: '',
    //   status: '' // 假设已注册
    // });
  },
  onShow: function () {
    console.log('App Show')
  },
  onHide: function () {
    console.log('App Hide')
  }
}
</script>

<style lang="scss">
@import "uview-ui/index.scss";
@import "@/static/iconfont/iconfont.css";

@font-face {
  font-family: 'PingFangQingChunTi';
  font-weight: 400;
  src: url('https://www.fidelity.net.cn/PingFangQingChunTi-2.ttf') format('truetype');
  font-display: swap;
}
</style>
