import {getWxJsSign,postWxScan,jsPay} from './api' // 导入扫码相关接口
import {loadingToast} from '../../common/weui/weui' // 导入微信toast样式
// window.loadingToast = loadingToast 
const dev = process.env.NODE_ENV === 'development'

function wxConfig (jsApiList,backFuc) {
  if (wx.configed && wx.configed.toString === jsApiList.toString){
    backFuc()
  } else {
    if (!wx.configed) wx.configed = []
    getWxJsSign({url:location.href.split('#')[0]})
      .then(data=>{
        // 设置微信js-sdk配置信息
        wx.config(Object.assign({debug:dev,jsApiList:wx.configed.concat(jsApiList)},data))
        wx.ready(()=>{          
          wx.configed =  wx.configed.concat(jsApiList)       
          backFuc()
        })
      }) 
  }
}

/**
 * 封闭微信扫码操作
 */
function scanCode() {  
  // 调用微信扫码API
  wx.scanQRCode({  
    needResult : 1,  // 自行处理扫码结果
    scanType : [ 'qrCode', 'barCode' ],  // 扫码方式
    success : function(res) {  // 扫码成功
      // alert(`success!\n Result:${res.resultStr}`)
      loadingToast() // 显示加载中toast
      // 发送扫码结果
      postWxScan({
        name:res.resultStr,
      })
        .then(()=>{
          // alert(JSON.stringify(data))
          // 隐藏加载中toast
          loadingToast({hide:true})
        })
    },  
    fail : function(res) {   // 扫码失败
      alert('fail' + JSON.stringify(res))
    },
  })  
} 


/**
 * 绑定扫码事件
 * @param {DOM} element 绑定调用扫码事件的按钮 
 */
export function bindScan (element) {
  wxConfig(['scanQRCode'],()=>{
    element.addEventListener('click',scanCode)
  })
}

export function wxPay (opts) {
  dev && (opts.payInfo.finalmoney = 0.01)
  wxConfig(['chooseWXPay'],()=>{
    jsPay(opts.payInfo)
      .then(data=>{          
        wx.chooseWXPay(Object.assign({},data,opts))
      })
      .catch(err=>{
        opts.fail && typeof opts.fail === 'function' && opts.fail(err)
      })
  })
  
}