<script>
export default {
  methods: {},
  onLaunch: function () {
    console.log('App Launch')
    uni.setStorageSync('userInfo', {
      name: '',
      phone: '',
      status: '' // 假设已注册
    });
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
// page {
//   background-color: #f0f2f5;
// }</style>
