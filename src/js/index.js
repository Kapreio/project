import '../css/common.css'
import '../css/index.less'
import MapClass from './mapClass.js'
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
let mapInst = new MapClass('mapContain',{})
let geolocation

mapInst.addMarkers(markerList).addInfos()
geolocation = mapInst.initGeolocation()
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