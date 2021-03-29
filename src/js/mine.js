import '../css/common.css'
import '../css/mine.less'
import '../img/my_img.png'
import {getUseInfo} from './common/api'
import qs from './common/qs'

const telNum = document.getElementById('telNum')
const toBalance = document.getElementById('toBalance')
const toWalletLog= document.getElementById('toWalletLog')
const toTelBind= document.getElementById('toTelBind')
getUseInfo({token:'sss'})
  .then(data=>{
    let queryStr = qs.stringify({id:data.id})
    telNum.innerHTML = data.tel
    toBalance.href = toBalance.href + `?${queryStr}&balance=${data.balance}`
    toWalletLog.href = toWalletLog.href + `?${queryStr}&cost=true`
    toTelBind.href = toTelBind.href + `?${queryStr}`
    console.log(data)
  })