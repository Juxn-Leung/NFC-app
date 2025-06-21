export const parseNdefRecord = (record) => {
  // 默认结果
  const result = {
    id: '',
    tnf: '',
    type: '',
    payload: '',
  };

  const { id, tnf, type, payload } = record;
  try {
    result.id = byteToString(new Uint8Array(id));
    result.tnf = byteToString(new Uint8Array(tnf));
    result.type = byteToString(new Uint8Array(type));
    result.payload = byteToString(new Uint8Array(payload));

    return result;
  } catch (e) {
    console.error('解析记录失败:', e);
    return result;
  }
}

export const byteToString = (arr) => {
  if (typeof arr === 'string') {
    return arr;
  }
  var str = '',
    _arr = arr;
  for (var i = 0; i < _arr.length; i++) {
    var one = _arr[i].toString(2),
      v = one.match(/^1+?(?=0)/);
    if (v && one.length == 8) {
      var bytesLength = v[0].length;
      var store = _arr[i].toString(2).slice(7 - bytesLength);
      for (var st = 1; st < bytesLength; st++) {
        store += _arr[st + i].toString(2).slice(2);
      }
      str += String.fromCharCode(parseInt(store, 2));
      i += bytesLength - 1;
    } else {
      str += String.fromCharCode(_arr[i]);
    }
  }
  return str;
}

export const str2ab = (text, extraBytes) => {
  const uriStr = encodeURIComponent(text)
  const bytes = []
  for (let i = 0; i < uriStr.length; i++) {
    const code = uriStr.charAt(i)
    if (code === '%') {
      const hex = uriStr.slice(i + 1, i + 3)
      const hexVal = parseInt(hex, 16)
      bytes.push(hexVal)
      i += 2
    } else {
      bytes.push(code.charCodeAt(0))
    }
  }
  if (extraBytes) {
    bytes.unshift(...extraBytes)
  }
  return new Uint8Array(bytes).buffer
}