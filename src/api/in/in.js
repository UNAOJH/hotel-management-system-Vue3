import request from '@/utils/request'

// 查询入住信息列表
export function listIn(query) {
  return request({
    url: '/in/in/list',
    method: 'get',
    params: query
  })
}

// 查询入住信息详细
export function getIn(id) {
  return request({
    url: '/in/in/' + id,
    method: 'get'
  })
}

// 新增入住信息
export function addIn(data) {
  return request({
    url: '/in/in',
    method: 'post',
    data: data
  })
}

// 修改入住信息
export function updateIn(data) {
  return request({
    url: '/in/in',
    method: 'put',
    data: data
  })
}

// 删除入住信息
export function delIn(id) {
  return request({
    url: '/in/in/' + id,
    method: 'delete'
  })
}
