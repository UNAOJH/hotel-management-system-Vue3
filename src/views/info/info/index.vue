<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="房间号" prop="roomNumber">
        <el-input
            v-model="queryParams.roomNumber"
            placeholder="请输入房间号"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>


      <!--      <el-form-item label="房型ID，关联room_type" prop="roomTypeId">-->
      <!--        <el-input-->
      <!--          v-model="queryParams.roomTypeId"-->
      <!--          placeholder="请输入房型ID，关联room_type"-->
      <!--          clearable-->
      <!--          @keyup.enter="handleQuery"-->
      <!--        />-->
      <!--      </el-form-item>-->

      <el-form-item label="房型ID，关联room_type" style="width: 200px" prop="roomTypeId">
        <el-select v-model="queryParams.roomTypeId" placeholder="请选择房型" clearable style="width: 100%">
          <el-option
              v-for="item in roomTypes"
              :key="item.id"
              :label="item.typeName"
              :value="item.id"
          />
        </el-select>
      </el-form-item>


      <el-form-item label="房间状态" style="width: 210px" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择房间状态" clearable>
          <el-option
              v-for="dict in room_status"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
          />
        </el-select>
      </el-form-item>


      <el-form-item label="楼层" prop="floor">
        <el-input
            v-model="queryParams.floor"
            placeholder="请输入楼层"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input
            v-model="queryParams.description"
            placeholder="请输入描述"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
            type="primary"
            plain
            icon="Plus"
            @click="handleAdd"
            v-hasPermi="['info:info:add']"
        >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="success"
            plain
            icon="Edit"
            :disabled="single"
            @click="handleUpdate"
            v-hasPermi="['info:info:edit']"
        >修改
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="danger"
            plain
            icon="Delete"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['info:info:remove']"
        >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
            v-hasPermi="['info:info:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="infoList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="房间ID" align="center" prop="id"/>
      <el-table-column label="房间号" align="center" prop="roomNumber"/>
      <el-table-column label="房型ID，关联room_type" align="center" prop="roomTypeId"/>
      <el-table-column label="房间状态，0空闲，1预订，2入住，3维修" align="center" prop="status">
        <template #default="scope">
          <dict-tag :options="room_status" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="楼层" align="center" prop="floor"/>
      <el-table-column label="描述" align="center" prop="description"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['info:info:edit']">
            修改
          </el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
                     v-hasPermi="['info:info:remove']">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
        v-show="total>0"
        :total="total"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        @pagination="getList"
    />

    <!-- 添加或修改客房信息对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="infoRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="房间号" prop="roomNumber">
          <el-input v-model="form.roomNumber" placeholder="请输入房间号"/>
        </el-form-item>


        <!--        <el-form-item label="房型ID，关联room_type" prop="roomTypeId">-->
        <!--          <el-input v-model="form.roomTypeId" placeholder="请输入房型ID，关联room_type" />-->
        <!--        </el-form-item>-->

        <el-form-item label="房型ID，关联room_type" prop="roomTypeId">
          <el-select v-model="form.roomTypeId" placeholder="请选择房型" style="width: 100%">
            <el-option
                v-for="item in roomTypes"
                :key="item.id"
                :label="item.typeName"
                :value="item.id"
            />
          </el-select>
        </el-form-item>


        <el-form-item label="房间状态，0空闲，1预订，2入住，3维修" prop="status">
          <el-select v-model="form.status" placeholder="请选择房间状态，0空闲，1预订，2入住，3维修">
            <el-option
                v-for="dict in room_status"
                :key="dict.value"
                :label="dict.label"
                :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="楼层" prop="floor">
          <el-input v-model="form.floor" placeholder="请输入楼层"/>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="form.description" placeholder="请输入描述"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Info">
import {listInfo, getInfo, delInfo, addInfo, updateInfo} from "@/api/info/info"
import {listType} from "@/api/type/type"


const {proxy} = getCurrentInstance()
const {room_status} = proxy.useDict('room_status')

const infoList = ref([])
const open = ref(false)
const loading = ref(true)
const showSearch = ref(true)
const ids = ref([])
const single = ref(true)
const multiple = ref(true)
const total = ref(0)
const title = ref("")


const roomTypes = ref([])

/** 初始化房型列表 */
function initRoomType() {
  listType().then(response => {
    roomTypes.value = response.rows || []
  })
}

onMounted(() => {
  initRoomType()
})


const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    roomNumber: null,
    roomTypeId: null,
    status: null,
    floor: null,
    description: null,
  },
  rules: {
    roomNumber: [
      {required: true, message: "房间号不能为空", trigger: "blur"}
    ],
    roomTypeId: [
      {required: true, message: "房型ID，关联room_type不能为空", trigger: "blur"}
    ],
    floor: [
      {required: true, message: "楼层不能为空", trigger: "blur"}
    ],
  }
})

const {queryParams, form, rules} = toRefs(data)


/** 查询客房信息列表 */
function getList() {
  loading.value = true
  listInfo(queryParams.value).then(response => {
    infoList.value = response.rows
    total.value = response.total
    loading.value = false
  })
}

// 取消按钮
function cancel() {
  open.value = false
  reset()
}

// 表单重置
function reset() {
  form.value = {
    id: null,
    roomNumber: null,
    roomTypeId: null,
    status: null,
    floor: null,
    description: null,
    createTime: null,
    updateTime: null
  }
  proxy.resetForm("infoRef")
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1
  getList()
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef")
  handleQuery()
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
  reset()
  open.value = true
  title.value = "添加客房信息"
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const _id = row.id || ids.value
  getInfo(_id).then(response => {
    form.value = response.data
    open.value = true
    title.value = "修改客房信息"
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["infoRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateInfo(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addInfo(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功")
          open.value = false
          getList()
        })
      }
    }
  })
}

/** 删除按钮操作 */
function handleDelete(row) {
  const _ids = row.id || ids.value
  proxy.$modal.confirm('是否确认删除客房信息编号为"' + _ids + '"的数据项？').then(function () {
    return delInfo(_ids)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => {
  })
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('info/info/export', {
    ...queryParams.value
  }, `info_${new Date().getTime()}.xlsx`)
}

getList()
</script>
