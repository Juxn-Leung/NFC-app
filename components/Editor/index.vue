<template>
  <view class="editorBox">
    <view
      class="toolbar"
      @touchend.stop="format"
      :style="'bottom: ' + (isIOS ? keyboardHeight : 0) + 'px'"
    >
      <!-- <i
        class="iconfont icon-charutupian"
        @touchend.stop="insertImage"
      ></i> -->
      <i
        :class="'iconfont icon-format-header-1 ' + (formats.header === 1 ? 'ql-active' : '')"
        data-name="header"
        :data-value="1"
      ></i>
      <i
        :class="'iconfont icon-format-header-2 ' + (formats.header === 2 ? 'ql-active' : '')"
        data-name="header"
        :data-value="2"
      ></i>
      <i
        :class="'iconfont icon-format-header-3 ' + (formats.header === 3 ? 'ql-active' : '')"
        data-name="header"
        :data-value="3"
      ></i>
      <i
        :class="'iconfont icon-format-header-4 ' + (formats.header === 4 ? 'ql-active' : '')"
        data-name="header"
        :data-value="4"
      ></i>
      <i
        :class="'iconfont icon-format-header-5 ' + (formats.header === 5 ? 'ql-active' : '')"
        data-name="header"
        :data-value="5"
      ></i>
      <i
        :class="'iconfont icon-format-header-6 ' + (formats.header === 6 ? 'ql-active' : '')"
        data-name="header"
        :data-value="6"
      ></i>
      <i
        :class="'iconfont icon-zitijiacu ' + (formats.bold ? 'ql-active' : '')"
        data-name="bold"
      ></i>
      <i
        :class="'iconfont icon-zitishanchuxian ' + (formats.strike ? 'ql-active' : '')"
        data-name="strike"
      ></i>
      <i
        :class="'iconfont icon-zitixieti ' + (formats.italic ? 'ql-active' : '')"
        data-name="italic"
      ></i>
      <i
        :class="'iconfont icon-zuoduiqi ' + (formats.align === 'left' ? 'ql-active' : '')"
        data-name="align"
        data-value="left"
      ></i>
      <i
        :class="'iconfont icon-juzhongduiqi ' + (formats.align === 'center' ? 'ql-active' : '')"
        data-name="align"
        data-value="center"
      ></i>
      <i
        :class="'iconfont icon-youduiqi ' + (formats.align === 'right' ? 'ql-active' : '')"
        data-name="align"
        data-value="right"
      ></i>
      <i
        :class="'iconfont icon-zuoyouduiqi ' + (formats.align === 'justify' ? 'ql-active' : '')"
        data-name="align"
        data-value="justify"
      ></i>
      <i
        :class="'iconfont icon-line-height ' + (formats.lineHeight ? 'ql-active' : '')"
        data-name="lineHeight"
        data-value="2"
      ></i>
      <i
        :class="'iconfont icon-Character-Spacing ' + (formats.letterSpacing ? 'ql-active' : '')"
        data-name="letterSpacing"
        data-value="2em"
      ></i>
      <!-- <i
        :class="'iconfont icon-722bianjiqi_duanqianju ' + (formats.marginTop ? 'ql-active' : '')"
        data-name="marginTop"
        data-value="20px"
      ></i>
      <i
        :class="'iconfont icon-723bianjiqi_duanhouju ' + (formats['micon-previewarginBottom'] ? 'ql-active' : '')"
        data-name="marginBottom"
        data-value="20px"
      ></i>
      <i
        class="iconfont icon-clearedformat"
        @tap="removeFormat"
      ></i> -->
      <i
        :class="'iconfont icon-font ' + (formats.fontFamily ? 'ql-active' : '')"
        data-name="fontFamily"
        data-value="Pacifico"
      ></i>
      <i
        :class="'iconfont icon-fontsize ' + (formats.fontSize === '24px' ? 'ql-active' : '')"
        data-name="fontSize"
        data-value="24px"
      ></i>
      <i
        class="iconfont icon-text_color"
        :style="'color: ' + fontColor"
        data-name="color"
        :data-value="fontColor"
        @tap="open"
      ></i>
      <i
        class="iconfont icon-fontbgcolor"
        :style="'color: ' + fontBg === '#ffffff' ? '#000' : fontBg"
        data-name="backgroundColor"
        :data-value="fontBg"
        @tap="open2"
      ></i>
      <i
        class="iconfont icon-date"
        @tap="insertDate"
      ></i>
      <i
        class="iconfont icon-undo"
        @tap="undo"
      ></i>
      <i
        class="iconfont icon-redo"
        @tap="redo"
      ></i>
      <i
        :class="'iconfont icon-zitixiahuaxian ' + (formats.underline ? 'ql-active' : '')"
        data-name="underline"
      ></i>
      <!-- <i
        class="iconfont icon--checklist"
        data-name="list"
        data-value="check"
      ></i> -->
      <i
        :class="'iconfont icon-youxupailie ' + (formats.list === 'ordered' ? 'ql-active' : '')"
        data-name="list"
        data-value="ordered"
      ></i>
      <!-- <i
        :class="'iconfont icon-wuxupailie ' + (formats.list === 'bullet' ? 'ql-active' : '')"
        data-name="list"
        data-value="bullet"
      ></i> -->
      <!-- <i
        class="iconfont icon-outdent"
        data-name="indent"
        data-value="-1"
      ></i>
      <i
        class="iconfont icon-indent"
        data-name="indent"
        data-value="+1"
      ></i>
      <i
        class="iconfont icon-fengexian"
        @tap="insertDivider"
      ></i> -->
      <!-- <i
        class="iconfont icon-preview"
        @tap="store"
        id="2"
      ></i>
      <i
        :class="'iconfont icon-zitixiabiao ' + (formats.script === 'sub' ? 'ql-active' : '')"
        data-name="script"
        data-value="sub"
      ></i>
      <i
        :class="'iconfont icon-zitishangbiao ' + (formats.script === 'super' ? 'ql-active' : '')"
        data-name="script"
        data-value="super"
      ></i> -->
      <!-- <i class="iconfont icon-quanping"></i> -->
      <!-- <i
        class="iconfont icon-shanchu"
        @tap="clear"
      ></i>
      <i
        :class="'iconfont icon-direction-rtl ' + (formats.direction === 'rtl' ? 'ql-active' : '')"
        data-name="direction"
        data-value="rtl"
      ></i>
      <i
        class="iconfont icon-baocun"
        @tap="store"
        id="1"
      ></i> -->
    </view>

    <view class="container">
      <editor
        id="editor"
        class="ql-container"
        show-img-size
        :read-only="isEdit"
        show-img-resize
        show-img-toolbar
        :readOnly="readOnly"
        :placeholder="placeholder"
        @statuschange="onStatusChange"
        @ready="onEditorReady"
        @input="getContents"
      >
      </editor>
    </view>

    <tColorPicke
      ref="colorPicker"
      :color="color"
      @confirm="confirm"
      @cancel="() => {
        isColorEdit = false;
        readOnly = false;
      }"
    ></tColorPicke>

    <tColorPicke
      ref="bgPicker"
      :color="bg"
      @confirm="confirm2"
      @cancel="() => {
        isBgEdit = false;
        readOnly = false;
      }"
    ></tColorPicke>

  </view>
