<template>
  <el-tabs v-model = "activeName" @tab-click = "handleClick">
    <el-tab-pane label = "订单中心" name = "first">
		<div style = "margin:2% 0;display: inline-block;">
		  <span>订单状态：</span>
		  <el-select v-model = "status" placeholder = "请选择订单状态" style = "width:150px;" @change = "select(status)">
		    <el-option v-for = "item in statusmain" :key = "item.value" :label = "item.label" :value = "item.value">
		    </el-option>
		  </el-select>&nbsp;&nbsp;&nbsp;&nbsp;
		  <span>订单号：</span>
		  <el-input style = "width: 150px;" @keydown.enter.native = "select" clearable placeholder = "请输入订单号" v-model = "orderNum"></el-input>&nbsp;&nbsp;&nbsp;&nbsp;
		  <span>手机号：</span>
		  <el-input style = "width: 150px;" @keydown.enter.native = "select" clearable placeholder = "请输入手机号" v-model = "mobile"></el-input>&nbsp;&nbsp;&nbsp;&nbsp;
		  <span>商品标题：</span>
		  <el-input style = "width: 150px;" @keydown.enter.native = "select" clearable placeholder = "请输入商品标题" v-model = "title"></el-input>&nbsp;&nbsp;&nbsp;&nbsp;
		</div>
    <div style="margin:5px;display: inline-block;">
    	<span>开始时间：</span>
    	<el-date-picker style="width: 160px;margin-left: 10px;" v-model="startTime" align="right"
    		type="datetime" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="选择开始时间">
    	</el-date-picker>&nbsp;&nbsp;&nbsp;
    </div>
    <div style="margin:5px;display: inline-block;">
    	<span>截止时间：</span>
    	<el-date-picker style="width: 160px;margin-left: 10px;" v-model="endTime" align="right" type="datetime"
    		format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="选择截止时间">
    	</el-date-picker>
    </div>
		<div style = "display: inline-block;">
		  <el-button style = "margin-left:15px;" size = "mini" type = "primary" icon = "document" @click = "select">查询</el-button>
		  <el-button style = "margin-left:15px;" size = "mini" type = "primary" icon = "document" @click = "cleans">重置</el-button>
      <el-button style='margin-left:15px;' size="mini" type="primary" icon="document" @click="exportBtn">导出
      </el-button>
		</div>
		<el-table v-loading = "tableDataLoading" :data = "tableData">
		 <el-table-column fixed prop = "img" label = "商品图片">
			<template slot-scope = "scope">
				<img :src = "scope.row.img" alt = "" width = "60" height = "60">
			</template>
		  </el-table-column>
		  <el-table-column prop = "title" label = "商品标题" width = "200">
		   </el-table-column>
       <el-table-column prop = "detailJson" label = "规格" width = "200">
        </el-table-column>
		   <el-table-column prop = "goodsType.name" label = "商品类型">
		    </el-table-column>
		  <el-table-column prop = "price" label = "商品价格">
		   <template slot-scope = "scope">
				<span style = "color: #f56c6c;">{{ scope.row.price | numFilter }}</span>
		   </template>
		   </el-table-column>
		   <el-table-column prop = "number" label = "商品个数">
		    </el-table-column>
			<el-table-column prop = "descrition" label = "订单备注">
			 <template slot-scope = "scope">
			 	<span>{{ scope.row.descrition ? scope.row.descrition : '未填写' }}</span>
			 </template>
			</el-table-column>
		   <el-table-column prop = "orderNum" label = "订单号" width = "200">
			<template slot-scope = "scope">
				<span>{{ scope.row.orderNum }}</span>
			</template>
		  </el-table-column>
			<!-- <el-table-column prop = "consignee" label = "收货人" width = "120">
			</el-table-column> -->
		  <el-table-column prop = "isExpress" label = "是否虚拟商品" width = "120">
			<template slot-scope = "scope">
				<span v-if = "scope.row.isExpress == 1">否</span>
				<span v-else>是</span>
			</template>
		  </el-table-column>
		  <el-table-column prop = "mobile" label = "手机号" width = "120">
		  </el-table-column>
		  <!-- <el-table-column prop = "detail" label = "详细地址" width = "120">
			<template slot-scope = "scope">
				<span>{{ scope.row.provinces }}{{ scope.row.detail }}</span>
			</template>
		  </el-table-column> -->
		  <el-table-column prop = "payMoney" label = "支付金额" width = "120">
			<template slot-scope = "scope">
				<span style = "color: #f56c6c;cursor:pointer;">{{ scope.row.payMoney | numFilter }}</span>
			</template>
		  </el-table-column>
		  <el-table-column prop = "commissionPrice" label = "佣金" width = "120">
			<template slot-scope = "scope">
				<span style = "color: #f56c6c;">{{ scope.row.commissionPrice?scope.row.commissionPrice:0 | numFilter }}</span>
			</template>
		  </el-table-column>
		  <el-table-column prop = "refund" label = "退款原因" width = "160">
			<template slot-scope = "scope">
				<span>{{ scope.row.refund ? scope.row.refund : '未退款' }}</span>
			</template>
		  </el-table-column>
		  <el-table-column prop = "refusedRefund" label = "驳回原因" width = "160">
			<template slot-scope = "scope">
				<span>{{ scope.row.refusedRefund ? scope.row.refusedRefund : '未拒绝' }}</span>
			</template>
		  </el-table-column>
		  <el-table-column prop = "payWay" label = "支付方式">
			<template slot-scope = "scope">
				<span style="color: #4f9dec;" v-if="scope.row.payWay === 1 ">app微信</span>
				<span style="color: #4f9dec;" v-if="scope.row.payWay === 2 ">微信公众号</span>
				<span style="color: #4f9dec;" v-if="scope.row.payWay === 3 ">微信小程序</span>
				<span style="color: #4f9dec;" v-if="scope.row.payWay === 4 ">app支付宝</span>
				<span style="color: #4f9dec;" v-if="scope.row.payWay === 5 ">H5支付宝</span>
				<span style="color: #4f9dec;" v-if="scope.row.payWay === 6 ">零钱</span>
        <span style="color: #4f9dec;" v-if="scope.row.payWay === 7 ">积分</span>
				<span style="color: #4f9dec;" v-if="scope.row.payWay === null ">未支付</span>
			</template>
		  </el-table-column>
		  <el-table-column fixed = "right" prop = "status" label = "订单状态">
			<template slot-scope = "scope">
				<span style = "color: #4f9dec;" v-if = "scope.row.status === 1 ">待付款</span>
				<span style = "color: #4f9dec;" v-if = "scope.row.status === 2 ">待发货 </span>
				<span style = "color: #999999;" v-if = "scope.row.status === 3 ">已发货 </span>
				<span style = "color: #999999;" v-if = "scope.row.status === 4 ">已收货</span>
				<span style = "color: #999999;" v-if = "scope.row.status === 5 ">已取消</span>
				<span style = "color: #4f9dec;" v-if = "scope.row.status === 6 ">退款中</span>
				<span style = "color: #999999;" v-if = "scope.row.status === 7 ">已退款</span>
				<span style = "color: #999999;" v-if = "scope.row.status === 8 ">已驳回</span>
			</template>
			</el-table-column>
			<el-table-column prop = "createAt" label = "创建时间" width = "160">
			</el-table-column>
			<el-table-column prop = "payTime" label = "付款时间" width = "160">
				<template slot-scope = "scope">
					<span>{{ scope.row.payTime ? scope.row.payTime : '未付款' }}</span>
				</template>
			</el-table-column>
			<el-table-column prop = "finishTime" label = "收货时间" width = "160">
				<template slot-scope = "scope">
					<span>{{ scope.row.finishTime ? scope.row.finishTime : '未收货' }}</span>
				</template>
			</el-table-column>
			<el-table-column fixed = "right" label = "操作" width = "100">
			  <template slot-scope = "scope">
					<el-button size = "mini" type = "primary" @click = "orderDetails(scope.row.id)">详情
					</el-button>
			  </template>
			</el-table-column>
		</el-table>
		<div style = "text-align: center;margin-top: 10px;">
		  <el-pagination @size-change = "handleSizeChange" @current-change = "handleCurrentChange" :page-sizes = "[10, 15, 20, 50]"
                     :page-size = "size" :current-page = "page" layout = "total,sizes, prev, pager, next,jumper" :total = "totalnum">
		  </el-pagination>
		</div>
	</el-tab-pane>
    <el-tab-pane label = "数据中心" name = "second">
		<div>
		  <el-select v-model = "way" style = "width:150px;margin-left: 10px;" @change = "animeDat">
		    <el-option v-for = "item in ways" :key = "item.value" :label = "item.label" :value = "item.value">
		    </el-option>
		  </el-select>&nbsp;&nbsp;&nbsp;
		  <el-date-picker style = "width: 160px;margin-left: 10px;" v-model = "info.stockDate" align = "right" type = "datetime"
                      format = "yyyy-MM-dd" value-format = "yyyy-MM-dd" placeholder = "选择开始时间" @change = "timeDate">
		  </el-date-picker>
		</div>
		<el-row>
		  <el-col :span = "6" class = "cards">
		    <div class = "box">
		      <div class = "box_num">
		        <div class = "box_color">总收入</div>
		        <div class = "text_color"><span>{{ sumincome | numFilter }}</span>元</div>
		      </div>
		    </div>
		  </el-col>
		  <el-col :span = "6" class = "cards">
		    <div class = "box">
		      <div class = "box_num">
		        <div class = "box_color">当前收入</div>
		        <div class = "text_color"><span>{{ income | numFilter }}</span>元</div>
		      </div>
		    </div>
		  </el-col>
		  <el-col :span = "6" class = "cards">
		    <div class = "box">
		      <div class = "box_num">
		        <div class = "box_color">微信收入</div>
		        <div class = "text_color"><span>{{ wxincome | numFilter }}</span>元</div>
		      </div>
		    </div>
		  </el-col>
		  <el-col :span = "6" class = "cards">
		    <div class = "box">
		      <div class = "box_num">
		        <div class = "box_color">支付宝收入</div>
		        <div class = "text_color"><span>{{ zfbincome | numFilter }}</span>元</div>
		      </div>
		    </div>
		  </el-col>
		</el-row>
		<el-row>
			<el-col :span = "6" class = "cards">
			  <div class = "box">
			    <div class = "box_num">
			      <div class = "box_color">余额</div>
			      <div class = "text_color"><span>{{ yueicome | numFilter }}</span>元</div>
			    </div>
			  </div>
			</el-col>
		  <el-col :span = "6" class = "cards">
		    <div class = "box">
		      <div class = "box_num">
		        <div class = "box_color">订单年成交量</div>
		        <div class = "text_color"><span>{{ ordersum0 }}</span>件</div>
		      </div>
		    </div>
		  </el-col>
		  <el-col :span = "6" class = "cards">
		    <div class = "box">
		      <div class = "box_num">
		        <div class = "box_color">订单月成交量</div>
		        <div class = "text_color"><span>{{ ordersum1 }}</span>件</div>
		      </div>
		    </div>
		  </el-col>
		  <el-col :span = "6" class = "cards">
		    <div class = "box">
		      <div class = "box_num">
		        <div class = "box_color">订单日成交量</div>
		        <div class = "text_color"><span>{{ ordersum2 }}</span>件</div>
		      </div>
		    </div>
		  </el-col>
		</el-row>
	</el-tab-pane>
  </el-tabs>
