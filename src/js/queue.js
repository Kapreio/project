import '../css/common.css'
import '../css/queue.less'
let videoPalyBtn = document.getElementById('videoPalyBtn')
let queueVideo = document.getElementById('queueVideo')
videoPalyBtn.addEventListener('click',function(){
  videoPalyBtn.setAttribute('playing',true)
  queueVideo.play()
})
queueVideo.addEventListener('ended',()=>{
  videoPalyBtn.setAttribute('playing',false)
})
queueVideo.addEventListener('pause',()=>{
  videoPalyBtn.setAttribute('playing',false)
})
queueVideo.addEventListener('click',()=>{
  videoPalyBtn.setAttribute('playing',false)
  queueVideo.pause()
})