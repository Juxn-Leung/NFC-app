export const passwordValidate =(rule, value, callback)=> {
  if (!value) {
    callback()
    return
  }
  if (String(value).length < 8 || String(value).length > 20) {
    callback(new Error('密码长度8-20位，包含数字、字母、符号'))
    return
  } else if (!String(value).match(/^[a-zA-Z\d\x21-\x2F\x3A-\x40\x5B-\x60\x7B-\x7E]+$/)) {
    callback(new Error('密码长度8-20位，包含数字、字母、符号'))
    return
  }  else if (!String(value).match(/(?=.*[a-zA-Z])(?=.*\d)(?=.*[\x21-\x2F\x3A-\x40\x5B-\x60\x7B-\x7E])/)) {
    callback(new Error('密码长度8-20位，包含数字、字母、符号'))
    return
  } 
  callback()
};
export const validateInfo = {
  phone: [
		// { pattern: /^[\d|,|+|-]{0,32}$/, message: '请填写正确的手机号', trigger: 'blur' }
		{ pattern: /^1(([378][\d])|(4[01456789])|([59][012356789])|(6[2567]))[\d]{8}$/, message: '请填写正确的手机号', trigger: 'blur' }
	],
	// 邮箱 （长度最大64 ascii@253 ascii）
	email: [
		// eslint-disable-next-line no-control-regex
		{ pattern: /^[\x00-\xff]+@[\x00-\xff]+$/, message: '请填写正确的邮箱', trigger: 'blur' },
		// eslint-disable-next-line no-control-regex
		{ pattern: /^[\x00-\xff]{0,64}$/, message: '请填写64位以内字符', trigger: 'blur' }
	],
  // 密码
  password: [
		{ validator: passwordValidate, trigger: 'blur' }
	],
}