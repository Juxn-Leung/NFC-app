<template>
  <view class="home u-flex u-flex-column u-flex-center">
    <NavBar
      :backState="2000"
      bgColor="transparent"
    ></NavBar>

    <view class="home-content u-padding-35">
      <u-image
        class="ring-image"
        width="456rpx"
        height="730rpx"
        src="/static/icon/ring.png"
      ></u-image>

      <u-image
        class="phone-image"
        width="500rpx"
        height="600rpx"
        src="/static/icon/phone.png"
      ></u-image>

      <text class="container-text">将手机背面靠近戒指</text>

      <button
        v-if="!userInfo.phone"
        class="btn-content"
        open-type="getPhoneNumber"
        @getphonenumber="getPhoneNumber"
      >
        <text class="text">获取手机号</text>
      </button>
      <cc-protocolBox
        v-if="!userInfo.phone"
        class="btn-content2"
        :agree="agree"
        :protocolArr="protocolArr"
        @click="agree = !agree"
        @protocolClick="protocolClick"
      ></cc-protocolBox>

      <view
        v-if="userInfo.status === 'registered'"
        class="btn-content"
        @click="
          () => {
            getBackgroundList()
            getPatternList()
            showEdit = true
            editBackground = background
            editMode = mode
            if (mode === 'text') {
              editMessages = messages
            } else if (mode === 'notice') {
              noticeMessage = messages
            }
          }
        "
      >
        <text class="text">编辑内容</text>
      </view>

      <view
        class="unReview-text"
        v-if="userInfo.status === 'unReview'"
      >
        审批中，请耐心等待
        <text
          class="unReview-text-btn"
          @click="getInfo"
        >{{ tips }}</text>
      </view>

      <view
        v-if="userInfo.phone && userInfo.status === 'unregistered'"
        class="btn-content"
        @click="handleRegister"
      >
        <text class="text">注册</text>
      </view>

      <u-image
        class="popup-background"
        width="100%"
        height="100%"
        src="@/static/images/background.png"
        mode="aspectFill"
      ></u-image>
    </view>

    <u-popup
      v-model="showEdit"
      mode="left"
      width="100%"
      height="100%"
    >
      <view class="popup-content u-padding-35">
        <scroll-view
          scroll-y="true"
          style="height: 80%; margin-top: 20%"
        >
          <view
            class="popup-pick"
            @click="
              () => {
                showPattern = true
              }
            "
          >应用款式：<text>{{ patternName }}</text></view>

          <view class="popup-select">
            <view class="select-image">
              <u-image
                v-if="editBackground"
                :src="formatImageUrl(editBackground)"
                width="144rpx"
                height="256rpx"
                mode="aspectFill"
              ></u-image>
              <text
                class="select"
                @click="
                  () => {
                    showBackground = true
                  }
                "
              >背景</text>
            </view>
            <view
              v-if="editMode === 'text'"
              class="select-image"
              @click="
                () => {
                  showModes = true
                }
              "
            >
              <u-image
                src="/static/icon/text.png"
                width="144rpx"
                height="144rpx"
                mode="aspectFill"
              ></u-image>
              <text class="select">文本展示</text>
            </view>
            <view
              v-if="editMode === 'notice'"
              class="select-image horizontal"
              @click="
                () => {
                  showModes = true
                }
              "
            >
              <u-notice-bar
                mode="horizontal"
                :volume-icon="false"
                style="width: 100%"
                :list="['滚动展示']"
              ></u-notice-bar>
            </view>
          </view>
          <EditorContent
            v-if="editMode === 'text'"
            :editorDetail="messages"
            @getContents="
              (html) => {
                editMessages = html
              }
            "
          ></EditorContent>
          <u-input
            v-if="editMode === 'notice'"
            v-model="noticeMessage"
            type="textarea"
            :border="true"
            :maxlength="200"
            auto-height
            :height="600"
            class="u-margin-top-40"
          />
        </scroll-view>
        <view class="popup-btn">
          <view
            class="button"
            @click="
              () => {
                showEdit = false
              }
            "
          >返回</view>
          <view
            class="button default"
            @click="handleView"
          >预览</view>
          <view
            class="button info"
            @click="onCopy"
          >复制</view>
          <view
            class="button primary"
            @click="onWrite"
          >写入</view>
        </view>
      </view>
    </u-popup>

    <u-modal
      title="选择背景"
      v-model="showBackground"
    >
      <view class="slot-content">
        <u-radio-group v-model="editBackground">
          <u-radio
            v-for="(item, index) in bgList"
            :key="index"
            :name="item.picId"
          >
            <view>
              <u-image
                v-if="item.picId"
                :src="formatImageUrl(item.picId)"
                width="54px"
                height="96px"
                mode="aspectFill"
              ></u-image>
              <text>{{ item.picName }}</text>
            </view>
          </u-radio>
        </u-radio-group>
      </view>
    </u-modal>

    <u-modal
      title="选择模式"
      v-model="showModes"
    >
      <view class="slot-content">
        <u-radio-group v-model="editMode">
          <u-radio
            v-for="(item, index) in modesList"
            :key="index"
            :name="item.value"
          >
            <text>{{ item.name }}</text>
          </u-radio>
        </u-radio-group>
      </view>
    </u-modal>

    <u-select
      v-model="showPattern"
      :list="patternList"
      title="选择款式"
      :label-name="'patternName'"
      :value-name="'id'"
      @confirm="handleSelectPattern"
    ></u-select>

    <u-verification-code
      ref="uCode"
      :seconds="60"
      start-text="刷新"
      end-text="刷新"
      @change="tipsChange"
    ></u-verification-code>

    <u-modal
      v-model="show"
      title="用户协议及隐私政策"
    >
      <view
        class="slot-content"
        style="white-space: break-spaces; height: 70vh; overflow: auto"
      >
        <rich-text :nodes="content"></rich-text>
      </view>
    </u-modal>
  </view>
