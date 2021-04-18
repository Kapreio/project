import './loginValidate.less'
import {getCookie} from '../../js/common/utils'
import {wxLoginBack} from '../../js/common/api'
export function isLogined(backfun) {
  if (!getCookie('logined')) {
    wxLoginBack()
  } else {
    document.body.setAttribute('login',new Date().getTime())
    typeof backfun === 'function' && backfun()
  }
}
