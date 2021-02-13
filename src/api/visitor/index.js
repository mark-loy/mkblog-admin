import request from '@/utils/request'

const BASE_API = "api/ucenter/visitor"

export default {
  /* 获取访客分页数据 */
  getVisitorPage(current, limit, visitorQuery) {
    return request({
      method: 'post',
      url: `${BASE_API}/${current}/${limit}`,
      data: visitorQuery
    })
  },
  /* 修改访客状态 */
  updateVisitorState(vid, status) {
    return request({
      method: 'put',
      url: `${BASE_API}/${vid}`,
      params: {
        status
      }
    })
  },
  /* 删除访客 */
  deleteVisitor(vid) {
    return request({
      method: 'delete',
      url: `${BASE_API}/${vid}`
    })
  }
}