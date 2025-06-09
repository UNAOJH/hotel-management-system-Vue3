<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="100px">
      <el-form-item label="预订ID" prop="reservationId">
        <el-input
            v-model="queryParams.reservationId"
            placeholder="请输入预订ID"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="入住日期" prop="checkInDate">
        <el-date-picker clearable
                        v-model="queryParams.checkInDate"
                        type="date"
                        value-format="YYYY-MM-DD"
                        placeholder="请选择入住日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="退房日期" prop="checkOutDate">
        <el-date-picker clearable
                        v-model="queryParams.checkOutDate"
                        type="date"
                        value-format="YYYY-MM-DD"
                        placeholder="请选择退房日期">
        </el-date-picker>
      </el-form-item>

      <el-form-item label="入住人姓名" prop="guestName" class="nowrap-label">
        <el-input
            v-model="queryParams.guestName"
            placeholder="请输入入住人姓名"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>


      <el-form-item label="身份证号" prop="guestIdNumber">
        <el-input
            v-model="queryParams.guestIdNumber"
            placeholder="请输入身份证号"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="是否已入住" style="width:300px" prop="checkInStatus">
        <el-select v-model="queryParams.checkInStatus" placeholder="请选择是否已入住" clearable>
          <el-option
              v-for="dict in is_or_no"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <!--      <el-form-item>-->
      <!--        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>-->
      <!--        <el-button icon="Refresh" @click="resetQuery">重置</el-button>-->
      <!--      </el-form-item>-->
      <el-row :gutter="10">
        <el-col :span="24">
          <el-form-item style="margin-bottom: 0;text-align: right;" >
            <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
            <el-button icon="Refresh" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>

    </el-form>
    <!-- 添加一个空行 -->
    <el-row>
      <el-col :span="24">
        <div style="height: 20px;"></div>
      </el-col>
    </el-row>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
            type="primary"
            plain
            icon="Plus"
            @click="handleAdd"
            v-hasPermi="['in:in:add']"
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
            v-hasPermi="['in:in:edit']"
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
            v-hasPermi="['in:in:remove']"
        >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
            v-hasPermi="['in:in:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="inList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
<!--      <el-table-column label="入住ID" align="center" prop="id"/>-->
<!--      <el-table-column label="关联预订ID" align="center" prop="reservationId"/>-->
      <el-table-column label="入住日期" align="center" prop="checkInDate" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.checkInDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="退房日期" align="center" prop="checkOutDate" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.checkOutDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="入住人姓名" align="center" prop="guestName"/>
      <el-table-column label="身份证号" align="center" prop="guestIdNumber"/>
      <el-table-column label="是否已入住" align="center" prop="checkInStatus">
        <template #default="scope">
          <dict-tag :options="is_or_no" :value="scope.row.checkInStatus"/>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['in:in:edit']">修改
          </el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['in:in:remove']">
            删除
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

    <!-- 添加或修改入住信息对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="inRef" :model="form" :rules="rules" label-width="80px">
<!--        <el-form-item label="关联预订ID" prop="reservationId">-->
<!--          <el-input v-model="form.reservationId" placeholder="请输入关联预订ID"/>-->
<!--        </el-form-item>-->
        <el-form-item label="入住日期" prop="checkInDate">
          <el-date-picker clearable
                          v-model="form.checkInDate"
                          type="date"
                          value-format="YYYY-MM-DD"
                          placeholder="请选择入住日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="退房日期" prop="checkOutDate">
          <el-date-picker clearable
                          v-model="form.checkOutDate"
                          type="date"
                          value-format="YYYY-MM-DD"
                          placeholder="请选择退房日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="入住人姓名" prop="guestName">
          <el-input v-model="form.guestName" placeholder="请输入入住人姓名"/>
        </el-form-item>
        <el-form-item label="身份证号" prop="guestIdNumber">
          <el-input v-model="form.guestIdNumber" placeholder="请输入身份证号"/>
        </el-form-item>
        <el-form-item label="是否已入住" prop="checkInStatus">
          <el-select v-model="form.checkInStatus" placeholder="请选择是否已入住">
            <el-option
                v-for="dict in is_or_no"
                :key="dict.value"
                :label="dict.label"
                :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注"/>
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

<script setup name="In">
import {listIn, getIn, delIn, addIn, updateIn} from "@/api/in/in"

const {proxy} = getCurrentInstance()
const {is_or_no} = proxy.useDict('is_or_no')

const inList = ref([])
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
    reservationId: null,
    checkInDate: null,
    checkOutDate: null,
    guestName: null,
    guestIdNumber: null,
    checkInStatus: null,
  },
  rules: {
    id: [
      {required: true, message: "入住ID不能为空", trigger: "blur"}
    ],
    reservationId: [
      {required: true, message: "关联预订ID不能为空", trigger: "blur"}
    ],
    checkInDate: [
      {required: true, message: "入住日期不能为空", trigger: "blur"}
    ],
    guestName: [
      {required: true, message: "入住人姓名不能为空", trigger: "blur"}
    ],
    guestIdNumber: [
      {required: true, message: "身份证号不能为空", trigger: "blur"}
    ],
    checkInStatus: [
      {required: true, message: "是否已入住不能为空", trigger: "change"}
    ],
  }
})

const {queryParams, form, rules} = toRefs(data)

/** 查询入住信息列表 */
function getList() {
  loading.value = true
  listIn(queryParams.value).then(response => {
    inList.value = response.rows
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
    reservationId: null,
    checkInDate: null,
    checkOutDate: null,
    guestName: null,
    guestIdNumber: null,
    checkInStatus: null,
    remark: null
  }
  proxy.resetForm("inRef")
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
  title.value = "添加入住信息"
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const _id = row.id || ids.value
  getIn(_id).then(response => {
    form.value = response.data
    open.value = true
    title.value = "修改入住信息"
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["inRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateIn(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addIn(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除入住信息编号为"' + _ids + '"的数据项？').then(function () {
    return delIn(_ids)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => {
  })
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('in/in/export', {
    ...queryParams.value
  }, `in_${new Date().getTime()}.xlsx`)
}

getList()
</script>
<style>
.el-form-item__label {
  white-space: nowrap;
}
</style>