</template>
<script>
	export default {
    data () {
      return {
        size: 10,
        page: 1,
        id: '',
        title: '',
        mobile: '',
        orderNum: '',
        status: 0,
        sumincome: '',
        totalnum: 0,
        income: '',
        wxincome: '',
        zfbincome: '',
        yueicome: '',
        ordersum0: '',
        ordersum1: '',
        ordersum2: '',
        expressName: '',
        expressNumber: '',
        info: {
          stockDate: this.getNowTime(),  //日期
        },
        way: 3,
        ways: [
          {
            value: 3,
            label: '按天查询'
          }, {
            value: 2,
            label: '按月查询'
          }, {
            value: 1,
            label: '按年查询'
          }],
        statusmain: [
          {
            value: 0,
            label: '全部'
          },
          {
            value: 1,
            label: '待付款'
          },
          {
            value: 2,
            label: '待发货'
          },
          {
            value: 3,
            label: '已发货'
          },
          {
            value: 4,
            label: '已收货'
          },
          {
            value: 5,
            label: '已取消'
          },
          {
            value: 6,
            label: '退款中'
          },
          {
            value: 7,
            label: '已退款'
          },
          {
            value: 8,
            label: '已驳回'
          }
        ],
        formLabelWidth: '200px',
        activeName: 'first',
        tableDataLoading: false,
        dialogFormVisible: false,
        tableData: [],
        info: {
        	stockDate: this.getNowTime(), //日期
        },
        info2: {
        	stockDate2: this.getNowTime2(), //日期
        },
        startTime: '',
        endTime: '',
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
      //处理默认选中当前日期
      getNowTime() {
      	var now = new Date()
      	var year = now.getFullYear() //得到年份
      	var month = now.getMonth() //得到月份
      	var date = now.getDate() //得到日期
      	month = month + 1
      	month = month.toString().padStart(2, '0')
      	date = date.toString().padStart(2, '0')
      	var defaultDate = `${year}-${month}-${date}`
      	return defaultDate
      	this.$set(this.info, 'stockDate', defaultDate)
      },
      //处理默认选中当前日期
      getNowTime2() {
      	var now = new Date()
      	var year = now.getFullYear() //得到年份
      	var month = now.getMonth() - now.getMonth() //得到月份
      	var date = now.getDate() - now.getDate() + 1 //得到日期
      	month = month + 1
      	month = month.toString().padStart(2, '0')
      	date = date.toString().padStart(2, '0')
      	var defaultDate = `${year}-${month}-${date}`
      	return defaultDate
      	this.$set(this.info, 'stockDate', defaultDate)
      },
      // 发货
      colonelClick (rows) {
        if (rows.status == 2) {
          this.dialogFormVisible = true
          this.id = rows.id
        } else {
          this.$message({
            message: '只有待发货订单才能发货',
            type: 'error',
            duration: 2500
          })
        }
      },
      deliverNoticeTo () {
        if (this.expressName == '') {
          this.$message({
            message: '请输入快递公司',
            type: 'error',
            duration: 1500
          })
          return
        }
        if (this.expressNumber == '') {
          this.$message({
            message: '请输入快递单号',
            type: 'error',
            duration: 1500
          })
          return
        }
        this.$http({
          url: this.$http.adornUrl2('/orders/express'),
          method: 'get',
          params: this.$http.adornParams({
            'id': this.id,
            'expressName': this.expressName,
            'expressNumber': this.expressNumber
          })
        }).then(({data}) => {
          if (data.status == 0) {
            this.dialogFormVisible = false
            let returnData = data.data
            this.orderName = returnData.expressName
            this.orderNumber = returnData.expressNumber
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.expressName = ''
                this.expressNumber = ''
                this.dataSelect()
              }
            })
          }
        })
      },
      // 详情
      orderDetails (id) {
        this.$router.push({path: '/orderDetails', query: {id: id}})
      },
      //处理默认选中当前日期
      getNowTime () {
        var now = new Date()
        var year = now.getFullYear() //得到年份
        var month = now.getMonth() //得到月份
        var date = now.getDate() //得到日期
        month = month + 1
        month = month.toString().padStart(2, '0')
        date = date.toString().padStart(2, '0')
        var defaultDate = `${year}-${month}-${date}`
        return defaultDate
        this.$set(this.info, 'stockDate', defaultDate)
      },
      // 日期选择
      animeDat (value) {
        let vanumber = value
        if (vanumber === 3) {
          this.moneySelect()
          this.orderSelect()
        }
        if (vanumber === 2) {
          // this.info.stockDate = this.info.stockDate.substring(0, 7)
          this.moneySelect()
          this.orderSelect()
          // this.info.stockDate = this.getNowTime()
        }
        if (vanumber === 1) {
          // this.info.stockDate = this.info.stockDate.substring(0, 4)
          this.moneySelect()
          this.orderSelect()
          // this.info.stockDate = this.getNowTime()
        }
      },
      timeDate () {
        this.moneySelect()
        this.orderSelect()
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
        if (tab._props.label == '订单中心') {
          this.page = 1
          this.size = 10
          this.dataSelect()
        }
        if (tab._props.label == '数据中心') {
          this.moneySelect()
          this.orderSelect()
        }
      },
      //搜索
      select () {
        this.page = 1
        this.size = 10
        this.dataSelect()
      },
      // 重置
      cleans () {
        this.orderNum = ''
        this.title = ''
        this.mobile = ''
        this.startTime = ''
        this.endTime = ''
        this.status = 0
        this.dataSelect()
      },
      // 退款
      refundClick (row) {
        if (row.status == 6) {
          this.$confirm(`确定退款?`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$http({
              url: this.$http.adornUrl2('/orders/refundMoney'),
              method: 'get',
              params: this.$http.adornParams({
                'ordersId': row.id
              })
            }).then(({data}) => {
              if (data.status == 0) {
                this.$message({
                  message: '退款成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.dataSelect()
                  }
                })
              }
              if (data.status == -1) {
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
          }).catch(() => {
          })
        } else {
          this.$message({
            message: '只有状态为退款中订单才能退款',
            type: 'error',
            duration: 2500
          })
        }
      },
      // 获取订单数据
      dataSelect () {
        let page = this.page - 1
        this.tableDataLoading = true
        var endTime=this.endTime
        if(this.endTime!=''){
        	endTime=this.endTime+" 23:59:59"
        }
        this.$http({
          url: this.$http.adornUrl2('/orders/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': page,
            'size': this.size,
            'orderNum': this.orderNum,
            'title': this.title,
            'mobile': this.mobile,
            'status': this.status,
            'startTime': this.startTime,
            'endTime': endTime
          })
        }).then(({data}) => {
          this.tableDataLoading = false
          let returnData = data.data
          this.tableData = returnData.content
          this.totalnum = returnData.totalElements
        })
      },
      // 收入金额统计
      moneySelect () {
        let page = this.page - 1
        this.tableDataLoading = true
        this.$http({
          url: this.$http.adornUrl2('/orders/income'),
          method: 'get',
          params: this.$http.adornParams({
            'data': this.info.stockDate,
            'way': this.way
          })
        }).then(({data}) => {
          this.tableDataLoading = false
          let returnData = data.data
          this.sumincome = returnData.sum0
          this.income = returnData.sum1
          this.wxincome = returnData.pay1
          this.zfbincome = returnData.pay2
          this.yueicome = returnData.pay3
        })
      },
      // 订单成交量统计
      orderSelect () {
        let page = this.page - 1
        this.tableDataLoading = true
        this.$http({
          url: this.$http.adornUrl2('/orders/statistical'),
          method: 'get',
          params: this.$http.adornParams({
            'data': this.info.stockDate,
          })
        }).then(({data}) => {
          this.tableDataLoading = false
          let returnData = data.data
          this.ordersum0 = returnData.sum0
          this.ordersum1 = returnData.sum1
          this.ordersum2 = returnData.sum2

        })
      },
      // 导出
      exportBtn() {
      	// if (this.endTime == '') {
      	// 	this.endTime = this.info.stockDate
      	// }
      	// if (this.startTime == '') {
      	// 	this.startTime = this.info2.stockDate2
      	// }
      	 var endTime=this.endTime
      	 if(this.endTime!=''){
      	 	endTime = this.endTime+' 23:59:59'
      	 }
      	this.$http({
      		url: this.$http.adornUrl2('/orders/listExcel'),
      		method: 'get',
      		responseType: 'blob',
      		params: this.$http.adornParams({
      			// 'page': page,
      			// 'size': this.size,
      			'orderNum': this.orderNum,
      			'title': this.title,
      			'mobile': this.mobile,
      			'status': this.status,
      			'startTime': this.startTime,
      			'endTime': endTime
      		})
      	}).then(({
      		data
      	}) => {
      		let blob = new Blob([data], {
      			type: 'application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      		})
      		if (window.navigator.msSaveOrOpenBlob) {
      			navigator.msSaveBlob(blob)
      		} else {
      			let url = window.URL.createObjectURL(blob)
      			let elink = document.createElement('a')
      			elink.download = '订单列表.xlsx'
      			elink.style.display = 'none'
      			elink.href = url
      			document.body.appendChild(elink)
      			elink.click()
      			document.body.removeChild(elink)
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
