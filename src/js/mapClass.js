/**
 * 将地图相关操作封装在类mapClass中
 * 并默认输出mapClass
 * 引用之前必须保证已经在html页面中引用高德js-api
 */

import '../img/marker.png'
import '../img/marker_off.png'
import '../img/marker_big.png'
// 定义icon大小 
const iconSize = new AMap.Size(64, 70)
// 定义选中icon大小
const iconSelectedSize = new AMap.Size(110, 120)
// 定义marker标签偏移
const markerOffset = new AMap.Pixel(-32,-70)
// 定义popup信息窗体偏移
const infoOffset = new AMap.Pixel(0,-125)
// 默认marker的icon配置
const defaultIconOpts = {
  size: iconSize,
  image: 'img/marker.png',
  imageSize: iconSize,
}
// 选中marker的icon配置
const selectedIconOpts = {
  size: iconSelectedSize,
  image: 'img/marker.png',
  imageSize: iconSelectedSize,
}
/**
 * 拼装跳转高德导航的链接
 * @param opts   Object 目标marker点数据  
 * @param coord  Array  当前位置坐标
 */
function getNaviUrl(opts,c){
  return `https://uri.amap.com/navigation?from=${c[0]},${c[1]},当前位置&to=${opts.position[0]},${opts.position[1]},${opts.title}&src=${location.href}&callnative=1`
}
// 返回popup信息窗体DOM
function getInfoDom(opts,index) {
  // index用于确认当前popup对应的是哪个marker
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
// 导出 MapClass
export default class MapClass{
  /**
   * constructor初始化地图
   * @param string elementId 挂载地图的DOM元素id 必传
   * @param center 中心点坐标、默认南京
   * @param zoom 缩放等级，默认14
   */
  constructor (elementId,{
    center = [118.785488,31.991624],
    zoom = 14,
  }) {   
    // 保存marker点数据，用于创建popup信息弹窗
    this.markers = [] 
    // 初始化地图
    this.map = new AMap.Map(elementId, {
      center,
      zoom,
    })
    // 保存定位插件
    this.geolocation = null
    // 保存当前位置坐标
    this.currentPosition = null
    // 保存默认位偏移
    this.markerOffset = markerOffset
  }
  // 创建Icon
  createIcon (opts = {}) {
    return new AMap.Icon(opts)
  }
  // 创建默认Icon
  createDefaultIcon () {
    this.icon = this.createIcon(defaultIconOpts)
    return this.icon
  }
  // 创建离线/未营业 Icon
  createOfflineIcon () {
    let opt = Object.assign({},defaultIconOpts)
    this.outIcon = this.createIcon(Object.assign(opt,{image: 'img/marker_off.png'}))
    return this.outIcon
  }
  // 创建已选中Icon
  createSelectIcon () {
    this.selectedIcon = this.createIcon(selectedIconOpts)
    return this.selectedIcon
  }
  // 返回已选中Icon,已创建直接返回,避免重复创建
  getSelectIcon () {
    return this.selectedIcon || this.createSelectIcon()
  }
  // 创建离线/未营业 Icon
  createOfflineSelectIcon () {
    let opt = Object.assign({},selectedIconOpts)
    this.offlineSelectedIcon = this.createIcon(Object.assign(opt,{image: 'img/marker_off.png'}))
    return this.offlineSelectedIcon
  }
  // 返回离线/未营业 Icon,已创建直接返回,避免重复创建
  getOfflineSelectIcon () {
    return this.offlineSelectedIcon || this.createOfflineSelectIcon()
  }
  // 创建并返回marker
  createMarker (data) {
    let icon
    let marker
    // 获得默认icon,未创建则创建
    icon = this.icon || this.createDefaultIcon()
    // 未营业,使用未营业Icon
    data.offline && (icon = this.outIcon || this.createOfflineIcon())
    // 创建marker
    marker = new AMap.Marker({
      position: new AMap.LngLat(...data.position), // marker坐标
      icon, // marker使用的icon 
      offset:data.offset || markerOffset, // 设置偏移
      title:data.title || null, // 设置marker的title
    })
    // 将data数据保存在marker对象中,创建popup弹窗、导航使用
    marker.data = data
    return marker
  }
  // 创建返回marker列表
  createMarkers (list) {
    let markers = []
    for (let v of list) {
      markers.push(this.createMarker(v))
    }
    return markers
  } 
  /**
   * 创建popup信息弹窗
   * @param {*} opts Object 创建marker对应的数据 
   * @param {*} index string marker的索引，添加至信息弹窗的导航的Dom中
   */
  createInform (opts,index) {
    return new AMap.InfoWindow({
      isCustom: true, // 自定义信息窗体
      closeWhenClickMap: true, // 点击地图关闭popup
      content: getInfoDom(opts,index), // 设置popup的内容
      offset: infoOffset, // 设置popup的偏移
    })
  }
  /**
   * 返回当前位置到指定点人距离
   * @param {*} point Array 指定位置
   */
  getDistance(point) {
    return (AMap.GeometryUtil.distance(this.currentPosition, point)/1000).toFixed(2) + 'km'
  }
  /**
   * 添加marker到地图
   * @param {*} list Array || Object, Array创建多个marker,Object创建单个marker
   * return 当前实例
   */
  addMarkers (list) {
    // 创建marker/markers
    let markers =  Object.prototype.toString.call(list).slice(8,-1) === 'Array' ? this.createMarkers(list) : this.createMarker(list)
    // 将marker/markers数据保存到实例的markers属性中
    this.markers.push(...markers)
    // 将marker/markers添加至地图
    this.map.add(markers)
    return this
  }
  // 初始化定位插件
  initGeolocation () {
    // 添加定位插件
    this.map.plugin('AMap.Geolocation',  ()=> {
      // 将插件事实例保存至mapClass实例的geolocation属性中
      this.geolocation = new AMap.Geolocation({
        enableHighAccuracy: true, // 使用高精度定位
        timeout: 10000, // 超时时间，10s
        showButton: false, // 不显示原生定位按钮
      })
      // 添加定位插件到地图
      this.map.addControl(this.geolocation)
      // 添加定位成功回调
      AMap.event.addListener(this.geolocation, 'complete', ({position})=>{
        // 将定位成功坐标保存到实例的currentPosition属性
        this.currentPosition = position ? [position.lng,position.lat] : null
      })
    })
    // 返回定位插件实例
    return this.geolocation
  }
  /**
   * 跳转至导航
   * @param opts   Object 目标marker点数据  
   * @param coord  Array  当前位置坐标
   */
  goToHere (opts, currentPosition) {
    // 跳转到高德地图
    location.href = getNaviUrl(opts, currentPosition)
  }
}