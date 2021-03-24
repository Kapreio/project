import '../css/common.css'
import '../css/index.less'
import MapClass from './mapClass.js'
import sendMessage from '../common/sendMessage/message'
const markerList = [
  {
    id:'1',
    position:[118.775961,31.997375],
    title:'南山路洗车店',
    address:'南京市雨花台区雨花南路520号-文字扩充文字扩充文字扩充文字扩充文字扩充文字扩充',
  },
  {
    position:[118.797075,31.98995],
    title:'网点2',
    offline:true,
  },
  {
    position:[118.7939,32.012441],
    title:'网点3',
  },
]
const locateBtn = document.getElementById('locateBtn')
const scanBtn = document.getElementById('scanBtn')
const bigMarkerOffset = new AMap.Pixel(-55,-120)
let mapInst = new MapClass('mapContain',{})
let geolocation = mapInst.initGeolocation()
let popupNavDom

mapInst.addMarkers(markerList)


function confirmGoToHere(opts,coord){
  if (confirm('路线已规划完成，是否跳转到高德地图导航?')) {
    mapInst.goToHere(opts,coord)
  }
}

function navigationBtnClick () {
  if (mapInst.currentPosition) {  
    confirmGoToHere(mapInst.markers[popupNavDom.getAttribute('data-index')].data,mapInst.currentPosition)
  } else {
    sendMessage({msg:'路线规划中，请稍等....'})
    geolocation.getCurrentPosition(function(status,{position}){
      if (position && status) {
        confirmGoToHere(mapInst.markers[popupNavDom.getAttribute('data-index')].data,[position.lng,position.lat])
      } else {
        sendMessage({msg:'定位失败，请稍后重试...'})
      }
    })
  }
}
for (let [index,marker] of mapInst.markers.entries()) {
      
  if(!marker.info) {
    marker.info = mapInst.createInform(marker.data,index)
    marker.info.on('close',()=>{
      marker.data.offline ?  marker.setIcon(mapInst.outIcon): marker.setIcon(mapInst.icon)
      marker.setOffset(mapInst.markerOffset)
    })
  }
  marker.off('click')
  marker.on('click', () => {
    marker.info.open(marker.getMap(), marker.getPosition())        
    setTimeout(()=>{
      let distanceDom = document.getElementById('distance')
      let navigationBtn = document.getElementById('navigationBtn')
      distanceDom.innerHTML = mapInst.currentPosition ? mapInst.getDistance(marker.getPosition()) : '导航'
      if (popupNavDom !== navigationBtn){
        popupNavDom && popupNavDom.removeEventListener('click', navigationBtnClick)
        popupNavDom = navigationBtn        
        popupNavDom.addEventListener('click', navigationBtnClick)
      }  
    })
    if(marker.data.offline) {
      mapInst.offlineSelectedIcon ? marker.setIcon(mapInst.offlineSelectedIcon) : marker.setIcon(mapInst.createOfflineSelectIcon())
    } else {
      mapInst.selectedIcon ? marker.setIcon(mapInst.selectedIcon) : marker.setIcon(mapInst.createSelectIcon())
    }
    marker.setOffset(bigMarkerOffset)
  })
}

locateBtn.addEventListener('click',function(){
  if (this.getAttribute('locating') !== true) {
    this.setAttribute('locating',true)
    geolocation.getCurrentPosition((result)=>{
      this.setAttribute('locating',false)
      console.log(result,'要开始请求数据了')
    })
  }
  
})
scanBtn.addEventListener('click',function(){
  location.href = 'wash.html'
})
window.mapInst = mapInst