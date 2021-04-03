import {getWxJsSign} from './api'

function scanCode(callback) {  
  wx.scanQRCode({  
    needResult : 1,  
    scanType : [ 'qrCode', 'barCode' ],  
    success : function(res) {  
      alert(`success!\n Result:${res.resultStr}`)
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
