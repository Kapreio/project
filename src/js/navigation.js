import '../css/common.css'
import '../css/navigation.less'
import MapClass from './common/mapClass.js'
import sendMessage from '../common/sendMessage/message'
import qs from './common/qs'
import {getSiteInfo} from './common/api'
// let query = qs.urlParse()
// 显示店铺名称DOM
const titleDom = document.getElementById('title')
// 店铺地址DOM
const addressDom = document.getElementById('address')
// 立即定位按钮
const navigationBtn = document.getElementById('navigationBtn')
// 地图实例
let mapInst
// 地图定位插件实例
let geolocation 
// 保存门店数据
let markerData

getSiteInfo(qs.urlParse())
  .then(data=>{
    mapInst = new MapClass('mapContainer',{center:[data.longitude,data.latitude]})
    // 添加店铺marker到地图
    markerData = data
    mapInst.map.add(mapInst.createMarker(data))
    geolocation = mapInst.initGeolocation()
    // 设置店铺名称
    titleDom.innerHTML = data.name
    // 设置店铺地址
    addressDom.innerHTML = data.address
    // 导航按钮绑定事件
    navigationBtn.addEventListener('click', navigationBtnClick)
    console.log(data)
  })


/**
 * 定位成功后确认是否跳转至导航
 * @param opts   Object 目标marker点数据  
 * @param coord  Array  当前位置坐标
 */
function confirmGoToHere(opts,coord){
  if (confirm('路线已规划完成，是否跳转到高德地图导航?')) {
    mapInst.goToHere(opts,coord)
  }
}
// 导航按钮事件回调
function navigationBtnClick () {
  if (mapInst.currentPosition) {  
    // 如果已获取当前位置，直接确认是否跳转至导航  
    confirmGoToHere(markerData,mapInst.currentPosition)
  } else {
    // 否则，先获取位置，再确认
    sendMessage({msg:'路线规划中，请稍等....'})
    geolocation.getCurrentPosition(function(status,{position}){
      if (position && status) {
        confirmGoToHere(markerData,[position.lng,position.lat])
      } else {
        sendMessage({msg:'定位失败，请稍后重试...'})
      }
    })
  }
}


