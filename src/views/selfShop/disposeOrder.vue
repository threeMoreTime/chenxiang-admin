<template>
  <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="待发货订单" name="first">
      <div style="margin:2% 0;display: inline-block;">
        <span>订单号：</span>
        <el-input style="width: 150px;" @keydown.enter.native="select" clearable placeholder="请输入订单号"
          v-model="orderNum"></el-input>&nbsp;&nbsp;&nbsp;&nbsp;
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
      <div style="display: inline-block;">
        <el-button style="margin-left:15px;" size="mini" type="primary" icon="document" @click="select">查询</el-button>
        <el-button style="margin-left:15px;" size="mini" type="primary" icon="document" @click="cleans">重置</el-button>
        <el-button style='margin-left:15px;' size="mini" type="primary" icon="document" @click="exportBtn">导出
        </el-button>
      </div>
      <el-table v-loading="tableDataLoading" :data="tableData">
        <el-table-column fixed prop="img" label="商品图片">
          <template slot-scope="scope">
            <img :src="scope.row.img" alt="" width="60" height="60">
          </template>
        </el-table-column>
        <el-table-column prop="title" label="商品标题" width="200">
        </el-table-column>
        <el-table-column prop = "detailJson" label = "规格" width = "200">
         </el-table-column>
        <el-table-column prop="goodsType.name" label="商品类型">

        </el-table-column>
        <el-table-column prop="price" label="商品价格">
          <template slot-scope="scope">
            <span style="color: #f56c6c;">{{ scope.row.price | numFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="number" label="商品个数">
        </el-table-column>
        <el-table-column prop="descrition" label="订单备注">
          <template slot-scope="scope">
            <span>{{ scope.row.descrition ? scope.row.descrition : '未填写' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="orderNum" label="订单号" width="200">
          <template slot-scope="scope">
            <span>{{ scope.row.orderNum }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="consignee" label="收货人" width="120">
        </el-table-column>
        <el-table-column prop="mobile" label="手机号" width="120">
        </el-table-column>
        <el-table-column prop="detail" label="详细地址" width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.provinces }}{{ scope.row.detail }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="payMoney" label="支付金额" width="120">
          <template slot-scope="scope">
            <span style="color: #f56c6c;cursor:pointer;">{{ scope.row.payMoney | numFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="commissionPrice" label="佣金" width="120">
          <template slot-scope="scope">
           <span style = "color: #f56c6c;">{{ scope.row.commissionPrice?scope.row.commissionPrice:0 | numFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="payWay" label="支付方式">
          <template slot-scope="scope">
            <!-- 1app微信 2微信公众号 3微信小程序 4app支付宝 5H5支付宝 6零钱 -->
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
        <el-table-column fixed="right" prop="status" label="订单状态">
          <template slot-scope="scope">
            <span style="color: #4f9dec;" v-if="scope.row.status === 2 ">待发货 </span>
          </template>
        </el-table-column>
        <el-table-column prop="createAt" label="创建时间" width="160">
        </el-table-column>
        <el-table-column prop="payTime" label="付款时间" width="160">
          <template slot-scope="scope">
            <span>{{ scope.row.payTime ? scope.row.payTime : '未付款' }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="150">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" :disabled="!isAuth('orderAdmin:deliver')"
              @click="colonelClick(scope.row)">发货
            </el-button>
            <el-button size="mini" type="primary" @click="orderDetails(scope.row.id)">详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align: center;margin-top: 10px;">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
          :page-sizes="[5, 10, 15, 20]" :page-size="size" :current-page="page"
          layout="total,sizes, prev, pager, next,jumper" :total="totalnum">
        </el-pagination>
      </div>
      <!-- 发货弹框 -->
      <el-dialog title="发货" :visible.sync="dialogFormVisible" center>
        <div style="margin-bottom: 10px;">
          <span style="width: 200px;display: inline-block;text-align: right;">快递公司：</span>
          <el-input style="width:50%;" v-model="expressName" placeholder="请输入快递公司"></el-input>
        </div>
        <div style="margin-bottom: 10px;">
          <span style="width: 200px;display: inline-block;text-align: right;">快递单号：</span>
          <el-input style="width: 50%;" v-model="expressNumber" placeholder="请输入快递单号"></el-input>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="deliverNoticeTo()">确 定</el-button>
        </div>
      </el-dialog>
    </el-tab-pane>
    <el-tab-pane label="待退款订单" name="second">
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
        <el-button style = "margin-left:15px;" size = "mini" type = "primary" icon = "document" @click = "cleans1">重置</el-button>
        <el-button style='margin-left:15px;' size="mini" type="primary" icon="document" @click="exportBtn">导出
        </el-button>
      </div>
      <el-table v-loading="tableDataLoading" :data="tableData">
        <el-table-column fixed prop="img" label="商品图片">
          <template slot-scope="scope">
            <img :src="scope.row.img" alt="" width="60" height="60">
          </template>
        </el-table-column>
        <el-table-column prop="title" label="商品标题" width="200">
        </el-table-column>
        <el-table-column prop="goodsType.name" label="商品类型">
        </el-table-column>
        <el-table-column prop="price" label="商品价格">
          <template slot-scope="scope">
            <span style="color: #f56c6c;">{{ scope.row.price | numFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="number" label="商品个数">
        </el-table-column>
        <el-table-column prop="descrition" label="订单备注">
          <template slot-scope="scope">
            <span>{{ scope.row.descrition ? scope.row.descrition : '未填写' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="orderNum" label="订单号" width="200">
          <template slot-scope="scope">
            <span>{{ scope.row.orderNum }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="consignee" label="收货人" width="120">
        </el-table-column>
        <el-table-column prop="mobile" label="手机号" width="120">
        </el-table-column>
        <el-table-column prop="detail" label="详细地址" width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.provinces }}{{ scope.row.detail }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="payMoney" label="支付金额" width="120">
          <template slot-scope="scope">
            <span style="color: #f56c6c;cursor:pointer;">{{ scope.row.payMoney | numFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="commissionPrice" label="佣金" width="120">
          <template slot-scope="scope">
            <span style = "color: #f56c6c;">{{ scope.row.commissionPrice?scope.row.commissionPrice:0 | numFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="payWay" label="支付方式">
          <template slot-scope="scope">
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
        <el-table-column fixed="right" prop="status" label="订单状态">
          <template slot-scope="scope">
            <span style="color: #4f9dec;" v-if="scope.row.status === 1 ">待付款</span>
            <span style="color: #4f9dec;" v-if="scope.row.status === 2 ">待发货 </span>
            <span style="color: #4f9dec;" v-if="scope.row.status === 3 ">已发货 </span>
            <span style="color: #4f9dec;" v-if="scope.row.status === 4 ">已收货</span>
            <span style="color: #4f9dec;" v-if="scope.row.status === 5 ">已取消</span>
            <span style="color: #4f9dec;" v-if="scope.row.status === 6 ">退款中</span>
            <span style="color: #4f9dec;" v-if="scope.row.status === 7 ">已退款</span>
          </template>
        </el-table-column>
        <el-table-column prop="createAt" label="创建时间" width="160">
        </el-table-column>
        <el-table-column prop="payTime" label="付款时间" width="160">
          <template slot-scope="scope">
            <span>{{ scope.row.payTime ? scope.row.payTime : '未付款' }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="280">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" :disabled="!isAuth('orderAdmin:refund')"
              @click="refundClick(scope.row)">确定退款
            </el-button>
            <el-button size="mini" type="primary" @click="refuseClick(scope.row)">拒绝退款
            </el-button>
            <el-button size="mini" type="primary" @click="orderDetails(scope.row.id)">详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align: center;margin-top: 10px;">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
          :page-sizes="[5, 10, 15, 20]" :page-size="size" :current-page="page"
          layout="total,sizes, prev, pager, next,jumper" :total="totalnum">
        </el-pagination>
      </div>
      <!-- 拒绝退款 -->
      <el-dialog title="拒绝退款" :visible.sync="dialogFormVisible1" center>
        <div style="margin-bottom: 10px;">
          <span
            style="width: 200px;display: inline-block;text-align: right;position: relative;top: -65px;">拒绝退款理由：</span>
          <el-input style="width:50%;" type="textarea" rows="4" v-model="refusedRefund" placeholder="请输入拒绝退款理由">
          </el-input>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible1 = false">取 消</el-button>
          <el-button type="primary" @click="refuseNoticeTo()">确 定</el-button>
        </div>
      </el-dialog>
    </el-tab-pane>
  </el-tabs>
</template>
<script>
  export default {
    data() {
      return {
        size: 10,
        page: 1,
        id: '',
        orderNum: '',
        status: 2,
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
        refusedRefund: '',
        isExpress: '',
        formLabelWidth: '200px',
        activeName: 'first',
        tableDataLoading: false,
        dialogFormVisible: false,
        dialogFormVisible1: false,
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
      numFilter(value) {
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
      colonelClick(rows) {

        if (rows.isExpress == 2) {


          this.$http({
            url: this.$http.adornUrl2('/orders/expressVirtual'),
            method: 'get',
            params: this.$http.adornParams({
              'id': rows.id,
            })
          }).then(({
            data
          }) => {
            if (data.status == 0) {
              this.dialogFormVisible = false
              let returnData = data.data
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.dataSelect()
                }
              })
            } else {
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
        } else if (rows.isExpress == 4) {
          this.$confirm(`确认充值完成?`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$http({
              url: this.$http.adornUrl2('/orders/express'),
              method: 'get',
              params: this.$http.adornParams({
                'id': rows.id
              })
            }).then(({
              data
            }) => {
              if (data.status == 0) {
                this.$message({
                  message: '发货成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.dataSelect()
                  }
                })
              }
            })
          })
        } else {
          this.dialogFormVisible = true
          this.id = rows.id
        }
      },
      deliverNoticeTo() {
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
        }).then(({
          data
        }) => {
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
      // 退款
      refundClick(row) {
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
          }).then(({
            data
          }) => {
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
        }).catch(() => {})
      },
      // 拒绝退款
      refuseClick(row) {
        this.ordersId = row.id
        this.dialogFormVisible1 = true
      },
      refuseNoticeTo() {
        if (this.refusedRefund == '') {
          this.$message({
            message: '请输入拒绝退款理由',
            type: 'error',
            duration: 1500,
            onClose: () => {
              this.refusedRefund = ''
              this.dataSelect()
            }
          })
        } else {
          this.$http({
            url: this.$http.adornUrl2('/orders/refusedRefund'),
            method: 'get',
            params: this.$http.adornParams({
              'ordersId': this.ordersId,
              'refusedRefund': this.refusedRefund,
            })
          }).then(({
            data
          }) => {
            this.dialogFormVisible1 = false
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.refusedRefund = ''
                this.dataSelect()
              }
            })
          })
        }

      },
      // 详情
      orderDetails(id) {
        this.$router.push({
          path: '/orderDetails',
          query: {
            id: id
          }
        })
      },
      handleSizeChange(val) {
        this.size = val
        this.dataSelect()
      },
      handleCurrentChange(val) {
        this.page = val
        this.dataSelect()
      },
      handleClick(tab, event) {
        if (tab._props.label == '待发货订单') {
          this.page = 1
          this.size = 10
          this.status = 2
          this.dataSelect()
        }
        if (tab._props.label == '待退款订单') {
          this.page = 1
          this.size = 10
          this.status = 6
          this.dataSelect()
        }
      },
      //搜索
      select() {
        this.page = 1
        this.size = 10
        this.dataSelect()
      },
      // 重置
      cleans() {
        this.orderNum = ''
        this.status = 2
        this.startTime = ''
        this.endTime = ''
        this.dataSelect()
      },
      // 重置
      cleans1() {
        this.orderNum = ''
        this.status = 6
        this.startTime = ''
        this.endTime = ''
        this.dataSelect()
      },
      // 获取订单数据
      dataSelect() {
        let page = this.page - 1
        this.tableDataLoading = true
        var endTime=this.endTime
        if(this.endTime!=''){
        	endTime = this.endTime+' 23:59:59'
        }
        this.$http({
          url: this.$http.adornUrl2('/orders/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': page,
            'size': this.size,
            'orderNum': this.orderNum,
            'status': this.status,
            'startTime': this.startTime,
            'endTime': endTime
          })
        }).then(({
          data
        }) => {
          this.tableDataLoading = false
          let returnData = data.data
          this.tableData = returnData.content
          this.totalnum = returnData.totalElements
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
    mounted() {
      this.dataSelect()
    }
  }
</script>
<style scoped="scoped">
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
