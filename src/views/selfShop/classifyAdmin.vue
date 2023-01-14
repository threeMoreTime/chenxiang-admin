<template>
  <div>
	  <div style = "float: right;margin-right:2%;">
	    <el-button :disabled = "!isAuth('classifyAdmin:add')" icon = "document" size = "mini" style = "margin: 10px 0;" type = "primary"
                 @click = "addNotice">添加分类</el-button>
	  </div>
	  <el-table v-loading = "tableDataLoading" :data = "typeDatas" row-key = "id">
	    <el-table-column label = "编号" prop = "id" width = "80">
	    </el-table-column>
		 <el-table-column label = "图片" prop = "img">
				<template slot-scope = "scope">
					<img :src = "scope.row.img" alt = "" height = "40" width = "40">
				</template>
		  </el-table-column>
	   <el-table-column label = "名称" prop = "name">
	    </el-table-column>
		<el-table-column label = "排序号" prop = "sort">
		 </el-table-column>
	    <el-table-column label = "创建时间" prop = "createAt">
	    </el-table-column>
	    <el-table-column label = "操作" width = "180">
	      <template slot-scope = "scope">
	        <el-button :disabled = "!isAuth('classifyAdmin:update')" size = "mini" type = "primary"
                     @click = "updates(scope.$index, scope.row)">修改
	        </el-button>
	        <el-button :disabled = "!isAuth('classifyAdmin:delete')" size = "mini" type = "danger" @click = "deletes(scope.row)">删除
	        </el-button>
	      </template>
	    </el-table-column>
	  </el-table>
    <!-- 添加分类 -->
	  <el-dialog :visible.sync = "dialogFormVisible" center title = "添加分类">
		<div style = "margin-bottom: 10px;">
			<span style = "width: 200px;display: inline-block;text-align: right;">选择分类：</span>
			<el-select v-model = "parentIdnum" placeholder = "请选择分类" style = "width:50%;">
			  <el-option v-for = "item in classnum" :key = "item.value" :label = "item.label" :value = "item.value">
			  </el-option>
			</el-select>
		</div>
		<div v-if = "parentIdnum==1" style = "margin-bottom: 10px;">
			<span style = "width: 200px;display: inline-block;text-align: right;">上级分类：</span>
			<el-cascader v-model = "value" :change-on-select = "true" :options = "classDatas" :props = "{ expandTrigger: 'hover' }" :show-all-levels = "false"
                   style = "width:50%;" @change = "handleChange">
			</el-cascader>
		</div>
		<div style = "margin-bottom: 10px;">
			<span style = "width: 200px;display: inline-block;text-align: right;">分类名称：</span>
			<el-input v-model = "name" placeholder = "请输入分类名称" style = "width:50%;"></el-input>
		</div>
		<div style = "margin-bottom: 10px;">
			<span style = "width: 200px;display: inline-block;text-align: right;">排序号：</span>
			<el-input v-model = "sort" placeholder = "请输入排序号" type="number" min="0" style = "width:50%;"></el-input>
		</div>
		<div style = "margin-bottom: 10px;display:flex;">
			<span style = "width: 200px;display: inline-block;text-align: right;">分类图标：</span>
			<div style = " width:148px;height:148px;border: 1px dashed #c0ccda;border-radius: 6px;text-align: center;line-height: 148px;">
				<el-upload v-model = "img" :on-success = "handleAvatarSuccess" :show-file-list = "false" action = "https://sqx.gomyorder.cn/tao/alioss/upload"
                   class = "avatar-uploader">
					<img v-if = "img" :src = "img" class = "avatar" style = "border-radius: 6px;width: 148px;height: 148px;"/>
					<i v-else class = "el-icon-plus avatar-uploader-icon"></i>
				</el-upload>
			</div>
		</div>
	    <div slot = "footer" class = "dialog-footer">
	      <el-button @click = "dialogFormVisible = false">取 消</el-button>
	      <el-button type = "primary" @click = "releasNoticeTo()">确 定</el-button>
	    </div>
	  </el-dialog>
    <!-- 修改分类 -->
	  <el-dialog :visible.sync = "dialogFormVisible1" center title = "修改分类">
	  	<el-form :model = "form">
	  	  <el-form-item :label-width = "formLabelWidth" label = "分类名称：">
	  	    <el-input v-model = "form.name" placeholder = "请输入分类名称" style = "width:65%;"></el-input>
	  	  </el-form-item>
		  <el-form-item :label-width = "formLabelWidth" label = "排序号：">
		    <el-input v-model = "form.sort" placeholder = "请输入排序号" type="number" min="0" style = "width:65%;"></el-input>
		  </el-form-item>
		  <el-form-item :label-width = "formLabelWidth" label = "图标：">
		  	<div style = " width:148px;height:148px;border: 1px dashed #c0ccda;border-radius: 6px;text-align: center;line-height: 148px;">
		  		<el-upload v-model = "form.img" :on-success = "handleAvatarSuccess2" :show-file-list = "false"
                     action = "https://sqx.gomyorder.cn/tao/alioss/upload" class = "avatar-uploader">
		  			<img v-if = "form.img" :src = "form.img" class = "avatar" style = "border-radius: 6px;width: 148px;height: 148px;"/>
		  			<i v-else class = "el-icon-plus avatar-uploader-icon"></i>
		  		</el-upload>
		  	</div>
		  </el-form-item>
	  	</el-form>
	    <div slot = "footer" class = "dialog-footer">
	      <el-button @click = "dialogFormVisible1 = false">取 消</el-button>
	      <el-button type = "primary" @click = "amendNoticeTo()">确 定</el-button>
	    </div>
	  </el-dialog>
  </div>
