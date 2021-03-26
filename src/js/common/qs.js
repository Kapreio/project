import qs from 'qs'
qs.urlParse = function (){
  let query = location.href.split('?')[1]
  return query ? qs.parse(query) : ''
}
export default qs