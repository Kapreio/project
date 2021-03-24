import '../css/common.css'
import '../css/navigation.less'
import MapClass from './mapClass.js'
import sendMessage from '../common/sendMessage/message'
const data={
  position:[118.775961,31.997375],
  title:'南山路洗车店',
  address:'南京市雨花台区雨花南路520号-文字扩充文字扩充文字扩充文字扩充文字扩充文字扩充',   
}
const titleDom = document.getElementById('title')
const addressDom = document.getElementById('address')
const navigationBtn = document.getElementById('navigationBtn')
let mapInst = new MapClass('mapContainer',{center:data.position})
let geolocation = mapInst.initGeolocation()


mapInst.map.add(mapInst.createMarker(data))
titleDom.innerHTML = data.title
addressDom.innerHTML = data.address


function confirmGoToHere(opts,coord){
  if (confirm('路线已规划完成，是否跳转到高德地图导航?')) {
    mapInst.goToHere(opts,coord)
  }
}

function navigationBtnClick () {
  if (mapInst.currentPosition) {  
    confirmGoToHere(data,mapInst.currentPosition)
  } else {
    sendMessage({msg:'路线规划中，请稍等....'})
    geolocation.getCurrentPosition(function(status,{position}){
      if (position && status) {
        confirmGoToHere(data,[position.lng,position.lat])
      } else {
        sendMessage({msg:'定位失败，请稍后重试...'})
      }
    })
  }
}

navigationBtn.addEventListener('click', navigationBtnClick)