<template>
  <view class="register-container">
    <NavBar
      :title="'注册'"
      bgColor="transparent"
    ></NavBar>

    <view class="register-content u-padding-35">
      <u-form
        :model="form"
        ref="uForm"
      >
        <u-form-item
          prop="name"
          left-icon="account"
          :border-bottom="false"
        >
          <u-input v-model="form.name" />
        </u-form-item>
        <u-form-item
          prop="phone"
          left-icon="phone"
          :border-bottom="false"
        >
          <u-input v-model="form.phone" />
        </u-form-item>
      </u-form>

      <view class="btn-content u-margin-top-60">
        <text @click="submit">提交</text>
      </view>
    </view>

    <u-image
      class="popup-background"
      width="100%"
      height="100%"
      src="@/static/images/background.png"
      mode="aspectFill"
    ></u-image>

    <u-toast ref="uToast" />
  </view>
</template>

<script>
import NavBar from '@/components/NavBar/index.vue'

export default {
  data() {
    return {
      form: {
        name: '',
        phone: '',
      },
      rules: {
        name: [
          {
            required: true,
            message: '请输入姓名',
            trigger: ['change', 'blur'],
          }
        ],
        phone: [
          {
            required: true,
            message: '请输入手机号',
            trigger: ['change', 'blur'],
          },
          {
            // 自定义验证函数，见上说明
            validator: (rule, value, callback) => {
              // 上面有说，返回true表示校验通过，返回false表示不通过
              // this.$u.test.mobile()就是返回true或者false的
              return this.$u.test.mobile(value);
            },
            message: '手机号码不正确',
            // 触发器可以同时用blur和change
            trigger: ['change', 'blur'],
          }
        ]
      }
    }
  },
  components: {
    NavBar,
  },
  watch: {},
  computed: {},
  onLoad() { },
  methods: {
    submit() {
      this.$refs.uForm.validate((valid) => {
        if (valid) {
          // 提交表单逻辑
          this.$refs.uToast.show({
            title: '提交成功',
            type: 'success',
            url: '/pages/home/home'
          })
          uni.setStorageSync('userInfo', {
            name: this.form.name,
            phone: this.form.phone,
            status: 'registered' // 假设已注册
          });
        }
      });
    }
  },
  onUnload() { },
  onReady() {
    this.$refs.uForm.setRules(this.rules);
  }
}
</script>
<style lang="scss" scoped>
.register-container {
  width: 100vw;
  height: 100vh;

  .register-content {
    margin-top: 50rpx;

    ::v-deep .u-form-item {
      background: #ebebeb;
      border-radius: 100rpx;
      margin-bottom: 30rpx;
      padding-left: 30rpx;
      padding-right: 30rpx;
    }

    .btn-content {
      height: 100rpx;
      background: linear-gradient(360deg, #23221E 0%, #37342B 100%);
      border-radius: 100rpx;
      display: flex;
      justify-content: center;
      align-items: center;

      text {
        width: 128rpx;
        height: 48rpx;
        font-family: Source Han Sans CN, Source Han Sans CN;
        font-weight: bold;
        font-size: 32rpx;
        color: #F8E49D;
        text-align: center;
        font-style: normal;
        text-transform: none;
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