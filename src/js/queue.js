import '../css/common.css'
import '../css/queue.less'
// 视频播放按钮DOM
let videoPalyBtn = document.getElementById('videoPalyBtn')
// 视频标签DOM
let queueVideo = document.getElementById('queueVideo')
// 点击视频播放按钮，开始播放
videoPalyBtn.addEventListener('click',function(){
  videoPalyBtn.setAttribute('playing',true)
  queueVideo.play()
})
// 监听播放结束
queueVideo.addEventListener('ended',()=>{
  videoPalyBtn.setAttribute('playing',false)
})
// 监听暂停播放
queueVideo.addEventListener('pause',()=>{
  videoPalyBtn.setAttribute('playing',false)
})
// 点击视频标签，暂停播放
queueVideo.addEventListener('click',()=>{
  videoPalyBtn.setAttribute('playing',false)
  queueVideo.pause()
})