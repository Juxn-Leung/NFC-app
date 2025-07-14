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
      v-if="getUrl"
      class="popup-background"
      width="100%"
      height="100%"
      :src="getUrl"
      mode="aspectFill"
    ></u-image>
  </view>
</template>

<script>
import NavBar from '@/components/NavBar/index.vue'
import { mapState } from 'vuex'
export default {
  data() {
    return {
      WHITE: require('@/static/images/WHITE_w.jpg'),
      JIM: require('@/static/images/JIM_w.jpg'),
      SILVER: require('@/static/images/SILVER_w.jpg'),

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
    getUrl() {
      const backgrounds = {
        WHITE: this.WHITE,
        JIM: this.JIM,
        SILVER: this.SILVER,
      };
      const url = backgrounds[this.showBackground] || '';
      return url || '';
    },
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
    }
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

  .view-scroll {
    width: 100%;
    height: 70%;
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
      // font-size: tovmin(100);
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