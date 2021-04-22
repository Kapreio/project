import '../css/common.css'
import '../css/balance.less'
import sendMessage from '../common/sendMessage/message' // 导入发送信息模块
// import qs from './common/qs'
import {getBalance} from './common/api' // 导入获取余额API
import {loadingToast} from '../common/weui/weui' // 导入微信toast样式
import {wxPay} from './common/wxJsSdk' // 导入微信支付功能
import {isLogined} from '../common/loginValidate/loginValidate' // 导入登录验证模块

isLogined(loginedOperation) // 验证是否已经登录，传入已登录要执行的操作

// 页面所有的操作都应该在已经登录后才会执行
function loginedOperation () {
  // 获取显示余额DOM
  const balance = document.getElementById('balance')
  // 获取充值input DOM
  const chargeInput = document.getElementById('chargeInput')
  // 获取显示充值后文本 DOM
  const chargeAfter =  document.getElementById('chargeAfter')
  // 获取显示充值后余额 DOM
  const afterBalance =  document.getElementById('afterBalance')
  // 获取确定充值按钮
  const chargeNow = document.getElementById('chargeNow')
  // 保存余额相关数据
  let balanceData = {}

  // 获取余额
  getBalance()
    .then(data=>{
      // 保存余额信息
      balanceData.balance = data || 0
      // 显示当然余额
      balance.innerHTML = balanceData.balance.toFixed(2)
      // 监听充值input的input事件，以显示/隐藏充值后文本 DOM
      chargeInput.addEventListener('input',function(){
        if(this.value){  // 如果输入值不为空
          // 更新充值后余额
          afterBalance.innerHTML = balanceData.balance - 0 + parseInt(this.value)
          // 显示充值后文本DOM
          chargeAfter.setAttribute('show','true')
        } else {
          // 否则隐藏充值后文本DOM
          chargeAfter.setAttribute('show','false')
        }
      })
      // 监听充值按钮点击事件
      chargeNow.addEventListener('click',function(){

        if(chargeInput.value >= 10) { // 如果充值金额合法
          // 判断是否处于充值中
          if (chargeNow.getAttribute('chargeing')==='true'){
            sendMessage({msg:'充值中，请吾多次点击！'})   
            return false
          }
          // 显示提示toast
          loadingToast({msg:'充值中，请稍候...'})
          // 标记状态为充值中，防止多次点击
          chargeNow.setAttribute('chargeing','true')
          // 发起微信支付
          wxPay({
            payInfo:{
              type:2,
              finalmoney:parseFloat(chargeInput.value),
            },
            success () { // 充值成功回调
              // 提示充值成功        
              sendMessage({msg:'充值金额成功！'})     
              // 更新余额
              balanceData.balance =  balanceData.balance - 0 + parseFloat(chargeInput.value)
              // 更新余额DOM显示
              balance.innerHTML = balanceData.balance    
              // 清空充值input 
              chargeInput.value = ''
            },
            fail(err){ // 支付失败回调
              sendMessage({msg:'支付失败：' + err})   
            },
            cancel () { // 支付取消回调
              sendMessage({msg:'您已取消支付操作....'})
            },
            complete () { // 支付操作完成回调，支付成功/失败/取消都会调用这个回调
              loadingToast({hide:true}) // 隐藏toast
              chargeNow.setAttribute('chargeing','false')  // 取消支付中标记      
              chargeAfter.setAttribute('show','false') // 隐藏充值后文本DOM
            },
          })
        } else {
          // 否则提示不合法
          chargeInput.focus()
          sendMessage({msg:'充值金额必须大于10元!!!'})
        }
      })
    })
    .catch((err)=>{
      sendMessage({msg:'获取余额失败：' + err})   
    })
}