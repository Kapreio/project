import './loginValidate.less'
import {getCookie,setCookie} from '../../js/common/utils'
window.setCookie = setCookie
if (!getCookie('logined')) {
  alert('当前页面需要登录后才能访问，请登录！') 
  document.body.innerHTML = '<div>请登录！</div>'
  location.href = `login.html?href=${location.href}`
} else {
  document.body.setAttribute('login',new Date().getTime())
}