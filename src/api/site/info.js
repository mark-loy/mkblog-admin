import request from '@/utils/request'

const BASE_API = "api/site/info"

export default {
  /* 获取站点信息 */
  selectSiteInfo() {
    return request({
      method: 'get',
      url: `${BASE_API}/`
    })
  },
  /* 修改站点信息 */
  updateSiteInfo(siteInfoForm) {
    return request({
      method: 'put',
      url: `${BASE_API}/`,
      data: siteInfoForm
    })
  }
}