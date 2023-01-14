<template>
	<div>
		<el-tabs v-model="activeName" @tab-click="handleClick">
			<el-tab-pane label="卡券列表" name="first">
				<div style="margin:2% 0;display: inline-block;">
				  <span>卡券名称：</span>
				  <el-input style="width: 150px;" @keydown.enter.native="select"  clearable placeholder="请输入卡券名称" v-model="cardName"></el-input>&nbsp;&nbsp;&nbsp;&nbsp;
				  <span>卡号：</span>
				<el-input style="width: 150px;" @keydown.enter.native="select"  clearable placeholder="请输入卡号" v-model="cardNo"></el-input>&nbsp;&nbsp;&nbsp;&nbsp;
				<span>卡券类型：</span>
				<el-select v-model="cardType" placeholder="请选择类型" style="width:150px;" @change="selectTrigger(cardType)">
				  <el-option v-for="item in cardTypes" :key="item.value" :label="item.label" :value="item.value">
				  </el-option>
				</el-select>
				</div>
				<div style="display: inline-block;">
					<el-button style='margin-left:15px;' size="mini" type="primary" icon="document" @click="select">查询</el-button>
					<el-button style='margin-left:15px;' size="mini" type="primary" icon="document" @click="cleans">重置</el-button>
					<el-button style='margin-left:15px;' :disabled="!isAuth('couponList:add')" size="mini" type="primary" icon="document" @click="addNotice">生成卡券</el-button>
					<el-button style='margin-left:15px;' size="mini" type="success" icon="document" @click="derive">导出Excel</el-button>
					<el-button style='margin-left:15px;' :disabled="!isAuth('couponList:delete') || checkBoxData.length <= 0 " size="mini" type="danger" icon="document" @click="choideletes()">批量删除</el-button>
				</div>
				<el-table
				@selection-change="changeFun"
				v-loading="tableDataLoading"
				  :data="tableData.content"
				row-key="id">
				<el-table-column type="selection">
				</el-table-column>
				  <el-table-column
					 prop="id"
					 label="编号"
					 width="80">
				  </el-table-column>
				  <el-table-column
					prop="cardName"
					label="卡券名称">
				  </el-table-column>
				<el-table-column
				prop="cardNo"
				label="卡号">
				</el-table-column>
				<el-table-column
				prop="cardMoney"
				label="卡券金额(分)">
				<template slot-scope="scope">
				  <span>{{scope.row.cardMoney/100}}</span>
				</template>
				</el-table-column>
				<el-table-column
				prop="cardType"
				label="卡券类型">
				<template slot-scope="scope">
				  <span style="color: #3E8EF7;" v-if="scope.row.cardType == 1">用户</span>
				  <span style="color: #3E8EF7;" v-if="scope.row.cardType == 2">商户</span>
				</template>
				</el-table-column>
				<el-table-column
				prop="cardIsActivation"
				label="是否被激活">
				<template slot-scope="scope">
				  <span style="color: #3E8EF7;" v-if="scope.row.cardIsActivation == 0">未使用</span>
				  <span v-if="scope.row.cardIsActivation == 1">已使用</span>
				</template>
				</el-table-column>
				  <el-table-column
					prop="createTime"
					label="创建时间">
				  </el-table-column>
				  <el-table-column
					label="操作"
					width="120">
					<template slot-scope="scope">
					  <el-button
						size="mini"
						type="danger"
						:disabled="!isAuth('couponList:delete')"
						@click="deleteClick(scope.row)">删除
					  </el-button>
					</template>
				  </el-table-column>
				</el-table>
				<div style="text-align: center;margin-top: 10px;">
				  <el-pagination
					@size-change="handleSizeChange"
					@current-change="handleCurrentChange"
					:page-sizes="[10, 15, 20, 25]"
					:page-size="size"
					:current-page="page"
					layout="total,sizes, prev, pager, next,jumper"
					:total="tableData.totalElements">
				  </el-pagination>
				</div>
				<!-- 生成卡券-->
				<el-dialog title="生成卡券" :visible.sync="dialogFormVisible" center>
					<div style="margin-bottom: 10px;">
						<span style="width: 200px;display: inline-block;text-align: right;">卡券名称：</span>
						<el-input style="width:50%;" v-model="cardName" type="text" placeholder="请输入卡券名称"></el-input>
					</div>
					<div style="margin-bottom: 10px;">
						<span style="width: 200px;display: inline-block;text-align: right;">卡券数量：</span>
						<el-input style="width:50%;" v-model="cardNumber" min="0" type="number" placeholder="请输入卡券数量"></el-input>
					</div>
					<div style="margin-bottom: 10px;">
						<span style="width: 200px;display: inline-block;text-align: right;">卡券金额：</span>
						<el-input style="width:50%;" v-model="cardMoney" type="number" min="0" placeholder="请输入卡券金额  单位(元)"></el-input>
					</div>
					<div style="margin-bottom: 10px;">
						<span style="width: 200px;display: inline-block;text-align: right;">卡券类型：</span>
						<el-select v-model="cardType" placeholder="请选择卡券类型" style="width:50%;">
						  <el-option v-for="item in cardTypes" :key="item.value" :label="item.label" :value="item.value">
						  </el-option>
						</el-select>
					</div>
					<div slot="footer" class="dialog-footer">
					  <el-button @click="dialogFormVisible = false">取 消</el-button>
					  <el-button type="primary" @click="releasNoticeTo()">确 定</el-button>
					</div>
				</el-dialog>
				<!-- 导出-->
				<el-dialog title="导出选择" :visible.sync="dialogFormVisible2" center>
				  <div style="margin-bottom: 10px;">
				    <span style="width: 200px;display: inline-block;text-align: right;">卡券名称：</span>
				    <el-input style="width:50%;" v-model="cardName" placeholder="请输入卡券名称"></el-input>
				  </div>
				  <div style="margin-bottom: 10px;">
				    <span style="width: 200px;display: inline-block;text-align: right;">卡号：</span>
				    <el-input style="width:50%;" v-model="cardNo" placeholder="请输入卡号"></el-input>
				  </div>
				  <div style="margin-bottom: 10px;">
				    <span style="width: 200px;display: inline-block;text-align: right;">是否激活：</span>
				    <el-radio-group v-model="cardIsActivation">
				        <el-radio :label="0">未使用</el-radio>
				        <el-radio :label="1">已使用</el-radio>
				    </el-radio-group>
				  </div>
				  <div slot="footer" class="dialog-footer">
				    <el-button @click="dialogFormVisible2 = false">取 消</el-button>
				    <el-button type="primary" @click="couponNoticeTo()">确 定</el-button>
				  </div>
				</el-dialog>
			</el-tab-pane>
			<el-tab-pane label="卡券管理" name="second">
				<div style="display: inline-block;float: right;margin:2% 0;">
					<el-button style='margin-left:15px;' size="mini" type="primary" icon="document" @click="refresh">刷新</el-button>
				</div>
				<el-table
					v-loading="tableDataLoading"
					:data="couponData.content"
					row-key="id">
					<el-table-column
					 prop="id"
					 label="编号"
					 width="80">
					</el-table-column>
					<el-table-column
					 prop="userId"
					 label="用户id"
					 width="150">
					</el-table-column>
					<el-table-column
					prop="userDeductQuota"
					label="用户抵扣总额度(元)">
					<template slot-scope="scope">
					  <span>{{scope.row.userDeductQuota/100}}</span>
					</template>
					</el-table-column>
					<el-table-column
						prop="userFrozenAmount"
						label="用户冻结金额(元)">
						<template slot-scope="scope">
						  <span>{{scope.row.userFrozenAmount/100}}</span>
						</template>
					</el-table-column>
					<el-table-column
						prop="createTime"
						label="创建时间"
						width="180">
					</el-table-column>
				</el-table>
				<div style="text-align: center;margin-top: 10px;">
				  <el-pagination
					@size-change="handleSizeChange1"
					@current-change="handleCurrentChange1"
					:page-sizes="[10, 15, 20, 25]"
					:page-size="size"
					:current-page="page"
					layout="total,sizes, prev, pager, next,jumper"
					:total="couponData.totalElements">
				  </el-pagination>
				</div>
			</el-tab-pane>
			<el-tab-pane label="抵扣明细" name="third">
				<div style="display: inline-block;float: right;margin: 2% 0;">
					<el-button style='margin-left:15px;' size="mini" type="primary" icon="document" @click="refresh1">刷新</el-button>
					<el-button style='margin-left:15px;' :disabled="!isAuth('storeList:delete') || checkBoxData.length <= 0 " size="mini" type="danger" icon="document" @click="choideletes1()">批量删除</el-button>
				</div>
				<el-table
				@selection-change="changeFun"
				v-loading="tableDataLoading"
				  :data="deductionData.content"
				row-key="id">
				<el-table-column type="selection">
				</el-table-column>
				  <el-table-column
					 prop="id"
					 label="编号"
					 width="80">
				  </el-table-column>
				  <el-table-column
					prop="userId"
					label="用户id">
				  </el-table-column>
				  <el-table-column
					prop="couponAmount"
					label="金额">
					<template slot-scope="scope">
					  <span>{{scope.row.couponAmount/100}}</span>
					</template>
				  </el-table-column>
				<el-table-column
				prop="orderId"
				label="订单号">
				</el-table-column>
				<el-table-column
				prop="productTitle"
				label="订单名称">
				</el-table-column>
				  <el-table-column
					prop="createTime"
					label="创建时间">
				  </el-table-column>
				  <el-table-column
					label="操作"
					width="120">
					<template slot-scope="scope">
					  <el-button
						size="mini"
						type="danger"
						:disabled="!isAuth('couponList:delete')"
						@click="deleteClick1(scope.row)">删除
					  </el-button>
					</template>
				  </el-table-column>
				</el-table>
				<div style="text-align: center;margin-top: 10px;">
				  <el-pagination
					@size-change="handleSizeChange2"
					@current-change="handleCurrentChange2"
					:page-sizes="[10, 15, 20, 25]"
					:page-size="size"
					:current-page="page"
					layout="total,sizes, prev, pager, next,jumper"
					:total="deductionData.totalElements">
				  </el-pagination>
				</div>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script>
	export default {
	    data() {
	      return {
				size:10,
				page:1,
				cardId:'',
				cardName:'',
				cardNo:'',
				cardType:'',
				cardIsActivation:'',
				cardUserId:'',
				cardMoney:'',
				cardNumber:'',
				userId:'',
				activeName: 'first',
				checkBoxData: [],//多选框选择的值
				cardTypes:[
					{
						value:'1',
						label:'用户'
					},
					{
						value:'2',
						label:'商户'
					}
				],
				deductionData:[],
				formLabelWidth:'200px',
				tableDataLoading:false,
				dialogFormVisible1:false,
				dialogFormVisible:false,
				dialogFormVisible2:false,
				tableData:[],
				couponData:[]
			}
		},
		methods: {
			// 多选
			changeFun(val) {
				this.checkBoxData = val;
			},
			handleSizeChange (val) {
			  this.size = val
			  this.dataSelect()
			},
			handleCurrentChange (val) {
			  this.page = val
			  this.dataSelect()
			},
			handleSizeChange1 (val) {
			  this.size = val
			  this.couponSelect()
			},
			handleCurrentChange1 (val) {
			  this.page = val
			  this.couponSelect()
			},
			handleSizeChange2 (val) {
			  this.size = val
			  this.deduction()
			},
			handleCurrentChange2 (val) {
			  this.page = val
			  this.deduction()
			},
			// 刷新
			refresh(){
				this.couponSelect()
			},
			// 刷新
			refresh1(){
				this.deduction()
			},
			// 查询
			select () {
        this.page = 1
			  this.dataSelect()
			},
			// 重置
			cleans () {
        this.page = 1
			  this.cardName = ''
			  this.cardNo = ''
			  this.cardType = ''
        this.cardIsActivation = ''
			  this.dataSelect()
			},
			handleClick (tab, event) {
        this.page = 1
			  if (tab._props.label == '卡券列表') {
				this.page = 1
				this.size = 10
			    this.dataSelect()
			  }
			  if (tab._props.label == '卡券管理') {
				this.page = 1
				this.size = 10
			    this.couponSelect()
			  }
			  if (tab._props.label == '抵扣明细') {
				this.page = 1
				this.size = 10
			    this.deduction()
			  }
			},
			derive(){
				this.dialogFormVisible2 = true
			},
			// 导出
			couponNoticeTo () {
			  this.tableDataLoading = true
			  this.$http({
			    url: this.$http.adornUrl2('/couponCard/exportCouponCards'),
			    method: 'post',
				responseType: 'blob',
			    data: this.$http.adornData({
			      'cardId': this.cardId,
			      'cardName': this.cardName,
			      'cardNo': this.cardNo,
			      'cardType': this.cardType,
			      'cardIsActivation': this.cardIsActivation,
				  'cardUserId': this.cardUserId
			    })
			  }).then(({data}) => {
				  this.tableDataLoading = false
			     let blob = new Blob([data], {
					type: 'application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
				 })
				 if (window.navigator.msSaveOrOpenBlob) {
					 navigator.msSaveBlob(blob);
				 } else {
					 let url = window.URL.createObjectURL(blob)
					 let elink = document.createElement('a');
					 elink.download = "卡券列表.xlsx";
					 elink.style.display = 'none';
					 elink.href = url
					 document.body.appendChild(elink);
					 elink.click();
					 document.body.removeChild(elink);
				 }
				  this.dialogFormVisible2 = false
			  })
			},
			// 添加卡券弹框
			addNotice(){
				this.dialogFormVisible = true
			},
			// 添加卡券
			releasNoticeTo(){
				if (this.cardName == '') {
				    this.$notify({
				        title: '提示',
				        duration: 1800,
				        message: '请输入卡券名称',
				        type: 'warning'
				    });
				    return
				}
				if (this.cardNumber == '') {
				    this.$notify({
				        title: '提示',
				        duration: 1800,
				        message: '请输入卡券数量',
				        type: 'warning'
				    });
				    return
				}
				if (this.cardMoney == '') {
				    this.$notify({
				        title: '提示',
				        duration: 1800,
				        message: '请输入卡券金额',
				        type: 'warning'
				    });
				    return
				}
				if (this.cardType == '') {
				    this.$notify({
				        title: '提示',
				        duration: 1800,
				        message: '请选择卡券类型',
				        type: 'warning'
				    });
				    return
				}
				this.$http({
				  url: this.$http.adornUrl2('/couponCard/generateCouponCard'),
				  method: 'post',
				  data: this.$http.adornData({
					'cardName':this.cardName,
					'cardNumber':this.cardNumber,
					'cardMoney':this.cardMoney,
					'cardType':this.cardType
				  })
				}).then(({data}) => {
					this.dialogFormVisible = false
				    this.$message({
				      message: data.data,
				      type: 'success',
				      duration: 1500,
				      onClose: () => {
						this.cardType = ''
						this.cardMoney = ''
						this.cardNumber = ''
						this.cardName = ''
				        this.dataSelect()
				      }
				    })
				})
			},
			// 批量删除卡券
			choideletes(id){
				this.$confirm(`确定批量删除卡券?`, '提示', {
				  confirmButtonText: '确定',
				  cancelButtonText: '取消',
				  type: 'warning'
				}).then(() => {
				  var idnum= id ? [id] : this.checkBoxData.map(item => {
				  	return item.id
				  })
				  let ids = idnum.join(',')
				  this.$http({
				    url: this.$http.adornUrl2(`/couponCard/deleteByIdList?ids=${ids}`),
				    method: 'post',
				    data: this.$http.adornData({
				    })
				  }).then(({data}) => {
				  	if(data.status == 0){
				  		this.$message({
				  			message: '批量删除成功',
				  			type: 'success',
				  			duration: 1500,
				  			onClose: () => {
				  			  this.page = 1
				  			  this.size = 10
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
			// 删除卡券
			deleteClick(row){
				this.$confirm(`确定删除此条信息?`, '提示', {
				  confirmButtonText: '确定',
				  cancelButtonText: '取消',
				  type: 'warning'
				}).then(() => {
				  this.$http({
					url: this.$http.adornUrl2(`/couponCard/deleteById?id=${row.id}`),
					method: 'post',
					data: this.$http.adornData({
					})
				  }).then(({data}) => {
					if(data.status == 0){
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
			// 批量删除抵扣记录
			choideletes1(id){
				this.$confirm(`确定批量删除该信息?`, '提示', {
				  confirmButtonText: '确定',
				  cancelButtonText: '取消',
				  type: 'warning'
				}).then(() => {
				  var idnum= id ? [id] : this.checkBoxData.map(item => {
				  	return item.id
				  })
				  let ids = idnum.join(',')
				  this.$http({
				    url: this.$http.adornUrl2(`/couponOrderDetail/deleteByIdList?ids=${ids}`),
				    method: 'post',
				    data: this.$http.adornData({
				    })
				  }).then(({data}) => {
				  	if(data.status == 0){
				  		this.$message({
				  			message: '批量删除成功',
				  			type: 'success',
				  			duration: 1500,
				  			onClose: () => {
				  			  this.page = 1
				  			  this.size = 10
				  			  this.deduction()
				  			}
				  		})
				  	}else{
				  		this.$message({
				  			message: data.msg,
				  			type: 'error',
				  			duration: 1500,
				  			onClose: () => {
				  			  this.deduction()
				  			}
				  		})
				  	}
				  })
				}).catch(() => {})
			},
			// 批量删除抵扣记录
			deleteClick1(row){
				this.$confirm(`确定删除此条信息?`, '提示', {
				  confirmButtonText: '确定',
				  cancelButtonText: '取消',
				  type: 'warning'
				}).then(() => {
				  this.$http({
					url: this.$http.adornUrl2(`/couponOrderDetail/deleteById?id=${row.id}`),
					method: 'post',
					data: this.$http.adornData({
					})
				  }).then(({data}) => {
					if(data.status == 0){
						this.$message({
							message: '删除成功',
							type: 'success',
							duration: 1500,
							onClose: () => {
							  this.deduction()
							}
						})
					}else{
						this.$message({
							message: data.msg,
							type: 'error',
							duration: 1500,
							onClose: () => {
							  this.couponSelect()
							}
						})
					}

				  })
				}).catch(() => {})
			},
			// 卡券类型
			selectTrigger(){
				this.dataSelect()
			},
			// 获取卡券数据
			dataSelect () {
			  let page = this.page - 1
			  this.tableDataLoading = true
			  this.$http({
				url: this.$http.adornUrl2(`/couponCard/findAllCouponCard?page=${page}&size=${this.size}`),
				method: 'post',
				data: this.$http.adornData({
					'cardId':this.cardId,
					'cardName':this.cardName,
					'cardNo':this.cardNo,
					'cardType':this.cardType,
					'cardIsActivation':this.cardIsActivation,
					'cardUserId':this.cardUserId
				})
			  }).then(({data}) => {
					this.tableDataLoading = false
					let returnData = data.data;
					this.tableData = returnData
			  })
			},
			// 获取卡券数据
			couponSelect () {
			  let page = this.page - 1
			  this.tableDataLoading = true
			  this.$http({
				url: this.$http.adornUrl2(`/couponAmount/findAllCouponAmount?page=${page}&size=${this.size}`),
				method: 'post',
				data: this.$http.adornData({
					'userId':this.userId,
				})
			  }).then(({data}) => {
					this.tableDataLoading = false
					let returnData = data.data;
					this.couponData = returnData
			  })
			},
			// 抵扣明细
			deduction(){
				let page = this.page - 1
				this.tableDataLoading = true
				this.$http({
					url: this.$http.adornUrl2(`/couponOrderDetail/findAllCouponOrderDetail?page=${page}&size=${this.size}`),
					method: 'post',
					data: this.$http.adornData({
						'userId':this.userId,
						'orderId':this.orderId,
						'productId':this.productId,
						'couponAmount':this.couponAmount
					})
				}).then(({data}) => {
					this.tableDataLoading = false
					let returnData = data.data;
					this.deductionData = returnData
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
