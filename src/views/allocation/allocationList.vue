<template>
	<div>
		<el-tabs v-model = "activeName" @tab-click = "handleClick">
			<el-tab-pane label = "系统配置" name = "first">
				<el-table v-loading = "tableDataLoading" :data = "tableData">
					<el-table-column fixed prop = "type" label = "编号" align = "center" width = "80">
					</el-table-column>
					<el-table-column prop = "min" label = "类型">
					</el-table-column>
					<el-table-column prop = "value" label = "内容" width = "500">
					</el-table-column>
					<el-table-column prop = "createAt" label = "创建时间">
					</el-table-column>
					<el-table-column label = "操作" prop = "id" width = "120">
						<template slot-scope = "scope">
							<el-button size = "mini" type = "primary" :disabled = "!isAuth('allocationList:update')"
                         @click = "amend(scope.$index, scope.row)">编辑
							</el-button>
						</template>
					</el-table-column>
				</el-table>

			</el-tab-pane>
			<el-tab-pane label = "淘宝配置" name = "second">
				<el-table v-loading = "tableDataLoading" :data = "tableData">
					<el-table-column fixed prop = "type" label = "编号" align = "center" width = "80"></el-table-column>
					<el-table-column prop = "min" label = "类型"></el-table-column>
					<el-table-column prop = "value" label = "内容" width = "500"></el-table-column>
					<el-table-column prop = "createAt" label = "更新时间"></el-table-column>
					<el-table-column label = "操作" prop = "id" width = "150">
						<template slot-scope = "scope">
              <el-button v-if = "scope.row.type == 131" size = "mini" type = "primary" :disabled = "!isAuth('allocationList:update')"
                         @click = "getSession(scope.$index, scope.row)">获取
							</el-button>
							<el-button size = "mini" type = "primary" :disabled = "!isAuth('allocationList:update')"
                         @click = "amend(scope.$index, scope.row)">编辑
							</el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-tab-pane>
			<el-tab-pane label = "拼多多配置" name = "third">
				<el-table v-loading = "tableDataLoading" :data = "tableData">
					<el-table-column fixed prop = "type" label = "编号" align = "center" width = "80">
					</el-table-column>
					<el-table-column prop = "min" label = "类型">
					</el-table-column>
					<el-table-column prop = "value" label = "内容" width = "500">
					</el-table-column>
					<el-table-column prop = "createAt" label = "更新时间">
					</el-table-column>
					<el-table-column label = "操作" prop = "id" width = "120">
						<template slot-scope = "scope">
							<el-button size = "mini" type = "primary" :disabled = "!isAuth('allocationList:update')"
                         @click = "amend(scope.$index, scope.row)">编辑
							</el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-tab-pane>
			<el-tab-pane label = "京东配置" name = "fourth">
				<el-table v-loading = "tableDataLoading" :data = "tableData">
					<el-table-column fixed prop = "type" label = "编号" align = "center" width = "80">
					</el-table-column>
					<el-table-column prop = "min" label = "类型">
					</el-table-column>
					<el-table-column prop = "value" label = "内容" width = "500">
					</el-table-column>
					<el-table-column prop = "createAt" label = "更新时间">
					</el-table-column>
					<el-table-column label = "操作" prop = "id" width = "120">
						<template slot-scope = "scope">
							<el-button size = "mini" type = "primary" :disabled = "!isAuth('allocationList:update')"
                         @click = "amend(scope.$index, scope.row)">编辑
							</el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-tab-pane>
      <el-tab-pane label = "美团配置" name = "meituan">
				<el-table v-loading = "tableDataLoading" :data = "tableData">
					<el-table-column fixed prop = "type" label = "编号" align = "center" width = "80">
					</el-table-column>
					<el-table-column prop = "min" label = "类型">
					</el-table-column>
					<el-table-column prop = "value" label = "内容" width = "500">
					</el-table-column>
					<el-table-column prop = "createAt" label = "更新时间">
					</el-table-column>
					<el-table-column label = "操作" prop = "id" width = "120">
						<template slot-scope = "scope">
							<el-button size = "mini" type = "primary" :disabled = "!isAuth('allocationList:update')"
                         @click = "amend(scope.$index, scope.row)">编辑
							</el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-tab-pane>
			<el-tab-pane label = "饿了么配置" name = "elm">
				<el-table v-loading = "tableDataLoading" :data = "tableData">
					<el-table-column fixed prop = "type" label = "编号" align = "center" width = "80">
					</el-table-column>
					<el-table-column prop = "min" label = "类型">
					</el-table-column>
					<el-table-column prop = "value" label = "内容" width = "500">
					</el-table-column>
					<el-table-column prop = "createAt" label = "更新时间">
					</el-table-column>
					<el-table-column label = "操作" prop = "id" width = "120">
						<template slot-scope = "scope">
							<el-button size = "mini" type = "primary" :disabled = "!isAuth('allocationList:update')"
                         @click = "amend(scope.$index, scope.row)">编辑
							</el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-tab-pane>
      <el-tab-pane label = "多麦配置" name = "dm">
				<el-table v-loading = "tableDataLoading" :data = "tableData">
					<el-table-column fixed prop = "type" label = "编号" align = "center" width = "80">
					</el-table-column>
					<el-table-column prop = "min" label = "类型">
					</el-table-column>
					<el-table-column prop = "value" label = "内容" width = "500">
					</el-table-column>
					<el-table-column prop = "createAt" label = "更新时间">
					</el-table-column>
					<el-table-column label = "操作" prop = "id" width = "120">
						<template slot-scope = "scope">
							<el-button size = "mini" type = "primary" :disabled = "!isAuth('allocationList:update')"
                         @click = "amend(scope.$index, scope.row)">编辑
							</el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-tab-pane>
			<el-tab-pane label = "佣金配置" name = "fifth">
				<el-table v-loading = "tableDataLoading" :data = "tableData">
					<el-table-column fixed prop = "type" label = "编号" align = "center" width = "80">
					</el-table-column>
					<el-table-column prop = "min" label = "类型">
					</el-table-column>
					<el-table-column prop = "value" label = "内容" width = "500">
					</el-table-column>
					<el-table-column prop = "createAt" label = "更新时间">
					</el-table-column>
					<el-table-column label = "操作" prop = "id" width = "120">
						<template slot-scope = "scope">
							<el-button size = "mini" type = "primary" :disabled = "!isAuth('allocationList:update')"
                         @click = "amend(scope.$index, scope.row)">编辑
							</el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-tab-pane>
			<el-tab-pane label = "微信配置" name = "sixth">
				<el-table v-loading = "tableDataLoading" :data = "tableData">
					<el-table-column fixed prop = "type" label = "编号" align = "center" width = "80">
					</el-table-column>
					<el-table-column prop = "min" label = "类型">
					</el-table-column>
					<el-table-column prop = "value" label = "内容" width = "500">
					</el-table-column>
					<el-table-column prop = "createAt" label = "更新时间">
					</el-table-column>
					<el-table-column label = "操作" prop = "id" width = "120">
						<template slot-scope = "scope">
							<el-button size = "mini" type = "primary" :disabled = "!isAuth('allocationList:update')"
                         @click = "amend(scope.$index, scope.row)">编辑
							</el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-tab-pane>
      <el-tab-pane label = "公众号模板配置" name = "sixths">
        <el-table v-loading = "tableDataLoading" :data = "tableData">
          <el-table-column fixed prop = "type" label = "编号" align = "center" width = "80">
          </el-table-column>
          <el-table-column prop = "min" label = "类型">
          </el-table-column>
          <el-table-column prop = "value" label = "内容" width = "500">
          </el-table-column>
          <el-table-column prop = "createAt" label = "更新时间">
          </el-table-column>
          <el-table-column label = "操作" prop = "id" width = "120">
            <template slot-scope = "scope">
              <el-button size = "mini" type = "primary" :disabled = "!isAuth('allocationList:update')"
                         @click = "amend(scope.$index, scope.row)">编辑
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
			<el-tab-pane label = "支付宝配置" name = "seventh">
				<el-table v-loading = "tableDataLoading" :data = "tableData">
					<el-table-column fixed prop = "type" label = "编号" align = "center" width = "80">
					</el-table-column>
					<el-table-column prop = "min" label = "类型">
					</el-table-column>
					<el-table-column prop = "value" label = "内容" width = "500">
					</el-table-column>
					<el-table-column prop = "createAt" label = "更新时间">
					</el-table-column>
					<el-table-column label = "操作" prop = "id" width = "120">
						<template slot-scope = "scope">
							<el-button size = "mini" type = "primary" :disabled = "!isAuth('allocationList:update')"
                         @click = "amend(scope.$index, scope.row)">编辑
							</el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-tab-pane>
			<el-tab-pane label = "短信配置" name = "eighth">
				<el-table v-loading = "tableDataLoading" :data = "tableData">
					<el-table-column fixed prop = "type" label = "编号" align = "center" width = "80">
					</el-table-column>
					<el-table-column prop = "min" label = "类型">
					</el-table-column>
					<el-table-column prop = "value" label = "内容" width = "500">
					</el-table-column>
					<el-table-column prop = "createAt" label = "更新时间">
					</el-table-column>
					<el-table-column label = "操作" prop = "id" width = "120">
						<template slot-scope = "scope">
							<el-button size = "mini" type = "primary" :disabled = "!isAuth('allocationList:update')"
                         @click = "amend(scope.$index, scope.row)">编辑
							</el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-tab-pane>
			<el-tab-pane label = "任务大厅配置" name = "ninth">
				<el-table v-loading = "tableDataLoading" :data = "tableData">
					<el-table-column fixed prop = "type" label = "编号" align = "center" width = "80">
					</el-table-column>
					<el-table-column prop = "min" label = "类型">
					</el-table-column>
					<el-table-column prop = "value" label = "内容" width = "500">
					</el-table-column>
					<el-table-column prop = "createAt" label = "更新时间">
					</el-table-column>
					<el-table-column label = "操作" prop = "id" width = "120">
						<template slot-scope = "scope">
							<el-button size = "mini" type = "primary" :disabled = "!isAuth('allocationList:update')"
                         @click = "amend(scope.$index, scope.row)">编辑
							</el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-tab-pane>
      <el-tab-pane label = "APP消息推送配置" name = "tenth">
        <el-table v-loading = "tableDataLoading" :data = "tableData">
          <el-table-column fixed prop = "type" label = "编号" align = "center" width = "80">
          </el-table-column>
          <el-table-column prop = "min" label = "类型">
          </el-table-column>
          <el-table-column prop = "value" label = "内容" width = "500">
          </el-table-column>
          <el-table-column prop = "createAt" label = "更新时间">
          </el-table-column>
          <el-table-column label = "操作" prop = "id" width = "120">
            <template slot-scope = "scope">
              <el-button size = "mini" type = "primary" :disabled = "!isAuth('allocationList:update')"
                         @click = "amend(scope.$index, scope.row)">编辑
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label = "文件上传配置" name = "tenths">
        <el-table v-loading = "tableDataLoading" :data = "tableData">
          <el-table-column fixed prop = "type" label = "编号" align = "center" width = "80">
          </el-table-column>
          <el-table-column prop = "min" label = "类型">
          </el-table-column>
          <el-table-column prop = "value" label = "内容" width = "500">
          </el-table-column>
          <el-table-column prop = "createAt" label = "更新时间">
          </el-table-column>
          <el-table-column label = "操作" prop = "id" width = "120">
            <template slot-scope = "scope">
              <el-button size = "mini" type = "primary" :disabled = "!isAuth('allocationList:update')"
                         @click = "amend(scope.$index, scope.row)">编辑
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label = "酷点支付配置" name = "kudian">
        <el-table v-loading = "tableDataLoading" :data = "tableData">
          <el-table-column fixed prop = "type" label = "编号" align = "center" width = "80">
          </el-table-column>
          <el-table-column prop = "min" label = "类型">
          </el-table-column>
          <el-table-column prop = "value" label = "内容" width = "500">
          </el-table-column>
          <el-table-column prop = "createAt" label = "更新时间">
          </el-table-column>
          <el-table-column label = "操作" prop = "id" width = "120">
            <template slot-scope = "scope">
              <el-button size = "mini" type = "primary" :disabled = "!isAuth('allocationList:update')"
                         @click = "amend(scope.$index, scope.row)">编辑
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
		</el-tabs>
    <!-- 修改弹框 -->
		<el-dialog title = "修改" :visible.sync = "dialogFormVisible" center>
			<el-form :model = "form">
			  <el-form-item label = "配置类型：" :label-width = "formLabelWidth">
				<el-input v-model = "form.min" style = "width:65%;" readonly></el-input>
			  </el-form-item>
			  <el-form-item label = "内容：" :label-width = "formLabelWidth">
				<el-input v-model = "form.value" style = "width:65%;"></el-input>
			  </el-form-item>
			</el-form>
		  <div slot = "footer" class = "dialog-footer">
			<el-button @click = "dialogFormVisible = false">取 消</el-button>
			<el-button type = "primary" @click = "amendNoticeTo()">确 定</el-button>
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
          deployname: 'xitong',
          activeName: 'first',
          dialogFormVisible: false,
          tableDataLoading: true,
          formLabelWidth: '200px',
          form: {
            id: '',
            min: '',
            value: '',
            type: '',
          },
          tableData: [],
          checkBoxData: []   //多选框选择的值
        }
      },
      methods: {
        handleSizeChange (val) {
          this.size = val
          this.dataSelect()
        },
        handleCurrentChange (val) {
          this.page = val - 1
          this.dataSelect()
        },
        handleClick (tab, event) {
          if (tab._props.label == '系统配置') {
            this.deployname = 'xitong'
            this.dataSelect()
          }
          if (tab._props.label == '淘宝配置') {
            this.deployname = 'taobao'
            this.dataSelect()
          }
          if (tab._props.label == '拼多多配置') {
            this.deployname = 'pingduoduo'
            this.dataSelect()
          }
          if (tab._props.label == '京东配置') {
            this.deployname = 'jingdong'
            this.dataSelect()
          }
          if (tab._props.label == '美团配置') {
            this.deployname = 'meituan'
            this.dataSelect()
          }
          if (tab._props.label == '饿了么配置') {
            this.deployname = 'elm'
            this.dataSelect()
          }
          if (tab._props.label == '多麦配置') {
            this.deployname = 'dm'
            this.dataSelect()
          }
          if (tab._props.label == '佣金配置') {
            this.deployname = 'yongjing'
            this.dataSelect()
          }
          if (tab._props.label == '微信配置') {
            this.deployname = 'weixin'
            this.dataSelect()
          }
          if (tab._props.label == '公众号模板配置') {
            this.deployname = 'xiaoxi'
            this.dataSelect()
          }
          if (tab._props.label == '支付宝配置') {
            this.deployname = 'zhifubao'
            this.dataSelect()
          }
          if (tab._props.label == '短信配置') {
            this.deployname = 'duanxin'
            this.dataSelect()
          }
          if (tab._props.label == '任务大厅配置') {
            this.deployname = 'renwu'
            this.dataSelect()
          }
          if (tab._props.label == 'APP消息推送配置') {
            this.deployname = 'push'
            this.dataSelect()
          }
          if (tab._props.label == '文件上传配置') {
            this.deployname = 'oss'
            this.dataSelect()
          }
          if (tab._props.label == '酷点支付配置') {
            this.deployname = 'kudian'
            this.dataSelect()
          }
        },
        // 重置
        cleans () {
          this.min = ''
          this.dataSelect()
        },
        //获取session
        getSession () {
          this.$http({
            url: this.$http.adornUrl2(`common/type/6`),
            method: 'get',
            params: this.$http.adornParams({})
          }).then(({data}) => {
            let id = data.data.value
            // window.location.href = 'https://oauth.taobao.com/authorize?response_type=token&client_id=' + id + '&state=1212&view=web'
            window.open('https://oauth.taobao.com/authorize?response_type=token&client_id=' + id + '&state=1212&view=web')
          })
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
              'id': this.form.id,
              'type': this.form.type,
              'value': this.form.value,
            })
          }).then(({data}) => {
            if (data && data.status === 0) {
              this.dialogFormVisible = false
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.dataSelect()
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        },
        // 获取数据列表
        dataSelect () {
          this.tableDataLoading = true
          this.$http({
            url: this.$http.adornUrl2(`/common/type/condition/${this.deployname}`),
            method: 'get',
            params: this.$http.adornParams({
              'page': this.page,
              'size': this.size
            })
          }).then(({data}) => {
            if (data && data.status === 0) {
              this.tableDataLoading = false
              let returnData = data.data
              this.tableData = returnData
            }
          })
        },
      },
      mounted () {
        this.dataSelect()
      }
    }
</script>

<style scoped = "scoped">
  .eit {
    height: 120px;
  }
</style>
