import { jumpUtils } from '@/utils/jump.js'
import { tipsUtils } from '@/utils/tips.js'

const utils = {
  getTime(n) {
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var day = now.getDay(); //返回星期几的某一天;
    n = day == 0 ? n + 6 : n + (day - 1)
    now.setDate(now.getDate() - n);
    let date = now.getDate();
    var s = year + "-" + (month < 10 ? ('0' + month) : month) + "-" + (date < 10 ? ('0' + date) : date);
    return s;
  },
  getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    return currentdate;
  },
  checkToken() {
    return new Promise((resolve, reject) => {
      const token = uni.getStorageSync('token')
      if ((token ?? '') == '') {
        jumpUtils('push', '/pages/login/login')
        resolve(false)
      } else {
        resolve(true)
      }

    })
  },
  // 字体加载
  loadFontFace() {
    return new Promise((resolve, reject) => {
      wx.loadFontFace({
        family: 'DIN Alternate Bold',
        source: 'url("https://rzk-finger.oss-cn-hangzhou.aliyuncs.com/typeface/DINAlternateBold.ttf")',
        success: (res) => {
          resolve(res)
        }
      })
    })
  },
  identityNumberTest(number) {
    if (!number || number.length <= 0) return false
    const code = number
    // 身份证号前两位代表区域
    const city = {
      '11': '北京',
      '12': '天津',
      '13': '河北',
      '14': '山西',
      '15': '内蒙古',
      '21': '辽宁',
      '22': '吉林',
      '23': '黑龙江 ',
      '31': '上海',
      '32': '江苏',
      '33': '浙江',
      '34': '安徽',
      '35': '福建',
      '36': '江西',
      '37': '山东',
      '41': '河南',
      '42': '湖北 ',
      '43': '湖南',
      '44': '广东',
      '45': '广西',
      '46': '海南',
      '50': '重庆',
      '51': '四川',
      '52': '贵州',
      '53': '云南',
      '54': '西藏 ',
      '61': '陕西',
      '62': '甘肃',
      '63': '青海',
      '64': '宁夏',
      '65': '新疆',
      '71': '台湾',
      '81': '香港',
      '82': '澳门',
      '91': '国外 ',
    }
    const idCardReg = /^[1-9]\d{5}(19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i // 身份证格式正则表达式
    let errorMessage = '' // 错误提示信息
    let isPass = true // 身份证验证是否通过（true通过、false未通过）

    // 如果身份证不满足格式正则表达式
    if (!code) {
      errorMessage = '请输入身份证号码'
      isPass = false
    }
    if (!code.match(idCardReg)) {
      errorMessage = '身份证规则不符合'
      isPass = false
    }
    if (!city[code.substr(0, 2)]) {
      // 区域数组中不包含需验证的身份证前两位
      errorMessage = '身份证地区有误'
      isPass = false
    }
    if (code.length === 18) {
      // 18位身份证需要验证最后一位校验位
      const _code = code.split('')
      // ∑(ai×Wi)(mod 11)
      // 加权因子
      const factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
      // 校验位
      const parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2]
      let sum = 0
      let ai = 0
      let wi = 0
      for (let i = 0; i < 17; i++) {
        ai = parseInt(_code[i])
        wi = factor[i]
        sum += ai * wi // 开始计算并相加
      }
      if (isNaN(sum)) {
        errorMessage = '证件号错误'
        isPass = false
      } else {
        const last = parity[sum % 11] // 求余
        if (last.toString() !== _code[17]) {
          errorMessage = '身份证最后一位验证不通过'
          isPass = false
        }
      }
    } else {
      errorMessage = '请输入18位有效身份证号'
      isPass = false
    }
    if (errorMessage) {
      console.log('errorMessage', errorMessage)
    }
    return isPass
  },
  sanEquipmentCode() {
    uni.scanCode({
      success: (res) => {
        console.log('条码类型：', res.scanType);
        console.log('条码内容：', res.result,);
        jumpUtils('push', '/pages/workOrderManagement/orderList?qrCodeData=' + res.result)
      },
      fail: (err) => {
        console.log('>>>>>>>>>>>sanEquipmentCode  Error', err);
        tipsUtils.toast('二维码识别失败')
      }
    });
  },
  formatNumber(n){
    n = n.toString()

    return n[1] ? n : '0' + n
  },
  //年月日时分秒
  formatTime(number, format){
    var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
    var returnArr = [];
    var date = new Date(number);
    console.log('date',date);
    returnArr.push(date.getFullYear());
    returnArr.push(this.formatNumber(date.getMonth() + 1));
    returnArr.push(this.formatNumber(date.getDate()));

    returnArr.push(this.formatNumber(date.getHours()));
    returnArr.push(this.formatNumber(date.getMinutes()));
    returnArr.push(this.formatNumber(date.getSeconds()));
    for (var i in returnArr) {
      format = format.replace(formateArr[i], returnArr[i]);
    }

  return format;
  },
 formatDate (date, fmt = "yyyy-MM-dd hh:mm:ss") {
  if (typeof date == 'string') {
    return date
  }

  if (!date || date == null) return null
  const o = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'h+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    'S': date.getMilliseconds() // 毫秒
  }
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  for (const k in o) {
    // eslint-disable-next-line
    // @ts-ignore
    if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
  }
  return fmt
}
}

export {
  utils
}