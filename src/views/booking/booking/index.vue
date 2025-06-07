<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="酒店用户ID，关联hotel_user" prop="hotelUserId">
        <el-input
          v-model="queryParams.hotelUserId"
          placeholder="请输入酒店用户ID，关联hotel_user"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="房间ID，关联room_info" prop="roomId">
        <el-input
          v-model="queryParams.roomId"
          placeholder="请输入房间ID，关联room_info"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="预订日期" prop="bookingDate">
        <el-date-picker clearable
          v-model="queryParams.bookingDate"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择预订日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="入住开始日期" prop="startDate">
        <el-date-picker clearable
          v-model="queryParams.startDate"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择入住开始日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="离店日期" prop="endDate">
        <el-date-picker clearable
          v-model="queryParams.endDate"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择离店日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="预订状态，0待确认，1已确认，2取消" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择预订状态，0待确认，1已确认，2取消" clearable>
          <el-option
            v-for="dict in order_status"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
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
          v-hasPermi="['booking:booking:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['booking:booking:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['booking:booking:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['booking:booking:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="bookingList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="预订ID" align="center" prop="id" />
      <el-table-column label="酒店用户ID，关联hotel_user" align="center" prop="hotelUserId" />
      <el-table-column label="房间ID，关联room_info" align="center" prop="roomId" />
      <el-table-column label="预订日期" align="center" prop="bookingDate" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.bookingDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="入住开始日期" align="center" prop="startDate" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.startDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="离店日期" align="center" prop="endDate" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.endDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="预订状态，0待确认，1已确认，2取消" align="center" prop="status">
        <template #default="scope">
          <dict-tag :options="order_status" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['booking:booking:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['booking:booking:remove']">删除</el-button>
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

    <!-- 添加或修改预订信息对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="bookingRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="酒店用户ID，关联hotel_user" prop="hotelUserId">
          <el-input v-model="form.hotelUserId" placeholder="请输入酒店用户ID，关联hotel_user" />
        </el-form-item>
        <el-form-item label="房间ID，关联room_info" prop="roomId">
          <el-input v-model="form.roomId" placeholder="请输入房间ID，关联room_info" />
        </el-form-item>
        <el-form-item label="预订日期" prop="bookingDate">
          <el-date-picker clearable
            v-model="form.bookingDate"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择预订日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="入住开始日期" prop="startDate">
          <el-date-picker clearable
            v-model="form.startDate"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择入住开始日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="离店日期" prop="endDate">
          <el-date-picker clearable
            v-model="form.endDate"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择离店日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="预订状态，0待确认，1已确认，2取消" prop="status">
          <el-select v-model="form.status" placeholder="请选择预订状态，0待确认，1已确认，2取消">
            <el-option
              v-for="dict in order_status"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
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

<script setup name="Booking">
import { listBooking, getBooking, delBooking, addBooking, updateBooking } from "@/api/booking/booking"

const { proxy } = getCurrentInstance()
const { order_status } = proxy.useDict('order_status')

const bookingList = ref([])
const open = ref(false)
const loading = ref(true)
const showSearch = ref(true)
const ids = ref([])
const single = ref(true)
const multiple = ref(true)
const total = ref(0)
const title = ref("")

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    hotelUserId: null,
    roomId: null,
    bookingDate: null,
    startDate: null,
    endDate: null,
    status: null,
  },
  rules: {
    hotelUserId: [
      { required: true, message: "酒店用户ID，关联hotel_user不能为空", trigger: "blur" }
    ],
    roomId: [
      { required: true, message: "房间ID，关联room_info不能为空", trigger: "blur" }
    ],
    bookingDate: [
      { required: true, message: "预订日期不能为空", trigger: "blur" }
    ],
    startDate: [
      { required: true, message: "入住开始日期不能为空", trigger: "blur" }
    ],
    endDate: [
      { required: true, message: "离店日期不能为空", trigger: "blur" }
    ],
  }
})

const { queryParams, form, rules } = toRefs(data)

/** 查询预订信息列表 */
function getList() {
  loading.value = true
  listBooking(queryParams.value).then(response => {
    bookingList.value = response.rows
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
    hotelUserId: null,
    roomId: null,
    bookingDate: null,
    startDate: null,
    endDate: null,
    status: null,
    createTime: null,
    updateTime: null
  }
  proxy.resetForm("bookingRef")
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
  title.value = "添加预订信息"
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const _id = row.id || ids.value
  getBooking(_id).then(response => {
    form.value = response.data
    open.value = true
    title.value = "修改预订信息"
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["bookingRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateBooking(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addBooking(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除预订信息编号为"' + _ids + '"的数据项？').then(function() {
    return delBooking(_ids)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => {})
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('booking/booking/export', {
    ...queryParams.value
  }, `booking_${new Date().getTime()}.xlsx`)
}

getList()
</script>