</template>

<script>
import { parseNdefRecord, str2ab } from '@/utils/record.js'
import EditorContent from '@/components/Editor/index.vue'
import NavBar from '@/components/NavBar/index.vue'
import { requestUtil } from '@/apis/index.js'

export default {
  data() {
    return {
      show: false,
      agree: false,
      protocolArr: [' 用户协议及隐私政策 '],
      content: `重要提示：请务必仔细阅读 \n
          欢迎使用由垚绅国际贸易（上海）有限公司 （以下简称“我们”）提供的“Fidelity 戒指”小程序（以下简称“本服务”）。本服务是专为在我们官方渠道购买了我们智能戒指产品的用户（以下简称“特定用户”）提供的NFC功能读写与管理工具。如果您未购买我们的智能戒指产品，将无法使用本服务。 \n
          在您使用本服务前，请仔细阅读并充分理解以下《用户协议》和《隐私政策》。当您点击“同意”或开始使用本服务时，即表示您已阅读、理解并接受本协议的全部内容，并同意我们按照本政策收集、使用和保护您的个人信息。 \n
一、用户协议 \n
  1. 服务对象 \n
      本服务仅限于已在我们店铺购买了我们智能戒指产品的特定用户使用。我们有权通过您提供的手机号等信息验证您的购买资格。非特定用户请勿注册或使用本服务。 \n
  2. 账号注册与登录 \n
      2.1 为验证您的用户身份并提供服务，您需要授权我们获取您的手机号码，以完成小程序登录。 \n
      2.2 您确保您提供的手机号码是您本人所有且真实有效。我们将通过该手机号识别您是否为我们的产品用户。 \n
  3. 服务内容 \n
      本服务为您购买的智能戒指提供NFC数据的读取、写入及相关管理功能。所有操作均需在遵守相关法律法规的前提下进行。 \n
  4. 免责声明 \n
      您理解并同意，您在使用本服务对NFC数据进行操作时，应确保不侵犯他人合法权益或违反任何法律。因您不当使用本服务而产生的任何法律责任由您自行承担。 \n
二、隐私政策 \n
      我们高度重视您的隐私保护，并承诺严格按照本政策处理您的个人信息。 \n
  1. 我们收集的信息 \n
    1.1 手机号码：当您使用本小程序登录时，我们会收集您的微信绑定的手机号码。这是您使用本服务的唯一身份凭证。 \n
  2. 我们如何使用这些信息 \n
    2.1 唯一目的：收集您的手机号码仅用于验证您是否为我们智能戒指的购买用户，并作为您登录和使用本小程序服务的账号依据。 \n
    2.2 我们不会将您的手机号码用于任何形式的营销、推广、用户画像分析或提供给任何第三方。 \n
  3. 信息的存储与保护 \n
    3.1 您的手机号码将安全地存储在我们的服务器上，并采取合理的技术措施防止信息泄露、损毁或丢失。 \n
    3.2 除非法律强制要求，否则我们不会向任何第三方共享、转让或公开披露您的手机号码。 \n
  4. 您的权利 \n
      您有权查询、更正您的个人信息（手机号码）。如需操作，请通过文末联系方式与我们联系。 \n
  5. 政策更新 \n
      我们可能会适时更新本政策。更新后的政策会在本页面公布，敬请定期查阅。 \n
联系我们 \n
  如果您对本协议或隐私政策有任何疑问、意见或建议，请通过以下方式联系我们： \n
  客服电话/微信：135 6488 7111 \n
`,
      // 电子邮件/店铺地址：【请填写您的电子邮箱或实体店地址】
      tips: '',
      bgList: [],
      patternList: [],

      modesList: [
        { name: '文字展示', value: 'text' },
        { name: '滚动展示', value: 'notice' },
      ],

      patternName: '请选择',

      userInfo: {
        id: null,
        name: '',
        phone: '',
        status: '',
      },

      // NFC 实例
      nfc: null,
      ndef: null,
      nfcStatus: false, // NFC 状态

      nfcMessage: '没有NFC标签',

      messages: '', // 消息内容
      background: '', // 背景
      music: '', // 音乐地址
      mode: 'text',

      editMessages: '',
      noticeMessage: '', // 滚动展示的消息内容
      editBackground: '',
      editMusic: '测试Music',
      editMode: 'text', // 编辑模式 text (文字展示)、notice (滚动展示)

      screen: 'horizontal', // 横屏 horizontal 竖屏 vertical

      showEdit: false,
      showBackground: false,
      showModes: false,
      showPattern: false,
    }
  },
  components: {
    NavBar,
    EditorContent,
  },
  watch: {},
  computed: {},
  onLoad() {
    console.log('onLoad')
    this.nfcInfo()
  },
  onShow() {
    this.nfcStatus = true
    this.handleRefresh()
  },
  methods: {
    protocolClick() {
      this.show = true
    },
    tipsChange(text) {
      this.tips = text
    },
    getInfo() {
      if (this.$refs.uCode.canGetCode) {
        // 模拟向后端请求验证码
        this.handleRefresh()
        setTimeout(() => {
          uni.hideLoading()
          this.$refs.uCode.start()
        }, 2000)
      } else {
        this.$u.toast('倒计时结束后再发送')
      }
    },
    handleRefresh() {
      // 页面显示时，检查是否有存储的消息内容
      const userinfo = uni.getStorageSync('userInfo')
      if (userinfo) {
        this.userInfo = userinfo
      }
      if (userinfo.phone) {
        this.login(userinfo.phone)
      }
    },
    async login(phone) {
      try {
        const { data } = await this.$apis.getByPhone({
          userPhone: phone,
        })
        if (data && data.id) {
          const { userName, userPhone, userStatus, id } = data
          this.userInfo = {
            id,
            name: userName,
            phone: userPhone,
            status:
              userStatus === 0
                ? 'unReview'
                : userStatus === 1
                  ? 'registered'
                  : userStatus === 2
                    ? 'unReview'
                    : 'unregistered',
          }
          uni.setStorageSync('userInfo', this.userInfo)
        } else {
          this.userInfo.status = 'unregistered'
        }
        console.log('登录数据:', data)
      } catch (error) {
        console.log('登录失败:', error)
      }
    },
    async getBackgroundList() {
      try {
        const { data } = await this.$apis.picList({
          pageNo: 1,
          pageSize: 999,
          picStatus: 1,
        })
        console.log('数据:', data)
        // Vue2 响应式赋值方式
        this.$set(this, 'bgList', data.records || [])
      } catch (error) {
        console.log('失败:', error)
      }
    },
    async getPatternList() {
      try {
        const { data } = await this.$apis.patternList({
          pageNo: 1,
          pageSize: 999,
          patternStatus: 1,
        })
        console.log('数据:', data)
        // Vue2 响应式赋值方式
        this.$set(this, 'patternList', data.records || [])
      } catch (error) {
        console.log('失败:', error)
      }
    },
    async handleSelectPattern(pattern) {
      if (Array.isArray(pattern) && pattern.length > 0) {
        console.log('选择的款式:', pattern[0])
        try {
          const { data } = await this.$apis.patternOne({
            id: pattern[0].value,
          })
          console.log('数据:', data)
          this.patternName = data.patternName
          this.editBackground = data.backgroundId
          this.background = data.backgroundId
          if (data.patternMode === 'text') {
            this.editMessages = data.patternContent
          } else if (data.patternMode === 'notice') {
            this.noticeMessage = data.patternContent
          }
          this.messages = data.patternContent
          this.editMode = data.patternMode
          console.log('消息内容:', this.messages)
        } catch (error) {
          console.log('失败:', error)
        }
      }
      this.showPattern = false
    },
    nfcInfo() {
      // 获取NFC实例
      this.nfc = wx.getNFCAdapter()
      // 绑定监听 NFC 标签
      this.nfc.onDiscovered((res) => {
        console.log('监听到NFC标签:', res)
        const { messages } = res
        // 检查是否有消息
        if (messages && messages.length) {
          messages.forEach((item, index) => {
            console.log(`--- 消息 ${index + 1} ---`)

            // 解析消息中的记录
            if (item.records && item.records.length) {
              item.records.forEach((record, recIndex) => {
                const parsedRecord = parseNdefRecord(record)
                console.log(`记录 ${recIndex + 1}:`, parsedRecord)

                // 在界面上显示 id 为 content 的记录内容
                if (parsedRecord.id === 'message' && !this.showEdit) {
                  this.messages = parsedRecord.payload
                }
                // 如果记录类型是背景颜色，则设置背景颜色
                if (parsedRecord.id === 'background' && !this.showEdit) {
                  this.background = parsedRecord.payload
                }

                // 如果记录类型是模式，则设置编辑模式
                if (parsedRecord.id === 'mode' && !this.showEdit) {
                  this.mode = parsedRecord.payload
                }
              })

              if (this.messages && !this.showEdit && this.nfcStatus) {
                this.$store.commit('content/changeMessage', this.messages)
                this.$store.commit('content/changeBackground', this.background)
                this.$store.commit('content/changeMode', this.mode)
                uni.navigateTo({
                  url: '/pages/view/view',
                  success: () => {
                    this.nfcStatus = false
                  },
                })
              }
            }
          })
        } else {
          console.log('未发现 NDEF 消息')
          wx.showToast({
            title: '标签无内容或格式不支持',
            icon: 'none',
          })
        }
        // 监听到数据进行返回 根据返回的数据在进行 处理
        if (res.techs.includes('NDEF')) {
          const ndef = this.nfc.getNdef()

          ndef.connect({
            success(res) {
              console.log('success:', res)

              // 读取NDEF消息
              ndef.onNdefMessage((ress) => {
                console.log('读取到NDEF消息:', ress)
              })
            },
            fail(err) {
              console.log('err:', err)
            },
          })
        }
      })

      // 开始监听   不能缺少
      this.nfc.startDiscovery({
        success(res) {
          console.log(res)
          const { errno } = res
          this.nfcMessage = '开始监听'
        },
        fail(err) {
          console.log('err:', err)
          const { errCode } = err
          if (errCode === 13000) {
            this.nfcMessage = '设备不支持NFC'
          } else if (errCode === 13001) {
            this.nfcMessage = '系统NFC开关未打开'
          } else if (errCode === 13010) {
            this.nfcMessage = '未知错误'
          } else if (errCode === 13019) {
            this.nfcMessage = '用户未授权'
          } else if (errCode === 13013) {
            this.nfcMessage = '未扫描到NFC标签'
          } else if (errCode === 13014) {
            this.nfcMessage = '无效的标签技术'
          } else if (errCode === 13017) {
            this.nfcMessage = '相关读写操作失败'
          } else if (errCode === 13016) {
            this.nfcMessage = '连接失败'
          }
        },
      })
    },

    async onCopy() {
      const msg =
        this.editMode === 'text' ? this.editMessages : this.noticeMessage
      try {
        const { data } = await this.$apis.generateLink({
          linkContent: msg,
          mode: this.editMode,
          musicId: '',
          picId: this.editBackground,
          userId: this.userInfo.id,
        })
        console.log('数据:', data)
        uni.setClipboardData({
          data: data,
          success: (res) => {
            wx.showToast({ title: '复制成功' })
          },
          fail: () => {
            wx.showToast({ title: '复制失败', icon: 'none' })
          },
        })
      } catch (error) {
        console.log('失败:', error)
      }
    },

    async onWrite() {
      const ndef = this.nfc.getNdef()
      // let access_token = '';
      // let nfcUrl = '';
      // await wx.request({
      //   url: "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx8e596e926cad1a62&secret=ee7fc228ee2ebc77f0660cee772d152a",
      //   method: 'GET',
      //   success: function (res) {
      //     access_token = res.data.access_token
      //   },
      // })
      // if (access_token) {
      //   await wx.request({
      //     url: "https://api.weixin.qq.com/wxa/generatenfcscheme?access_token=" + access_token,
      //     data: {
      //       model_id: "_0QXLl5NGLHaWso4auYF3g"
      //     },
      //     method: 'POST',
      //     success: function (res) {
      //       nfcUrl = res.data.openlink
      //     },
      //   })
      // }
      if (!this.editBackground) {
        wx.showToast({
          title: '请先选择背景',
          icon: 'none',
        })
        return
      }

      const msg = this.editMode === 'text' ? this.editMessages : this.noticeMessage;

      // console.log('editMode:', this.editMode)
      // console.log('editMessages:', this.editMessages)
      // console.log('noticeMessage:', this.noticeMessage)
      // console.log('写入的消息:', msg)

      const records = [
        {
          id: str2ab('mini-ios'), // iOS小程序
          tnf: 1,
          type: str2ab('U'),
          // payload: str2ab('weixin://dl/business/?appid=2088241412926203&path=pages/home/home', [
          payload: str2ab('weixin://dl/business/?t=s7jMnEVZdtv', [0]),
        },
        {
          id: str2ab('mini-android'), // 安卓小程序
          tnf: 4,
          type: str2ab('android.com:pkg'),
          payload: str2ab('com.tencent.mm'),
        },
        {
          id: str2ab('message'), // 读写内容
          tnf: 1,
          type: str2ab('T'),
          payload: str2ab(msg),
        },
        {
          id: str2ab('background'), // 读写内容
          tnf: 1,
          type: str2ab('T'),
          payload: str2ab(this.editBackground),
        },
        {
          id: str2ab('mode'), // 读写内容
          tnf: 1,
          type: str2ab('T'),
          payload: str2ab(this.editMode),
        },
      ]

      console.log('要写入的 NDEF 消息:', records)

      ndef.writeNdefMessage({
        records: records,
        success() {
          wx.showToast({ title: '写入成功' })
          if (this.editMode === 'text') {
            this.messages = this.editMessages
          } else if (this.editMode === 'notice') {
            this.messages = this.noticeMessage
          }
          this.editMessages = ''
          this.noticeMessage = ''
          this.showEdit = false
        },
        fail(err) {
          console.error('写入失败:', err)
          wx.showToast({
            title: '写入失败,请重试',
            icon: 'none',
          })
        },
      })
    },
    handleView() {
      this.mode = this.editMode
      if (this.editMode === 'notice') {
        this.messages = this.noticeMessage
      } else if (this.editMode === 'text') {
        this.messages = this.editMessages
      }
      console.log('预览消息内容:', this.messages)
      this.$store.commit('content/changeMessage', this.messages)
      this.$store.commit('content/changeBackground', this.editBackground)
      this.$store.commit('content/changeMode', this.mode)
      uni.navigateTo({
        url: '/pages/view/view',
        success: () => {
          this.nfcStatus = false
        },
      })
    },

    // 获取手机号
    async getPhoneNumber(e) {
      if (!this.agree) {
        this.$u.toast('请同意用户协议及隐私政策')
        return
      }
      try {
        const { data } = await this.$apis.getPhone(e.detail.code)
        this.userInfo.phone = data
        uni.setStorageSync('userInfo', this.userInfo)
        this.login(data)
      } catch (error) {
        console.error('获取手机号失败:', error)
        return
      }
    },

    // 格式化图片
    formatImageUrl(id) {
      if (!id) return ''
      return `${requestUtil.apiurl}/api/file/${id}` // 替换为实际的图片服务器地址
    },

    handleHold() {
      uni.setStorageSync('storageMessage', this.editMessages)
    },
    handleRegister() {
      uni.navigateTo({
        url: '/pages/register/register',
      })
    },
    handleStopNFC() {
      if (this.nfc) {
        this.nfc.stopDiscovery({
          success: () => {
            console.log('停止监听 NFC 标签成功')
          },
          fail: (err) => {
            console.log('停止监听 NFC 标签失败:', err)
          },
        })
      }
    },
  },
  onUnload() {
    // 停止监听 NFC 标签
    this.handleStopNFC()
  },
}
</script>
<style lang="scss" scoped>
.home {
  width: 100vw;
  height: 100vh;

  .home-content {
    width: 100%;
    height: 100%;
    z-index: 10;
    background: transparent;
    position: relative;

    .ring-image {
      position: absolute;
      top: 340rpx;
      left: 50%;
      transform: translateX(-50%);
      z-index: 1;
    }

    .phone-image {
      position: absolute;
      top: 354rpx;
      right: 100rpx;
      z-index: 1;
      animation: phone-move-in 8s infinite;

      @keyframes phone-move-in {
        0% {
          opacity: 0;
          right: -200rpx;
        }

        10% {
          opacity: 0.2;
          right: -100rpx;
        }

        30% {
          opacity: 1;
          right: -100rpx;
        }

        40% {
          opacity: 1;
          right: 0;
        }

        80% {
          opacity: 1;
          right: 0;
        }

        100% {
          opacity: 0;
          right: 0;
        }
      }
    }
  }
}

