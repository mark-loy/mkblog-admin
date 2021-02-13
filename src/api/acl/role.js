import request from '@/utils/request'

const api_name = 'admin/acl/role'

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
  save(role) {
    const roleForm = JSON.parse(role)
    return request({
      url: `${api_name}`,
      method: 'post',
      data: roleForm
    })
  },
  updateById(role) {
    const roleForm = JSON.parse(role)
    return request({
      url: `${api_name}`,
      method: 'put',
      data: roleForm
    })
  },
  getAssign(roleId) {
    return request({
      url: `${api_name}/toAssign/${roleId}`,
      method: 'get'
    })
  },
  removeById(id) {
    return request({
      url: `${api_name}/${id}`,
      method: 'delete'
    })
  },
  doAssign(roleId, perIds) {
    return request({
      url: `${api_name}/doAssign`,
      method: "post",
      params: {
        roleId,
        perIds
      }
    })
  }

}
