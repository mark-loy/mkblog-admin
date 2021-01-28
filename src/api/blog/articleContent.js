import request from '@/utils/request'

const BASE_API = "blog/article/content"

export default {
  /* 根据id查询文章内容 */
  selectArticleContent(aid) {
    return request({
      method: 'get',
      url: `${BASE_API}/${aid}`
    })
  },
  /* 修改文章内容 */
  updateArticleContent(contentForm) {
    return request({
      method: 'put',
      url: `${BASE_API}/`,
      data: contentForm
    })
  }
}