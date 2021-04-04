import {getWxJsSign,postWxScan} from './api'
import {loadingToast} from '../../common/weui/weui'
window.loadingToast = loadingToast
function scanCode() {  
  wx.scanQRCode({  
    needResult : 1,  
    scanType : [ 'qrCode', 'barCode' ],  
    success : function(res) {  
      alert(`success!\n Result:${res.resultStr}`)
      loadingToast()
      postWxScan({
        name:res.resultStr,
      })
        .then(data=>{
          alert(JSON.stringify(data))
          loadingToast({hide:true})
        })
    },  
    fail : function(res) {  
      alert('fail' + JSON.stringify(res))
    },
  })  
} 
export function bindScan (element) {
  getWxJsSign({url:location.href.split('#')[0]})
    .then(data=>{
      wx.config(Object.assign({debug:true,jsApiList:['scanQRCode']},data))
      element.addEventListener('click',scanCode)
    })
}
