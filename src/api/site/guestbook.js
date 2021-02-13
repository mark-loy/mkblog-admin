import request from '@/utils/request'

const BASE_API = "api/site/guestbook"

export default {
  /* 获取分页留言信息 */
  getGuestbookPage(current, limit) {
    return request({
      method: 'get',
      url: `${BASE_API}/${current}/${limit}`
    })
  },
  /* 删除留言信息 */
  deleteGuestbook(gid) {
    return request({
      method: 'delete',
      url: `${BASE_API}/${gid}`
    })
  }

}