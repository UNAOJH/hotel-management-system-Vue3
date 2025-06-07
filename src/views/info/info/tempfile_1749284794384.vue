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
