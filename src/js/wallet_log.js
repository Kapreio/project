import '../css/common.css'
import '../css/wallet_log.less'
// 显示记录DOM
const log = document.getElementById('log')
// 记录数据
const logData = [
  {
    log:'账户充值',
    time:'2018.05.14 08:40:12',
    payMent:'微信充值',
    change:'+200元',
  },
  {
    log:'账户充值',
    time:'2018.05.14 08:40:12',
    payMent:'储值卡充值',
    change:'+200元',
  },
]
// 记录数据
const logData2 = [
  {
    log:'洗车',
    time:'2018.05.14 08:40:12',
    locate:'泰山路店',
    change:'-100元',
  },
  {
    log:'维护',
    time:'2018.05.14 08:40:12',
    locate:'泰山路店',
    change:'-100元',
  },
  {
    log:'保养',
    time:'2018.05.14 08:40:12',
    locate:'泰山路店',
    change:'-100元',
  },
]
// 拼装记录DOM
function splitLi(list){
  let html=''
  for(let li of list){
    html += `<li>
                <p>${li.log}</p>
                <p class="gray">${li.time}</p>
                <div class="right">
                    <p>${li.change}</p>
                    <p class="gray">${li.payMent || li.locate}</p>
                </div>
            </li>` 
  }
  return html
}
// 更新记录
log.innerHTML = splitLi(logData2)
console.log(logData)