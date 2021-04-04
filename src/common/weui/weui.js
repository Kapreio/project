import 'weui'
import './weui.less' 
const body = document.body
let loadingToastDom
function getLoadingToastHtml(msg) {
  return ` <div class="weui-mask_transparent"></div>
                <div class="weui-toast">
                    <i class="weui-loading weui-icon_toast"></i>
                    <p class="weui-toast__content">${msg}</p>
                </div>
            </div>`
}
export function loadingToast ({msg='数据加载中...',hide=false} = {}) {
  if (hide) {
    body.setAttribute('loadingtoast','false')
    return false
  }
  if (!loadingToastDom) {
    loadingToastDom = document.createElement('div')
    loadingToastDom.className = 'loadingToast'
    body.appendChild(loadingToastDom)
  }
  loadingToastDom.innerHTML = getLoadingToastHtml(msg)
  body.setAttribute('loadingtoast','true')
}