</template>

<script>
import tColorPicke from './t-color-picker.vue';
export default {
  data() {
    return {
      color: {
        r: 0,
        g: 0,
        b: 0,
        a: 1
      },
      bg: {
        r: 255,
        g: 255,
        b: 255,
        a: 1
      },
      isColorEdit: false,
      isBgEdit: false,
      formats: {},
      readOnly: false,
      placeholder: '开始输入...',
      editorHeight: 300,
      keyboardHeight: 0,
      isIOS: false
    };
  },
  components: {
    tColorPicke
  },
  computed: {
    fontColor() {
      const { r, g, b } = this.color;
      return (
        '#' +
        [r, g, b]
          .map(x => {
            const hex = x.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
          })
          .join('')
      );
    },
    fontBg() {
      const { r, g, b } = this.bg;
      return (
        '#' +
        [r, g, b]
          .map(x => {
            const hex = x.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
          })
          .join('')
      );
    }
  },
  props: ["editorDetail"],
  onLoad() { },
  methods: {
    // 失去焦点时，获取富文本的内容
    getContents() {
      // console.log('fff')
      let _this = this
      this.editorCtx.getContents({
        success(res) {
          _this.$emit('getContents', res.html)
        }
      })
    },
    open() {
      this.readOnly = true;
      this.$refs.colorPicker.open();
      this.isColorEdit = true;
    },
    open2() {
      this.readOnly = true;
      this.$refs.bgPicker.open();
      this.isBgEdit = true;
    },
    hideKey() {
      uni.hideKeyboard();
    },
    confirm(e) {
      this.isColorEdit = false;
      this.color = e.rgba;
      this.$nextTick(() => {
        this.editorCtx.format('color', e.hex);
        this.readOnly = false;
      });
    },
    confirm2(e) {
      this.isColorEdit = false;
      this.bg = e.rgba;
      this.$nextTick(() => {
        this.editorCtx.format('backgroundColor', e.hex);
        this.readOnly = false;
      });
    },
    readOnlyChange() {
      this.readOnly = !this.readOnly
    },
    onEditorReady() {
      // #ifndef MP-WEIXIN
      uni.createSelectorQuery().select('#editor').context((res) => {
        this.editorCtx = res.context;
      }).exec();
      // #endif
      // #ifdef MP-WEIXIN
      this.createSelectorQuery().select('#editor').context((res) => {
        this.editorCtx = res.context;
      }).exec();
      // #endif
    },

    undo() {
      this.editorCtx.undo();
    },

    redo() {
      this.editorCtx.redo();
    },

    blur() {
      this.editorCtx.blur();
    },

    format(e) {
      // this.hideKey();
      let {
        name,
        value
      } = e.target.dataset;
      if (!name) return; // console.log('format', name, value)
      this.editorCtx.format(name, value);
    },

    onStatusChange(e) {
      this.formats = e.detail;
    },

    insertDivider() {
      this.editorCtx.insertDivider({
        success: function () {
          console.log('insert divider success');
        }
      });
    },

    store(e) {
      this.editorCtx.getContents({
        success: function (res) {
          uni.navigateTo({
            url: `/pages/common/preview?rich=${encodeURIComponent(res.html)}`
          });
          // e.currentTarget.id == 1 ? console.log('保存内容:', res.html) : uni.navigateTo({
          // 	url: `/pages/common/preview?rich=${encodeURIComponent(res.html)}`
          // });
        }
      });
    },

    clear() {
      this.editorCtx.clear({
        success: function (res) {
          console.log("clear success");
        }
      });
    },

    removeFormat() {
      this.editorCtx.removeFormat();
    },

    insertDate() {
      const date = new Date();
      const formatDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
      this.editorCtx.insertText({
        text: formatDate
      });
    },

    insertImage() {
      // const that = this;
      uni.chooseImage({
        count: 1,
        success: function (res) {
          this.editorCtx.insertImage({
            src: res.tempFilePaths[0],
            data: {
              id: 'abcd',
              role: 'god'
            },
            width: '80%',
            success: function () {
              console.log('insert image success');
            }
          });
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
@import "./assets/editor.css";
</style>
