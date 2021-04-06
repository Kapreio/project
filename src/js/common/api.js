import axios from 'axios'
// import qs from 'qs'

const baseURL = process.env.NODE_ENV === 'production'
  ? 'http://localhost:8080/' // 生产
  : '/apis' // 开发
// 创建一个axios实例,配置相关参数
let axiosIns = axios.create({
  baseURL,
  timeout: 5000,
  headers: {'Content-Type':'application/json; charset=utf-8'},
})
// 对发送请求进行拦截
axiosIns.interceptors.request.use(config => {
  return config
}, error => {
  return Promise.reject(error)
})
// 对请求的响应进行拦截
axiosIns.interceptors.response.use(function (rawResp = {data: {}}) {

  if (rawResp.data.msg === 'success' && rawResp.data.status === 10200) { // 数据获取成功
    return rawResp.data.data
  } else { 
    // 失败返回一个立即执行Reject的Promise
    return Promise.reject(rawResp.data.msg)
  }
}, function (error) {
  // 请求出错
  return Promise.reject(error)
})
/**
 * 创建一个axios请求
 * 返回一个aixos实例
 */
function axiosCreation ({method = 'GET'} = {}) {
  let arg = arguments[0]
  let opts = Object.assign({method}, arg)
  opts.method === 'GET' && !opts.params && (opts.params = opts.data)
  opts.data && opts.data.token && (opts.auth = {
    username: 'janedoe',
    password: 's00pers3cret',
  })

  // enableQs && opts.method !== 'GET' && opts.data && (opts.data = qs.stringify(opts.data))
  
  return axiosIns(opts)
}
/**
 * 站点 / 获取站点信息
 * @param {Object} params 
 * {
 *    id:2 // 站点id
 * }
 */
export function getSiteInfo (params) {
  return axiosCreation({
    url: '/wx/site/info',
    method: 'POST',
    data: params,
  })
}
/**
 * 站点 / 根据经纬度获取站点列表（暂时返回所有）
 * @param {Object} params 
 * {
 *    longitude:30.144508, // 经度
 *    latitude:120.104170 // 纬度
 * }
 */
export function getSiteList (params) {
  return axiosCreation({
    url: '/wx/site/list',
    method: 'POST',
    data: params,
  })
}


// 用户 / 获取用户信息
export function getUseInfo (params) {
  return axiosCreation({
    url: '/wx/user/info',
    method: 'POST',
    data: params,
  })
}
// 用户 / 获取余额
export function getBalance (params) {
  return axiosCreation({
    url: '/wx/user/balance',
    method: 'POST',
    data: params,
  })
}
// 用户 / 充值/消费记录
export function getRecord (params,cost) {
  return axiosCreation({
    url: `/wx/user/${cost ? 'consume': 'chargemoney'}_record`,
    method: 'POST',
    data: params,
  })
}
// 用户 / 关联手机号列表
export function getRelevanceList (params) {
  return axiosCreation({
    url: '/wx/user/relevance_list',
    method: 'POST',
    data: params,
  })
}
// 用户 / 增加关联手机号
export function relevanceAdd (params) {
  return axiosCreation({
    url: '/wx/user/relevance_add',
    method: 'POST',
    data: params,
  })
}
// 用户 / 取消关联手机号
export function relevanceCancel (params) {
  return axiosCreation({
    url: '/wx/user/relevance_cancel',
    method: 'POST',
    data: params,
  })
}
//   短信 / 发送短信
export function smsPost (params) {
  return axiosCreation({
    url: '/sms/post',
    method: 'POST',
    data: params,
  })
}
// 微信 / 获取 js 签名
export function getWxJsSign (params) {
  return axiosCreation({
    url: '/wx/jssign',
    method: 'POST',
    data: params,
  })
}
// 微信 / 扫一扫
export function postWxScan (params) {
  return axiosCreation({
    url: '/wx/scan',
    method: 'POST',
    data: params,
  })
}

