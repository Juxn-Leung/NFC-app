<template>
  <view class="protocol_box">
    <view
      class="select"
      :class="{ active: agree }"
      @click="agreeClick"
    ></view>
    仅限特定人群登录

    <view
      v-for="(item, index) in protocolArr"
      :key="index"
    >

      <text @click="protocolClick(index)">{{ protocolArr[index] }}</text>

      <span v-if="index < (protocolArr.length - 1)">{{ " 、" }}</span>

    </view>

  </view>
</template>

<script>
export default {
  props: {
    // 是否同意
    agree: {
      type: Boolean,
      default: false
    },
    // 协议数组
    protocolArr: {
      type: Array,
      default: function () {
        return [];
      }
    },

  },

  methods: {
    // 是否同意勾选
    agreeClick() {

      this.$emit('click')

    },
    protocolClick(tag) {

      this.$emit('protocolClick', tag)

    }

  }


}
</script>




<style lang="scss" scoped>
//主题色 #ea552d
$themeColor: #ea552d;



.protocol_box {

  display: flex;
  flex-wrap: wrap;


  justify-content: center;
  align-items: center;

  margin-top: 40rpx;
  margin-left: 2%;
  width: 96%;
  font-size: 28rpx;
  color: #333333;
  font-size: 13px;




  .select {
    width: 36rpx;
    height: 36rpx;
    background-image: url("./ic_nor.png");
    background-position: center center;
    background-repeat: no-repeat;
    background-size: 100% auto;
    margin-right: 15rpx;
    margin-top: 2px;


    &.active {
      background-image: url("./ic_sel.png");
    }
  }

  text {


    color: $themeColor;
    font-size: 13px;

    white-space: pre-wrap;



  }


}
</style>