import axios from 'axios'
import qs from './qs'
import {getCookie,setCookie} from './utils'
 
const baseURL = process.env.NODE_ENV === 'production'
  ? 'http://carwash1.eveabc.com/' // 生产
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
// 状态码详情 https://note.youdao.com/share/?id=a81f243d3dfe94dd87fb8932d920ff8f&type=note#/
axiosIns.interceptors.response.use(function (rawResp = {data: {}}) {
  if (rawResp.data.msg === 'success' && rawResp.data.status === 10200) { // 数据获取成功
    return rawResp.data.data
  } else if(rawResp.data.status === 10401 || rawResp.data.status === 10402 || rawResp.data.status === 10408){
    // 状态码：10401  "未登录或超时";10402  "用户未登录或超时";10408  "用户未授权或超时"
    // 需要重新进行静默微信登录
    wxLoginBack()
  } else if(rawResp.data.status === 10407){    
    // 状态码：10407 "未绑定手机号码"，需要跳转到登录页面进行手机绑定
    // 用户感知为手机号登录
    alert('当前页面需要登录后才能访问，请登录！') 
    document.body.innerHTML = '<div>请登录！</div>'
    location.href = `login.html?href=${location.href}&ubind=true`
  } else{ 
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
/**
 * 短信 / 发送短信
 * @param {Object} params 
 * {
 *    phone:'15575104709' // 手机号码
 * }
 */
export function smsPost (params) {
  return axiosCreation({
    url: '/wx/sms/post',
    method: 'POST',
    data: params,
  })
}
// 微信 / 获取 js 签名
/**
 * 
 * @param {Object} params
 * {
 *    url:'http://carwash1.eveabc.com/xx.html?a=2&b3' // 当前网页的URL
 * } 
 */
export function getWxJsSign (params) {
  return axiosCreation({
    url: '/wx/jssign',
    method: 'POST',
    data: params,
  })
}
// 微信 / 扫一扫 发送扫码结果给后端
/**
 * 
 * @param {Object} params 
 * {
 * name:'sdfdsfds' // 扫码后的内容
 * }
 */
export function postWxScan (params) {
  return axiosCreation({
    url: '/wx/scan',
    method: 'POST',
    data: params,
  })
}

/**
 * 用户 / 用户绑定手机号
 * @param {Object} params
 * {
*   phone 手机号码
*   code 短信验证码
 * }
 */
export function bindPhone(params) {
  return axiosCreation({
    url: '/wx/user/bindphone',
    method: 'POST',
    data: params,
  })
}
/**
 * 微信 / 微信支付，生成预支付订单及数据，用于js sdk支付使用
 *
 * @param {Object} params
 * {
 *    finalmoney:10, // 洗车或充值金额
 *    type: 1 // 业务类型：1：洗车 2：充值
 * }
 */
export function jsPay(params) {
  return axiosCreation({
    url: '/wx/pay/jspay',
    method: 'POST',
    data: params,
  })
}
/**
 * 用户 / 洗车（使用余额支付）
 * 
 * @param {Object} params
 * {
 *    money:10,//洗车金额,可省略
 * }
 * @returns
 */
export function balancePay(params) {
  return axiosCreation({
    url: '/wx/pay/balancepay',
    method: 'POST',
    data: params,
  })
}
// 微信 / 获取授权URL
export function getWxCodeurl(params) {
  return axiosCreation({
    url: '/wx/codeurl',
    method: 'POST',
    data: params,
  })
}

/**
 * 根据后端返回微信授权URL,拼装成合法的微信授权
 * 需要将redirect_uri的值修改为当前页面的URL
 */
export function getWxAuthUrl() {
  return getWxCodeurl()
    .then(url=>{
      let urlStr = url.split('?')[0]
      let querys = url.split('?')[1]
      querys = qs.stringify(Object.assign(
        {},
        qs.parse(querys),
        {redirect_uri:location.href}
      ))
      urlStr += '?' + querys
      return  urlStr
    })
}
/**
 * 获取用于登录的微信code
 * @return 一个promise实例 
 */
export function getWxCode(){
  let querys = qs.urlParse()
  let wxCode = getCookie('wxCode') 
  if (wxCode) { // 本地已经存储微信code，直接返回
    return Promise.resolve(wxCode)
  }
  if (querys.code) { // url上已经带code参数，表示已经通过授权URL跳转回来
    setCookie('wxCode',querys.code,5) // 存储微信code,有效时间5分钟
    return Promise.resolve(querys.code)
  }
  // 否则，调用获取授权Url方法
  // 并通过跳转url获取微信code
  getWxAuthUrl()
    .then(url=>{
      location.href = url
    })
  return Promise.resolve()
}

// 微信 / 登录
/**
 * 
 * @param {Object} params
 * {
 *    code:'021YcqyR1pzrt91tevAR1gVGyR1Ycqyp',// 通过跳转授权Url返回的code
 * } 
 */
export function wxLogin(params) {
  return axiosCreation({
    url: '/wx/login',
    method: 'POST',
    data: params,
  })
}
// 静默授权登录
export function wxLoginBack(){
  // 获取code
  getWxCode()
    .then(code=>{
      // 获取code成功，进行登陆
      code && wxLogin({code})
        .then(data=>{
          // 登录成功，存储logined字段，记录登录状态；
          setCookie('logined',data || {})
          location.href = qs.urlParse().href || location.href
        })
    })
} 