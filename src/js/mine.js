import '../css/common.css'
import '../css/mine.less'
import '../img/my_img.png' // 导入头像默认图片，在mine.html中使用
import {getUseInfo} from './common/api' // 导入获取用户信息方法
import {isLogined} from '../common/loginValidate/loginValidate' // 导入登录判断方法

// 判断是否登录
isLogined(loginedOperation)

// 将登录成功后的操作写在loginedOperation函数中
function loginedOperation () {
  // 获取显示手机号码DOM
  const telNum = document.getElementById('telNum')
  // 获取用户头像DOM
  const hearder = document.getElementById('hearder')
  getUseInfo()
    .then(data=>{
      // 更新手机号码
      telNum.innerHTML = data.username
      // 更新用户头像
      hearder.src = data.header
      hearder.alt = data.nickname
    })
}