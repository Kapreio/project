import {getWxJsSign} from './api'

function scanCode() {  
  wx.scanQRCode({  
    needResult : 1,  
    scanType : [ 'qrCode', 'barCode' ],  
    success : function(res) {  
      console.log(res)  
      alert(JSON.stringify(res))  
      var result = res.resultStr  
      console.log(result)
    },  
    fail : function(res) {  
      console.log(res)  
      alert(JSON.stringify(res))  

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
