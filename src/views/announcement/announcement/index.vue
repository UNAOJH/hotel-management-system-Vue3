<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="120px">
      <el-form-item label="公告标题" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入公告标题"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="公告内容" prop="content">
        <el-input
          v-model="queryParams.content"
          placeholder="请输入公告内容"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="发布时间" prop="publishDate">
        <el-date-picker clearable
          v-model="queryParams.publishDate"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择发布时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="状态" style="width: 300px;" prop="status">
        <el-select v-model="queryParams.status" style="width: 300px" placeholder="请选择状态" clearable>
          <el-option
              v-for="dict in notice_status"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
          />
        </el-select>
      </el-form-item>
<!--      <el-form-item >-->
<!--        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>-->
<!--        <el-button icon="Refresh" @click="resetQuery">重置</el-button>-->
<!--      </el-form-item>-->
<!--      <el-row :gutter="10" justify="end">-->
<!--        <el-col :span="24">-->
<!--          <el-form-item style="margin-bottom: 0; text-align: right;">-->
<!--            <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>-->
<!--            <el-button icon="Refresh" @click="resetQuery">重置</el-button>-->
<!--          </el-form-item>-->
<!--        </el-col>-->
<!--      </el-row>-->
      <el-row :gutter="10" justify="end" style="width: 100%;">
        <el-col :span="24">
          <el-form-item style="margin-bottom: 0; text-align: right;">
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
    </el-row>  <!-- 添加一个空行 -->
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
          v-hasPermi="['announcement:announcement:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['announcement:announcement:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['announcement:announcement:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['announcement:announcement:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="announcementList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="公告ID" align="center" prop="id" />
      <el-table-column label="公告标题" align="center" prop="title" />
      <el-table-column label="公告内容" align="center" prop="content" />
      <el-table-column label="发布时间" align="center" prop="publishDate" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.publishDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态，0未发布，1已发布" align="center" prop="status">
        <template #default="scope">
          <dict-tag :options="notice_status" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['announcement:announcement:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['announcement:announcement:remove']">删除</el-button>
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

    <!-- 添加或修改公告管理对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="announcementRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="公告标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入公告标题" />
        </el-form-item>
        <el-form-item label="公告内容" prop="content">
          <el-input v-model="form.content" placeholder="请输入公告内容" />
        </el-form-item>
        <el-form-item label="发布时间" prop="publishDate">
          <el-date-picker clearable
            v-model="form.publishDate"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择发布时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status" placeholder="请选择状态">
            <el-option
              v-for="dict in notice_status"
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

<script setup name="Announcement">
import { listAnnouncement, getAnnouncement, delAnnouncement, addAnnouncement, updateAnnouncement } from "@/api/announcement/announcement"

const { proxy } = getCurrentInstance()
const { notice_status } = proxy.useDict('notice_status')

const announcementList = ref([])
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
    title: null,
    content: null,
    publishDate: null,
    status: null,
  },
  rules: {
    title: [
      { required: true, message: "公告标题不能为空", trigger: "blur" }
    ],
    content: [
      { required: true, message: "公告内容不能为空", trigger: "blur" }
    ],
  }
})

const { queryParams, form, rules } = toRefs(data)

/** 查询公告管理列表 */
function getList() {
  loading.value = true
  listAnnouncement(queryParams.value).then(response => {
    announcementList.value = response.rows
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
    title: null,
    content: null,
    publishDate: null,
    status: null,
    createTime: null,
    updateTime: null
  }
  proxy.resetForm("announcementRef")
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
  title.value = "添加公告管理"
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const _id = row.id || ids.value
  getAnnouncement(_id).then(response => {
    form.value = response.data
    open.value = true
    title.value = "修改公告管理"
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["announcementRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateAnnouncement(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addAnnouncement(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除公告管理编号为"' + _ids + '"的数据项？').then(function() {
    return delAnnouncement(_ids)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => {})
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('announcement/announcement/export', {
    ...queryParams.value
  }, `announcement_${new Date().getTime()}.xlsx`)
}

getList()
</script>
