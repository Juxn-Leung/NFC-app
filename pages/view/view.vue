<template>
  <view class="view-container">
    <NavBar bgColor="transparent"></NavBar>

    <view class="view-content u-padding-35">
      <scroll-view
        scroll-y="true"
        class="view-scroll"
      >
        <u-parse
          v-if="showMode === 'text'"
          :html="showMessage"
        ></u-parse>
        <u-notice-bar
          class="notice-bar"
          v-if="showMode === 'notice' && falg"
          showMode="horizontal"
          :volume-icon="false"
          :bg-color="'transparent'"
          :color="'#37342B'"
          :font-size="100"
          :list="[showMessage]"
        ></u-notice-bar>
      </scroll-view>
    </view>

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
      WHITE: require('@/static/images/WHITE.jpg'),
      JIM: require('@/static/images/JIM.jpg'),
      SILVER: require('@/static/images/SILVER.jpg'),
      BLUE: require('@/static/images/BLUE.jpg'),
      MWE: require('@/static/images/MWE.png'),
      PURPLE: require('@/static/images/PURPLE.jpg'),
      SPRING: require('@/static/images/SPRING.jpg'),

      falg: false,
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
      // 根据背景类型返回对应的图片路径
      return this.showBackground === 'MWE'
        ? this.MWE
        : this.showBackground === 'BLUE'
          ? this.BLUE
          : this.showBackground === 'PURPLE'
            ? this.PURPLE
            : this.showBackground === 'SPRING'
              ? this.SPRING
              : this.showBackground === 'WHITE'
                ? this.WHITE
                : this.showBackground === 'JIM'
                  ? this.JIM
                  : this.showBackground === 'SILVER'
                    ? this.SILVER
                    : ''
    },
  },
  onLoad() {
    console.log('message:', this.message);
    console.log('background:', this.background);
    console.log('mode:', this.mode);
    this.showMessage = this.message;
    this.showBackground = this.background;
    this.showMode = this.mode;
  },
  onShow() {
    uni.onWindowResize((res) => {
      console.log('Window resized:', res);
      this.falg = false;
      this.$nextTick(() => {
        this.falg = true;
      });
    });
  },
  methods: {},
  onUnload() { },
  onReady() {
    setTimeout(() => {
      this.falg = false;
    }, 1000);
  }
}
</script>
<style lang="scss" scoped>
.view-container {
  width: 100vw;
  height: 100vh;

  .view-content {
    height: 100%;
    width: 100%;
    padding: 15% 20rpx;
    position: absolute;
    left: 0;
    top: 0;

    .view-scroll {
      width: 100%;
      height: 100%;
      margin-top: 10%;
    }

    .notice-bar {
      width: 100%;
      margin-top: 50%;
      transform: translateY(-50%);
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