</template>

<script>
	export default {
    data () {
      return {
        size: 5,
        page: 1,
        name: '',
        sort: '',
        img: '',
        classn: '',
        value: [],
        parentId: 0,
        parentIdnum: '',
        form: {
          id: '',
          name: '',
          img: '',
          parentId: '',
          sort: ''
        },
        classnum: [
          {
            value: '0',
            label: '一级分类'
          },
          {
            value: '1',
            label: '二级分类'
          }
        ],
        formLabelWidth: '200px',
        tableDataLoading: false,
        dialogFormVisible1: false,
        dialogFormVisible: false,
        typeDatas: [],
        classDatas: []
      }
    },
    methods: {
      // 图标上传
      handleAvatarSuccess (file) {
        this.img = file.data
      },
      // 图标上传
      handleAvatarSuccess2 (file) {
        this.form.img = file.data
      },
      handleChange (value) {
        this.value.forEach(element => {
          this.parentId = element
        })
      },
      // 添加分类弹框
      addNotice () {
        this.dialogFormVisible = true
        this.classSelect()
      },
      // 添加分类
      releasNoticeTo () {
        if (this.name == '') {
          this.$notify({
            title: '提示',
            duration: 1800,
            message: '请输入分类名称',
            type: 'warning'
          })
          return
        }
        if (this.img == '') {
          this.$notify({
            title: '提示',
            duration: 1800,
            message: '请上传图片',
            type: 'warning'
          })
          return
        }
        this.$http({
          url: this.$http.adornUrl2('/goodsType/save'),
          method: 'post',
          data: this.$http.adornData({
            'parentId': this.parentId,
            'name': this.name,
            'img': this.img,
            'sort': this.sort
          })
        }).then(({data}) => {
          this.dialogFormVisible = false
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.name = ''
              this.img = ''
              this.parentId = 0
              this.parentIdnum = ''
              this.dataSelect()
            }
          })
        })
      },
      // 修改弹框
      updates (index, rows) {
        this.dialogFormVisible1 = true
        this.form.id = rows.id
        this.form.name = rows.name
        this.form.parentId = rows.parentId
        this.form.sort = rows.sort
        this.form.createAt = rows.createAt
        this.form.img = rows.img
      },
      // 修改商品类别
      amendNoticeTo () {
        this.$http({
          url: this.$http.adornUrl2('/goodsType/save'),
          method: 'post',
          data: this.$http.adornData({
            'id': this.form.id,
            'name': this.form.name,
            'img': this.form.img,
            'parentId': this.form.parentId,
            'createAt': this.form.createAt,
            'sort': this.form.sort

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
        if (row.children == null || row.children.length == 0) {
          this.$confirm(`确定删除此条信息?`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$http({
              url: this.$http.adornUrl2('/goodsType/delete'),
              method: 'get',
              params: this.$http.adornParams({
                'id': row.id
              })
            }).then(({data}) => {
              this.$message({
                message: '删除成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.dataSelect()
                }
              })
            })
          }).catch(() => {
          })
        } else {
          this.$message({
            message: '请先删除二级分类',
            type: 'error',
            duration: 1500,
          })
          return
        }
      },
      // 获取分类数据
      classSelect () {
        this.tableDataLoading = true
        this.$http({
          url: this.$http.adornUrl2('/goodsType/result1'),
          method: 'get',
          params: this.$http.adornParams({})
        }).then(({data}) => {
          this.tableDataLoading = false
          let returnData = data.data
          this.classDatas = returnData
        })
      },
      // 获取分类数据
      dataSelect () {
        this.tableDataLoading = true
        this.$http({
          url: this.$http.adornUrl2('/goodsType/list'),
          method: 'get',
          params: this.$http.adornParams({})
        }).then(({data}) => {
          this.tableDataLoading = false
          let returnData = data.data
          this.typeDatas = returnData
        })
      }
    },
    mounted () {
      this.dataSelect()
    }
  }
</script>

<style>

</style>
