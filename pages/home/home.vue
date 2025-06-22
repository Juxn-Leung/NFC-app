<template>
  <view class="home u-flex u-flex-column u-flex-center u-padding-35">
    <view class="home-content">

      <view class="container">
        <u-image
          width="100px"
          height="100px"
          src="/static/images/Ring.png"
        ></u-image>
      </view>

      <text class="container-text">将手机背面靠近戒指</text>

      <view class="btn-content">
        <view
          class="btn"
          @click="() => {
            showEdit = true;
            editBackground = background;
            editMessages = messages;
          }"
        >
          <u-image
            width="24px"
            height="24px"
            src="/static/images/start.png"
            mode="aspectFill"
          ></u-image>

          <text class="text">编辑内容</text>
        </view>
      </view>
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
          style="height: 80%; margin-top: 20%;"
        >
          <view class="popup-select">
            <view class="select-image">
              <u-image
                v-if="editBackground"
                :src="getUrl"
                width="72px"
                height="128px"
                mode="aspectFill"
              ></u-image>
              <text
                class="select"
                @click="() => {
                  showBackground = true;
                }"
              >选择背景</text>
            </view>
          </view>
          <EditorContent
            :editorDetail="messages"
            @getContents="(html) => {
              editMessages = html;
            }"
          ></EditorContent>
        </scroll-view>
        <view class="popup-btn">
          <view
            class="button orange"
            @click="() => {
              showEdit = false;
            }"
          >返回</view>
          <view
            class="button cyan"
            @click="() => {
              showView = true;
              messages = editMessages;
            }"
          >预览</view>
          <view
            class="button pink"
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
            :name="item.value"
          >
            <view>
              <u-image
                v-if="item.image"
                :src="item.image"
                width="54px"
                height="96px"
                mode="aspectFill"
              ></u-image>
              <text>{{ item.name }}</text>
            </view>
          </u-radio>
        </u-radio-group>
      </view>
    </u-modal>

    <u-popup
      v-model="showView"
      mode="right"
      width="100%"
      height="100%"
    >
      <view class="popup-content u-padding-35">
        <u-icon
          class="popup-close"
          name="close"
          color="#2979ff"
          size="40"
          @click="() => {
            showView = false;
          }"
        ></u-icon>
        <scroll-view
          scroll-y="true"
          style="height: 80%; margin-top: 20%;padding: 10px;"
        >
          <u-parse :html="messages"></u-parse>
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
    </u-popup>
  </view>
</template>

<script>
import { parseNdefRecord, str2ab } from "@/utils/record.js";
import EditorContent from "@/components/Editor/index.vue";

