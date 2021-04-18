import '../css/common.css'
import '../css/wash.less'
import sendMessage from '../common/sendMessage/message'
import {getBalance,balancePay} from './common/api'
import {loadingToast} from '../common/weui/weui' // 导入微信toast样式
import {wxPay} from './common/wxJsSdk'
import {isLogined} from '../common/loginValidate/loginValidate'
isLogined(loginedOperation)
function loginedOperation () {
  const price = 10.00
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
  let payChoosed = chooicesList[0]
  // 用时更新定时器保存变量
  let timeConsumedInter 
  // 记录总用时，单位S
  let timeConsumed = 3600
  washPrice.innerHTML = price.toFixed(2)
  // 设置默认支付方式选中
  payChoosed.setAttribute('choosed','true')
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

    stepIndex === 2 && thirdOperation()          
    console.log(stepIndex)
    stepIndex < 2 && bodyDom.setAttribute('step',stepStr[stepIndex++])
    console.log(stepIndex)
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
      // 完成清除计时器
      if(timeConsumed>=3665){
        clearInterval(timeConsumedInter)
        bodyDom.setAttribute('step',stepStr[stepIndex++])
      }
    },1000)
  }
  function thirdOperation() {
    getBalance({
      money:0.01,
    })
      .then(data=>{
        balance.innerHTML = data.toFixed(2)
        if(data<price) {
          balancePayDom.setAttribute('insufficient','true')
        }
      })
    bodyDom.setAttribute('step',stepStr[stepIndex++])
  }
  // 给支付选项设置选中功能
  for(let li of chooicesList) {
    li.addEventListener('click',function(){
      if(this.getAttribute('choosed') !== 'true') {
        payChoosed && payChoosed.setAttribute('choosed','false')
        payChoosed = this
        payChoosed.setAttribute('choosed','true')
      }
    })
  }
  function paySuccess() {
    bodyDom.setAttribute('step',stepStr[stepIndex++])
    beginTime()
    console.log(paySuccess)
    loadingToast({hide:true}) 
  }
  function fail (err) {
    sendMessage({msg:'支付失败：' + err}) 
    loadingToast({hide:true})   
  }
  function paymentOpetation () {
    let payType = payChoosed.getAttribute('type')
    loadingToast({msg:'加载中，请稍候...'})
    if (payType === 'balance') {
      balancePay()
        .then(paySuccess)
        .catch(fail)
    } else {
      wxPay({
        payInfo:{
          type:1,
          finalmoney:10,
        },
        success () {           
          sendMessage({msg:'充值金额成功！'})     
        },
        fail,
        cancel () {
          sendMessage({msg:'您已取消支付操作....'})
        },
        complete () {
          loadingToast({hide:true})            
        },
      })
    }
    
  }
}
