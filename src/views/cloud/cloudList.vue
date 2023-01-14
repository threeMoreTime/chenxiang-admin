<template>
  <div>
	  <div style="float: right;margin-right:2%;">
	    <el-button style='margin: 10px 0;' :disabled="!isAuth('classifyAdmin:add')" size="mini" type="primary" icon="document" @click="addNotice">启动微信机器人</el-button>
	  </div>
	  <el-table
	  v-loading="tableDataLoading"
	    :data="typeDatas">
	    <el-table-column
	  	 prop="id"
	  	 label="id">
	     </el-table-column>
	   <el-table-column
	  	prop="name"
	  	label="微信名称">
	    </el-table-column>
	    <el-table-column
	      label="操作"
	  	width="320">
	      <template slot-scope="scope">
	        <el-button
	          size="mini"
	          type="primary"
				:disabled="!isAuth('classifyAdmin:update')"
	          @click="cloudTask(scope.row)">任务定时器
	        </el-button>
	        <el-button
	          size="mini"
	          type="primary"
				:disabled="!isAuth('classifyAdmin:delete')"
	          @click="closeRobot(scope.row)">关闭微信机器人
	        </el-button>
	      </template>
	    </el-table-column>
	  </el-table>
	  <el-dialog customClass="cloudWidth"   title="扫码启动微信机器人" :visible.sync="dialogFormVisible1" center>
	  	<el-form :model="form">
	  	  <el-form-item  style="text-align: center;">
			<img :src="form.img" alt="" width="230" height="230">
	  	  </el-form-item>
	  	</el-form>
		<div slot="footer" class="dialog-footer">
		  <el-button @click="dialogFormVisible1 = false">取 消</el-button>
		  <el-button type="primary" @click="amendNoticeTo()">确 定</el-button>
		</div>
	  </el-dialog>
  </div>
</template>

<script>
	export default {
	    data() {
	      return {
				size:5,
				page:1,
				img:'',
				form:{
					id:'',
					img:''
				},
				formLabelWidth:'200px',
				tableDataLoading:false,
				dialogFormVisible1:false,
				dialogFormVisible:false,
				typeDatas:[],
			}
		},
		methods: {
			// 启动微信机器人
			addNotice(){
				this.$http({
				  url: this.$http.adornUrl('/weixin/start'),
				  method: 'post',
				  data: this.$http.adornData({
				  })
				}).then(({data}) => {
					if(data.status == 0){
						this.form.img = data.data
						this.dialogFormVisible1 = true
						
					}else{
						this.$message({
							message: '启动失败',
							type: 'error',
							duration: 1500,
						})
					}
				})
			},
			amendNoticeTo(){
				this.dialogFormVisible1 = false
				this.dataSelect()
			},
			// 关闭微信机器人
			closeRobot(row){
				this.$confirm(`确定关闭微信机器人?`, '提示', {
				  confirmButtonText: '确定',
				  cancelButtonText: '取消',
				  type: 'warning'
				}).then(() => {
				  this.$http({
				    url: this.$http.adornUrl(`/weixin/shutdown?id=${row.id}`),
				    method: 'post',
				    data: this.$http.adornData({
				    })
				  }).then(({data}) => {
					  if(data.status == -100){
						  this.$message({
							message: data.msg,
							type: 'error',
							duration: 1500,
							onClose: () => {
							  this.dataSelect()
							}
						  }) 
					  }
					 if(data.status == 0){
						  this.$message({
							message: '操作成功',
							type: 'success',
							duration: 1500,
							onClose: () => {
							  this.dataSelect()
							}
						  }) 
					 }
				  })
				}).catch(() => {})
			},
			// 跳转定时任务
			cloudTask(row){
				this.$router.push({path: '/cloudTask', query: {randomId: row.id}})
			},
			// 获取分类数据
			dataSelect () {
			  this.tableDataLoading = true
			  this.$http({
				url: this.$http.adornUrl('/weixin/select'),
				method: 'get',
				params: this.$http.adornParams({
				})
			  }).then(({data}) => {
				  if(data.status == 0){
					 this.tableDataLoading = false
					 let returnData = data.data;
					 this.typeDatas = returnData
				  }
			  })
			}
		},
		mounted() {
			this.dataSelect()
		}
	  };
</script>

<style>
	.cloudWidth{
	  width:30%!important;
	}
</style>