export default {
  data() {
    return {
      BLUE: require('@/static/images/BLUE.jpg'),
      MWE: require('@/static/images/MWE.png'),
      PURPLE: require('@/static/images/PURPLE.jpg'),
      SPRING: require('@/static/images/SPRING.jpg'),

      // NFC 实例
      nfc: null,
      ndef: null,

      nfcMessage: '没有NFC标签',

      messages: '', // 消息内容
      background: 'MWE', // 背景 星空蓝（BLUE）、梦幻粉（MWE）、魅力紫（PURPLE）
      music: '', // 音乐地址

      editMessages: '',
      editBackground: 'MWE',
      editMusic: '测试Music',

      messagesList: [], // 用于存储所有消息内容

      showEdit: false,
      showView: false,
      showBackground: false,
    }
  },
  components: {
    EditorContent
  },
  watch: {},
  computed: {
    getUrl() {
      // 根据背景类型返回对应的图片路径
      return this.editBackground === 'MWE' ? this.MWE :
        this.editBackground === 'BLUE' ? this.BLUE :
          this.editBackground === 'PURPLE' ? this.PURPLE :
            this.editBackground === 'SPRING' ? this.SPRING : '';
    },
    bgList() {
      return [
        { name: '梦幻粉', value: 'MWE', image: this.MWE },
        { name: '星空蓝', value: 'BLUE', image: this.BLUE },
        { name: '魅力紫', value: 'PURPLE', image: this.PURPLE },
        { name: '春日绿', value: 'SPRING', image: this.SPRING },
      ];
    },
  },
  onLoad() {
    this.nfcINfo()
  },
  methods: {
    nfcINfo() {
      // 获取NFC实例
      this.nfc = wx.getNFCAdapter()
      // 绑定监听 NFC 标签
      this.nfc.onDiscovered(res => {
        console.log('监听到NFC标签:', res)
        const { messages } = res;
        // 检查是否有消息
        if (messages && messages.length) {
          // 解析所有消息
          const list = [];
          messages.forEach((item, index) => {
            console.log(`--- 消息 ${index + 1} ---`);

            // 解析消息中的记录
            if (item.records && item.records.length) {
              item.records.forEach((record, recIndex) => {
                const parsedRecord = parseNdefRecord(record);
                console.log(`记录 ${recIndex + 1}:`, parsedRecord);

                // 在界面上显示 id 为 content 的记录内容
                if (parsedRecord.id === 'message') {
                  this.messages = parsedRecord.payload;
                  if (!this.showEdit) return this.showView = true; // 如果没有编辑界面则显示查看界面
                }
                // 如果记录类型是背景颜色，则设置背景颜色
                if (parsedRecord.id === 'background') {
                  this.background = parsedRecord.payload;
                }

                // 将所有内容添加到 messagesList 中
                list.push(parsedRecord);
              });
              this.messagesList = list;
            }
          });
        } else {
          console.log('未发现 NDEF 消息');
          wx.showToast({
            title: '标签无内容或格式不支持',
            icon: 'none'
          });
        }
        // 监听到数据进行返回 根据返回的数据在进行 处理
        if (res.techs.includes("NDEF")) {
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
            }
          })
        }
      })

      // 开始监听   不能缺少
      this.nfc.startDiscovery({
        success(res) {
          console.log(res)
          const { errno } = res;
          this.nfcMessage = '开始监听';
        },
        fail(err) {
          console.log('err:', err)
          const { errCode } = err;
          if (errCode === 13000) {
            this.nfcMessage = '设备不支持NFC';
          } else if (errCode === 13001) {
            this.nfcMessage = '系统NFC开关未打开';
          } else if (errCode === 13010) {
            this.nfcMessage = '未知错误';
          } else if (errCode === 13019) {
            this.nfcMessage = '用户未授权';
          } else if (errCode === 13013) {
            this.nfcMessage = '未扫描到NFC标签';
          } else if (errCode === 13014) {
            this.nfcMessage = '无效的标签技术';
          } else if (errCode === 13017) {
            this.nfcMessage = '相关读写操作失败';
          } else if (errCode === 13016) {
            this.nfcMessage = '连接失败';
          }
        }
      })
    },
    onWrite() {
      const ndef = this.nfc.getNdef()

      const records = [
        {
          id: str2ab('mini-ios'), // iOS小程序
          tnf: 1,
          type: str2ab('U'),
          payload: str2ab('weixin://dl/business/?t=XTSkBZlzqmn&cq=a%3Dhello', [0])
        },
        {
          id: str2ab('mini-android'), // 安卓小程序
          tnf: 4,
          type: str2ab('android.com:pkg'),
          payload: str2ab('com.tencent.mm')
        },
        {
          id: str2ab('message'), // 读写内容
          tnf: 1,
          type: str2ab('T'),
          payload: str2ab(this.editMessages)
        },
        {
          id: str2ab('background'), // 读写内容
          tnf: 1,
          type: str2ab('T'),
          payload: str2ab(this.editBackground)
        },
      ]

      console.log('要写入的 NDEF 消息:', records);

      ndef.writeNdefMessage({
        records: records,
        success() {
          wx.showToast({ title: '写入成功' });
          this.messages = this.editMessages;
          this.editMessages = '';
          this.showEdit = false;
        },
        fail(err) {
          console.error('写入失败:', err);
          wx.showToast({
            title: '写入失败,请重试',
            icon: 'none'
          });
        }
      });
    },
    handleHold() {
      uni.setStorageSync('storageMessage', this.editMessages);
    },
  },
  onUnload() {
    // 停止监听 NFC 标签
    if (this.nfc) {
      this.nfc.stopDiscovery({
        success: () => {
          console.log('停止监听 NFC 标签成功');
        },
        fail: (err) => {
          console.error('停止监听 NFC 标签失败:', err);
        }
      });
    }
  }
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
  }
}

.home {
  font-family: 'Quicksand', sans-serif;
  margin: 0;
  min-height: 100vh;
  background-color: #e493d0;
  background-image:
    radial-gradient(closest-side, rgba(235, 105, 78, 1), rgba(235, 105, 78, 0)),
    radial-gradient(closest-side, rgba(243, 11, 164, 1), rgba(243, 11, 164, 0)),
    radial-gradient(closest-side, rgba(254, 234, 131, 1), rgba(254, 234, 131, 0)),
    radial-gradient(closest-side, rgba(170, 142, 245, 1), rgba(170, 142, 245, 0)),
    radial-gradient(closest-side, rgba(248, 192, 147, 1), rgba(248, 192, 147, 0));
  background-size:
    130vmax 130vmax,
    80vmax 80vmax,
    90vmax 90vmax,
    110vmax 110vmax,
    90vmax 90vmax;
  background-position:
    -80vmax -80vmax,
    60vmax -30vmax,
    10vmax 10vmax,
    -30vmax -10vmax,
    50vmax 50vmax;
  background-repeat: no-repeat;
  animation: 10s movement linear infinite;
}

