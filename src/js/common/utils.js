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
      if (new Date(c_name.date) > new Date()) {
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
 * @param {numbers} expiredays  cookie有效时间
 */
function setCookie(c_name, value, expiredays) {
  var exdate = new Date()
  exdate.setDate(exdate.getDate() + (expiredays ? expiredays : 100000))
  if (localStorage) {
    //如果支持localstorage,则使用localstorage保存数据
    localStorage[c_name] = JSON.stringify({ val: value, date: exdate })
  } else {
    //否则使用cookies保存数据
    document.cookie = `${c_name}=${escape(value) + (expiredays == null ? '' : ';expires=' + exdate.toGMTString())}`
  }			
}
function is_weixin(){  
  var ua = navigator.userAgent.toLowerCase()  
  // /i忽略大小写  
  if(ua.match(/MicroMessenger/i) == 'micromessenger'){  
    return true  
  }  

  return false  
}
export {getCookie,setCookie,is_weixin}