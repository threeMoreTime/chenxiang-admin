<template>
  <el-tabs v-model = "activeName" @tab-click = "handleClick">
    <el-tab-pane label = "分类管理" name = "first">
		<div style = "float: right;margin-right:2%;">
		  <el-button style = "margin: 10px 0;" :disabled = "!isAuth('materialsList:add')" size = "mini" type = "primary" icon = "document"
                 @click = "addNotice">添加分类</el-button>
		</div>
		<el-table v-loading = "tableDataLoading" :data = "tableData">
		  <el-table-column prop = "id" label = "编号" width = "80">
		   </el-table-column>
		 <el-table-column prop = "classifyName" label = "分类名称">
		  </el-table-column>
		  <el-table-column prop = "remark" label = "备注">
		   </el-table-column>
		  <el-table-column prop = "createTime" label = "创建时间">
		  </el-table-column>
		  <el-table-column label = "操作" width = "150">
		    <template slot-scope = "scope">
		      <el-button size = "mini" type = "primary" :disabled = "!isAuth('materialsList:update')"
                     @click = "updates(scope.$index, scope.row)">编辑
		      </el-button>
		      <el-button size = "mini" type = "danger" :disabled = "!isAuth('materialsList:delete')" @click = "deletes(scope.row)">删除
		      </el-button>
		    </template>
		  </el-table-column>
		</el-table>
		<div style = "text-align: center;margin-top: 10px;">
		  <el-pagination @size-change = "handleSizeChange" @current-change = "handleCurrentChange" :page-sizes = "[5, 10, 15, 20]"
                     :page-size = "size" :current-page = "page" layout = "total,sizes, prev, pager, next,jumper"
                     :total = "tableData.length">
		  </el-pagination>
		</div>
      <!-- 添加弹框 -->
		<el-dialog title = "添加分类" :visible.sync = "dialogFormVisible" center>
			<div style = "margin-bottom: 10px;">
				<span style = "width: 200px;display: inline-block;text-align: right;">分类名称：</span>
				<el-input style = "width:50%;" v-model = "classifyName" placeholder = "请输入分类名称"></el-input>
			</div>
			<div style = "margin-bottom: 10px;">
				<span style = "width: 200px;display: inline-block;text-align: right;">备注：</span>
				<el-input style = "width: 50%;" v-model = "remark" placeholder = "请输入备注"></el-input>
			</div>
		  <div slot = "footer" class = "dialog-footer">
		    <el-button @click = "dialogFormVisible = false">取 消</el-button>
		    <el-button type = "primary" @click = "releasNoticeTo()">确 定</el-button>
		  </div>
		</el-dialog>
      <!-- 修改弹框 -->
		<el-dialog title = "修改分类" :visible.sync = "dialogFormVisible1" center>
			<el-form :model = "form">
			  <el-form-item label = "分类名称：" :label-width = "formLabelWidth">
			    <el-input v-model = "form.classifyName" style = "width:65%;"></el-input>
			  </el-form-item>
			  <el-form-item label = "备注：" :label-width = "formLabelWidth">
			    <el-input v-model = "form.remark" style = "width:65%;"></el-input>
			  </el-form-item>
			</el-form>
		  <div slot = "footer" class = "dialog-footer">
		    <el-button @click = "dialogFormVisible1 = false">取 消</el-button>
		    <el-button type = "primary" @click = "amendNoticeTo()">确 定</el-button>
		  </div>
		</el-dialog>
	</el-tab-pane>
    <el-tab-pane label = "文章管理" name = "second">
		<div style = "float: right;margin-right:2%;">
		  <el-button style = "margin: 10px 0;height:35px;" :disabled = "!isAuth('materialsList:add')" size = "mini" type = "primary"
                 icon = "document" @click = "addNoticewz">添加文章</el-button>&nbsp;&nbsp;&nbsp;&nbsp;
		  <el-select v-model = "classifyId" placeholder = "请选择类型" style = "width:150px;" @change = "articleSelect(classifyId)">
		    <el-option v-for = "(item,index) in classifyIds" :key = "item.index" :label = "item.classifyName" :value = "item.id">
		    </el-option>
		  </el-select>
		</div>
		<el-table v-loading = "tableDataLoading" :data = "tableData">
		<el-table-column prop = "id" label = "编号" width = "80">
		 </el-table-column>
		 <el-table-column prop = "title" label = "标题" width = "120">
		  </el-table-column>
		  <el-table-column prop = "articleUrl" label = "链接">
		   </el-table-column>
		   <el-table-column prop = "picture" label = "图片">
			 <template slot-scope = "scope">
				 <img :src = "scope.row.picture" alt = "" width = "60" height = "60">
			 </template>
			</el-table-column>
			<el-table-column prop = "content" label = "内容">
			 </el-table-column>
		  <el-table-column prop = "createTime" label = "创建时间" width = "160">
		  </el-table-column>
		  <el-table-column label = "操作" width = "150">
			<template slot-scope = "scope">
			  <el-button size = "mini" type = "primary" :disabled = "!isAuth('materialsList:update')"
                   @click = "updateswz(scope.$index, scope.row)">编辑
			  </el-button>
			  <el-button size = "mini" type = "danger" :disabled = "!isAuth('materialsList:delete')" @click = "deleteswz(scope.row)">删除
			  </el-button>
			</template>
		  </el-table-column>
		</el-table>
		<div style = "text-align: center;margin-top: 10px;">
		  <el-pagination @size-change = "handleSizeChange" @current-change = "handleCurrentChange" :page-sizes = "[5, 10, 15, 20]"
                     :page-size = "size" :current-page = "page" layout = "total,sizes, prev, pager, next,jumper"
                     :total = "tableData.length">
		  </el-pagination>
		</div>
      <!-- 添加弹框 -->
		<el-dialog title = "添加文章" :visible.sync = "dialogFormVisible2" center>
			<div style = "margin-bottom: 10px;display: flex;">
				<span style = "width: 200px;display: inline-block;text-align: right;">文章图片：</span>
				<div style = " width:148px;height:148px;border: 1px dashed #c0ccda;border-radius: 6px;text-align: center;line-height: 148px;">
					<el-upload class = "avatar-uploader" v-model = "picture" action = "https://sqx.gomyorder.cn/tao/alioss/upload"
                     :show-file-list = "false" :on-success = "handleAvatarSuccess">
						<img v-if = "picture" :src = "picture" class = "avatar" style = "border-radius: 6px;width: 148px;height: 148px;"/>
						<i v-else class = "el-icon-plus avatar-uploader-icon"></i>
					</el-upload>
				</div>
			</div>
			<div style = "margin-bottom: 10px;">
				<span style = "width: 200px;display: inline-block;text-align: right;">文章标题：</span>
				<el-input style = "width: 50%;" v-model = "title" placeholder = "请输入文章标题"></el-input>
			</div>
			<div style = "margin-bottom: 10px;">
				<span style = "width: 200px;display: inline-block;text-align: right;">跳转链接：</span>
				<el-input style = "width: 50%;" v-model = "articleUrl" placeholder = "请输入跳转链接"></el-input>
			</div>
			<div style = "margin-bottom: 10px;p">
				<span style = "width: 200px;display: inline-block;text-align: right;position: relative;top: -65px;">文章内容：</span>
				<el-input style = "width: 50%;" type = "textarea" rows = "4" v-model = "content" placeholder = "请输入内容"></el-input>
			</div>
		  <div slot = "footer" class = "dialog-footer">
		    <el-button @click = "dialogFormVisible2 = false">取 消</el-button>
		    <el-button type = "primary" @click = "releasNoticeTowz()">确 定</el-button>
		  </div>
		</el-dialog>
      <!-- 修改弹框 -->
		<el-dialog title = "修改文章" :visible.sync = "dialogFormVisible3" center>
			<el-form :model = "form">
				<el-form-item label = "文章图片：" :label-width = "formLabelWidth">
				 <div style = " width:148px;height:148px;border: 1px dashed #c0ccda;border-radius: 6px;text-align: center;line-height: 148px;">
				 	<el-upload class = "avatar-uploader" v-model = "picture" action = "https://sqx.gomyorder.cn/tao/alioss/upload"
                     :show-file-list = "false" :on-success = "handleAvatarSuccess2">
				 		<img v-if = "formwz.picture" :src = "formwz.picture" class = "avatar" style = "border-radius: 6px;width: 148px;height: 148px;"/>
				 		<i v-else class = "el-icon-plus avatar-uploader-icon"></i>
				 	</el-upload>
				 </div>
				</el-form-item>
			  <el-form-item label = "文章标题：" :label-width = "formLabelWidth">
			    <el-input v-model = "formwz.title" style = "width:65%;"></el-input>
			  </el-form-item>
			  <el-form-item label = "跳转链接：" :label-width = "formLabelWidth">
			    <el-input v-model = "formwz.articleUrl" style = "width:65%;"></el-input>
			  </el-form-item>
			  <el-form-item label = "文章内容：" :label-width = "formLabelWidth">
			    <el-input type = "textarea" rows = "4" v-model = "formwz.content" style = "width:65%;"></el-input>
			  </el-form-item>
			</el-form>
		  <div slot = "footer" class = "dialog-footer">
		    <el-button @click = "dialogFormVisible3 = false">取 消</el-button>
		    <el-button type = "primary" @click = "amendNoticeTowz()">确 定</el-button>
		  </div>
		</el-dialog>
	</el-tab-pane>
  </el-tabs>
