import '../css/common.css'
import '../css/wash.less'
import { setInterval } from 'core-js'
const bodyDom = document.body
const  nextStepBtn = document.getElementById('nextStepBtn')
const stepStr = ['first','second','third','fourth','fifth']
const chooicesList = document.getElementById('chooices').children
const tiemConsumedDom = document.getElementById('tiemConsumed')
let stepIndex = 0
let payChoosed = chooicesList[0]
let timeConsumedInter 
let timeConsumed = 3600
payChoosed.setAttribute('choosed','true')

bodyDom.setAttribute('step',stepStr[stepIndex])
stepIndex++

nextStepBtn.setAttribute('enable','true')

nextStepBtn.addEventListener('click',function(){
  let hour
  let minute
  let second
  if(this.getAttribute('enable')!=='true') return false
  bodyDom.setAttribute('step',stepStr[stepIndex++])
  if(stepIndex==3){
    timeConsumedInter = setInterval(()=>{
      timeConsumed++
      hour = parseInt(timeConsumed/3600)      
      minute = parseInt(timeConsumed%3600/60)
      second =timeConsumed%3600%60
      hour > 0?(hour=hour+':'):(hour='')
      minute < 10?(minute = '0'+minute):''
      second < 10?(second = '0'+second):''
      tiemConsumedDom.innerHTML = `${hour}${minute}:${second}`
      if(timeConsumed>=3665){
        clearInterval(timeConsumedInter)
        bodyDom.setAttribute('step',stepStr[stepIndex++])
      }
    },1000)
  }
})

for(let li of chooicesList) {
  li.addEventListener('click',function(){
    if(this.getAttribute('choosed') !== 'true') {
      payChoosed && payChoosed.setAttribute('choosed','false')
      payChoosed = this
      payChoosed.setAttribute('choosed','true')
    }
  })
}
