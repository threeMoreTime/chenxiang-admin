<template>
  <div>
    <div style="display: inline-block">
    <el-input
    style="width: 150px"
    @keydown.enter.native="select"
    clearable
    placeholder="请输入手机号"
    v-model="phone"
    >
    </el-input
    >&nbsp;&nbsp;&nbsp;&nbsp;
    <el-input
    style="width: 150px"
    @keydown.enter.native="select"
    clearable
    placeholder="请输入昵称"
    v-model="nickName"
    >
    </el-input>
      <span>开始时间：</span>
      <el-date-picker
        style="width: 160px; margin-left: 10px"
        v-model="startDate"
        align="right"
        type="datetime"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
        placeholder="选择开始时间"
      >
      </el-date-picker
      >&nbsp;&nbsp;&nbsp;
      <span>截止时间：</span>
      <el-date-picker
        style="width: 160px; margin-left: 10px"
        v-model="endDate"
        align="right"
        type="datetime"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
        placeholder="选择截止时间"
      >
      </el-date-picker>
      <el-button
        style="margin-left: 15px"
        size="mini"
        type="primary"
        icon="document"
        @click="findUserTreeList"
        >查询
      </el-button>
    </div>
    <el-table v-loading="tableDataLoading" :data="gradeBonusLogData">
      <el-table-column fixed prop="id" label="编号" width="80">
      </el-table-column>
      <el-table-column label="用户信息">
       <template slot-scope="scope">
        {{scope.row.nickName+'('+scope.row.phone+')'}}
       </template>
      </el-table-column>
      <el-table-column prop="name" label="名称" width="120">
      </el-table-column>
      <el-table-column prop="img" label="图片" width="120">
        <template slot-scope="scope">
          <img :src="scope.row.img" alt="" width="60" height="60">
        </template>
      </el-table-column>
      <el-table-column prop="contractUrl" label="电子合同图片" width="120">
        <template slot-scope="scope">
          <img :src="scope.row.contractUrl" alt="" width="60" height="60">
        </template>
      </el-table-column>
      <el-table-column prop="product" label="当前产量" width="120">
      </el-table-column>
      <el-table-column prop="createTime" label="购买时间">
        <template slot-scope="scope">
          {{ parseDateTime(new Date(scope.row.createTime)) }}
        </template>
      </el-table-column>
      <el-table-column prop="bonusDayPool" label="编辑" width="200">
        <template slot-scope="scope">
          <div style="display:flex;flex-direction:row">
            <el-button
              style="margin-left: 15px"
              size="mini"
              type="primary"
              icon="document"
              :disabled="scope.row.status==1"
              @click="editUserTree(scope.row)"
            >编辑
            </el-button>
          </div>
        </template>
        
      </el-table-column>
    </el-table>
    <div style="text-align: center; margin-top: 10px">
      <el-pagination
        :page-sizes="[10, 20, 30, 40]"
        :page-size="size"
        :current-page="page"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total,sizes, prev, pager, next,jumper"
        :total="total"
      >
      </el-pagination>
    </div>
    <el-dialog title = "修改" :visible.sync = "editUserTreeDialogVisable" center>
      <el-form :model = "editUserTreeData">
        <el-form-item label = "名称" label-width = "200px">
          <el-input v-model = "editUserTreeData.name" style = "width:65%;"></el-input>
        </el-form-item>
        <el-form-item label = "树苗图片：" label-width = "200px">
          <div style = " width:148px;height:148px;border: 1px dashed #c0ccda;border-radius: 6px;text-align: center;line-height:148px;">
            <el-upload class = "avatar-uploader" v-model = "uploadImg" action = "https://sqx.gomyorder.cn/tao/alioss/upload"
                      :show-file-list = "false" :on-success = "handleUploadTreeImg">
              <img v-if = "editUserTreeData.img" :src = "editUserTreeData.img" class = "avatar" style = "border-radius: 6px;width:148px;height: 148px;"/>
              <i v-else class = "el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </div>
        </el-form-item>
        <el-form-item label = "合同图片：" label-width = "200px">
          <div style = " width:148px;height:148px;border: 1px dashed #c0ccda;border-radius: 6px;text-align: center;line-height:148px;">
            <el-upload class = "avatar-uploader" v-model = "uploadContractUrl" action = "https://sqx.gomyorder.cn/tao/alioss/upload"
                      :show-file-list = "false" :on-success = "handleUploadTreeContractUrl">
              <img v-if = "editUserTreeData.contractUrl" :src = "editUserTreeData.contractUrl" class = "avatar" style = "border-radius: 6px;width:148px;height: 148px;"/>
              <i v-else class = "el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </div>
        </el-form-item>
        <el-form-item label = "产量" label-width = "200px">
          <el-input v-model = "editUserTreeData.product" style = "width:65%;"></el-input>
        </el-form-item>
      </el-form>
      <div slot = "footer" class = "dialog-footer">
        <el-button @click = "editUserTreeDialogVisable = false">取 消</el-button>
        <el-button type = "primary" @click = "confirmEditUser()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { parseDate,parseDateTime } from '@/utils/date.js'
export default {
  name: 'GradeBonusLog',
  components: {

  },
  mixins: [],
  props: {

  },
  data () {
    return {
      gradeBonusLogData: [],
      grdeBonusLogTypeData:{},
      tableDataLoading: false,
      page: 1,
      size: 10,
      total: 0,
      // 搜索条件 start
      startDate: null,
      endDate: null,
      selectBonusLogType:'',
      nickName:'',
      phone:'',
      // 搜索条件 end

      // 编辑 start
      editUserTreeData:{ },
      editUserTreeDialogVisable:false,
      uploadImg:'',
      uploadContractUrl:'',
      // 编辑 end

    }
  },
  filters:{

  },
  computed: {

  },
  watch: {

  },
  mounted () {
    this.findUserTreeList() 
  },
  methods: {
    parseDate,parseDateTime,
    handleSizeChange(val) {
      this.size = val;
      this.findUserTreeList();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.findUserTreeList();
    },
    /* 查询树苗信息 */
    findUserTreeList () {
      this.tableDataLoading = true
      this.$http({
        url: this.$http.adornUrl2("/grade/findUserTreeList"),
        method: "get",
        params: this.$http.adornParams({
          page: this.page - 1,
          size: this.size,  
          startDate:this.startDate,
          endDate:this.endDate,
          nickName:this.nickName,
          phone:this.phone
        }),
      }).then(({ data }) => {
        this.tableDataLoading = false
        let returnData = data.data
        this.gradeBonusLogData = returnData.content
        this.total = returnData.totalElements
      })
    },
    /* 编辑树苗信息 */
    editUserTree(row) {
      this.editUserTreeDialogVisable = true;
      this.editUserTreeData = row;
    },
    /* 上传树苗图片 */
    handleUploadTreeImg (file) {
        this.editUserTreeData.img = file.data
    },
    /* 上传合同图片 */
    handleUploadTreeContractUrl(file) {
      this.editUserTreeData.contractUrl = file.data
    },
    /* 确认编辑树苗 */
    confirmEditUser() {
      this.$http({
        url: this.$http.adornUrl2("/grade/updateUserTree"),
        method: "post",
        data: this.$http.adornParams(this.editUserTreeData),
      }).then(({ data }) => {
        this.editUserTreeDialogVisable = false;
        this.findUserTreeList();
      })
    }
  }
};
</script>
<style lang='' scoped>
</style>
