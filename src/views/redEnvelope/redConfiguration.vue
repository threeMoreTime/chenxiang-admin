<template>
  <div>
    <el-tabs v-model = "activeName" @tab-click = "handleClick">
      <el-tab-pane label = "红包配置" name = "first">
        <el-table v-loading = "tableDataLoading" :data = "tableData">
          <el-table-column fixed prop = "type" label = "编号" align = "center" width = "80">
          </el-table-column>
          <el-table-column prop = "min" label = "类型"> </el-table-column>
          <el-table-column prop = "value" label = "内容">
          </el-table-column>
          <el-table-column prop = "createAt" label = "创建时间"> </el-table-column>
          <el-table-column label = "操作" prop = "id" width = "120">
            <template slot-scope = "scope">
              <el-button size = "mini" type = "primary" :disabled = "!isAuth('redConfiguration:update')"
                         @click = "amend(scope.$index, scope.row)">编辑
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label = "红包记录" name = "second">
        <div style = "margin:2% 0;display: inline-block;">
          <span>红包状态：</span>
          <el-select v-model = "tkstatus" placeholder = "请选择状态" style = "width:150px;" @change = "selectTrigger(tkstatus)">
            <el-option v-for = "item in redStatus" :key = "item.value" :label = "item.label" :value = "item.value">
            </el-option>
          </el-select>
        </div>
        <el-table v-loading = "tableDataLoading" :data = "tableDatajilu">
          <el-table-column fixed prop = "redPacketId" label = "编号" align = "center" width = "80">
          </el-table-column>
          <el-table-column prop = "nickName" label = "用户昵称" align = "center">
          </el-table-column>
          <el-table-column prop = "money" label = "当前金额" align = "center">
          </el-table-column>
          <el-table-column prop = "numPeople" label = "当前人数" width = "80" align = "center">
          </el-table-column>
          <el-table-column prop = "tarGetMoney" label = "目标金额" align = "center"></el-table-column>
          <el-table-column prop = "tarGetNumPeople" label = "目标人数" width = "80" align = "center"></el-table-column>
          <el-table-column prop = "createTime" label = "创建时间" width = "220" align = "center">
          </el-table-column>
          <el-table-column prop = "endTime" label = "结束时间" width = "220" align = "center">
          </el-table-column>
           <el-table-column fixed = "right" prop = "status" align = "center" label = "订单状态">
          <template slot-scope = "scope">
            <span v-if = "scope.row.status == 1">砍价中</span>
            <span v-if = "scope.row.status == 2">待提现</span>
            <span v-if = "scope.row.status == 3">已提现</span>
            <span v-if = "scope.row.status == 4">已过期</span>
          </template>
        </el-table-column>
        </el-table>
        <div style = "text-align: center;margin-top: 10px;">
         <el-pagination @size-change = "handleSizeChange" @current-change = "handleCurrentChange" :page-sizes = "[5, 10, 15, 20]"
                        :page-size = "size" :current-page = "page + 1" layout = "total,sizes, prev, pager, next,jumper" :total = "totalnum">
        </el-pagination>
      </div>
      </el-tab-pane>
      <el-tab-pane label = "文案列表" name = "wenan">
        <div style = "float: right; margin-right: 2%">
        <el-button style = "margin: 10px 0" :disabled = "!isAuth('redConfiguration:add')" size = "mini" type = "primary" icon = "document"
                   @click = "addNavigation7">添加文案</el-button>
      </div>
        <el-table v-loading = "tableDataLoading" :data = "tableDataWEN">
          <el-table-column fixed prop = "id" label = "编号" align = "center" width = "80">
          </el-table-column>
          <el-table-column prop = "content" label = "内容">
          </el-table-column>
          <el-table-column label = "操作" prop = "id" width = "120">
		     <template slot-scope = "scope">
				<el-button size = "mini" type = "danger" :disabled = "!isAuth('redConfiguration:delete')" @click = "choidelete1(scope.row)">删除
				</el-button>
		     </template>
		   </el-table-column>
        </el-table>
        <div style = "text-align: center;margin-top: 10px;">
         <el-pagination @size-change = "handleSizeChange1" @current-change = "handleCurrentChange1" :page-sizes = "[5, 10, 15, 20]"
                        :page-size = "size1" :current-page = "page1 + 1" layout = "total,sizes, prev, pager, next,jumper"
                        :total = "totalnum">
        </el-pagination>
      </div>
      </el-tab-pane>
      <el-tab-pane label = "链接列表" name = "lianjie">
        <div style = "float: right; margin-right: 2%">
        <el-button style = "margin: 10px 0" :disabled = "!isAuth('redConfiguration:add')" size = "mini" type = "primary" icon = "document"
                   @click = "addNavigation11">添加链接</el-button>
      </div>
        <el-table v-loading = "tableDataLoading" :data = "tableDatalianjie">
          <el-table-column fixed prop = "id" label = "编号" align = "center" width = "80">
          </el-table-column>
          <el-table-column prop = "content" label = "链接">
          </el-table-column>
          <el-table-column label = "操作" prop = "id" width = "120">
		     <template slot-scope = "scope">
				<el-button size = "mini" type = "danger" :disabled = "!isAuth('redConfiguration:delete')" @click = "choidelete2(scope.row)">删除
				</el-button>
		     </template>
		   </el-table-column>
        </el-table>
        <div style = "text-align: center;margin-top: 10px;">
         <el-pagination @size-change = "handleSizeChange2" @current-change = "handleCurrentChange2" :page-sizes = "[5, 10, 15, 20]"
                        :page-size = "size2" :current-page = "page2 + 1" layout = "total,sizes, prev, pager, next,jumper"
                        :total = "totalnum">
        </el-pagination>
      </div>
      </el-tab-pane>
    </el-tabs>
    <!-- 修改弹框 -->
    <el-dialog title = "修改" :visible.sync = "dialogFormVisible" center>
      <el-form :model = "form">
        <el-form-item label = "配置类型：" :label-width = "formLabelWidth">
          <el-input v-model = "form.min" style = "width: 65%" readonly></el-input>
        </el-form-item>
        <el-form-item label = "内容：" :label-width = "formLabelWidth">
          <el-input v-model = "form.value" style = "width: 65%"></el-input>
        </el-form-item>
      </el-form>
      <div slot = "footer" class = "dialog-footer">
        <el-button @click = "dialogFormVisible = false">取 消</el-button>
        <el-button type = "primary" @click = "amendNoticeTo()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 添加导航弹框 -->
		<el-dialog title = "添加文案内容" :visible.sync = "dialogFormVisible7" center>
			<div style = "margin-bottom: 10px;">
				<span style = "width: 200px;display: inline-block;text-align: right;">内容：</span>
				<el-input style = "width:50%;" v-model = "content" placeholder = "请输入内容"></el-input>
			</div>
			<div slot = "footer" class = "dialog-footer">
				<el-button @click = "dialogFormVisible7 = false">取 消</el-button>
				<el-button type = "primary" @click = "NagNoticeTo()">确 定</el-button>
			</div>
		</el-dialog>
    <!-- 添加导航弹框 -->
		<el-dialog title = "添加链接内容" :visible.sync = "dialogFormVisible11" center>
			<div style = "margin-bottom: 10px;">
				<span style = "width: 200px;display: inline-block;text-align: right;">链接：</span>
				<el-input style = "width:50%;" v-model = "content1" placeholder = "请输入链接"></el-input>
			</div>
			<div slot = "footer" class = "dialog-footer">
				<el-button @click = "dialogFormVisible11 = false">取 消</el-button>
				<el-button type = "primary" @click = "NagNoticeTolianjie()">确 定</el-button>
			</div>
		</el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      size: 10,
      page: 0,
      min: '',
      value: '',
      id: '',
      deployname: 'hongbao',
      activeName: 'first',
      dialogFormVisible: false,
      tableDataLoading: true,
      dialogFormVisible7: false,
      formLabelWidth: '200px',
      tkstatus: 0,
      redStatus: [
        {
          value: 0,
          label: '全部'
        }, {
          value: 1,
          label: '砍价中'
        }, {
          value: 2,
          label: '待提现'
        }, {
          value: 3,
          label: '已提现'
        }, {
          value: 4,
          label: '已过期'
        }
      ],
      form: {
        id: '',
        min: '',
        value: '',
        type: '',
      },
      totalnum: 0,
      tableData: [],
      tableDatajilu: [],
      tableDataWEN: [],
      tableDatalianjie: [],
      dialogFormVisible11: false,
      size1: 10,
      page1: 0,
      size2: 10,
      page2: 0,
      content: '',
      content1: '',
      checkBoxData: [], //多选框选择的值
    }
  },
  methods: {
    handleSizeChange (val) {
      this.size = val
      this.dataSelectJilu()
    },
    handleCurrentChange (val) {
      this.page = val - 1
      this.dataSelectJilu()
    },
    handleSizeChange1 (val) {
      this.size1 = val
      this.dataSelectWenan()
    },
    handleCurrentChange1 (val) {
      this.page1 = val - 1
      this.dataSelectWenan()
    },
    handleSizeChange2 (val) {
      this.size2 = val
      this.dataSelectLianjie()
    },
    handleCurrentChange2 (val) {
      this.page2 = val - 1
      this.dataSelectLianjie()
    },
    handleClick (tab, event) {
      if (tab._props.label == '红包配置') {
        this.dataSelect()
      }
      if (tab._props.label == '红包记录') {
        this.dataSelectJilu()
      }
      if (tab._props.label == '文案列表') {
        this.dataSelectWenan()
      }
      if (tab._props.label == '链接列表') {
        this.dataSelectLianjie()
      }

    },
    // select自动选择
    selectTrigger () {
      this.dataSelectJilu()
    },
    addNavigation7 () {
      this.dialogFormVisible7 = true
    },
    addNavigation11 () {
      this.dialogFormVisible11 = true
    },
    choidelete1 (row) {
      let delid = row.id
      this.$confirm(`确定删除此条信息?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl2(`/storeroom/deleteStoreroomById?id=${delid}`),
          method: 'get',
          params: this.$http.adornData({})
        }).then(({data}) => {
          this.$message({
            message: '删除成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.dataSelectWenan()
            }
          })
        })
      }).catch(() => {
      })
    },
    choidelete2 (row) {
      let delid = row.id
      this.$confirm(`确定删除此条信息?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl2(`/storeroom/deleteStoreroomById?id=${delid}`),
          method: 'get',
          params: this.$http.adornData({})
        }).then(({data}) => {
          this.$message({
            message: '删除成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.dataSelectLianjie()
            }
          })
        })
      }).catch(() => {
      })
    },
    // 重置
    cleans () {
      this.min = ''
      this.dataSelect()
    },
    // 修改弹框
    amend (index, rows) {
      this.dialogFormVisible = true
      this.form.id = rows.id
      this.form.type = rows.type
      this.form.min = rows.min
      this.form.value = rows.value
    },
    // 修改商品类别
    amendNoticeTo () {
      this.$http({
        url: this.$http.adornUrl2('/common/save'),
        method: 'post',
        data: this.$http.adornData({
          id: this.form.id,
          type: this.form.type,
          value: this.form.value,
        }),
      }).then(({data}) => {
        if (data && data.status === 0) {
          this.dialogFormVisible = false
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.dataSelect()
            },
          })
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    NagNoticeTolianjie () {
      if (this.content1 == '') {
        this.$notify({
          title: '提示',
          duration: 1800,
          message: '请输入链接',
          type: 'warning'
        })
        return
      }
      this.$http({
        url: this.$http.adornUrl2('/storeroom/insertStoreroom'),
        method: 'post',
        data: this.$http.adornData({
          'content': this.content1,
          'classify': 2,
        })
      }).then(({data}) => {
        console.log(data)
        this.dialogFormVisible11 = false
        this.$message({
          message: '操作成功',
          type: 'success',
          duration: 1500,
          onClose: () => {
            this.content1 = ''
            this.dataSelectLianjie()
          }
        })
      })
    },
    // 添加文案
    NagNoticeTo () {
      if (this.content == '') {
        this.$notify({
          title: '提示',
          duration: 1800,
          message: '请输入内容',
          type: 'warning'
        })
        return
      }
      this.$http({
        url: this.$http.adornUrl2('/storeroom/insertStoreroom'),
        method: 'post',
        data: this.$http.adornData({
          'content': this.content,
          'classify': 1,
        })
      }).then(({data}) => {
        console.log(data)
        this.dialogFormVisible7 = false
        this.$message({
          message: '操作成功',
          type: 'success',
          duration: 1500,
          onClose: () => {
            this.content = ''
            this.dataSelectWenan()
          }
        })
      })
    },
    // 获取红包配置数据列表
    dataSelect () {
      this.tableDataLoading = true
      this.$http({
        url: this.$http.adornUrl2(`/common/type/condition/hongbao`),
        method: 'get',
        params: this.$http.adornParams({
          page: this.page,
          size: this.size,
        }),
      }).then(({data}) => {
        if (data && data.status === 0) {
          this.tableDataLoading = false
          let returnData = data.data
          this.tableData = returnData
        }
      })
    },
    // 获取红包记录数据列表
    dataSelectJilu () {
      this.tableDataLoading = true
      this.$http({
        url: this.$http.adornUrl2(`/redPacket/selectRedPacketList`),
        method: 'get',
        params: this.$http.adornParams({
          page: this.page,
          size: this.size,
          status: this.tkstatus,
        }),
      }).then(({data}) => {
        if (data && data.status === 0) {
          this.tableDataLoading = false
          let returnDataJilu = data.data.data.content
          this.totalnum = data.data.data.totalElements
          this.tableDatajilu = returnDataJilu
        }
      })
    },

    // 获取红包dataSelectWenan数据列表
    dataSelectWenan () {
      this.tableDataLoading = true
      this.$http({
        url: this.$http.adornUrl2(`/storeroom/selectStoreroomListByClassify`),
        method: 'get',
        params: this.$http.adornParams({
          page: this.page1,
          size: this.size1,
          classify: 1,
          content: ''
        }),
      }).then(({data}) => {
        if (data && data.status === 0) {
          this.tableDataLoading = false
          let returnDataWa = data.data.content
          this.totalnum = data.data.totalElements
          this.tableDataWEN = returnDataWa
        }
      })
    },
    dataSelectLianjie () {
      this.tableDataLoading = true
      this.$http({
        url: this.$http.adornUrl2(`/storeroom/selectStoreroomListByClassify`),
        method: 'get',
        params: this.$http.adornParams({
          page: this.page2,
          size: this.size2,
          classify: 2,
          content: ''
        }),
      }).then(({data}) => {
        if (data && data.status === 0) {
          this.tableDataLoading = false
          let returnDataLj = data.data.content
          this.totalnum = data.data.totalElements
          this.tableDatalianjie = returnDataLj
        }
      })
    },
  },
  mounted () {
    this.dataSelect()
  },
}
</script>

<style scoped = "scoped">
.eit {
  height: 120px;
}
</style>
