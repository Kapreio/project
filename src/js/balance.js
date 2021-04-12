import '../css/common.css'
import '../css/balance.less'
import sendMessage from '../common/sendMessage/message'
import qs from './common/qs'
import {getBalance,jsPay} from './common/api'
import {loadingToast} from '../common/weui/weui' // 导入微信toast样式
// import '../common/loginValidate/loginValidate'

const balance = document.getElementById('balance')
const chargeLog = document.getElementById('chargeLog')
const chargeInput = document.getElementById('chargeInput')
const chargeAfter =  document.getElementById('chargeAfter')
const afterBalance =  document.getElementById('afterBalance')
const chargeNow = document.getElementById('chargeNow')
let query = qs.urlParse() || {}
chargeLog.href = chargeLog.href +  `?id=${query.id}`

getBalance()
  .then(data=>{
    query.balance = data || 0
    balance.innerHTML = query.balance.toFixed(2)
    chargeInput.addEventListener('input',function(){
      if(this.value){
        afterBalance.innerHTML = query.balance - 0 + parseInt(this.value)
        chargeAfter.setAttribute('show',true)
      } else {
        chargeAfter.setAttribute('show',false)
      }
    })
    chargeNow.addEventListener('click',function(){
      if(chargeInput.value >= 10) {
        query.balance =  query.balance - 0 + parseInt(chargeInput.value)
        balance.innerHTML = query.balance
        loadingToast('充值中，请稍候...')
        console.log(chargeInput.value)
        jsPay({
          type:2,
          finalmoney:parseFloat(chargeInput.value),
        })
          .then(data=>{
            chargeAfter.setAttribute('show',false)            
            chargeInput.value = ''
            console.log(data)
          })
          .catch(err=>{
            chargeAfter.setAttribute('show',false)
            sendMessage({msg:err})
          })
        chargeAfter.setAttribute('show',false)
        sendMessage({msg:'充值金额成功！'})
      } else {
        chargeInput.focus()
        sendMessage({msg:'请输入正确的充值金额！！！'})
      }
    })
  })
  .catch((err)=>{
    console.log(err)
  })
