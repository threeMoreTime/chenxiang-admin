<template>
  <div>
	  <div style="display: inline-block;float: right;">
	    <el-button style='margin-left:15px;' size="mini" type="primary" icon="document" @click="refresh">刷新</el-button>
	  </div>
	  	<el-table
	  	v-loading="tableDataLoading"
	  	  :data="tableData.content">
        <el-table-column
         prop="couponIssueId"
         label="id"
         width="80">
         </el-table-column>
			  <el-table-column
			   prop="type"
			   label="优惠券类型">
			   <template slot-scope="scope">
            <span  v-if="scope.row.type==1">通用券</span>
			   		<span style="color: #3E8EF7;" v-if="scope.row.type==2">商品券</span>
			   </template>
			  </el-table-column>
        <el-table-column
         prop="couponName"
         label="优惠券名称">
         </el-table-column>
        <el-table-column
	  		  label="领取日期"
          width="150">
          <template slot-scope="scope">
            <div>{{scope.row.createTime}}</div>
          	<div>{{scope.row.endTime}}</div>
          </template>
	  		</el-table-column>
			  <el-table-column
			   label="发布数量">
         <template slot-scope="scope">
            <div>发布:{{scope.row.issueNumber}}</div>
         		<div>剩余:{{scope.row.remainNumber}}</div>
         </template>
			   </el-table-column>
			    <el-table-column
					label="状态">
            <template slot-scope="scope">
              <span style="color: #3E8EF7;" v-if="scope.row.status == 1">开启</span>
              <span v-if="scope.row.status == 2">关闭</span>
            </template>
			    </el-table-column>
	  		  <el-table-column
	  			prop="createTime"
	  			label="创建时间"
          width="150">
	  		  </el-table-column>
	  		  <el-table-column
	  		  label="操作"
	  			width="150">
	  		    <template slot-scope="scope">
	  		      <el-button
	  		        size="mini"
	  		        type="primary"
                :disabled="!isAuth('couponissue:update')"
	  		        @click="amend(scope.$index,scope.row)">修改
	  		      </el-button>
	  		      <el-button
	  		        size="mini"
	  		        type="danger"
                :disabled="!isAuth('couponissue:delete')"
	  		        @click="shopdeletes(scope.row)">删除
	  		      </el-button>
	  		    </template>
	  		  </el-table-column>
	  	</el-table>
	  	<div style="text-align: center;margin-top: 10px;">
	  	  <el-pagination
	  	    @size-change="handleSizeChange"
	  	    @current-change="handleCurrentChange"
	  	    :page-sizes="[5, 10, 15, 20]"
	  	    :page-size="size"
	  	    :current-page="page"
	  	    layout="total,sizes, prev, pager, next"
	  	    :total="tableData.totalElements">
	  	  </el-pagination>
	  	</div>
      <!-- 修改-->
      <el-dialog title="修改" :visible.sync="dialogFormVisible" center>
      	<el-form :model="form">
      	  <el-form-item label="状态：" :label-width="formLabelWidth" >
            <el-radio-group v-model="form.status">
                <el-radio :label="1">开启</el-radio>
                <el-radio :label="2">关闭</el-radio>
            </el-radio-group>
      	  </el-form-item>
          <el-form-item label="限量：" :label-width="formLabelWidth" >
            <el-radio-group v-model="form.isLimit">
                <el-radio :label="1">限量</el-radio>
                <el-radio :label="2">不限量</el-radio>
            </el-radio-group>
          </el-form-item>
      	</el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="amendNoticeTo()">确 定</el-button>
        </div>
      </el-dialog>
  </div>
</template>

