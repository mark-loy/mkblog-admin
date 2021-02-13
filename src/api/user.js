import request from '@/utils/request'

export function login(data) {
  return request({
    url: 'acl/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: 'acl/index/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: 'acl/logout',
    method: 'post'
  })
}
