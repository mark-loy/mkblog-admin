import request from '@/utils/request'

const BASE_API = "api/site/friend"

export default {
  /* 查询所有友站信息 */
  selectAllFriends() {
    return request({
      method: 'get',
      url: `${BASE_API}/`
    })
  },
  /* 保存友站信息 */
  saveFriend(friendForm) {
    return request({
      method: 'post',
      url: `${BASE_API}/`,
      data: friendForm
    })
  },
  /* 根据id查询友站信息 */
  getFriendById(fid) {
    return request({
      method: 'get',
      url: `${BASE_API}/${fid}`
    })
  },
  /* 修改友站信息 */
  updateFriend(friendForm) {
    return request({
      method: 'put',
      url: `${BASE_API}/`,
      data: friendForm
    })
  },
  /* 删除友站信息 */
  deleteFriend(fid) {
    return request({
      method: 'delete',
      url: `${BASE_API}/${fid}`
    })
  }
}