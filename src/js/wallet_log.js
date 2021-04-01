import '../css/common.css'
import '../css/wallet_log.less'
import qs from './common/qs'
import moment from 'moment'
import {getRecord} from './common/api'
import '../common/loginValidate/loginValidate'
// 显示记录DOM
const log = document.getElementById('log')
const body = document.body
const loadDistance = 100
let pageSize = 20 
let pageIndex = 1
let haveNextPage = true
let  fragment
let query = qs.urlParse()

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
  let paySite
  let logText
  for(let li of list){
    l = createElement() // 创建li标签
    // 添加p标签
    if(!query.cost){
      logText = '账户充值'
    } else {
      switch (li.type) {
      case 1:
        logText='保养'
        break
      case 2:
        logText='维修'
        break
      case 3:
        logText='洗车'
        break
      case 4:
        logText='钣金'   
      }
    }
    l.appendChild(createElement('p',{text:logText}))
    // 添加p标签
    l.appendChild(createElement('p',{
      text:moment(li.addtime*1000).format('YYYY.MM.DD HH:mm:ss'),
      attr:{class:'gray'},
    }))
    // 创建li标签
    div = createElement('div',{attr:{class:'right'}})
    // div添加p标签
    div.appendChild(createElement('p',{text:`${query.cost?'-':'+'}${li.money}元`}))
    // div添加p标签
    if (query.cost) {
      paySite = li.sitename
    } else {
      paySite = (li.payway === 1 ?'微信':'储值卡')
    }
    div.appendChild(createElement('p',{text:paySite,attr:{class:'gray'}}))
    // li添加div标签
    l.appendChild(div)
    // 放进数组
    lis.push(l)
  }
  return lis
}
// 判断是否可以进行分页加载
function loadEable(){
  if (!haveNextPage) return false
  // 加载中，返回false
  if (body.getAttribute('loading') === 'true') return false
  // 已经是最后一页，返回false
  if (body.getAttribute('loaded') === 'true') return false
  // 未滚动到底部，返回false
  if (body.offsetHeight + body.scrollTop <= body.scrollHeight - loadDistance) 
    return false
  // 否则，返回true
  return true
}
// 滚动分页加载
body.addEventListener('scroll',function(){
  // 判断是否分页加载
  if (loadEable()) {
    // 标记加载中
    body.setAttribute('loading','true')

    getList(pageSize,pageIndex,query.cost).then(data=>{
      appendLiToList(data.data)
      if(data.pageCount === pageIndex){
        haveNextPage = false
      }
      body.setAttribute('loading','false')
    })

  } else {
    return false
  }
})
function getList(pageSize,pageIndex,cost){
  return getRecord({pageSize,pageIndex},cost)
    .then(data=>{
      return data 
    })
}
function appendLiToList(data){
  // 将加载的数据变成DOM元素
  let lis = getLis(data) 
  // 创建一个虚拟节点，减小重排成本     
  fragment = document.createDocumentFragment()
  for(let i=0;i<lis.length;i++){
    // 将标签添加到虚拟标签中
    fragment.appendChild(lis[i])
  } 
  // 统一添加到ul标签中
  log.appendChild(fragment)
}
getList(pageSize,pageIndex,query.cost).then(data=>{
  appendLiToList(data.data)
  if(data.pageCount === pageIndex){
    haveNextPage = false
  }
})


