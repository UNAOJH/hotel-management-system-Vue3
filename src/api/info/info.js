import request from '@/utils/request'
import { listType } from "@/api/type/type" // 假设已定义该接口

// 获取房型列表
function getRoomTypes() {
  listType().then(response => {
    roomTypeOptions.value = response.rows || []
  })
}
// 页面初始化时调用
getRoomTypes()

// 查询客房信息列表
export function listInfo(query) {
  return request({
    url: '/info/info/list',
    method: 'get',
    params: query
  })
}

// 查询客房信息详细
export function getInfo(id) {
  return request({
    url: '/info/info/' + id,
    method: 'get'
  })
}

// 新增客房信息
export function addInfo(data) {
  return request({
    url: '/info/info',
    method: 'post',
    data: data
  })
}

// 修改客房信息
export function updateInfo(data) {
  return request({
    url: '/info/info',
    method: 'put',
    data: data
  })
}

// 删除客房信息
export function delInfo(id) {
  return request({
    url: '/info/info/' + id,
    method: 'delete'
  })
}
