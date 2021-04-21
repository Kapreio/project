import '../css/common.css'
import '../css/wash.less'
import sendMessage from '../common/sendMessage/message'
import {balancePay,postWxScan} from './common/api'
import {loadingToast} from '../common/weui/weui' // 导入微信toast样式
import {wxPay} from './common/wxJsSdk'
import {isLogined} from '../common/loginValidate/loginValidate'
import qs from './common/qs'
isLogined(loginedOperation)
function loginedOperation () {

  loadingToast() // 显示加载中toast

  let price = 10.00
  // body Dom用于步骤UI
  const bodyDom = document.body
  // 下一步按错
  const nextStepBtn = document.getElementById('nextStepBtn')
  // 步骤对应字段列表，用于UI控制
  const stepStr = ['first','second','third','fourth','fifth']
  // 支付方式列表DOM
  const chooicesList = document.getElementById('chooices').children
  // 显示用时DOM
  const tiemConsumedDom = document.getElementById('tiemConsumed')
  const washPrice = document.getElementById('washPrice')
  const balance = document.getElementById('balance')
  const balancePayDom = document.getElementById('balancePay')
  // 记录当前步骤
  let stepIndex = 0
  // 保存选中的支付方式
  let payChoosed
  // 用时更新定时器保存变量
  let timeConsumedInter 
  // 记录总用时，单位S
  let timeConsumed = 3600

  // 发送扫码结果
  postWxScan({
    name:qs.urlParse().resultStr,
  })
    .then((data)=>{
      washPrice.innerHTML =data.price && data.price.toFixed(2) // 更新价格显示
      balance.innerHTML = data.balance.toFixed(2) // 更新余额显示

      if(data.balance<data.price) { // 余额小于价格
        payChoosed = chooicesList[1] // 微信支付为默认选中
        balancePayDom.setAttribute('insufficient','true') // 标记余额不足
      } else {
        payChoosed = chooicesList[0] // 余额支付为默认选中
      }
      // 设置默认支付方式选中状态
      payChoosed.setAttribute('choosed','true')      
      // 隐藏加载中toast
      loadingToast({hide:true})
    })
    .catch(err=>{
      sendMessage({msg:err})
      loadingToast({hide:true})
    })
 
 
  // 显示第一步UI
  bodyDom.setAttribute('step',stepStr[stepIndex++])
  //  bodyDom.setAttribute('step',stepStr[2])
  // 设置下一步按钮可用
  nextStepBtn.setAttribute('enable','true')

  // 下一步
  nextStepBtn.addEventListener('click',function(){
    if(this.getAttribute('enable')!=='true') return false 
    // 付款开始
    stepIndex === 3 && paymentOpetation()
    stepIndex < 3 && bodyDom.setAttribute('step',stepStr[stepIndex++])
  })
  // 耗时计算
  function beginTime () {
    let hour
    let minute
    let second
    // 使用inter每秒更新一次耗时
    timeConsumedInter = setInterval(()=>{
    // 更新耗时
      timeConsumed++
      // 计算花费小时
      hour = parseInt(timeConsumed/3600)      
      // 计算花费分钟
      minute = parseInt(timeConsumed%3600/60)
      // 计算花费秒
      second =timeConsumed%3600%60
      // hour为零时，hour字段为空
      hour > 0?(hour=hour+':'):(hour='')
      // 分钟小于10于，前面补零
      minute < 10?(minute = '0'+minute):''
      // 秒小于10于，前面补零
      second < 10?(second = '0'+second):''
      // 拼接耗时字串
      tiemConsumedDom.innerHTML = `${hour}${minute}:${second}`
      // 完成清除计时器，后续需要使用接口
      if(timeConsumed>=3665){
        clearInterval(timeConsumedInter)
        bodyDom.setAttribute('step',stepStr[stepIndex++])
      }
    },1000)
  }
  // 给支付选项设置选中功能
  for(let li of chooicesList) {
    li.addEventListener('click',function(){
      if(this.getAttribute('insufficient')==='true'){
        // 记为余额不足
        sendMessage({msg:'余额不足'})
        return false
      }
      if(this.getAttribute('choosed') !== 'true') {
        // 当前支付方式没有处于选中状态
        payChoosed && payChoosed.setAttribute('choosed','false')
        payChoosed = this
        payChoosed.setAttribute('choosed','true')
      }
    })
  }
  // 支付成功回调
  function paySuccess() {
    sendMessage({msg:'支付成功，马上开始洗车...'}) 
    bodyDom.setAttribute('step',stepStr[stepIndex++])
    beginTime()
    loadingToast({hide:true}) 
  }
  // 支付失败回调
  function fail (err) {
    sendMessage({msg:'支付失败：' + err}) 
    loadingToast({hide:true})   
  }
  // 支付相关操作
  function paymentOpetation () {
    // 获取选中的支付类型
    let payType = payChoosed.getAttribute('type')
    // 显示toast
    loadingToast({msg:'加载中，请稍候...'})
    if (payType === 'balance') {
      // 余额支付
      balancePay()
        .then(paySuccess)
        .catch(fail)
    } else {
      // 微信支付
      wxPay({
        payInfo:{
          type:1, // 支付类型，1表示洗车
          finalmoney:10, // 支付金额
        },
        success:paySuccess, // 设置成功回调
        fail, // 失败回调
        cancel () { // 取消支付回调
          sendMessage({msg:'您已取消支付操作....'})
        },
        complete () { // 支付操作结束
          loadingToast({hide:true})            
        },
      })
    }
    
  }
}