<script>
	export default {
	    data() {
	      return {
				size:10,
				page:1,
        form:{
        	couponId:'',
        	couponIssueId:'',
        	couponName:'',
        	createTime:'',
        	endTime:'',
          isLimit:'',
          issueNumber:'',
          remainNumber:'',
          startTime:'',
          status:'',
          type:'',
          createTime:''
        },
				formLabelWidth:'200px',
				tableDataLoading:false,
				dialogFormVisible:false,
				tableData:[],
			}
		},

		methods: {
			handleSizeChange(val) {
				this.size = val;
				this.dataSelect()
			},
			handleCurrentChange(val) {
				this.page = val;
				this.dataSelect()
			},
      // 刷新
      refresh(){
       this.dataSelect()
      },
      // 删除优惠券
      shopdeletes(row){
      	this.$confirm(`确定删除此条信息?`, '提示', {
      	  confirmButtonText: '确定',
      	  cancelButtonText: '取消',
      	  type: 'warning'
      	}).then(() => {
      	  this.$http({
      	    url: this.$http.adornUrl2('/selfCouponIssue/delete'),
      	    method: 'get',
      	    params: this.$http.adornParams({
      			'id':row.couponIssueId
      	    })
      	  }).then(({data}) => {
            if(data&&data.status == 0){
              this.$message({
                message: '删除成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.dataSelect()
                }
              })
            }else{
              this.$message({
                message: data.msg,
                type: 'error',
                duration: 1500,
                onClose: () => {
                  this.dataSelect()
                }
              })
            }
      	  })
      	}).catch(() => {})
      },
      // 修改
      amend(index,row){
        this.dialogFormVisible = true
        this.form.couponId = row.couponId,
        this.form.couponIssueId = row.couponIssueId,
        this.form.couponName = row.couponName,
        this.form.createTime = row.createTime,
        this.form.endTime = row.endTime,
        this.form.isLimit = row.isLimit,
        this.form.issueNumber = row.issueNumber,
        this.form.remainNumber = row.remainNumber,
        this.form.startTime = row.startTime,
        this.form.status = row.status,
        this.form.type = row.type
        this.form.createTime = row.createTime
      },
      // 修改
      amendNoticeTo(){
        if (this.form.type == '') {
            this.$notify({
                title: '提示',
                duration: 1800,
                message: '请选择状态',
                type: 'warning'
            });
            return
        }
        this.$http({
          url: this.$http.adornUrl2('/selfCouponIssue/update'),
          method: 'post',
          data: this.$http.adornData({
          'couponId':this.form.couponId,
          'couponIssueId':this.form.couponIssueId,
          'startTime':this.form.startTime,
          'couponName':this.form.couponName,
          'endTime':this.form.endTime,
          'issueNumber':this.form.issueNumber,
          'remainNumber':this.form.remainNumber,
          'isLimit':this.form.isLimit,
          'status':this.form.status,
          'type':this.form.type,
          'createTime': this.form.createTime
          })
        }).then(({data}) => {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.dataSelect()
              }
            })
            this.dialogFormVisible = false
        })
      },
			//获取已发布优惠券数据
			dataSelect () {
        let page = this.page-1
			  this.tableDataLoading = true
			  this.$http({
				url: this.$http.adornUrl2('/selfCouponIssue/list'),
				method: 'get',
				params: this.$http.adornParams({
          'page':page,
          'size':this.size
				})
			  }).then(({data}) => {
					this.tableDataLoading = false
					let returnData = data.data;
					this.tableData = returnData
			  })
			}
		},
		mounted() {
			this.dataSelect()
		}
	  };
</script>

<style scoped="scoped">
.divhove {
  	position: absolute;
  	width: 100%;
  	height: 100%;
  	left:0;
  	top: 0;
  	opacity: 0;
  	cursor: default;
  	text-align:center;
  	padding-top: 50%;
  border-radius: 6px;
  	background-color: rgba(0,0,0,.5);
  	-webkit-transition: opacity .3s;
  	transition: opacity .3s;
  }
  .el-tag--medium{margin-right: 10px;}
  .divhove:hover{opacity:0.8;}
</style>
