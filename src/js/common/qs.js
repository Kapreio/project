import qs from 'qs'
// 导入qs,添加一个获取URL参数的方法
qs.urlParse = function (){
  let query = location.href.split('?')[1]
  return query ? qs.parse(query) : ''
}
// 导出qs
export default qs