.home::after {
  content: '';
  display: block;
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

span {
  position: relative;
  z-index: 10;
  display: flex;
  min-height: 100vh;
  width: 100%;
  justify-content: center;
  align-items: center;
  font-size: 5rem;
  color: transparent;
  text-shadow:
    0px 0px 1px rgba(255, 255, 255, 1),
    0px 4px 4px rgba(0, 0, 0, .05);
  letter-spacing: .2rem;
}

.container {
  height: 30%;
  width: 60%;
  // background: #F1F1F1;
  // border-radius: 20px;
  // padding: 16px;
  // box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  top: 35%;
  left: 20%;
  transform: translateY(-50%);
  position: absolute;
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.container-text {
  position: absolute;
  top: 50%;
  z-index: 10;
  display: flex;
  width: 100%;
  text-align: center;
  display: block;
  font-size: 16px;
  color: transparent;
  text-shadow:
    0px 0px 1px rgba(255, 255, 255, 1),
    0px 4px 4px rgba(0, 0, 0, .05);
  letter-spacing: .2rem;
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

  .popup-select {
    position: relative;
    width: 100%;
    height: 140px;
    display: flex;

    .select-image {
      margin-right: 16px;
      border-radius: 8px;
      height: 128px;
      overflow: hidden;
      border: 2px solid #bbbbbb;
      border-radius: 8px;
      position: relative;

      .select {
        width: 72px;
        height: 128px;
        text-align: center;
        line-height: 128px;
        z-index: 10;
        position: absolute;
        top: 0;
        left: 0;
      }
    }
  }

  .popup-btn {
    position: relative;
    padding-top: 16px;
    padding-bottom: 16px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    width: 100%;

    .button {
      color: #ecf0f1;
      font-size: 15px;
      cursor: pointer;
      text-align: center;
      line-height: 32px;
      width: 90px;
      height: 32px;
      border-radius: 30px;
      transition: all 0.1s;
    }

    .button:active {
      position: relative;
      top: 2px;
    }

    .button.orange {
      background-color: #e67e22;
      border: 1px solid #f39c12;
      box-shadow: 0px 6px 0px #d35400;
    }

    .button.orange:active {
      box-shadow: 0px 2px 0px #d35400;
    }

    .button.cyan {
      background-color: #1abc9c;
      border: 1px solid #16a085;
      box-shadow: 0px 6px 0px #148f77;
    }

    .button.cyan:active {
      box-shadow: 0px 2px 0px #148f77;
    }

    .button.blue {
      background-color: #3498db;
      border: 1px solid #2980b9;
      box-shadow: 0px 6px 0px #2471a3;
    }

    .button.blue:active {
      box-shadow: 0px 2px 0px #2471a3;
    }


    .button.purple {
      background-color: #9b59b6;
      border: 1px solid #8e44ad;
      box-shadow: 0px 6px 0px #7d3c98;
    }

    .button.purple:active {
      box-shadow: 0px 2px 0px #7d3c98;
    }

    .button.pink {
      background-color: #e493d0;
      border: 1px solid #dc4a89;
      box-shadow: 0px 6px 0px #e23798;
    }

    .button.pink:active {
      box-shadow: 0px 2px 0px #e23798;
    }
  }

  .popup-close {
    position: absolute;
    top: 40px;
    left: 20px;
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
    background-size:
      130vmax 130vmax,
      80vmax 80vmax,
      90vmax 90vmax,
      110vmax 110vmax,
      90vmax 90vmax;
    background-position:
      -80vmax -80vmax,
      60vmax -30vmax,
      10vmax 10vmax,
      -30vmax -10vmax,
      50vmax 50vmax;
  }

  25% {
    background-size:
      100vmax 100vmax,
      90vmax 90vmax,
      100vmax 100vmax,
      90vmax 90vmax,
      60vmax 60vmax;
    background-position:
      -60vmax -90vmax,
      50vmax -40vmax,
      0vmax -20vmax,
      -40vmax -20vmax,
      40vmax 60vmax;
  }

  50% {
    background-size:
      80vmax 80vmax,
      110vmax 110vmax,
      80vmax 80vmax,
      60vmax 60vmax,
      80vmax 80vmax;
    background-position:
      -50vmax -70vmax,
      40vmax -30vmax,
      10vmax 0vmax,
      20vmax 10vmax,
      30vmax 70vmax;
  }

  75% {
    background-size:
      90vmax 90vmax,
      90vmax 90vmax,
      100vmax 100vmax,
      90vmax 90vmax,
      70vmax 70vmax;
    background-position:
      -50vmax -40vmax,
      50vmax -30vmax,
      20vmax 0vmax,
      -10vmax 10vmax,
      40vmax 60vmax;
  }
}


/* From Uiverse.io by AlimurtuzaCodes */
.btn-content {
  position: absolute;
  bottom: 60px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.btn {
  border: none;
  width: 160px;
  height: 54px;
  border-radius: 30px;
  padding: 0 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  background: linear-gradient(0deg, #A47CF3, #683FEA);
  box-shadow: inset 0px 1px 0px 0px rgba(255, 255, 255, 0.4),
    inset 0px -4px 0px 0px rgba(0, 0, 0, 0.2),
    0px 0px 0px 4px rgba(255, 255, 255, 0.2),
    0px 0px 180px 0px #9917FF;
  transform: translateY(-2px);
  cursor: pointer;

  .sparkle {
    color: white;
    transform: scale(1.2);
  }

  .text {
    position: relative;
    display: block;
    z-index: 10;
    width: 100%;
    text-align: center;
    font-size: 18px;
    color: transparent;
    text-shadow:
      0px 0px 1px rgba(255, 255, 255, 1),
      0px 4px 4px rgba(0, 0, 0, .05);
    letter-spacing: .2rem;
  }
}
</style>
