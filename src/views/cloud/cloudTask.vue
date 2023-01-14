<template>
  <div>
	  <div style="float: right;margin-right:2%;">
	    <el-button style='margin: 10px 0;' :disabled="!isAuth('classifyAdmin:add')" size="mini" type="primary" icon="document" @click="addTask">新增任务定时器</el-button>
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
			prop="cron"
			label="时间">
			<template slot-scope="scope">
			  <span  v-if="scope.row.cron.length > 14" >每隔半小时执行一次</span>
			  <span  v-else>每小时执行一次</span>
			</template>	
		 </el-table-column>
	    <el-table-column
	      label="操作"
	  	width="220">
	      <template slot-scope="scope">
	        <el-button
	          size="mini"
	          type="primary"
				:disabled="!isAuth('classifyAdmin:delete')"
	          @click="closeRobot(scope.row)">关闭定时器
	        </el-button>
	      </template>
	    </el-table-column>
	  </el-table>
	  <el-dialog title="新增任务定时器" :visible.sync="dialogFormVisible" center>
	  	<div style="margin-bottom: 10px;">
	  		<span style="width: 200px;display: inline-block;text-align: right;">微信机器人群：</span>
	  		<el-select v-model="toUserName" placeholder="请选择微信群" style="width:50%;" >
	  		  <el-option v-for="item in toUserNames" :key="item.value" :label="item.nickName" :value="item.nickName">
	  		  </el-option>
	  		</el-select>
	  	</div>
		<div style="margin-bottom: 10px;">
			<span style="width: 200px;display: inline-block;text-align: right;">执行时间：</span>
			<el-select v-model="cron" placeholder="请选择执行时间" style="width:50%;" >
			  <el-option v-for="item in crons" :key="item.value" :label="item.label" :value="item.value">
			  </el-option>
			</el-select>
		</div>
	    <div slot="footer" class="dialog-footer">
	      <el-button @click="dialogFormVisible = false">取 消</el-button>
	      <el-button type="primary" @click="taskNoticeTo()">确 定</el-button>
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
				randomId:'',
				toUserName:'',
				cron:'',
				name:null,
				crons:[
					{
						value:'0 0 0/1 * * ?' ,
						label:'每小时执行一次'
					},
					{
						value:'0 0/30 0/1 * * ?',
						label:'每隔半小时执行一次'
					}
				] ,
				toUserNames:[],
				formLabelWidth:'200px',
				tableDataLoading:false,
				dialogFormVisible1:false,
				dialogFormVisible:false,
				typeDatas:[],
			}
		},
		methods: {
			// 新增任务定时器
			addTask(){
				this.dialogFormVisible = true
				let page = this.page-1
				let randomId = this.$route.query.randomId
				this.$http({
					url: this.$http.adornUrl('/weixin/selectWxQun'),
					method: 'get',
					params: this.$http.adornParams({
						'randomId':randomId,
						'page':page,
						'size':this.size
					})
				}).then(({data}) => {
					  if(data.status == 0){
						 this.tableDataLoading = false
						 let returnData = data.data;
						 this.toUserNames = returnData.content;
					  }
				})
			},
			// 新增任务定时器操作
			taskNoticeTo(){
				if(this.toUserName == ''){
					this.$message({
						message: '请选择微信机器人群',
						type: 'erroe',
						duration: 1500,
					})
					return
				}
				if(this.cron == ''){
					this.$message({
						message: '请选择执行时间',
						type: 'erroe',
						duration: 1500,
					})
					return
				}
				let randomId = this.$route.query.randomId
				this.$http({
				  url: this.$http.adornUrl(`/weixin/addTimedTask?randomId=${randomId}&toUserName=${this.toUserName}&cron=${this.cron}&name=${this.name}`),
				  method: 'post',
				  data: this.$http.adornData({
				  })
				}).then(({data}) => {
					if(data.status == 0){
						this.dialogFormVisible = false
						this.$message({
							message: '操作成功',
							type: 'success',
							duration: 1500,
							onClose: () => {
							  this.toUserName = ''
							  this.cron = ''
							  this.dataSelect()
							}
						}) 
					}
				})
			},
			// 关闭任务定时器
			closeRobot(row){
				this.$confirm(`确定关闭任务定时器?`, '提示', {
				  confirmButtonText: '确定',
				  cancelButtonText: '取消',
				  type: 'warning'
				}).then(() => {
				  this.$http({
				    url: this.$http.adornUrl(`/weixin/shutdownTimedTask/${row.id}`),
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
			// 获取分类数据
			dataSelect () {
			  this.tableDataLoading = true
			  this.$http({
				url: this.$http.adornUrl('/weixin/selectTimedTask'),
				method: 'post',
				data: this.$http.adornData({
				})
			  }).then(({data}) => {
				  if(data.status == 0){
					 this.tableDataLoading = false
					 let returnData = data.data;
					 this.typeDatas = returnData
					 // console.log(returnData.cron.length)
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
