import request from '@/utils/request'

const BASE_API = "site/social"

export default {
  /* 获取所有社交信息 */
  selectAllSocial() {
    return request({
      method: 'get',
      url: `${BASE_API}/`
    })
  },
  /* 保存社交信息 */
  saveSocial(socialForm) {
    return request({
      method: 'post',
      url: `${BASE_API}/`,
      data: socialForm
    })
  },
  /* 根据id获取社交信息 */
  selectSocialId(sid) {
    return request({
      method: 'get',
      url: `${BASE_API}/${sid}`
    })
  },
  /* 修改社交信息 */
  updateSocial(socialForm) {
    return request({
      method: 'put',
      url: `${BASE_API}/`,
      data: socialForm
    })
  },
  /* 删除社交信息 */
  deleteSocial(sid) {
    return request({
      method: 'delete',
      url: `${BASE_API}/${sid}`
    })
  }
}