import {getWxJsSign} from './api'

function scanCode(callback) {  
  wx.scanQRCode({  
    needResult : 1,  
    scanType : [ 'qrCode', 'barCode' ],  
    success : function(res) {  
      callback('success',res.resultStr)
    },  
    fail : function(res) {  
      callback('fail',res)
    },
  })  
} 
export function bindScan (element,callback) {
  getWxJsSign({url:location.href.split('#')[0]})
    .then(data=>{
      wx.config(Object.assign({debug:true,jsApiList:['scanQRCode']},data))
      element.addEventListener('click',()=>{scanCode(callback)})
    })
}