.unReview-text {
  position: absolute;
  bottom: 172rpx;
  left: 0;
  width: 100%;
  text-align: center;
  font-weight: 500;
  font-size: 32rpx;

  .unReview-text-btn {
    color: #146eff;
    cursor: pointer;
    margin-left: 4rpx;
  }
}

.container-text {
  height: 44rpx;
  font-family: PingFang SC, PingFang SC;
  font-weight: 500;
  font-size: 32rpx;
  color: #000000;
  text-align: center;
  font-style: normal;
  text-transform: none;
  position: absolute;
  bottom: 36%;
  left: 50%;
  transform: translateX(-50%);
  animation: blink 4s infinite;

  @keyframes blink {

    0%,
    100% {
      opacity: 1;
    }

    50% {
      opacity: 0.2;
    }
  }
}

.container-shadow {
  position: absolute;
  width: 50%;
  height: 30%;
  top: calc(45% + 16px);
  left: 25%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.5);
  border-radius: 16px;
  z-index: -1;
}

.popup-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}

.popup-content {
  height: 100%;
  width: 100%;
  z-index: 2;
  position: absolute;
  top: 0;
  left: 0;

  .view-content {
    height: 100vh;
    width: 100vw;
    padding: 10px;
    position: absolute;
    left: 0;
    top: 0;

    .notice-bar {
      width: 100%;
      margin-top: 50%;
      transform: translateY(-50%);
    }
  }

  .popup-pick {
    padding: 16rpx;
    box-sizing: border-box;
    position: relative;
    width: 100%;
    margin-bottom: 4rpx;

    text {
      padding: 6rpx 16rpx;
      color: #ffcc14;
      background: #fff6d5;
      border: 1px solid #ffcc14;
      font-weight: 500;
      text-align: center;
      border-radius: 16rpx;
    }
  }

  .popup-select {
    position: relative;
    width: 100%;
    height: 140px;
    display: flex;

    .select-image {
      width: 150rpx;
      margin-right: 32rpx;
      border-radius: 16rpx;
      height: 256rpx;
      overflow: hidden;
      border: 2px solid #bbbbbb;
      border-radius: 16rpx;
      position: relative;

      .select {
        width: 144rpx;
        height: 144rpx;
        text-align: center;
        line-height: 144rpx;
        z-index: 10;
        position: absolute;
        bottom: 0;
        left: 0;
      }
    }

    .select-image.horizontal {
      width: 256rpx;
      height: 144rpx;
      margin-top: 56rpx;
      display: flex;
      align-items: center;
    }
  }

  .popup-btn {
    position: relative;
    padding-top: 16px;
    padding-bottom: 16px;
    display: flex;
    justify-content: space-between;
    width: max-content;
    margin-left: 50%;
    transform: translateX(-50%);

    .button {
      width: 150rpx;
      height: 72rpx;
      border: 1px solid #37342b;
      border-radius: 36rpx;
      text-align: center;
      line-height: 68rpx;
      color: #37342b;
      font-size: 36rpx;
      margin: 0 16rpx;
    }

    .button.default {
      color: #ffcc14;
      background: #fff6d5;
      border: 1px solid #ffcc14;
    }

    .button.primary {
      background: #37342b;
      color: #f8e49d;
      border: none;
      list-style: 72rpx;
    }

    .button.info {
      background: #1f7acc;
      color: #fff;
      border: none;
      list-style: 72rpx;
    }
  }

  .popup-close {
    position: absolute;
    top: 40rpx;
    left: 40rpx;
  }

  .popup-screen {
    position: absolute;
    bottom: 40rpx;
    right: 40rpx;
  }
}

