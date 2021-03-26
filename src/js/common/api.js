import axios from 'axios'
import qs from 'qs'

const baseURL = process.env.NODE_ENV === 'production'
  ? 'http://192.168.200.184:8380' // 生产
  : 'http://192.168.200.184:8380' // 开发

let axiosIns = axios.create({
  baseURL,
  timeout: 15000,
})
axiosIns.interceptors.request.use(config => {
  return config
}, error => {
  return Promise.reject(error)
})
axiosIns.interceptors.response.use(function (rawResp = {data: {}}) {
  if (rawResp.data.success !== false) {
    return rawResp
  } else {
    return Promise.reject(rawResp.data.msg)
  }
}, function (error) {
  return Promise.reject(error)
})
export default function axiosCreation ({method = 'GET'} = {}, enableQs = true) {
  let arg = arguments[0]
  let opts = Object.assign({method}, arg)
  opts.method === 'GET' && !opts.params && (opts.params = opts.data)
  enableQs && opts.method !== 'GET' && opts.data && (opts.data = qs.stringify(opts.data))
  return axiosIns(opts)
}
