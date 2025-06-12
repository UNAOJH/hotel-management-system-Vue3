<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="房间ID" prop="roomId">
        <el-input
          v-model="queryParams.roomId"
          placeholder="请输入房间ID"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="预订日期" prop="reserveDate">
        <el-date-picker clearable
          v-model="queryParams.reserveDate"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择预订日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="预定天数" prop="reserveTime">
        <el-select v-model="queryParams.reserveTime" placeholder="请选择预定天数" clearable>
          <el-option
            v-for="dict in number_of_days"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="预订人姓名" prop="reserverName">
        <el-input
          v-model="queryParams.reserverName"
          placeholder="请输入预订人姓名"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="预订人电话" prop="reserverPhone">
        <el-input
          v-model="queryParams.reserverPhone"
          placeholder="请输入预订人电话"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input
          v-model="queryParams.remark"
          placeholder="请输入备注"
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
          v-hasPermi="['reservation:reservation:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['reservation:reservation:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['reservation:reservation:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['reservation:reservation:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="reservationList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
<!--      <el-table-column label="主键" align="center" prop="id" />-->
      <el-table-column label="房间ID" align="center" prop="roomId" />
      <el-table-column label="预订日期" align="center" prop="reserveDate" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.reserveDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="预定天数" align="center" prop="reserveTime">
        <template #default="scope">
          <dict-tag :options="number_of_days" :value="scope.row.reserveTime"/>
        </template>
      </el-table-column>
      <el-table-column label="预订人姓名" align="center" prop="reserverName" />
      <el-table-column label="预订人电话" align="center" prop="reserverPhone" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['reservation:reservation:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['reservation:reservation:remove']">删除</el-button>
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

    <!-- 添加或修改预定信息对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="reservationRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="房间ID" prop="roomId">
          <el-input v-model="form.roomId" placeholder="请输入房间ID" />
        </el-form-item>
        <el-form-item label="预订日期" prop="reserveDate">
          <el-date-picker clearable
            v-model="form.reserveDate"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择预订日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="预定天数" prop="reserveTime">
          <el-select v-model="form.reserveTime" placeholder="请选择预定天数">
            <el-option
              v-for="dict in number_of_days"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="预订人姓名" prop="reserverName">
          <el-input v-model="form.reserverName" placeholder="请输入预订人姓名" />
        </el-form-item>
        <el-form-item label="预订人电话" prop="reserverPhone">
          <el-input v-model="form.reserverPhone" placeholder="请输入预订人电话" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注" />
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

<script setup name="Reservation">
import { listReservation, getReservation, delReservation, addReservation, updateReservation } from "@/api/reservation/reservation"

const { proxy } = getCurrentInstance()
const { number_of_days } = proxy.useDict('number_of_days')

const reservationList = ref([])
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
    roomId: null,
    reserveDate: null,
    reserveTime: null,
    reserverName: null,
    reserverPhone: null,
    remark: null,
  },
  rules: {
    roomId: [
      { required: true, message: "房间ID不能为空", trigger: "blur" }
    ],
    reserveDate: [
      { required: true, message: "预订日期不能为空", trigger: "blur" }
    ],
    reserverName: [
      { required: true, message: "预订人姓名不能为空", trigger: "blur" }
    ],
    reserverPhone: [
      { required: true, message: "预订人电话不能为空", trigger: "blur" }
    ],
  }
})

const { queryParams, form, rules } = toRefs(data)

/** 查询预定信息列表 */
function getList() {
  loading.value = true
  listReservation(queryParams.value).then(response => {
    reservationList.value = response.rows
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
    roomId: null,
    reserveDate: null,
    reserveTime: null,
    reserved: null,
    reserverName: null,
    reserverPhone: null,
    remark: null,
    createTime: null,
    updateTime: null
  }
  proxy.resetForm("reservationRef")
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
  title.value = "添加预定信息"
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const _id = row.id || ids.value
  getReservation(_id).then(response => {
    form.value = response.data
    open.value = true
    title.value = "修改预定信息"
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["reservationRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateReservation(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addReservation(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除预定信息编号为"' + _ids + '"的数据项？').then(function() {
    return delReservation(_ids)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => {})
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('reservation/reservation/export', {
    ...queryParams.value
  }, `reservation_${new Date().getTime()}.xlsx`)
}

getList()
</script>
