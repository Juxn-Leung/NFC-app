<template>
  <view class="register-container u-padding-35">
    <NavBar
      :title="'註冊'"
      bgColor="transparent"
    ></NavBar>

    <view class="register-content">


    </view>
  </view>
</template>

<script>
import NavBar from '@/components/NavBar/index.vue'

export default {
  data() {
    return {}
  },
  components: {
    NavBar,
  },
  watch: {},
  computed: {},
  onLoad() { },
  methods: {},
  onUnload() { },
}
</script>