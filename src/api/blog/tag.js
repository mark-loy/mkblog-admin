import request from '@/utils/request'

const BASE_API = "api/blog/tag"

export default {
  /* 查询所有标签*/
  selectAllTag() {
    return request({
      method: 'get',
      url: `${BASE_API}/all`
    })
  },
  /* 条件带分页查询标签*/
  selectTagPage(current, limit, name) {
    return request({
      method: 'get',
      url: `${BASE_API}/${current}/${limit}`,
      params: {
        name
      }
    })
  },
  /* 保存标签信息 */
  saveTag(tagForm) {
    return request({
      method: 'post',
      url: `${BASE_API}/`,
      data: tagForm
    })
  },
  /* 根据id查询标签信息 */
  selectTagById(tid) {
    return request({
      method: 'get',
      url: `${BASE_API}/${tid}`
    })
  },
  /* 修改标签信息 */
  updateTag(tagForm) {
    return request({
      method: 'put',
      url: `${BASE_API}/`,
      data: tagForm
    })
  },
  /* 根据id删除标签*/
  deleteTag(tid) {
    return request({
      method: 'delete',
      url: `${BASE_API}/${tid}`
    })
  },
  /* 批量删除标签*/
  deleteBatchTag(tidList) {
    return request({
      method: 'delete',
      url: `${BASE_API}/batch`,
      params: tidList
    })
  }
}