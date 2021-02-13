import request from '@/utils/request'

const BASE_API = "api/oss/file"

export default {
  /* 删除上传文件 */
  deleteFileUrl(url) {
    return request({
      method: 'delete',
      url: `${BASE_API}/url`,
      params: {
        url: url
      }
    })
  }
}