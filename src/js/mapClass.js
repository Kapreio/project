const defaultIconOpts = {
  size: new AMap.Size(64, 70),
  image: 'img/marker.png',
  imageSize: new AMap.Size(64, 70),
}

export default class MapClass{
  constructor (elementId,{
    center = [118.785488,31.991624],
    zoom = 14,
  }) {
    this.map = new AMap.Map(elementId, {
      center,
      zoom,
    })
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
      offset:data.offset || new AMap.Pixel(-32,-70),
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
  addMarkers (list) {
    let markers =  Object.prototype.toString.call(list).slice(8,-1) === 'Array' ? this.createMarkers(list) : this.createMarker(list)
    console.log(markers)
    this.map.add(markers)
    return this.map
  }
}