import '../css/common.css'
import '../css/wash.less'
import {getBalance} from './common/api'
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
  const balancePay = document.getElementById('balancePay')
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
  // bodyDom.setAttribute('step',stepStr[stepIndex])
  bodyDom.setAttribute('step',stepStr[2])
  // 更新当前步骤
  stepIndex++
  // 设置下一步按钮可用
  nextStepBtn.setAttribute('enable','true')

  // 下一步
  nextStepBtn.addEventListener('click',function(){
    if(this.getAttribute('enable')!=='true') return false
    bodyDom.setAttribute('step',stepStr[stepIndex++])
    stepIndex === 2 && thirdOperation()
    if(stepIndex===3){
    // 第四步开始计算耗时
      beginTime()
    }
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
    getBalance()
      .then(data=>{
        balance.innerHTML = data.toFixed(2)
        if(data<price) {
          balancePay.setAttribute('insufficient','true')
        }
      })
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
}