</template>

<script>
	export default {
    data () {
      return {
        size: 10,
        page: 1,
        state: 1,
        sort: 0,
        remark: '',
        createTime: '',
        classifyName: '',
        id: '',
        classifyId: '',
        fenleiId:0,
        classifyIds: [],
        form: {
          id: '',
          state: '',
          sort: '',
          classifyName: '',
          remark: '',
          createTime: ''
        },
        formwz: {
          id: '',
          picture: '',
          articleUrl: '',
          content: '',
          title: '',
          classifyId: '',
          createTime: ''
        },
        info: {
          stockDate: this.getNowTime(),  //日期
        },
        picture: '',
        picture2: '',
        articleUrl: '',
        content: '',
        title: '',
        formLabelWidth: '200px',
        activeName: 'first',
        tableDataLoading: false,
        dialogFormVisible1: false,
        dialogFormVisible: false,
        dialogFormVisible2: false,
        dialogFormVisible3: false,
        tableData: [],
      }
    },
    methods: {
      //处理默认选中当前日期
      getNowTime () {
        var now = new Date()
        var year = now.getFullYear() //得到年份
        var month = now.getMonth() //得到月份
        var date = now.getDate() //得到日期
        var hh = now.getHours() < 10 ? '0' + now.getHours() : now.getHours()
        var mm = now.getMinutes() < 10 ? '0' + now.getMinutes() : now.getMinutes()
        var ss = now.getSeconds() < 10 ? '0' + now.getSeconds() : now.getSeconds()
        month = month + 1
        month = month.toString().padStart(2, '0')
        date = date.toString().padStart(2, '0')
        var defaultDate = `${year}-${month}-${date} ${hh}:${mm}:${ss}`
        return defaultDate
        this.$set(this.info, 'stockDate', defaultDate)
      },
      handleSizeChange (val) {
        this.size = val
        this.dataSelect()
      },
      handleCurrentChange (val) {
        this.page = val
        this.dataSelect()
      },
      handleClick (tab, event) {
        if (tab._props.label == '分类管理') {
          this.dataSelect()
        }
        if (tab._props.label == '文章管理') {
          this.classifyId = this.fenleiId
          this.articleSelect()
        }
      },
      handleAvatarSuccess (file) {
        this.picture = file.data
      },
      handleAvatarSuccess2 (file2) {
        this.formwz.picture = file2.data
      },
      // 添加分类弹框
      addNotice () {
        this.dialogFormVisible = true
      },
      // 添加分类
      releasNoticeTo () {
        if (this.classifyName == '') {
          this.$notify({
            title: '提示',
            duration: 1800,
            message: '请选择分类名称',
            type: 'warning'
          })
          return
        }
        if (this.remark == '') {
          this.$notify({
            title: '提示',
            duration: 1800,
            message: '请选择备注',
            type: 'warning'
          })
          return
        }
        this.$http({
          url: this.$http.adornUrl2('/article/saveArticleClassify'),
          method: 'post',
          data: this.$http.adornData({
            'state': this.state,
            'sort': this.sort,
            'remark': this.remark,
            'classifyName': this.classifyName,
            'createTime': this.info.stockDate,
          })
        }).then(({data}) => {
          this.dialogFormVisible = false
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.dataSelect()
            }
          })
        })
      },
      // 编辑分类弹框
      updates (index, rows) {
        this.form.state = rows.state
        this.form.sort = rows.state
        this.dialogFormVisible1 = true
        this.form.id = rows.id
        this.form.classifyName = rows.classifyName
        this.form.remark = rows.remark
        this.form.createTime = rows.createTime
      },
      // 修改商品类别
      amendNoticeTo () {
        if (this.form.classifyName == '') {
          this.$notify({
            title: '提示',
            duration: 1800,
            message: '请输入分类名称',
            type: 'warning'
          })
          return
        }
        if (this.form.remark == '') {
          this.$notify({
            title: '提示',
            duration: 1800,
            message: '请输入备注',
            type: 'warning'
          })
          return
        }
        this.$http({
          url: this.$http.adornUrl2('/article/saveArticleClassify'),
          method: 'post',
          data: this.$http.adornData({
            'id': this.form.id,
            'state': this.form.state,
            'sort': this.form.sort,
            'classifyName': this.form.classifyName,
            'remark': this.form.remark,
            'createTime': this.info.stockDate,
          })
        }).then(({data}) => {
          this.dialogFormVisible1 = false
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.dataSelect()
            }
          })
        })
      },
      // 删除分类
      deletes (row) {
        let delid = row.id
        this.id = delid
        this.$confirm(`确定删除此条信息?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl2(`/article/deleteArticleClassifyById?articleClassifyId=${this.id}`),
            method: 'post',
            data: this.$http.adornData({})
          }).then(({data}) => {
            this.$message({
              message: '删除成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.name = ''
                this.dataSelect()
              }
            })
          })
        }).catch(() => {
        })
      },
      // 添加文章弹框
      addNoticewz () {
        this.dialogFormVisible2 = true
      },
      // 添加文章
      releasNoticeTowz () {
        if (this.title == '') {
          this.$notify({
            title: '提示',
            duration: 1800,
            message: '请输入文章标题',
            type: 'warning'
          })
          return
        }
        if (this.articleUrl == '') {
          this.$notify({
            title: '提示',
            duration: 1800,
            message: '请输入跳转链接',
            type: 'warning'
          })
          return
        }
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
          url: this.$http.adornUrl2('/article/addArticle'),
          method: 'post',
          data: this.$http.adornData({
            'articleUrl': this.articleUrl,
            'classifyId': this.classifyId,
            'content': this.content,
            'createTime': this.info.stockDate,
            'picture': this.picture,
            'state': this.state,
            'title': this.title,
          })
        }).then(({data}) => {
          this.dialogFormVisible2 = false
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.title = ''
              this.articleUrl = ''
              this.content = ''
              this.picture = ''
              this.articleSelect()
            }
          })
        })
      },
      // 编辑文章弹框
      updateswz (index, rows) {
        this.formwz.picture = rows.picture
        this.dialogFormVisible3 = true
        this.formwz.id = rows.id
        this.formwz.classifyId = rows.classifyId
        this.formwz.articleUrl = rows.articleUrl
        this.formwz.content = rows.content
        this.formwz.title = rows.title
        this.formwz.createTime = rows.createTime
      },
      // 修改商品类别
      amendNoticeTowz () {
        this.$http({
          url: this.$http.adornUrl2('/article/addArticle'),
          method: 'post',
          data: this.$http.adornData({
            'id': this.formwz.id,
            'picture': this.formwz.picture,
            'articleUrl': this.formwz.articleUrl,
            'content': this.formwz.content,
            'classifyId': this.formwz.classifyId,
            'title': this.formwz.title,
            'createTime': this.info.stockDate,
          })
        }).then(({data}) => {
          this.dialogFormVisible3 = false
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.articleSelect()
            }
          })
        })
      },
      // 删除文章
      deleteswz (row) {
        let delid = row.id
        this.id = delid
        this.$confirm(`确定删除此条信息?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl2(`/article/deleteArticle?articleId=${this.id}`),
            method: 'post',
            data: this.$http.adornData({})
          }).then(({data}) => {
            this.$message({
              message: '删除成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.name = ''
                this.articleSelect()
              }
            })
          })
        }).catch(() => {
        })
      },
      // 获取分类管理数据
      dataSelect () {
        this.tableDataLoading = true
        this.$http({
          url: this.$http.adornUrl2('/article/selectArticleClassifyList'),
          method: 'get',
          params: this.$http.adornParams({})
        }).then(({data}) => {
          this.tableDataLoading = false
          let returnData = data.data
          this.tableData = returnData
          this.classifyIds = returnData
          this.fenleiId = returnData[0].id
        })
      },
      // 获取文章管理数据
      articleSelect () {
        this.tableDataLoading = true
        this.$http({
          url: this.$http.adornUrl2('/article/selectArticleList'),
          method: 'get',
          params: this.$http.adornParams({
            'classifyId': this.classifyId
          })
        }).then(({data}) => {
          this.tableDataLoading = false
          let returnData = data.data
          this.tableData = returnData
        })
      },
    },
    mounted () {
      this.dataSelect()
    }
  }
</script>

<style>

</style>
