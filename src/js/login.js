import '../css/common.css'
import '../css/login.less'
import sendMessage from '../common/sendMessage/message' // 引入通知小组件
import {smsPost,bindPhone} from './common/api' // 引入发送短信和绑定手机接口
import qs from './common/qs' // 导入qs
// 电话输入表单DOM
const telInput = document.getElementById('telInput')
// 验证码输入DOM
const codeInput = document.getElementById('codeInput')
// 获取验证码DOM
const getCode = document.getElementById('getCode')
// 手机号码验证正则
const telReg = new RegExp(/^((13[0-9])|(17[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,5-9]))\d{8}$/)
// 登陆按钮DOM
const loginBtn = document.getElementById('loginBtn')
// 再次获取验证码间隔时长
const countSeconds = 60
// 倒计时定时器保存变量
let countDowmInter = null
// 倒计时结束文本
let countDownString ='重新获取'

// 获取验证码按钮绑定事件
getCode.addEventListener('click',function(){
  if (!telReg.test(telInput.value.trim())) { // 手机号码不合法
    // 提示并返回
    telInput.parentElement.setAttribute('error','true')
    return false
  } else{ // 手机号码合法
    // 倒计时未结束不能再次获取
    if (this.parentElement.getAttribute('countDown') === 'true') return false
    // 调用发送短信接口
    smsPost({phone:telInput.value.trim()})
      .then(()=>{
        // 提示获取成功
        sendMessage({msg:'验证码获取成功....'})
        // 保存倒计时时长
        let seconds = countSeconds
        // 已经存在倒计时先清除
        countDowmInter && clearInterval(countDowmInter)
        // 标记开始倒计时
        this.parentElement.setAttribute('countDown','true')
        // 修改倒计时文本
        getCode.innerHTML = countDownString + `(${seconds})s`
        // 添加定时器，动态修改倒计时文本
        countDowmInter = setInterval(()=>{
          // 倒计时时长减1
          seconds--
          if (seconds === 0) {
            // 倒计时结束
            // 标记倒计时结束
            this.parentElement.setAttribute('countDown','false')
            //清除倒计时
            clearInterval(countDowmInter)
            countDowmInter = null
            // 恢复获取验证码DOM文本
            getCode.innerHTML = countDownString
          } else{
            // 更新获取验证码DOM文本
            getCode.innerHTML = countDownString + `(${seconds})s`
          }
        }, 1000)
      })
      .catch(err=>{
        sendMessage({msg:`获取失败：${err}`})
      })
  }
})
// 给电话输入表单绑定事件
telInput.addEventListener('input',loginBtnEnabel)
// 给获取验证码表单绑定事件
codeInput.addEventListener('input',loginBtnEnabel)

/**
 * 验证登录按钮是否可用
 */
function loginBtnEnabel() {
  // 电话输入和验证码表单不为空，则登录按钮为可用状态
  if(!getCode.parentElement.getAttribute('countDown')){
    loginBtn.setAttribute('enable', 'false')
    return false
  }
  codeInput.value.trim()!=='' && telInput.value.trim()!==''
    ? loginBtn.setAttribute('enable', 'true')
    : loginBtn.setAttribute('enable', 'false')
  // 如果电话表单处于非法状态，动态验证是否合法
  telInput.parentElement.getAttribute('error') === 'true' && validate()
}
/**
 * 验证表单是否合法
 * return Boolean 是否合法
 */
function validate() {
  if (!telReg.test(telInput.value.trim())) {
    telInput.parentElement.setAttribute('error','true')
    return false
  } else {
    telInput.parentElement.setAttribute('error','false')
  }
  return true
}
// 登录按钮绑定事件
loginBtn.addEventListener('click',function(){
  if (this.getAttribute('enable')!=='true') return false
  if(validate()){
    bindPhone({
      phone:telInput.value.trim(),
      code:codeInput.value.trim(),
    })
      .then(()=>{
        sendMessage({msg:'登录成功'})
        location.href = qs.urlParse().href ?qs.urlParse().href : 'mine.html'
      })
      .catch(err=>{
        sendMessage({msg:err})
      })
  }    
})


