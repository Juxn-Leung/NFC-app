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
    // 初始化云开发环境
    wx.cloud.init({
      env: "你的云环境ID", // 替换为实际环境ID（在微信云控制台获取）
      traceUser: true, // 追踪用户（静默获取 openid 必需）
    });
    const openid = uni.getStorageSync("openid");
    // 调用云函数获取 openid
    if (!openid) this.getUserOpenId();
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
