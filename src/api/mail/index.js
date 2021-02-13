import request from '@/utils/request'

const BASE_API = "api/mds/mail"

export default {
  /* 获取邮件分页数据 */
  selectMailPage(current, limit) {
    return request({
      method: 'get',
      url: `${BASE_API}/${current}/${limit}`
    })
  },
  /* 发送邮件 */
  sendMail(mailForm) {
    return request({
      method: 'post',
      url: `${BASE_API}/send/notice`,
      data: mailForm
    })
  },
  /* 删除邮件 */
  deleteMail(mid) {
    return request({
      method: 'delete',
      url: `${BASE_API}/${mid}`
    })
  }
}