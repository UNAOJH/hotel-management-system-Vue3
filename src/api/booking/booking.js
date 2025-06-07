import request from '@/utils/request'

// 查询预订信息列表
export function listBooking(query) {
  return request({
    url: '/booking/booking/list',
    method: 'get',
    params: query
  })
}

// 查询预订信息详细
export function getBooking(id) {
  return request({
    url: '/booking/booking/' + id,
    method: 'get'
  })
}

// 新增预订信息
export function addBooking(data) {
  return request({
    url: '/booking/booking',
    method: 'post',
    data: data
  })
}

// 修改预订信息
export function updateBooking(data) {
  return request({
    url: '/booking/booking',
    method: 'put',
    data: data
  })
}

// 删除预订信息
export function delBooking(id) {
  return request({
    url: '/booking/booking/' + id,
    method: 'delete'
  })
}
