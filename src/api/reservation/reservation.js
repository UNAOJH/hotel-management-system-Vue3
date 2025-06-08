import request from '@/utils/request'

// 查询预定信息列表
export function listReservation(query) {
  return request({
    url: '/reservation/reservation/list',
    method: 'get',
    params: query
  })
}

// 查询预定信息详细
export function getReservation(id) {
  return request({
    url: '/reservation/reservation/' + id,
    method: 'get'
  })
}

// 新增预定信息
export function addReservation(data) {
  return request({
    url: '/reservation/reservation',
    method: 'post',
    data: data
  })
}

// 修改预定信息
export function updateReservation(data) {
  return request({
    url: '/reservation/reservation',
    method: 'put',
    data: data
  })
}

// 删除预定信息
export function delReservation(id) {
  return request({
    url: '/reservation/reservation/' + id,
    method: 'delete'
  })
}
