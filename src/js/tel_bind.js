import '../css/common.css'
import '../css/tel_bind.less'
import '../common/inAnimate.less'
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
// 绑定弹窗电话输入表单
const telModal = document.getElementById('telModal')
// 已绑定电话列表
const tleList = [
  {
    id:'1',
    tel:'15378469036',
  },
  {
    id:'2',
    tel:'15378469067',
  },
  {
    id:'3',
    tel:'15378469021',
  },
]
// 拼装电话列表
function splitLi(list){
  let html=''
  for(let li of list){
    html += `<li>${li.tel}<span data-id="${li.id}">取消关联</span></li>` 
  }
  return html
}
// 更新电话列表内容
list.innerHTML = splitLi(tleList)
// 在list上设置事件代理，用于删除电话绑定
list.addEventListener('click',function(event){
  let target = event.target
  let id =target.getAttribute('data-id')
  if(id){
    console.log('要删除了',id,target.parentElement)
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
  console.log('addddd')
  body.setAttribute('tel-bind','false')
})