import '../css/common.css'
import '../css/login.less'
const telInput = document.getElementById('telInput')
const codeInput = document.getElementById('codeInput')
const getCode = document.getElementById('getCode')
const loginBtn = document.getElementById('loginBtn')
const countSeconds = 10
let countDowmInter = null
let countDownString ='重新获取'

getCode.addEventListener('click',function(){
  if (this.parentElement.getAttribute('countDown') === true) return false
  let seconds = countSeconds
  countDowmInter && clearInterval(countDowmInter)
  this.parentElement.setAttribute('countDown',true)
  getCode.innerHTML = countDownString + `(${seconds})s`
  countDowmInter = setInterval(()=>{
    seconds--
    if (seconds === 0) {
      this.parentElement.setAttribute('countDown',false)
      clearInterval(countDowmInter)
      countDowmInter = null
      getCode.innerHTML = countDownString
    } else{
      getCode.innerHTML = countDownString + `(${seconds})s`
    }
  }, 1000)
})

telInput.addEventListener('input',loginBtnEnabel)
codeInput.addEventListener('input',loginBtnEnabel)
function loginBtnEnabel() {
  if(codeInput.value.trim()!=='' && telInput.value.trim()!=='' ){
    loginBtn.setAttribute('enable', true)
  } else {
    loginBtn.setAttribute('enable', false)
  }
  if (telInput.parentElement.getAttribute('error')) {
    validate()
  }
}

function validate() {
  if (!/^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,5-9]))\d{8}$/.test(telInput.value.trim())) {
    telInput.parentElement.setAttribute('error',true)
    return false
  } else {
    telInput.parentElement.setAttribute('error',false)
  }
  return true
}
loginBtn.addEventListener('click',function(){
  if (!this.getAttribute('enable')) return false
  if(validate()) location.href ='mine.html'     
})
// console.log(telInput,codeInput,getCode)