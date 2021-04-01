import axios from 'axios'
import qs from 'qs'

const baseURL = process.env.NODE_ENV === 'production'
  ? 'http://localhost:8080/' // 生产
  : '/apis' // 开发

let axiosIns = axios.create({
  baseURL,
  timeout: 15000,
  headers: {'Content-Type':'application/json; charset=utf-8'},
})
axiosIns.interceptors.request.use(config => {
  return config
}, error => {
  return Promise.reject(error)
})
axiosIns.interceptors.response.use(function (rawResp = {data: {}}) {

  if (rawResp.data.msg === 'success' && rawResp.data.status === 10200) {
    return rawResp.data.data
  } else {
    return Promise.reject(rawResp.data.msg)
  }
}, function (error) {
  return Promise.reject(error)
})
function axiosCreation ({method = 'GET'} = {}, enableQs = true) {
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

export function getSiteInfo (params) {
  return axiosCreation({
    url: '/wx/site/info',
    method: 'POST',
    data: params,
  })
}

export function getUseInfo (params) {
  return axiosCreation({
    url: '/wx/user/info',
    method: 'POST',
    data: params,
  })
}

export function getBalance (params) {
  return axiosCreation({
    url: '/wx/user/balance',
    method: 'POST',
    data: params,
  })
}

export function getRecord (params,cost) {
  return axiosCreation({
    url: `/wx/user/${cost ? 'consume': 'chargemoney'}_record`,
    method: 'POST',
    data: params,
  })
}

export function getRelevanceList (params) {
  return axiosCreation({
    url: '/wx/user/relevance_list',
    method: 'POST',
    data: params,
  })
}

export function relevanceAdd (params) {
  return axiosCreation({
    url: '/wx/user/relevance_add',
    method: 'POST',
    data: params,
  })
}

export function relevanceCancel (params) {
  return axiosCreation({
    url: '/wx/user/relevance_cancel',
    method: 'POST',
    data: params,
  })
}
export function smsPost (params) {
  return axiosCreation({
    url: '/sms/post',
    method: 'POST',
    data: params,
  })
}
