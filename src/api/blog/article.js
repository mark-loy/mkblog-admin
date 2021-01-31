import request from '@/utils/request'

const BASE_API = "blog/article"

export default {
  /* 多组合条件查询文章分页数据 */
  getArticlePage(current, limit, articleQuery) {
    return request({
      method: 'post',
      url: `${BASE_API}/${current}/${limit}`,
      data: articleQuery
    })
  },
  /* 保存文章数据 */
  saveArticle(articleForm) {
    return request({
      method: 'post',
      url: `${BASE_API}/`,
      data: articleForm
    })
  },
  /* 根据id查询文章数据 */
  getArticleById(aid) {
    return request({
      method: 'get',
      url: `${BASE_API}/${aid}`
    })
  },
  /* 修改文章数据 */
  updateArticle(articleForm) {
    return request({
      method: 'put',
      url: `${BASE_API}/`,
      data: articleForm
    })
  },
  /* 根据id删除文章数据 */
  deleteArticle(aid) {
    return request({
      method: 'delete',
      url: `${BASE_API}/${aid}`
    })
  },
  /* 批量删除文章数据 */
  deleteBatchArticle(aids) {
    return request({
      method: 'delete',
      url: `${BASE_API}/`,
      params: aids
    })
  },
  /* 修改文章发布状态 */
  updateArticleStatus(aid, status) {
    return request({
      method: 'put',
      url: `${BASE_API}/${aid}/${status}`
    })
  },
  /* 保存并发布文章数据 */
  saveArticlePublish(articleForm) {
    return request({
      method: 'post',
      url: `${BASE_API}/pub`,
      data: articleForm
    })
  },
  /* 修改并发布文章数据 */
  updateArticlePublish(articleForm) {
    return request({
      method: 'put',
      url: `${BASE_API}/pub`,
      data: articleForm
    })
  },
  /* 修改文章置顶状态 */
  updateArticleTopStatus(aid, status) {
    return request({
      method: 'put',
      url: `${BASE_API}/top/${aid}/${status}`
    })
  }

}
