/**
 * 微信JS-SDK相关封装
 * 调用前，必须在HTML页面中引用微信JS-SDK文件
 */
import {getWxJsSign,jsPay} from './api' // 导入微信相关接口
import {loadingToast} from '../../common/weui/weui' // 导入微信toast样式
// 保存获取环境变量，用于判断微信js-sdk配置是否打开debug
const dev = process.env.NODE_ENV === 'development'
/**
 * 微信Js-Sdk API配置封装
 * @param {Array} jsApiList 要使用的API列表 
 * @param {Function} backFuc 配置成功后的回调
 */
function wxConfig (jsApiList,backFuc) {
  if (wx.configed && wx.configed.toString === jsApiList.toString){
    // 如果当前页面已经调用过wx.config,并且要配置的API未改变
    // 直接调用回调
    backFuc()
  } else {
    // 添加configed属性，用以保存配置结果
    if (!wx.configed) wx.configed = []
    // 调用获取js-sdk配置信息接口，获取配置参数
    getWxJsSign({url:location.href.split('#')[0]})
      .then(data=>{
        // 设置微信js-sdk配置信息
        wx.config(Object.assign({
          debug:dev, // 是否开户debug
          jsApiList:wx.configed.concat(jsApiList), // 设置要使用的API列表
        },data))
        wx.ready(()=>{        
          // 配置完成   
          wx.configed =  wx.configed.concat(jsApiList)   // 保存已经配置接口    
          backFuc() // 调用回调
        })
      }) 
  }
}

/**
 * 微信扫码操作封装
 */
function scanCode() {  
  // 调用微信扫码API
  loadingToast() // 显示加载中toast
  wx.scanQRCode({  
    needResult : 1,  // 自行处理扫码结果
    scanType : [ 'qrCode', 'barCode' ],  // 扫码方式
    success : function(res) {  // 扫码成功
      // alert(`success!\n Result:${res.resultStr}`)
      loadingToast({hide:true}) // 显示加载中toast
      location.href = `wash.html?resultStr=${res.resultStr}`
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
/**
 * 微信支付
 * @param {Object} opts
 * {
 *    finalmoney:10, // 洗车或充值金额
 *    type: 1 // 业务类型：1：洗车 2：充值
 * } 
 */
export function wxPay (opts) {
  // 开发环境用于测试，所有金额默认为0.01
  dev && (opts.payInfo.finalmoney = 0.01)
  // 进行js-sdk配置
  wxConfig(['chooseWXPay'],()=>{
    // 调用获取微信支付订单
    jsPay(opts.payInfo)
      .then(data=>{   
        // 发起支付，调用微信js-sdk支付接口       
        wx.chooseWXPay(Object.assign({},data,opts))
      })
      .catch(err=>{
        // 获取微信支付订单失败
        opts.fail && typeof opts.fail === 'function' && opts.fail(err)
      })
  })
  
}