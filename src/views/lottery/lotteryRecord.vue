<template>
  <div>
	  <div style="margin:2% 0;display: inline-block;">
      <span>用户昵称：</span>
      <el-input style="width: 150px;" @keydown.enter.native="select" clearable placeholder="请输入用户昵称" v-model="nickName"></el-input>
	  </div>
	  <div style="display: inline-block;">
	    <el-button style='margin-left:15px;' size="mini" type="primary" icon="document" @click="select">查询</el-button>
	    <el-button style='margin-left:15px;' size="mini" type="primary" icon="document" @click="cleans">重置</el-button>
      <el-button style='margin-left:15px;' size="mini" type="primary" icon="document" @click="refresh">刷新</el-button>
    </div>
	  	<el-table
        v-loading="tableDataLoading"
	  	  :data="tableData.content">
        <el-table-column
          fixed
          prop="prizeUserId"
          label="编号"
          width="80">
        </el-table-column>
        <el-table-column
         prop="nickName"
         label="用户昵称">
        </el-table-column>
	  	  <el-table-column
	  		 prop="lessJiFen"
	  		 label="减少的积分">
	  	  </el-table-column>
        <el-table-column
          prop="addJiFen"
          label="增加的积分">
        </el-table-column>
        <el-table-column
	  			prop="createTime"
	  			label="创建时间"
          width="160">
	  		</el-table-column>
	  	</el-table>
	  	<div style="text-align: center;margin-top: 10px;">
	  	  <el-pagination
	  	    @size-change="handleSizeChange"
	  	    @current-change="handleCurrentChange"
	  	    :page-sizes="[5, 10, 15, 20]"
	  	    :page-size="size"
	  	    :current-page="page"
	  	    layout="total,sizes, prev, pager, next,jumper"
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
          nickName:'',
          formLabelWidth:'200px',
          tableDataLoading:false,
          tableData:[],
        }
      },
      methods: {
        handleSizeChange(val) {
          this.size = val;
          this.shopSelect()
        },
        handleCurrentChange(val) {
          this.page = val;
          this.shopSelect()
        },
        //搜索
        select(){
           this.shopSelect()
        },
        // 重置
        cleans(){
          this.nickName = ''
          this.shopSelect()
        },
        // 刷新
        refresh(){
          this.shopSelect()
        },
        // 获取商品数据
        shopSelect () {
          let page = this.page-1
          this.tableDataLoading = true
          this.$http({
          url: this.$http.adornUrl2('/selfPrizeUser/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page':page,
            'size':this.size,
            'nickName':this.nickName,
          })
          }).then(({data}) => {
            this.tableDataLoading = false
            let returnData = data.data;
            this.tableData = returnData
          })
        },
      },
      mounted() {
        this.shopSelect()
      }
	  };
</script>

<style>

</style>
