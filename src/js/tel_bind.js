import '../css/common.css'
import '../css/tel_bind.less'
import '../common/inAnimate.less'
import sendMessage from '../common/sendMessage/message' // 引入通知小组件
import {getRelevanceList,relevanceAdd,relevanceCancel} from './common/api'
// 电话列表DOM
const list = document.getElementById('list')
// 添加绑定按钮
const addBind = document.getElementById('addBind')
// 绑定弹窗取消按错
const cancle = document.getElementById('cancle')
// 绑定弹窗确定按错
const confirmBind = document.getElementById('confirmBind')
// body Dom用于控制弹窗显示/隐藏
const body = document.body
const tel = document.getElementById('tel')
// 绑定弹窗电话输入表单
const telModal = document.getElementById('telModal')
let telList
// 拼装电话列表
function splitLi(list){
  let html=''
  for(let li of list){
    html += `<li>${li.username}<span data-id="${li.id}">取消关联</span></li>` 
  }
  return html
}
// 更新电话列表内容
function updateTelList() {
  getRelevanceList()
    .then(data=>{
      telList = data
      list.innerHTML = splitLi(data)
    })
}
updateTelList()
// 在list上设置事件代理，用于删除电话绑定
list.addEventListener('click',function(event){
  let target = event.target
  let id =target.getAttribute('data-id')
  if(id){
    relevanceCancel({id})
      .then(()=>{
        sendMessage({msg:'删除成功'})
        target.parentElement.remove()
      })
      .catch(err=>{
        sendMessage({msg:err})
      })
  }
})
// 显示添加电话绑定弹窗
addBind.addEventListener('click',function(){
  body.setAttribute('show-modal','show')
  telModal.setAttribute('show','true')
})
// 隐藏添加电话绑定弹窗
cancle.addEventListener('click',function(){
  body.setAttribute('show-modal','hide')
  telModal.setAttribute('show','false')
})
// 确认添加电话绑定
confirmBind.addEventListener('click',function(){
  if (!/^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,5-9]))\d{8}$/.test(tel.value.trim())) {
    sendMessage({msg:'请输入正确的电话号码...'})
    tel.focus()
  } else {
    relevanceAdd({name:tel.value.trim()})
      .then(()=>{
        sendMessage({msg:'添加成功'})
        body.setAttribute('tel-bind','false')
        updateTelList()
      })
      .catch(err=>{
        sendMessage({msg:err})
      })
  }
  
})