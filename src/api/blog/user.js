import request from '@/utils/request'

const BASE_API = "api/blog/user"

export default {
  /* 查询所有用户 */
  selectAllUser() {
    return request({
      method: 'get',
      url: `${BASE_API}/all`
    })
  }
}