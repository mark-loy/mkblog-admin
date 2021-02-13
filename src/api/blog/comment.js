import request from '@/utils/request'

const BASE_API = "api/blog/comment";

export default {
  /* 获取文章的评论分页信息 */
  selectArticleCommentPage(aid) {
    return request({
      method: 'get',
      url: `${BASE_API}/${aid}`
    })
  },
  /* 修改评论状态 */
  updateCommentState(cid, state) {
    return request({
      method: 'put',
      url: `${BASE_API}/${cid}/${state}`
    })
  },
  /* 删除评论 */
  deleteComment(cid) {
    return request({
      method: 'delete',
      url: `${BASE_API}/${cid}`
    })
  },
  /* 批量删除评论 */
  deleteCommentBatch(commentIds) {
    return request({
      method: 'delete',
      url: `${BASE_API}/`,
      params: {
        commentIds
      }
    })
  }
}