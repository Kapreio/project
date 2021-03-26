import '../css/common.css'
import '../css/wallet_log.less'
// 显示记录DOM
const log = document.getElementById('log')
const body = document.body
const loadDistance = 100
let  fragment
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
/**
 * 创建DOM元素
 * @param {*} tagName String 标签名称 默认li
 * @param {*} opts Object 配置 {text：内容,attr：属性对象}
 * return element // 创建的元素
 */
function createElement(tagName = 'li' , opts = {attr:{}}){
  let element = document.createElement(tagName)
  opts.text && (element.innerText = opts.text)
  for(let prop in opts.attr){
    element.setAttribute(prop,opts.attr[prop])
  } 
  return element
}
/**
 * 创建li标签
 * @param {*} list Array li标签数据 
 * return lis 
 */
function getLis(list){
  let lis = []
  let l
  let div
  for(let li of list){
    l = createElement() // 创建li标签
    // 添加p标签
    l.appendChild(createElement('p',{text:li.log}))
    // 添加p标签
    l.appendChild(createElement('p',{text:li.time,attr:{class:'gray'}}))
    // 创建li标签
    div = createElement('div',{attr:{class:'right'}})
    // div添加p标签
    div.appendChild(createElement('p',{text:li.change}))
    // div添加p标签
    div.appendChild(createElement('p',{text:li.payMent || li.locate,attr:{class:'gray'}}))
    // li添加div标签
    l.appendChild(div)
    // 放进数组
    lis.push(l)
  }
  return lis
}
// 更新记录
log.innerHTML = splitLi([...logData2,...logData2,...logData2,...logData2])
// 判断是否可以进行分页加载
function loadEable(){
  // 加载中，返回false
  if (body.getAttribute('loading') === 'true') return false
  // 已经是最后一页，返回false
  if (body.getAttribute('loaded') === 'true') return false
  // 未滚动到底部，返回false
  if (body.offsetHeight <= body.scrollHeight - loadDistance) 
    return false
  // 否则，返回true
  return true
}
// 滚动分页加载
body.addEventListener('scroll',function(){
  // 判断是否分页加载
  if (loadEable()) {
    console.log('要分页加载了')
    // 标记加载中
    body.setAttribute('loading','true')

    setTimeout(function(){
      // 将加载的数据变成DOM元素
      let lis = getLis(logData) 
      // 创建一个虚拟节点，减小重排成本     
      fragment = document.createDocumentFragment()
      for(let i=0;i<lis.length;i++){
        // 将标签添加到虚拟标签中
        fragment.appendChild(lis[i])
      } 
      // 统一添加到ul标签中
      log.appendChild(fragment)
      // 标记加载完成
      body.setAttribute('loading','false')
    },5000)

  } else {
    return false
  }
})