import request from '@/utils/request'

// 查询酒店简介列表
export function listProfile(query) {
  return request({
    url: '/profile/profile/list',
    method: 'get',
    params: query
  })
}

// 查询酒店简介详细
export function getProfile(id) {
  return request({
    url: '/profile/profile/' + id,
    method: 'get'
  })
}

// 新增酒店简介
export function addProfile(data) {
  return request({
    url: '/profile/profile',
    method: 'post',
    data: data
  })
}

// 修改酒店简介
export function updateProfile(data) {
  return request({
    url: '/profile/profile',
    method: 'put',
    data: data
  })
}

// 删除酒店简介
export function delProfile(id) {
  return request({
    url: '/profile/profile/' + id,
    method: 'delete'
  })
}
