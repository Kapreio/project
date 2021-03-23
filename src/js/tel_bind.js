import '../css/common.css'
import '../css/tel_bind.less'
const list = document.getElementById('list')
const addBind = document.getElementById('addBind')
const cancle = document.getElementById('cancle')
const confirmBind = document.getElementById('confirmBind')
const body = document.body
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
function splitLi(list){
  let html=''
  for(let li of list){
    html += `<li>${li.tel}<span data-id="${li.id}">取消关联</span></li>` 
  }
  return html
}
list.innerHTML = splitLi(tleList)
list.addEventListener('click',function(event){
  let target = event.target
  let id =target.getAttribute('data-id')
  if(id){
    console.log('要删除了',id,target.parentElement)
  }
})
addBind.addEventListener('click',function(){
  body.setAttribute('tel-bind','true')
})
cancle.addEventListener('click',function(){
  body.setAttribute('tel-bind','false')
})
confirmBind.addEventListener('click',function(){
  console.log('addddd')
  body.setAttribute('tel-bind','false')
})