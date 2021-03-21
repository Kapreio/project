import '../css/common.css'
import '../css/navigation.less'
import MapClass from './mapClass.js'
const data={
  position:[118.775961,31.997375],
  title:'南山路洗车店',
  address:'南京市雨花台区雨花南路520号-文字扩充文字扩充文字扩充文字扩充文字扩充文字扩充',   
}
const titleDom = document.getElementById('title')
const addressDom = document.getElementById('address')
let mapInst = new MapClass('mapContainer',{center:data.position})
mapInst.map.add(mapInst.createMarker(data))
titleDom.innerHTML = data.title
addressDom.innerHTML = data.address