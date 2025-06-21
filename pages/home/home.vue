<template>
  <view class="home u-flex u-flex-column u-flex-center u-padding-35">
    <view class="home-content">
      <view>
        {{ nfcMessage }}
      </view>


      <view class="btn-content">
        <button
          class="btn"
          @click="() => {
            showEdit = true;
          }"
        >
          <svg
            height="24"
            width="24"
            fill="#FFFFFF"
            viewBox="0 0 24 24"
            data-name="Layer 1"
            id="Layer_1"
            class="sparkle"
          >
            <path
              d="M10,21.236,6.755,14.745.264,11.5,6.755,8.255,10,1.764l3.245,6.491L19.736,11.5l-6.491,3.245ZM18,21l1.5,3L21,21l3-1.5L21,18l-1.5-3L18,18l-3,1.5ZM19.333,4.667,20.5,7l1.167-2.333L24,3.5,21.667,2.333,20.5,0,19.333,2.333,17,3.5Z"
            ></path>
          </svg>

          <span class="text">编辑内容</span>
        </button>
      </view>
    </view>

    <u-popup
      v-model="showEdit"
      mode="left"
      width="100%"
      height="100%"
    >
      <view class="content u-padding-35">
        <scroll-view
          scroll-y="true"
          style="height: 70%; margin-top: 20%;"
        >
          <EditorContent
            :editorDetail="messages"
            @getContents="(html) => {
              editMessages = html;
            }"
          ></EditorContent>
        </scroll-view>
        <view class="confrim-btn u-flex u-row-between u-flex-column">
          <u-button @click="() => {
            showEdit = false;
          }">取消</u-button>
          <u-button
            type="primary"
            @click="onWrite"
          >写入</u-button>
        </view>
      </view>
    </u-popup>

    <u-popup
      v-model="showView"
      :closeable="true"
      :close-icon-position="'top-left'"
      mode="right"
      width="100%"
      height="100%"
    >
      <view class="content u-padding-35">
        <scroll-view scroll-y="true">
          <u-parse :html="messages"></u-parse>
        </scroll-view>
      </view>
    </u-popup>
  </view>
</template>

<script>
import { parseNdefRecord, str2ab } from "@/utils/record.js";
import EditorContent from "@/components/Editor/index.vue";
export default {
  data() {
    return {
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

      list: [
        {
          image: "https://cdn.uviewui.com/uview/xxx.jpg",
        },
        {
          image: "https://cdn.uviewui.com/uview/xxx.jpg",
        },
      ],
    }
  },
  components: {
    EditorContent
  },
  watch: {},
  computed: {},
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
                  this.editMessages = parsedRecord.payload; // 设置编辑内容
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
}

.btn {
  border: none;
  width: 150px;
  height: 54px;
  border-radius: 30px;
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
    z-index: 10;
    display: flex;
    min-height: 100vh;
    width: 100%;
    justify-content: center;
    align-items: center;
    font-size: 18px;
    color: transparent;
    text-shadow:
      0px 0px 1px rgba(255, 255, 255, 1),
      0px 4px 4px rgba(0, 0, 0, .05);
    letter-spacing: .2rem;
  }
}
</style>
