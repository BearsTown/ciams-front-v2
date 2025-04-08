import { API_INFO_CIAMS } from '@/config/config'
import { ElLoading, ElMessage, ElMessageBox } from 'element-plus'
import { saveAs } from 'file-saver'

interface Iarr {
  [k: string]: string | [] | number | boolean

  children: []
}

export default {
  getObject: function (array: any[], key: string, value: string) {
    let o
    array.some(function iter(a: Iarr) {
      if (a[key] === value) {
        o = a
        return true
      }
      return Array.isArray(a.children) && a.children.some(iter)
    })
    return o
  },

  comma: function (val) {
    return String(val).replace(
      /(\..*)$|(\d)(?=(\d{3})+(?!\d))/g,
      (digit, fract) => fract || digit + ',',
    )
    //return String(val).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  },

  convertDateFormat: function (dateString) {
    if (dateString.length !== 8) {
      return dateString
    }

    const year = dateString.slice(0, 4)
    const month = dateString.slice(4, 6)
    const day = dateString.slice(6, 8)

    return `${year}-${month}-${day}`
  },

  download: (data: Blob, fileName: string) => {
    const url = window.URL.createObjectURL(new Blob([data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', fileName)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  },

  downloadFile: (fileId, fileName) => {
    const prefixPath = API_INFO_CIAMS.PREFIX + '/api/v1/file/down/'
    const url = prefixPath + fileId
    const http = new XMLHttpRequest()
    http.open('HEAD', url, false)
    http.send()
    if (http.status === 404) {
      ElMessage({
        message: '존재하지 않는 파일입니다.',
        type: 'error',
      })
    } else {
      saveAs(url, fileName)
    }
  },

  isEmpty: function (param) {
    // return param != null && param != undefined && Object.keys(param).length === 0
    return param == null || Object.keys(param).length === 0
  },

  loading: function (message?) {
    let loadingMsg = '처리 중...'
    if (message) {
      loadingMsg = message
    }

    return ElLoading.service({
      lock: true,
      text: loadingMsg,
      // spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0)',
    })
  },

  confirm: function (message: string, title?: string, isHtml = false) {
    return ElMessageBox.confirm(message, title ?? '', {
      confirmButtonText: '확인',
      cancelButtonText: '취소',
      dangerouslyUseHTMLString: isHtml ?? false,
    })
  },

  successMessage: function (message) {
    ElMessage({
      message: message,
      type: 'success',
    })
  },

  errorMessage: function (message) {
    ElMessage({
      message: message,
      type: 'error',
    })
  },

  warningMessage: function (message) {
    ElMessage({
      message: message,
      type: 'warning',
    })
  },

  hex2rgb: (hex, alpha) => {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)

    return alpha !== undefined ? `rgba(${r}, ${g}, ${b}, ${alpha})` : `rgb(${r}, ${g}, ${b})`
  },
  rgbaToHex: (r, g, b, a) => {
    const toHex = (x) => {
      const hex = Math.round(x).toString(16)
      return hex.length === 1 ? '0' + hex : hex
    }

    if (a !== undefined) {
      a = toHex(a * 255)
    } else {
      a = ''
    }

    return `#${toHex(r)}${toHex(g)}${toHex(b)}${a}`
  },

  formatBytes(bytes, decimals) {
    if (bytes == 0) return '0 Bytes'
    const k = 1024,
      dm = decimals || 2,
      sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
      i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
  },

  /**
   * 파일용량 체크
   * @param size
   * @param byte
   * @param multiNum
   * @returns true일 경우 초과함
   */
  checkFileSizeValid: (size: number, byte = 'Byte', multiNum = 1) => {
    const unit = ['Byte', 'KB', 'MB', 'GB', 'TB'].indexOf(byte)

    const maxSize = Math.pow(1024, unit) * multiNum

    return !unit || maxSize < size
  },

  /**
   * 투명도 hex 코드 계산
   * @param opacity
   * @returns
   */
  getHexOpacity(opacity: number) {
    const alpha = Math.round(opacity * 255)
    const hex = (alpha + 0x10000).toString(16).substr(-2).toUpperCase()
    return hex
  },

  toRound3(v: number) {
    return Math.round(v * 1000) / 1000
  },

  isFinite(v: number) {
    return isNaN(v) || !isFinite(v) ? 0.0 : v
  },
}