.slot-content {
  padding: 16px;
  display: flex;
  justify-content: center;
}

@keyframes movement {

  0%,
  100% {
    background-size: 130vmax 130vmax, 80vmax 80vmax, 90vmax 90vmax,
      110vmax 110vmax, 90vmax 90vmax;
    background-position: -80vmax -80vmax, 60vmax -30vmax, 10vmax 10vmax,
      -30vmax -10vmax, 50vmax 50vmax;
  }

  25% {
    background-size: 100vmax 100vmax, 90vmax 90vmax, 100vmax 100vmax,
      90vmax 90vmax, 60vmax 60vmax;
    background-position: -60vmax -90vmax, 50vmax -40vmax, 0vmax -20vmax,
      -40vmax -20vmax, 40vmax 60vmax;
  }

  50% {
    background-size: 80vmax 80vmax, 110vmax 110vmax, 80vmax 80vmax,
      60vmax 60vmax, 80vmax 80vmax;
    background-position: -50vmax -70vmax, 40vmax -30vmax, 10vmax 0vmax,
      20vmax 10vmax, 30vmax 70vmax;
  }

  75% {
    background-size: 90vmax 90vmax, 90vmax 90vmax, 100vmax 100vmax,
      90vmax 90vmax, 70vmax 70vmax;
    background-position: -50vmax -40vmax, 50vmax -30vmax, 20vmax 0vmax,
      -10vmax 10vmax, 40vmax 60vmax;
  }
}

/* From Uiverse.io by AlimurtuzaCodes */
.btn-content {
  position: absolute;
  bottom: 172rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 594rpx;
  height: 100rpx;
  background: linear-gradient(360deg, #23221e 0%, #37342b 100%);
  border-radius: 200rpx 200rpx 200rpx 200rpx;
  display: flex;
  justify-content: center;
  align-items: center;

  .text {
    width: 300rpx;
    height: 48rpx;
    line-height: 48rpx;
    font-family: Source Han Sans CN, Source Han Sans CN;
    font-weight: bold;
    font-size: 32rpx;
    color: #f8e49d;
    text-align: center;
    font-style: normal;
    text-transform: none;
  }
}

.btn-content2 {
  position: absolute;
  bottom: 100rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
}
</style>
