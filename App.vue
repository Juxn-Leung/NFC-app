<script>
export default {
  methods: {
    async getUserOpenId() {
      try {
        const res = await uni.cloud.callFunction({
          name: "getUserOpenId", // 云函数名称
        });
        const openid = res.result.openid;
        console.log("用户 openid:", openid);
        uni.setStorageSync("openid", openid); // 存储到本地
      } catch (err) {
        console.error("获取 openid 失败:", err);
      }
    },
  },
  onLaunch: function () {
    console.log('App Launch')
    if (wx.cloud) {
      wx.cloud.init({
        env: "cloud1-9g9zjuj0caed4611", // 替换为你的云环境ID
        traceUser: true,    // 记录用户访问
      });
    }
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
