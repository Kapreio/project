/**
 * 获取cookie值
 * @param  {string} c_name cookie名称
 * @return {string}        存在返回cookies值，否则返回空。
 */
function getCookie(c_name) {
  if (localStorage) {
    //如果支持localstorage,则使用localstorage获取数据
    if (!localStorage[c_name]) {
      return ''
    } else {
      let cookieVal = JSON.parse(localStorage[c_name])
      if (new Date(cookieVal.date) > new Date()) {
        return cookieVal.val
      } else {
        return ''
      }
    }
  } else {
    //否则使用cookies获取数据
    let c_start,c_end
    if (document.cookie.length > 0) {
      c_start = document.cookie.indexOf(c_name + '=')
      if (c_start != -1) {
        c_start = c_start + c_name.length + 1
        c_end = document.cookie.indexOf(';', c_start)
        if (c_end == -1) c_end = document.cookie.length
        return unescape(document.cookie.substring(c_start, c_end))
      }
    }
    return ''
  }
}

/**
 * 保存cookies
 * @param {string} c_name       cookie的名称
 * @param {string} value        cookie值
 * @param {numbers} expire      cookie有效时间分钟,默认一年
 */
function setCookie(c_name, value, expire = 365*10*24*60) {
  var exdate = new Date()
  exdate.setMinutes(exdate.getMinutes() + expire )
  if (localStorage) {
    //如果支持localstorage,则使用localstorage保存数据
    localStorage[c_name] = JSON.stringify({ val: value, date: exdate })
  } else {
    //否则使用cookies保存数据
    document.cookie = `${c_name}=${escape(value)};expires=${exdate.toGMTString()}`
  }			
}
/**
 * 判断是否微信webview打开
 * @return Boolean 
 */
function is_weixin(){  
  var ua = navigator.userAgent.toLowerCase()  
  // /i忽略大小写  
  if(ua.match(/MicroMessenger/i) == 'micromessenger'){  
    return true  
  }  

  return false  
}
/**
 * 非微信打开相关操作
 */
function weixinOnly(){
  if(!is_weixin()){
    document.body.innerHTML = '<h2 class="weixin-only">请使用微信打开！！！</h2>'
  }
}
export {getCookie,setCookie,is_weixin,weixinOnly}