import '../css/common.css'
import '../css/login.less'
import sendMessage from '../common/sendMessage/message' // 引入通知小组件
import {smsPost} from './common/api'
// 电话输入表单DOM
const telInput = document.getElementById('telInput')
// 验证码输入DOM
const codeInput = document.getElementById('codeInput')
// 获取验证码DOM
const getCode = document.getElementById('getCode')
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
  if (!/^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,5-9]))\d{8}$/.test(telInput.value.trim())) {
    telInput.parentElement.setAttribute('error','true')
    return false
  } else{
  // 倒计时未结束不能再次获取
    if (this.parentElement.getAttribute('countDown') === 'true') return false
    smsPost({name:telInput.value.trim()})
      .then(()=>{
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
          seconds--
          if (seconds === 0) {
            // 倒计时结束，清除倒计时
            this.parentElement.setAttribute('countDown','false')
            clearInterval(countDowmInter)
            countDowmInter = null
            getCode.innerHTML = countDownString
          } else{
            getCode.innerHTML = countDownString + `(${seconds})s`
          }
        }, 1000)
      })
      .catch(err=>{
        sendMessage({msg:err})
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
  if (!/^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,5-9]))\d{8}$/.test(telInput.value.trim())) {
    telInput.parentElement.setAttribute('error','true')
    return false
  } else {
    telInput.parentElement.setAttribute('error','false')
  }
  return true
}
// 登录按钮绑定事件
loginBtn.addEventListener('click',function(){
  if (!this.getAttribute('enable')) return false
  if(validate()) location.href ='mine.html'     
})
// console.log(telInput,codeInput,getCode)