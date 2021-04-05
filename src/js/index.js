import '../css/common.css'
import '../css/index.less'
import MapClass from './common/mapClass.js' // 导入map相关操作的封装类引入
import sendMessage from '../common/sendMessage/message' // 引入通知小组件
import {bindScan} from './common/scan'
import {getSiteList} from './common/api'
import {weixinOnly} from './common/utils'
// marker点数据，后期使用请求获取
// const markerList = [
//   {
//     id:'1',
//     longitude:118.775961,
//     latitude:31.997375,
//     name:'南山路洗车店',
//     address:'南京市雨花台区雨花南路520号-文字扩充文字扩充文字扩充文字扩充文字扩充文字扩充',
//   },
//   {
//     longitude:118.797075,
//     latitude:31.98995,
//     name:'网点2',
//     status:0,
//   },
//   {
//     longitude:118.7939,
//     latitude:32.012441,
//     name:'网点3',
//   },
// ]
// 定位按钮
const locateBtn = document.getElementById('locateBtn')
// 扫码按钮
const scanBtn = document.getElementById('scanBtn')
// marker选中的位移
const bigMarkerOffset = new AMap.Pixel(-55,-120)

// 创建地图实例
let mapInst = new MapClass('mapContain',{})
// 初始定位组件
let geolocation = mapInst.initGeolocation()

let popupNavDom // 保存popup导航按钮DOM

// 添加marker要到地图
// mapInst.addMarkers(markerList)

geolocation.getCurrentPosition((status,result)=>{
  if(status === 'complete' && result.position){
    // console.log(result.position)
    getSiteList({latitude:result.position.lat,longitude:result.position.lng})
      .then(data=>{
        mapInst.addMarkers(data)
        markersBindClick()
      })
  }
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

/**
 * popup 导航按钮事件回调
 */
function navigationBtnClick () {

  if (mapInst.currentPosition) { 
    // 如果已获取当前位置，直接确认是否跳转至导航  
    confirmGoToHere(mapInst.markers[popupNavDom.getAttribute('data-index')].data,mapInst.currentPosition)
  } else { 
    // 否则，先获取位置，再确认
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

// 遍历markers列表，绑定popup信息窗体
function markersBindClick() {
  for (let [index,marker] of mapInst.markers.entries()) {
      
    if(!marker.info) {
    // 如果marker未绑定popup信息窗体，创建并绑定
      marker.info = mapInst.createInform(marker.data,index)
      marker.info.on('close',()=>{
      // 信息窗体关闭，恢复marker原始大小和位移
        marker.data.status === 0 ?  marker.setIcon(mapInst.outIcon) : marker.setIcon(mapInst.icon)
        marker.setOffset(mapInst.markerOffset)
      })
    }
    marker.off('click')
    marker.on('click', () => {
    // 点击marker,显示popup信息窗体
      marker.info.open(marker.getMap(), marker.getPosition())   

      // 对popup内的DOM操作
      // popup内的DOM元素需要在本轮事件循环结束才能获取，所以包在setTimeout的回调中
      setTimeout(()=>{
      // 获取popup信息窗体里显示距离DOM
        let distanceDom = document.getElementById('distance')
        // 获取popup信息窗体中的导航按钮DOM
        let navigationBtn = document.getElementById('navigationBtn')
        // 设置距离DOM的文本
        distanceDom.innerHTML = mapInst.currentPosition ? mapInst.getDistance(marker.getPosition()) : '导航'
        if (popupNavDom !== navigationBtn){
        // 如果打开了不是上次打开的popup弹窗
        // 解除上个popup弹窗的导航按钮的事件绑定
          popupNavDom && popupNavDom.removeEventListener('click', navigationBtnClick)
          // 当前导航按钮保存到popupNavDom
          popupNavDom = navigationBtn   
          // 当前导航按钮添加事件绑定    
          popupNavDom.addEventListener('click', navigationBtnClick)
        }  
      })

      // 根据是否营业，添加不同的选中icon
      marker.data.status === 0 
        ? marker.setIcon(mapInst.getOfflineSelectIcon()) 
        : marker.setIcon(mapInst.getSelectIcon())
      // 设置选中位移
      marker.setOffset(bigMarkerOffset)

    })
  }
} 
// 定位按钮添加事件
locateBtn.addEventListener('click',function(){
  // 不在定位中
  if (this.getAttribute('locating') !== true) {
    // 设置定位中
    this.setAttribute('locating',true)
    // 开始定位
    geolocation.getCurrentPosition((result)=>{
      // 设置定位结束
      this.setAttribute('locating',false)
      console.log(result,'要开始请求数据了')
    })
  }
})

// 暴露出地图实例，用于调试
window.mapInst = mapInst

bindScan(scanBtn)
// console.log(wx)

weixinOnly()