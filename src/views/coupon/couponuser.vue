<template>
  <div>
	  <div style="display: inline-block;">
      <div style="margin:2% 0;display: inline-block;">
        <span>优惠券名称：</span>
        <el-input style="width:200px;" @keydown.enter.native="select" clearable placeholder="请输入优惠券名称" v-model="couponName"></el-input>
      </div>
      <el-button style='margin-left:15px;' size="mini" type="primary" icon="document" @click="select">查询</el-button>
      <el-button style='margin-left:15px;' size="mini" type="primary" icon="document" @click="cleans">重置</el-button>
	    <el-button style='margin-left:15px;' :disabled="!isAuth('shopAdmin:add')" size="mini" type="primary" icon="document" @click="refresh">刷新</el-button>
	  </div>
	  	<el-table
	  	v-loading="tableDataLoading"
	  	  :data="tableData.content">
        <el-table-column
         prop="couponName"
         label="优惠券名称"
         width="150">
         </el-table-column>
			  <el-table-column
			   prop="nickName"
			   label="所属用户">
			  </el-table-column>
        <el-table-column
         prop="lessMoney"
         label="优惠券面值">
         </el-table-column>
         <el-table-column
          prop="minMoney"
          label="优惠券最低消费">
          </el-table-column>
        <el-table-column
          prop="failureTime"
	  		  label="优惠券失效时间"
          width="150">
	  		</el-table-column>
        <el-table-column
        label="状态">
          <template slot-scope="scope">
            <span style="color: #3E8EF7;" v-if="scope.row.status == 1">未使用</span>
            <span v-if="scope.row.status == 2">已使用</span>
            <span v-if="scope.row.status == 3">已过期</span>
          </template>
        </el-table-column>
        <el-table-column
        prop="createTime"
        label="创建时间"
        width="150">
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
  </div>
</template>

<script>
	export default {
	    data() {
	      return {
				size:10,
				page:1,
        couponName:'',
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
      // 查询
      select () {
        this.dataSelect()
      },
      // 重置
      cleans () {
        this.couponName = ''
        this.dataSelect()
      },
      // 刷新
      refresh(){
       this.dataSelect()
      },
			//获取已发布优惠券数据
			dataSelect () {
        let page = this.page-1
			  this.tableDataLoading = true
			  this.$http({
				url: this.$http.adornUrl2('/selfCouponUser/list'),
				method: 'get',
				params: this.$http.adornParams({
          'page':page,
          'size':this.size,
          'couponName':this.couponName
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
