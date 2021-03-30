import '../css/common.css'
import '../css/mine.less'
import '../img/my_img.png'
import {getUseInfo} from './common/api'
import qs from './common/qs'
import '../common/loginValidate/loginValidate'

const telNum = document.getElementById('telNum')
const toBalance = document.getElementById('toBalance')
const toWalletLog = document.getElementById('toWalletLog')
const toTelBind = document.getElementById('toTelBind')
const hearder = document.getElementById('hearder')
getUseInfo()
  .then(data=>{
    let queryStr = qs.stringify({id:data.id})
    telNum.innerHTML = data.username
    toBalance.href = toBalance.href + `?${queryStr}&balance=${data.balance}`
    toWalletLog.href = toWalletLog.href + `?${queryStr}&cost=true`
    toTelBind.href = toTelBind.href + `?${queryStr}`
    hearder.src = data.header
    hearder.alt = data.nickname
    console.log(data)
  })