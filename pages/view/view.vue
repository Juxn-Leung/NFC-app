<template>
  <view class="view-container">
    <NavBar bgColor="transparent"></NavBar>

    <scroll-view
      scroll-y="true"
      class="view-scroll"
    >
      <rich-text
        v-if="showMode === 'text'"
        :nodes="showMessage"
        class="rich-text"
        style="white-space: pre-wrap;"
      ></rich-text>
      <view
        v-if="showMode === 'notice' && flag"
        class="notice-content"
      >
        <u-notice-bar
          class="notice-bar"
          showMode="horizontal"
          :volume-icon="false"
          :bg-color="'transparent'"
          :color="'#37342B'"
          :font-size="isLandscape ? 100 : 50"
          :list="[showMessage]"
        ></u-notice-bar>
      </view>
    </scroll-view>

    <u-image
      v-if="formatImageUrl(showBackground)"
      class="popup-background"
      width="100%"
      height="100%"
      :src="formatImageUrl(showBackground)"
      mode="aspectFill"
    ></u-image>
  </view>
</template>

<script>
import NavBar from '@/components/NavBar/index.vue'
import { mapState } from 'vuex'
import { requestUtil } from '@/apis/index.js'
export default {
  data() {
    return {
      flag: false,
      showMessage: '',
      showBackground: '',
      showMode: '',
    }
  },
  components: {
    NavBar,
  },
  watch: {},
  computed: {
    ...mapState('content', ['message', 'background', 'mode']),
  },
  onLoad() {
    this.checkOrientation();
    this.showMessage = this.message;
    this.showBackground = this.background;
    this.showMode = this.mode;
  },
  onShow() {
    uni.onWindowResize((res) => {
      console.log('Window resized:', res);
      this.checkOrientation()
      this.flag = false;
      this.$nextTick(() => {
        this.flag = true;
      });
    });
  },
  methods: {
    checkOrientation() {
      const { windowWidth, windowHeight } = uni.getSystemInfoSync()
      this.isLandscape = windowWidth > windowHeight
    },
    // 格式化图片
    formatImageUrl(id) {
      console.log('图片ID:', id)
      if (!id) return ''
      return `${requestUtil.apiurl}/api/file/${id}` // 替换为实际的图片服务器地址
    },
  },
  onUnload() { },
  onReady() {
    setTimeout(() => {
      this.flag = true;
    }, 1000);
  }
}
</script>
<style lang="scss" scoped>
@function tovmin($rpx) {
  //$rpx为需要转换的字号
  @return #{$rpx * 100 / 750}vmin;
}

.view-container {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  font-family: 'PingFangJiangNanTi';

  .view-scroll {
    width: 100%;
    height: auto;
    top: 50%;
    transform: translateY(-50%);
    position: absolute;
    padding: tovmin(32);
    box-sizing: border-box;
  }

  .notice-content {
    position: relative;
    width: 100%;
    height: 100%;

    .notice-bar {
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
      position: absolute;

      :deep(.u-notice-content) {
        text-align: left !important;
      }
    }
  }

  .popup-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
  }
}
</style>