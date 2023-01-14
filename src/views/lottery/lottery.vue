<template>
  <div>
	  <div style="display: inline-block;float: right;">
	    <el-button style='margin-left:15px;' :disabled="!isAuth('lottery:add')" size="mini" type="primary" icon="document" @click="addCoupon">添加规则</el-button>
      <el-button style='margin-left:15px;' size="mini" type="primary" icon="document" @click="refresh">刷新</el-button>
    </div>
	  	<el-table
	  	v-loading="tableDataLoading"
	  	  :data="tableData">
        <el-table-column
         prop="prizeRuleId"
         label="编号"
         width="80">
         </el-table-column>
	  	  <el-table-column
	  		 prop="name"
	  		 label="抽奖名称">
	  	   </el-table-column>
			  <el-table-column
			   prop="jiFen"
			   label="消耗积分">
			  </el-table-column>
        <el-table-column
         prop="number"
         label="每日抽奖次数">
        </el-table-column>
	  		<el-table-column
	  		   prop="detail"
	  		   label="活动规则"
           width="200">
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
          width="160">
	  		  </el-table-column>
	  		  <el-table-column
	  		  label="操作"
	  			width="150">
	  		    <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                @click="compile(scope.$index,scope.row)">奖品
              </el-button>
	  		      <el-button
	  		        size="mini"
	  		        type="primary"
                :disabled="!isAuth('lottery:update')"
	  		        @click="shopUpdates(scope.$index,scope.row)">修改
	  		      </el-button>
	  		    </template>
	  		  </el-table-column>
	  	</el-table>
      <!-- 添加规则-->
      <el-dialog title="添加规则" :visible.sync="dialogFormVisible" center>
        <div style="margin-bottom: 10px;">
          <span style="width: 200px;display: inline-block;text-align: right;">抽奖名称：</span>
          <el-input style="width:50%;" v-model="name" placeholder="请输入抽奖名称"></el-input>
        </div>
        <div style="margin-bottom: 10px;">
          <span style="width: 200px;display: inline-block;text-align: right;">消耗积分：</span>
          <el-input style="width:50%;" v-model="jiFen" type="number" :min="0" placeholder="请输入消耗积分"></el-input>
        </div>
        <div style="margin-bottom: 10px;">
          <span style="width: 200px;display: inline-block;text-align: right;">每日抽奖次数：</span>
          <el-input style="width:50%;" v-model="number" type="number" :min="1" placeholder="请输入每日抽奖次数"></el-input>
        </div>
        <div style="margin-bottom: 10px;">
          <span style="width: 200px;display: inline-block;text-align: right;position: relative;top: -75px;">活动规则：</span>
          <el-input style="width:50%;" v-model="detail" type="textarea" :rows="4" placeholder="请输入活动规则"></el-input>
        </div>
        <div style="margin-bottom: 10px;">
          <span style="width: 200px;display: inline-block;text-align: right;">状态：</span>
          <el-radio-group v-model="status">
              <el-radio :label="1">开启</el-radio>
              <el-radio :label="2">关闭</el-radio>
          </el-radio-group>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="couponNoticeTo()">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 修改优惠券 -->
      <el-dialog title="修改优惠券" :visible.sync="dialogFormVisible1" center>
      	<el-form :model="form">
          <el-form-item label="抽奖名称：" :label-width="formLabelWidth" >
            <el-input v-model="form.name" style="width:65%;" placeholder="请输入抽奖名称"></el-input>
          </el-form-item>
          <el-form-item label="消耗积分：" :label-width="formLabelWidth" >
            <el-input v-model="form.jiFen" style="width:65%;" placeholder="请输入消耗积分"></el-input>
          </el-form-item>
          <el-form-item label="每日抽奖次数：" :label-width="formLabelWidth" >
            <el-input v-model="form.number" style="width:65%;" placeholder="请输入每日抽奖次数"></el-input>
          </el-form-item>
          <el-form-item label="活动规则：" :label-width="formLabelWidth" >
            <el-input v-model="form.detail" style="width:65%;" placeholder="请输入活动规则"></el-input>
          </el-form-item>
          <el-form-item label="状态：" :label-width="formLabelWidth" >
            <el-radio-group v-model="form.status">
                <el-radio :label="1">开启</el-radio>
                <el-radio :label="2">关闭</el-radio>
            </el-radio-group>
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
				size:10,
				page:1,
        name:'',
        jiFen:'',
        number:'',
        detail:'',
        status:1,
        form:{
          prizeRuleId:'',
          name:'',
          jiFen:'',
          number:'',
          detail:'',
          status:'',
          createTime:''
        },
				formLabelWidth:'200px',
				tableDataLoading:false,
				dialogFormVisible:false,
        dialogFormVisible1:false,
				tableData:[]
			}
		},

		methods: {
      // 刷新
      refresh(){
       this.dataSelect()
      },
      // 奖品
      compile(index,rows){
         this.$router.push({path: '/lotteryPrize', query: {prizeRuleId: rows.prizeRuleId}});
      },
      // 添加规则
      addCoupon(){
        this.dialogFormVisible = true
      },
      // 添加规则
      couponNoticeTo(){
          if (this.name == '') {
              this.$notify({
                  title: '提示',
                  duration: 1800,
                  message: '请输入抽奖名称',
                  type: 'warning'
              });
              return
          }
          if (this.jiFen == '') {
              this.$notify({
                  title: '提示',
                  duration: 1800,
                  message: '请输入消耗积分',
                  type: 'warning'
              });
              return
          }
          if (this.number == '') {
              this.$notify({
                  title: '提示',
                  duration: 1800,
                  message: '请输入每日抽奖次数',
                  type: 'warning'
              });
              return
          }
          if (this.detail == '') {
              this.$notify({
                  title: '提示',
                  duration: 1800,
                  message: '请输入活动规则',
                  type: 'warning'
              });
              return
          }
          this.$http({
            url: this.$http.adornUrl2('/selfPrizeRule/save'),
            method: 'post',
            data: this.$http.adornData({
            'name':this.name,
            'jiFen':this.jiFen,
            'number':this.number,
            'detail':this.detail,
            'status':this.status
            })
          }).then(({data}) => {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.name = ''
                  this.jiFen = ''
                  this.number = ''
                  this.detail = ''
                  this.status = 1
                  this.dataSelect()
                }
              })
              this.dialogFormVisible = false
          })
      },
      // 修改规则
      shopUpdates(index,row){
         this.dialogFormVisible1 = true
         this.form.name = row.name
         this.form.jiFen = row.jiFen
         this.form.number = row.number
         this.form.detail = row.detail
         this.form.status = row.status
         this.form.prizeRuleId = row.prizeRuleId
         this.form.createTime = row.createTime
      },
      amendNoticeTo(){
          this.$http({
            url: this.$http.adornUrl2('/selfPrizeRule/update'),
            method: 'post',
            data: this.$http.adornData({
            'prizeRuleId':this.form.prizeRuleId,
            'name':this.form.name,
            'jiFen':this.form.jiFen,
            'number':this.form.number,
            'detail':this.form.detail,
            'status':this.form.status,
            'createTime':this.form.createTime,
            })
          }).then(({data}) => {
            if(data.status == 0){
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.dataSelect()
                }
              })
              this.dialogFormVisible1 = false
            }else{
              this.$message({
                message: data.msg,
                type: 'error',
                duration: 1500,
                onClose: () => {
                  this.dataSelect()
                }
              })
              this.dialogFormVisible1 = false
            }
          })
      },
			//获取优惠券数据
			dataSelect () {
        let page = this.page-1
			  this.tableDataLoading = true
			  this.$http({
				url: this.$http.adornUrl2('/selfPrizeRule/list'),
				method: 'get',
				params: this.$http.adornParams({
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

<style>

</style>
