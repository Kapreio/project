import './message.css'
let body
let msgTimeOut 

function createDom () {
  const msgWrapDom = document.createElement('div')
  const msgDom = document.createElement('div')
  const d = document.body
  msgWrapDom.className = 'message-wrap'
  msgDom.className = 'message'
  msgWrapDom.appendChild(msgDom)
  d.appendChild(msgWrapDom)
  d.msgDom = msgDom
  body = d
}
function doSendMessage({msg, time=3000}){
  clearTimeout(msgTimeOut)
  msgTimeOut = null
  body.msgDom.innerHTML = msg
  body.setAttribute('show-message','show')
  msgTimeOut = setTimeout(function() {
    body.setAttribute('show-message','hide')
  }, time)
}
function sendMessage({msg, time=5000}) {

  if(!body){
    createDom()
    setTimeout(()=>{
      doSendMessage({msg,time})
    })
  } else{
    doSendMessage({msg,time})
  }

}
export default sendMessage