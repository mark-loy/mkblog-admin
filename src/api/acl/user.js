import request from '@/utils/request'

const api_name = 'admin/acl/user'

export default {
  getPageList(page, limit) {
    return request({
      url: `${api_name}/${page}/${limit}`,
      method: 'post'
    })
  },
  getById(id) {
    return request({
      url: `${api_name}/${id}`,
      method: 'get'
    })
  },
  save(user) {
    const userForm = JSON.parse(user)
    return request({
      url: `${api_name}`,
      method: 'post',
      data: userForm
    })
  },
  updateById(user) {
    const userForm = JSON.parse(user)
    return request({
      url: `${api_name}`,
      method: 'put',
      data: userForm
    })
  },
  getAssign(userId) {
    return request({
      url: `${api_name}/toAssign/${userId}`,
      method: 'get'
    })
  },
  saveAssign(uid, rids) {
    return request({
      url: `${api_name}/doAssign`,
      method: 'post',
      params: {
        uid,
        rids
      }
    })
  },
  removeById(id) {
    return request({
      url: `${api_name}/${id}`,
      method: 'delete'
    })
  },
}
