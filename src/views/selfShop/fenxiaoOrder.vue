<template>
  <div>
	  <div style = "margin:2% 0;display: inline-block;">
		<span>分销状态：</span>
		<el-select v-model = "status" placeholder = "请选择分销类型" style = "width:150px;" @change = "selectTrigger(status)">
		  <el-option v-for = "item in statusnum" :key = "item.value" :label = "item.label" :value = "item.value">
		  </el-option>
		</el-select>&nbsp;&nbsp;&nbsp;&nbsp;
	    <span>手机号：</span>
	    <el-input style = "width: 150px;" @keydown.enter.native = "select" clearable placeholder = "请输入手机号" v-model = "phone"></el-input>&nbsp;&nbsp;&nbsp;&nbsp;
	  </div>
	  <div style = "display: inline-block;">
	    <el-button style = "margin-left:15px;" size = "mini" type = "primary" icon = "document" @click = "select">查询</el-button>
	    <el-button style = "margin-left:15px;" size = "mini" type = "primary" icon = "document" @click = "cleans">重置</el-button>
	  </div>
	  <el-table v-loading = "tableDataLoading" :data = "tableData">
		<el-table-column prop = "id" label = "编号">
		 </el-table-column>
	     <el-table-column prop = "userId" label = "用户id">
		 <template slot-scope = "scope">
		 	  <span style = "color: #4f9dec;cursor:pointer;" @click = "updates(scope.row)">{{ scope.row.userId }}</span>
		 </template>
	      </el-table-column>
	    <el-table-column prop = "phone" label = "手机号">
	     </el-table-column>
	     <el-table-column prop = "commissionPrice" label = "订单佣金">
			 <template slot-scope = "scope">
			 	<span style = "color: #f56c6c;">{{ scope.row.commissionPrice?scope.row.commissionPrice:0 | numFilter }}</span>
			 </template>
	      </el-table-column>
		  <el-table-column prop = "status" label = "分销状态">
		   <template slot-scope = "scope">
		   	  <span v-if = "scope.row.status == 1">未到账</span>
			  <span v-if = "scope.row.status == 2">已到账</span>
		   </template>
		   </el-table-column>
	    <el-table-column prop = "detail" label = "分销明细">
	    </el-table-column>
	    <el-table-column prop = "createAt" label = "创建时间">
	    </el-table-column>
	  </el-table>
	  <div style = "text-align: center;margin-top: 10px;">
	    <el-pagination @size-change = "handleSizeChange" @current-change = "handleCurrentChange" :page-sizes = "[5, 10, 15, 20]"
                     :page-size = "size" :current-page = "page" layout = "total,sizes, prev, pager, next,jumper" :total = "totalnum">
	    </el-pagination>
	  </div>
  </div>
</template>
<script>
	export default {
    data () {
      return {
        size: 10,
        page: 1,
        userId: '',
        phone: '',
        totalnum: 0,
        moneyFrom: 0,
        formLabelWidth: '200px',
        activeName: 'first',
        tableDataLoading: false,
        tableData: [],
        status: 0,
        statusnum: [
          {
            value: 0,
            label: '全部'
          }, {
            value: 1,
            label: '未到账'
          }, {
            value: 2,
            label: '已到账'
          }],
      }
    },
    filters: {
      numFilter (value) {
        let realVal = ''
        if (!isNaN(value) && value !== '') {
          // 截取当前数据到小数点后两位
          realVal = parseFloat(value).toFixed(2)
        } else {
          realVal = '--'
        }
        return realVal
      }
    },
    methods: {
      handleSizeChange (val) {
        this.size = val
        this.dataSelect()
      },
      handleCurrentChange (val) {
        this.page = val
        this.dataSelect()
      },
      // 详情跳转
      updates (row) {
        this.$router.push({path: '/userDetail', query: {userId: row.userId}})
      },
      // 详情跳转
      updates (row) {
        this.$router.push({path: '/userDetail', query: {userId: row.userId}})
      },
      selectTrigger () {
        this.size = 10
        this.page = 1
        this.dataSelect()
      },
      //搜索
      select () {
        this.page = 1
        this.size = 10
        this.dataSelect()
      },
      // 重置
      cleans () {
        this.status = 0
        this.phone = ''
        this.dataSelect()
      },
      // 获取订单数据
      dataSelect () {
        let page = this.page - 1
        this.tableDataLoading = true
        this.$http({
          url: this.$http.adornUrl2('/ordersRelation/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': page,
            'size': this.size,
            'userId': this.userId,
            'phone': this.phone,
            'status': this.status,
            'moneyFrom': this.moneyFrom
          })
        }).then(({data}) => {
          this.tableDataLoading = false
          let returnData = data.data
          this.tableData = returnData.content
          this.totalnum = returnData.totalElements
        })
      }
    },
    mounted () {
      this.dataSelect()
    }
  }
</script>
<style scoped = "scoped">
  .box {
    height: 110px;
    padding: 24px;
    border: 1px solid #eee;
    margin: 15px 10px;
  }

  .box_num {
    font-size: 14px;
    color: #66b1ff;
  }

  .box_num .box_color {
    color: #333;
    font-size: 14px;
    margin-bottom: 15px;
  }

  .box_num div span {
    font-size: 20px;
    margin-left: 5px;
  }

  .text_color {
    color: #4f9dec;
  }

  .text_color span {
    margin-right: 5px;
  }
</style>
