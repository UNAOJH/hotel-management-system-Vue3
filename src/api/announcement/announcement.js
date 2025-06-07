import request from '@/utils/request'

// 查询公告管理列表
export function listAnnouncement(query) {
  return request({
    url: '/announcement/announcement/list',
    method: 'get',
    params: query
  })
}

// 查询公告管理详细
export function getAnnouncement(id) {
  return request({
    url: '/announcement/announcement/' + id,
    method: 'get'
  })
}

// 新增公告管理
export function addAnnouncement(data) {
  return request({
    url: '/announcement/announcement',
    method: 'post',
    data: data
  })
}

// 修改公告管理
export function updateAnnouncement(data) {
  return request({
    url: '/announcement/announcement',
    method: 'put',
    data: data
  })
}

// 删除公告管理
export function delAnnouncement(id) {
  return request({
    url: '/announcement/announcement/' + id,
    method: 'delete'
  })
}
