import request from '@/utils/request'

const BASE_API = "api/blog/category"

export default {
  /* 查询所有分类 */
  selectAllCategory() {
    return request({
      method: 'get',
      url: `${BASE_API}/all`
    })
  },
  /* 条件带分页查询分类 */
  selectCategoryPage(current, limit, name) {
    return request({
      method: 'get',
      url: `${BASE_API}/${current}/${limit}`,
      params: {
        name
      }
    })
  },
  /* 保存分类信息 */
  saveCategory(categoryForm) {
    return request({
      method: 'post',
      url: `${BASE_API}/`,
      data: categoryForm
    })
  },
  /* 根据id查询分类信息 */
  selectCategoryById(cid) {
    return request({
      method: 'get',
      url: `${BASE_API}/${cid}`
    })
  },
  /* 修改分类信息 */
  updateCategory(categoryForm) {
    return request({
      method: 'put',
      url: `${BASE_API}/`,
      data: categoryForm
    })
  },
  /* 根据id删除分类 */
  deleteCategory(cid) {
    return request({
      method: 'delete',
      url: `${BASE_API}/${cid}`
    })
  },
  /* 批量删除分类 */
  deleteBatchCategory(cidList) {
    return request({
      method: 'delete',
      url: `${BASE_API}/batch`,
      params: cidList
    })
  }
}