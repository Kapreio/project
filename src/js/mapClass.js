import '../img/marker.png'
import '../img/marker_off.png'
import '../img/marker_big.png'
const iconSize = new AMap.Size(64, 70)
const iconSelectedSize = new AMap.Size(110, 120)
const markerOffset = new AMap.Pixel(-32,-70)
const infoOffset = new AMap.Pixel(0,-125)
const defaultIconOpts = {
  size: iconSize,
  image: 'img/marker.png',
  imageSize: iconSize,
}
const selectedIconOpts = {
  size: iconSelectedSize,
  image: 'img/marker.png',
  imageSize: iconSelectedSize,
}
function getNaviUrl(opts,c){
  return `https://uri.amap.com/navigation?from=${c[0]},${c[1]},当前位置&to=${opts.position[0]},${opts.position[1]},${opts.title}&src=${location.href}&callnative=1`
}
function getInfoDom(opts,index) {
  return `
      <div class='popup-wrap ${opts.offline?'offline':''}'>
        <div class='title'>
          ${opts.title}
        </div>
        <p class="address">${opts.address}</p>
        <div class='opreationg-btns'>
          <div  id="navigationBtn" data-index="${index}"><span id='distance'>2.4km</span></div>
          <a  class="go-queue" href='queue.html?id=${opts.id}'><span>查看排队</span></a>
        </div>
      </div> 
  `
}
export default class MapClass{
  constructor (elementId,{
    center = [118.785488,31.991624],
    zoom = 14,
  }) {   
    this.markers = []
    this.map = new AMap.Map(elementId, {
      center,
      zoom,
    })
    this.geolocation = null
    this.currentPosition = null
    this.markerOffset = markerOffset
  }
  createIcon (opts = {}) {
    return new AMap.Icon(opts)
  }
  createDefaultIcon () {
    this.icon = this.createIcon(defaultIconOpts)
    return this.icon
  }
  createOfflineIcon () {
    let opt = Object.assign({},defaultIconOpts)
    this.outIcon = this.createIcon(Object.assign(opt,{image: 'img/marker_off.png'}))
    return this.outIcon
  }
  createSelectIcon () {
    this.selectedIcon = this.createIcon(selectedIconOpts)
    return this.selectedIcon
  }
  getSelectIcon () {
    return this.selectedIcon || this.createSelectIcon()
  }
  createOfflineSelectIcon () {
    let opt = Object.assign({},selectedIconOpts)
    this.offlineSelectedIcon = this.createIcon(Object.assign(opt,{image: 'img/marker_off.png'}))
    return this.offlineSelectedIcon
  }
  getOfflineSelectIcon () {
    return this.offlineSelectedIcon || this.createOfflineSelectIcon()
  }
  createMarker (data) {
    let icon
    let marker 
    if (this.icon) {
      icon = this.icon
    } else {
      icon = this.createDefaultIcon()
    }
    if (data.offline) {
      if (this.outIcon) {
        icon = this.outIcon
      } else {
        icon = this.createOfflineIcon()
      }
    }
    marker = new AMap.Marker({
      position: new AMap.LngLat(...data.position),
      icon,
      offset:data.offset || markerOffset,
      title:data.title || null,
    })
    marker.data = data
    return marker
  }
  createMarkers (list) {
    let markers = []
    for (let v of list) {
      markers.push(this.createMarker(v))
    }
    return markers
  }  
  createInform (opts,index) {
    return new AMap.InfoWindow({
      isCustom: true,
      closeWhenClickMap: true,
      content: getInfoDom(opts,index),
      offset: infoOffset,
    })
  }
  getDistance(point) {
    return (AMap.GeometryUtil.distance(this.currentPosition, point)/1000).toFixed(2) + 'km'
  }
  addMarkers (list) {
    let markers =  Object.prototype.toString.call(list).slice(8,-1) === 'Array' ? this.createMarkers(list) : this.createMarker(list)
    this.markers.push(...markers)
    this.map.add(markers)
    return this
  }
  initGeolocation () {
    this.map.plugin('AMap.Geolocation',  ()=> {
      this.geolocation = new AMap.Geolocation({
        enableHighAccuracy: true,
        timeout: 10000,
        showButton: false,
       
      })
      this.map.addControl(this.geolocation)
      AMap.event.addListener(this.geolocation, 'complete', ({position})=>{
        this.currentPosition = position ? [position.lng,position.lat] : null
      })
      AMap.event.addListener(this.geolocation, 'error', ()=>{
        this.currentPosition = null
      })
    })
    return this.geolocation
  }
  goToHere (opts, currentPosition) {
    location.href = getNaviUrl(opts, currentPosition)
  }
}