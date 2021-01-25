import request from '@/utils/request'

export function login(data) {
  return request({
    url: 'blog/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: 'blog/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: 'blog/user/logout',
    method: 'post'
  })
}
