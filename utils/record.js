export const parseNdefRecord = (record) => {
  // 默认结果
  const result = {
    id: '',
    type: '未知',
    content: '无法解析的内容',
    rawData: record.payload
  };

  const { id, tnf, type, payload } = record;

  const recordId = byteToString(new Uint8Array(id));
  const recordType = byteToString(new Uint8Array(type));

  try {
    // 1. 文本记录 (TNF=1, type='T')
    if (tnf === 1 && recordType === 'T') {
      result.id = recordId;
      result.type = '文本';
      result.content = byteToString(new Uint8Array(payload));
    }

    // 2. URI 记录 (TNF=1, type='U')
    else if (tnf === 1 && recordType === 'U') {
      result.id = recordId;
      result.type = '链接';
      result.content = byteToString(new Uint8Array(payload));
    }

    // 3. 智能海报 (包含多个记录)
    else if (tnf === 1 && recordType === 'Sp') {
      result.id = recordId;
      result.type = '智能海报';
      result.content = '包含多个记录的复杂数据';
    }

    // 4. 绝对 URI (TNF=3)
    else if (tnf === 3) {
      result.id = recordId;
      result.type = '绝对 URI';
      result.content = byteToString(new Uint8Array(payload));
    }

    // 5. MIME 类型 (TNF=2)
    else if (tnf === 2) {
      result.id = recordId;
      result.type = `MIME: ${recordType}`;

      // 尝试解析常见 MIME 类型
      if (recordType === 'text/plain') {
        result.content = decodeTextRecord(record.payload);
      } else if (recordType === 'application/vnd.wap.wbxml') {
        result.content = 'WAP WBXML 内容';
      } else {
        result.content = `二进制数据 (${record.payload.length} 字节)`;
      }
    }

    // 6. 外部类型 (TNF=4)
    else if (record.tnf === 4) {
      result.id = recordId;
      result.type = `外部类型: ${recordType}`;
      result.content = `数据长度: ${record.payload.length} 字节`;
    }

    // 7. 未知类型
    else {
      result.id = recordId;
      result.type = `TNF=${record.tnf}, Type=${recordType}`;
      result.content = '未知记录类型';
    }

    return result;
  } catch (e) {
    console.error('解析记录失败:', e);
    result.content = `解析错误: ${e.message}`;
    return result;
  }
}

// 解码文本记录
export const decodeTextRecord = (payload) => {
  if (!payload || payload.length === 0) return '空文本';

  try {
    // 第一个字节包含编码和语言码长度信息
    const statusByte = payload[0];
    const encoding = (statusByte & 0x80) === 0x80 ? 'utf-16' : 'utf-8';
    const languageCodeLength = statusByte & 0x3F;

    // 提取语言码和文本内容
    const languageBytes = payload.slice(1, 1 + languageCodeLength);
    const textBytes = payload.slice(1 + languageCodeLength);

    // 解码文本
    const decoder = new TextDecoder(encoding);
    return decoder.decode(new Uint8Array(textBytes));
  } catch (e) {
    console.error('文本解码失败:', e);

    // 尝试简单 UTF-8 解码作为后备方案
    try {
      const decoder = new TextDecoder('utf-8');
      return decoder.decode(new Uint8Array(payload.slice(1)));
    } catch {
      return '无法解码的文本';
    }
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