import request from '@/utils/request'

// 查询房型信息列表
export function listType(query) {
  return request({
    url: '/type/type/list',
    method: 'get',
    params: query
  })
}

// 查询房型信息详细
export function getType(id) {
  return request({
    url: '/type/type/' + id,
    method: 'get'
  })
}

// 新增房型信息
export function addType(data) {
  return request({
    url: '/type/type',
    method: 'post',
    data: data
  })
}

// 修改房型信息
export function updateType(data) {
  return request({
    url: '/type/type',
    method: 'put',
    data: data
  })
}

// 删除房型信息
export function delType(id) {
  return request({
    url: '/type/type/' + id,
    method: 'delete'
  })
}
