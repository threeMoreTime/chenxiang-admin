<template>
	<div>
		<!-- <div style="display: inline-block;font-size:18px;margin-bottom: 15px;">
			<a href="#" @click="prev" style="text-decoration:none;font-size: 14px;">
				<icon-svg name="jiantou" style="width: 1.2em;height: 1.2em;position: relative;top: 0.3em;"></icon-svg>
				返回
			</a>
			<span style="display: inline-block;margin: 0 15px;color: #D9D9D9;">|</span>
			<span>用户详情</span>
		</div> -->
		<el-tabs v-model = "activeName" @tab-click = "handleClick">
			<el-tab-pane label = "用户详情" name = "first">
				<div class = "detailtabel">
					<div class = "table_main">
						<table>
							<tbody>
								<tr>
									<th>本月结算收入</th>
									<td>{{ nowMonthOver ? `${nowMonthOver}元` : '0元' }}</td>
									<th>上月结算收入</th>
									<td>{{ lastMonthOver ? `${lastMonthOver}元` : '0元' }}</td>
									<th>本月付款收入</th>
									<td class = "border-rt">{{ nowMonthPaid ? `${nowMonthPaid}元` : '0元' }}</td>
								</tr>
								<tr>
									<th>上月付款收入</th>
									<td>{{ lastMonthPaid ? `${lastMonthPaid}元` : '0元' }}</td>
									<th>本月付款订单</th>
									<td>{{ nowMonthOrderNumber ? `${nowMonthOrderNumber}笔` : '0笔' }}</td>
									<th>今日付款订单</th>
									<td class = "border-rt">{{ nowDayOrderNumber ? `${nowDayOrderNumber}笔` : '0笔' }}</td>
								</tr>
								<tr>
									<th>上月团队收益</th>
									<td>{{ teamlastOver + teamlastPaid ? `${teamlastOver + teamlastPaid}元` : '0元' }}</td>
									<th>本月团队收益</th>
									<td>{{ teamMonthOver + teamMonthPaid ? `${teamMonthOver + teamMonthPaid}元` : '0元' }}</td>
									<th>推广邀请码</th>
									<td class = "border-rt">{{ tableData.invitationCode }}</td>
								</tr>
								<tr>
									<th>可提现金额</th>
									<td style = "color: rgb(245, 108, 108)">{{ tablejifen ? `${tablejifen}元` : '0元' }}  <span
                    style = "color: #4f9dec;cursor:pointer;" @click = "withdraw(tableData.id,tableData.jifen)">提现提醒</span></td>
									<th>累计提现金额</th>
									<td style = "color: rgb(245, 108, 108)">{{ hasCash ? `${hasCash}元` : '0元' }}</td>
									<th>编号</th>
									<td class = "border-rt">{{ tableData.id }}</td>
								</tr>
								<tr>
									<th>可抵扣金额</th>
									<td style = "color: rgb(245, 108, 108)">{{ (userDeductQuota) / 100 ? (userDeductQuota) / 100 : '0' }} 元</td>
									<th>不可提现金额</th>
									<td style = "color: rgb(245, 108, 108)">
										{{ irrevocable ? `${irrevocable}元` : '0元' }}
										<span style = "color: #4f9dec;cursor:pointer;" @click = "rechargenone()">添加金额</span>
									</td>
									<th>渠道</th>
									<td class = "border-rt">
										<span v-if = "tableData.platform == 'weixin' ">公众号</span>
										<span v-if = "tableData.platform == 'wap' ">网站</span>
										<span v-if = "tableData.platform == 'app' ">APP</span>
										<span v-if = "tableData.platform == 'mp' ">小程序</span>
										<span v-if = "tableData.platform == '' ">未知</span>
									</td>
								</tr>
								<tr>
									<th>创建时间</th>
									<td>{{ tableData.createAt }}</td>
									<th>手机号</th>
									<td>{{ tableData.phone ? tableData.phone : '未绑定' }}</td>
									<th>图像</th>
									<td class = "border-rt"><img :src = "tableData.image_url ? tableData.image_url : 'https://sqx.gomyorder.cn/logo.png'"
                                               width = "80" height = "80"/></td>
								</tr>
								<tr>
									<th>微信名称</th>
									<td>{{ tableData.nickName }}</td>
									<th>地址</th>
									<td>{{ tableData.address ? tableData.address : '未绑定' }}</td>
									<th>支付宝姓名</th>
									<td class = "border-rt">{{ tableData.zhifubaoName ? tableData.zhifubaoName : '未绑定' }}</td>
								</tr>
								<tr>
									<th>支付宝账号</th>
									<td>{{ tableData.zhifubao ? tableData.zhifubao : '未绑定' }}</td>
									<th>性别</th>
									<td>{{ tableData.gender == 2 ? '女' : (tableData.gender == 1 ? '男' : '未知') }}</td>
									<th>会员编号</th>
									<td class = "border-rt">{{ tableData.relationId ? tableData.relationId : '未绑定' }} <span
                    style = "color: #4f9dec;cursor:pointer;"
                    @click = "accredit(tableData.id)"> {{ tableData.isInvitation === 0 ? '立即授权' : '取消授权' }}</span> </td>
								</tr>
								<tr>
									<th>收款二维码</th>
									<td><!--备注 {{ tableData.name }} -->
                  <div v-if="tableData.wxImg == null || tableData.wxImg == ''">
                    暂无收款二维码
                  </div>
                  <div v-else style="display:flex;flex-wrap: wrap;">
                    <div style="margin: 2px;">
                      <el-popover placement="top-start" title="" trigger="hover">
                        <img style="width: 50px; height: 50px" :src="tableData.wxImg" alt="" slot="reference">
                        <img style="width: 300px; height: 300px" :src="tableData.wxImg" alt="">
                      </el-popover>
                    </div>
                  </div>
                  </td>
									<th>app微信登录openid</th>
									<td>{{ tableData.open_uid ? tableData.open_uid : '未授权' }}</td>
									<th>等级描述</th>
									<td class = "border-rt">{{ tableData.gradeDes }}</td>
								</tr>
								<tr>
									<th>等级数字</th>
									<td>{{ tableData.gradeIndex }}</td>
									<th>淘宝openid</th>
									<td>{{ tableData.tb_openid ? tableData.tb_openid : '未绑定' }}</td>
									<th>app消息推送</th>
									<td class = "border-rt">{{ tableData.clientid }}</td>
								</tr>
								<tr>
									<th>苹果用户id</th>
									<td>{{ tableData.appleUserId }}</td>
									<th>小程序mpid</th>
									<td>{{ tableData.mpId ? tableData.mpId : '未绑定' }}</td>
									<th>是否会员</th>
									<td class = "border-rt">
										<span v-if = "tableData.isRelation == 1">是</span>
										<span v-else>否</span>
									</td>
								</tr>
								<tr>
									<th>是否团长</th>
									<td>
										<span v-if = "tableData.isTuan == 1">是</span>
										<span v-else>否</span>
									</td>
									<th>拼多多pid</th>
									<td>{{ tableData.pdd ? tableData.pdd : '未绑定' }}</td>
									<th>京东pid</th>
									<td class = "border-rt">
										{{ tableData.jd ? tableData.jd : '未绑定' }}
									</td>
								</tr>
								<tr>
									<th>邀请人</th>
									<td>{{ tableData.invitation }} <span style = "color: #4f9dec;cursor:pointer;"
                                                       @click = "colonelClick(tableData.invitation)">查看用户详情</span></td>
									<th>等级</th>
									<td>{{ tableData.grade * 100 }}%</td>
									<th>openId</th>
									<td class = "border-rt">{{ tableData.openId ? tableData.openId : '未绑定' }}</td>
								</tr>
								<tr>
									<th class = "border-bt">我的积分</th>
									<td class = "border-bt">{{ tableData.orderJifen }}</td>
									<th class = "border-bt">已邀请人数</th>
									<td class = " border-bt">{{ totalnum }}人</td>
									<th class = "border-bt">用户状态</th>
									<td class = "border-bt border-rt">
										<span v-if = "tableData.state == 'true'">正常</span>
										<span v-if = "tableData.state == 'false'" style = "color: #f56c6c;">禁用</span>
										<span style = "color: #4f9dec;cursor:pointer;" @click = "stateChange(tableData.id)">更改状态</span>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</el-tab-pane>
			<el-tab-pane label = "订单详情" name = "order">
				<el-table v-loading = "tableDataLoading" :data = "orderDatamin.content">
				  <el-table-column fixed prop = "item_img" label = "商品图片">
				    <template slot-scope = "scope">
				      　　<img :src = "scope.row.item_img" width = "40" height = "40"/>
				    </template>
				  </el-table-column>
				  <el-table-column prop = "item_title" label = "商品名称" width = "200">
				  </el-table-column>
				  <el-table-column prop = "relation_id" label = "会员号" width = "100">
				    <template slot-scope = "scope">
				      <span style = "color: #4f9dec;">{{ scope.row.relation_id }}</span>
				    </template>
				  </el-table-column>
				  <el-table-column prop = "invitation" label = "团长号" width = "100">
				    <template slot-scope = "scope">
				      <span style = "color: #4f9dec;">{{ scope.row.invitation }}</span>
				    </template>
				  </el-table-column>
				  <el-table-column prop = "trade_id" label = "订单号" width = "170">
				  </el-table-column>
				  <el-table-column prop = "item_price" label = "商品单价">
				  </el-table-column>
				  <el-table-column prop = "alipay_total_price" label = "实付金额">
				  </el-table-column>
				  <el-table-column prop = "pub_share_pre_fee" label = "商品总佣金" width = "120">
				  </el-table-column>
				  <el-table-column prop = "pub_share_pre_fee_user" label = "会员佣金">
				    <template slot-scope = "scope">
				      <div>{{ scope.row.isGif !== 0 ? '首单' : '' }}</div>
				      <span style = "color: #f56c6c;">{{ scope.row.tk_status !== 13 ? scope.row.pub_share_pre_fee_user : '—' }}</span>
				    </template>
				  </el-table-column>
				  <el-table-column prop = "invitationMoney" label = "团长佣金">
				    <template slot-scope = "scope">
				      <span style = "color: #f56c6c;">{{ scope.row.tk_status !== 13 ? scope.row.invitationMoney : '—' }}</span>
				    </template>
				  </el-table-column>
				  <el-table-column prop = "pub_share_pre_fee_user_s" label = "平台佣金">
				    <template slot-scope = "scope">
				      <span
                style = "color: #f56c6c;">{{ scope.row.tk_status !== 13 ? (scope.row.pub_share_pre_fee - scope.row.pub_share_pre_fee_user - scope.row.invitationMoney).toFixed(2) : '—' }}</span>
				    </template>
				  </el-table-column>
				  <el-table-column prop = "tk_paid_time" label = "支付时间" width = "160">
				  </el-table-column>
				  <el-table-column prop = "fromInfo" label = "来源渠道">
				    <template slot-scope = "scope">
				      <span v-if = "scope.row.fromInfo == 'pdd'">拼多多</span>
				      <span v-if = "scope.row.fromInfo == 'tb'">淘宝</span>
				      <span v-if = "scope.row.fromInfo == 'jd'">京东</span>
				      <span v-if = "scope.row.fromInfo == 'mt'">美团</span>
				      <span v-if = "scope.row.fromInfo == 'elm'">饿了么</span>
				      <span v-if = "scope.row.fromInfo == 'dm'">多麦</span>
				      <span v-if = "scope.row.fromInfo == 'wph'">唯品会</span>
				      <span v-if = "scope.row.fromInfo == 'dy'">抖音</span>
				    </template>
				  </el-table-column>
				  <el-table-column fixed = "right" prop = "tk_status" label = "订单状态">
				    <template slot-scope = "scope">
				      <span v-if = "scope.row.tk_status == 3">已结算</span>
				      <span v-if = "scope.row.tk_status == 12">已付款</span>
				      <span v-if = "scope.row.tk_status == 13">已失效</span>
				    </template>
				  </el-table-column>
				  <el-table-column fixed = "right" prop = "balance" label = "平台结算状态" width = "120">
				    <template slot-scope = "scope">
				      <span v-if = "scope.row.balance == 1" style = "color: #4f9dec;">已结算</span>
				      <span v-if = "scope.row.balance == 0" style = "color: #4f9dec;">未结算</span>
				    </template>
				  </el-table-column>
				</el-table>
				<div style = "text-align: center;margin-top: 10px;">
				  <el-pagination @size-change = "handleSizeChange5" @current-change = "handleCurrentChange5" :page-sizes = "[10, 20, 30, 40]"
                         :page-size = "size" :current-page = "page" layout = "total,sizes, prev, pager, next,jumper"
                         :total = "orderDatamin.totalElements">
				  </el-pagination>
				</div>
			</el-tab-pane>
			<el-tab-pane label = "团队成员" name = "second">
				<el-table v-loading = "tableDataLoading" :data = "tableDatamin">
				  <el-table-column fixed prop = "id" label = "编号" align = "center" width = "80">
				  </el-table-column>
				 <el-table-column fixed prop = "nickName" label = "昵称" width = "150">
				  </el-table-column>
				  <el-table-column prop = "phone" label = "手机号" width = "200">
					 <template slot-scope = "scope">
						<span style = "color: #4f9dec;">{{ scope.row.phone ? scope.row.phone : '未绑定' }}</span>
					 </template>
				   </el-table-column>
				  <el-table-column prop = "createAt" label = "创建时间" width = "100">
				  </el-table-column>
				  <el-table-column prop = "gender" label = "性别" width = "100">
					<template slot-scope = "scope">
						<span v-if = "scope.row.gender == 1">男</span>
						<span v-if = "scope.row.gender == 2">女</span>
					</template>
				  </el-table-column>
				  <el-table-column prop = "relationId" label = "会员编号" width = "100">
					<template slot-scope = "scope">
						<span>{{ scope.row.isInvitation === 0 ? '未授权' : scope.row.relationId ? scope.row.relationId : '未绑定' }}</span>
					</template>
				  </el-table-column>
				  <el-table-column prop = "invitation" label = "邀请人" width = "170">
					<template slot-scope = "scope">
						<span style = "color: #4f9dec;">{{ scope.row.invitation ? scope.row.invitation : '未设置' }}</span>
					</template>
				  </el-table-column>
				  <el-table-column prop = "grade" label = "等级">
					<template slot-scope = "scope">
						<span>{{ scope.row.grade * 100 }}%</span>
					</template>
				  </el-table-column>
				  <el-table-column prop = "zhifubao" label = "支付宝">
					<template slot-scope = "scope">
						<span>{{ scope.row.zhifubaoName }}{{ scope.row.zhifubao ? scope.row.zhifubao : '未绑定' }}</span>
					</template>
				  </el-table-column>
				  <el-table-column prop = "jifen" label = "余额" width = "120">
				  </el-table-column>
				  <el-table-column prop = "orderJifen" label = "积分">
				  </el-table-column>
				  <el-table-column prop = "name" label = "备注">
				  </el-table-column>
				  <el-table-column prop = "pub_share_pre_fee_user_s" label = "来源">
					<template slot-scope = "scope">
						<span v-if = "scope.row.platform == 'weixin' ">微信</span>
						<span v-if = "scope.row.platform == 'wap' ">网站</span>
						<span v-if = "scope.row.platform == 'app' ">APP</span>
						<span v-if = "scope.row.platform == 'mp' ">小程序</span>
						<span v-if = "scope.row.platform == '' "></span>
					</template>
				  </el-table-column>
				  <el-table-column fixed = "right" prop = "state " label = "状态">
					<template slot-scope = "scope">
						  <el-switch v-model = "scope.row.state" @change = "change(scope.row.state,scope.row.id)" :active-value = "openValue"
                         :inactive-value = "closeValue" active-color = "#13ce66" inactive-color = "#ff4949">
							</el-switch>
					</template>
				  </el-table-column>
				</el-table>
				<div style = "text-align: center;margin-top: 10px;">
				  <el-pagination @size-change = "handleSizeChange" @current-change = "handleCurrentChange" :page-sizes = "[10, 20, 30, 40]"
                         :page-size = "size" :current-page = "page" layout = "total,sizes, prev, pager, next,jumper" :total = "totalnum">
				  </el-pagination>
				</div>
			</el-tab-pane>
			<el-tab-pane label = "自营订单" name = "self">
				<div style = "margin:2% 0;display: inline-block;">
					<span>订单状态：</span>
					  <el-select v-model = "status" placeholder = "请选择订单状态" style = "width:150px;" @change = "select(status)">
						<el-option v-for = "item in statusmain" :key = "item.value" :label = "item.label" :value = "item.value">
						</el-option>
					  </el-select>&nbsp;&nbsp;&nbsp;&nbsp;
					</div>
				<el-table v-loading = "tableDataLoading" :data = "selfData.content">
				 <el-table-column fixed prop = "img" label = "商品图片">
					<template slot-scope = "scope">
						<img :src = "scope.row.img" alt = "" width = "60" height = "60">
					</template>
				  </el-table-column>
				  <el-table-column prop = "title" label = "商品标题" width = "200">
				   </el-table-column>
				   <el-table-column prop = "type" label = "商品类型">
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
				  <el-table-column prop = "consignee" label = "收货人" width = "120">
				  </el-table-column>
				  <el-table-column prop = "isExpress" label = "是否虚拟商品" width = "120">
					<template slot-scope = "scope">
						<span v-if = "scope.row.isExpress == 1">否</span>
						<span v-else>是</span>
					</template>
				  </el-table-column>
				  <el-table-column prop = "mobile" label = "手机号" width = "120">
				  </el-table-column>
				  <el-table-column prop = "detail" label = "详细地址" width = "120">
					<template slot-scope = "scope">
						<span>{{ scope.row.provinces }}{{ scope.row.detail }}</span>
					</template>
				  </el-table-column>
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
				  <el-pagination @size-change = "handleSizeChange" @current-change = "handleCurrentChange" :page-sizes = "[5, 10, 15, 20]"
                         :page-size = "size" :current-page = "page" layout = "total,sizes, prev, pager, next,jumper"
                         :total = "selfData.totalElements">
				  </el-pagination>
				</div>
			</el-tab-pane>
			<el-tab-pane label = "用户消息" name = "third">
				<el-table v-loading = "tableDataLoading" :data = "userData.content">
				<el-table-column fixed prop = "id" label = "编号" width = "80">
				 </el-table-column>
				 <el-table-column prop = "userName" label = "用户名称">
				  </el-table-column>
				  <el-table-column prop = "title" label = "消息标题">
				   </el-table-column>
				  <el-table-column prop = "content" label = "消息内容" width = "280">
				  </el-table-column>
				  <el-table-column prop = "createAt" label = "创建时间">
				  </el-table-column>
				</el-table>
				<div style = "text-align: center;margin-top: 10px;">
				  <el-pagination @size-change = "handleSizeChange1" @current-change = "handleCurrentChange1" :page-sizes = "[5, 10, 15, 20]"
                         :page-size = "size" :current-page = "page" layout = "total,sizes, prev, pager, next,jumper"
                         :total = "userData.totalElements">
				  </el-pagination>
				</div>
			</el-tab-pane>
			<el-tab-pane label = "订单消息" name = "fourth">
				<el-table v-loading = "tableDataLoading" :data = "userData.content">
				<el-table-column fixed prop = "id" label = "编号" width = "80">
				 </el-table-column>
				 <el-table-column prop = "userName" label = "用户名称">
				  </el-table-column>
				  <el-table-column prop = "title" label = "消息标题">
				   </el-table-column>
				  <el-table-column prop = "content" label = "消息内容" width = "280">
				  </el-table-column>
				  <el-table-column prop = "createAt" label = "创建时间">
				  </el-table-column>
				</el-table>
				<div style = "text-align: center;margin-top: 10px;">
				  <el-pagination @size-change = "handleSizeChange1" @current-change = "handleCurrentChange1" :page-sizes = "[5, 10, 15, 20]"
                         :page-size = "size" :current-page = "page" layout = "total,sizes, prev, pager, next,jumper"
                         :total = "userData.totalElements">
				  </el-pagination>
				</div>
			</el-tab-pane>
			<el-tab-pane label = "任务消息" name = "fifth">
				<el-table v-loading = "tableDataLoading" :data = "userData.content">
				<el-table-column fixed prop = "id" label = "编号" width = "80">
				 </el-table-column>
				 <el-table-column prop = "userName" label = "用户名称">
				  </el-table-column>
				  <el-table-column prop = "title" label = "消息标题">
				   </el-table-column>
				  <el-table-column prop = "content" label = "消息内容" width = "280">
				  </el-table-column>
				  <el-table-column prop = "createAt" label = "创建时间">
				  </el-table-column>
				</el-table>
				<div style = "text-align: center;margin-top: 10px;">
				  <el-pagination @size-change = "handleSizeChange1" @current-change = "handleCurrentChange1" :page-sizes = "[5, 10, 15, 20]"
                         :page-size = "size" :current-page = "page" layout = "total,sizes, prev, pager, next,jumper"
                         :total = "userData.totalElements">
				  </el-pagination>
				</div>
			</el-tab-pane>
			<el-tab-pane label = "提现记录" name = "sixth">
				<el-table v-loading = "tableDataLoading" :data = "withdrawData">
				<el-table-column fixed prop = "id" label = "编号" width = "80">
				 </el-table-column>
				 <el-table-column prop = "zhifubao" label = "支付宝账号">
				  </el-table-column>
				  <el-table-column prop = "zhifubaoName" label = "支付宝名称">
				   </el-table-column>
				  <el-table-column prop = "money" label = "提现金额">
					<template slot-scope = "scope">
						<span style = "color: #f56c6c;">{{ scope.row.money }}</span>
					</template>
				  </el-table-column>
				  <el-table-column prop = "orderNumber" label = "付款编号">
				  </el-table-column>
				  <el-table-column prop = "createAt" label = "创建时间">
				  </el-table-column>
				  <el-table-column prop = "outAt" label = "结束时间">
				  </el-table-column>
				</el-table>
			</el-tab-pane>
			<el-tab-pane label = "我的积分" name = "seventh">
				<el-table v-loading = "tableDataLoading" :data = "integralData">
				<el-table-column fixed prop = "id" label = "编号" width = "80">
				 </el-table-column>
				 <el-table-column prop = "des" label = "积分明细">
				  </el-table-column>
				  <el-table-column label = "积分" width = "80">
					 <template slot-scope = "scope">
            <span v-if="scope.row.content=='积分兑换'" style = "color: #009926;">-{{ scope.row.number }}</span>
						<span v-else style = "color: #f56c6c;">+{{ scope.row.number }}</span>
					 </template>
				   </el-table-column>
				  <el-table-column prop = "createAt" label = "创建时间" width = "180">
				  </el-table-column>
				</el-table>
			</el-tab-pane>
			<el-tab-pane label = "分销明细" name = "fenxiao">
				<el-table v-loading = "tableDataLoading" :data = "fenxiaoData">
				  <el-table-column prop = "id" label = "编号">
				   </el-table-column>
				   <el-table-column prop = "userId" label = "用户id">
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
				  <el-pagination @size-change = "fenxiaoSelect" @current-change = "fenxiaoSelect" :page-sizes = "[5, 10, 15, 20]"
                         :page-size = "size" :current-page = "page" layout = "total,sizes, prev, pager, next,jumper" :total = "totalnum">
				  </el-pagination>
				</div>
			</el-tab-pane>
			<el-tab-pane label = "钱包明细" name = "eighth">
				<el-table v-loading = "tableDataLoading" :data = "walletData">
				  <el-table-column prop = "id" label = "编号" width = "50">
				  </el-table-column>
				  <el-table-column prop = "title" label = "标题" width = "120">
				   </el-table-column>
				 <el-table-column prop = "content" label = "内容">
				  </el-table-column>
				  <el-table-column prop = "money" label = "金额" width = "100">
					 <template slot-scope = "scope">
						<span style = "color: #f56c6c;">{{ scope.row.money }}</span>
					 </template>
				   </el-table-column>
				  <el-table-column prop = "createTime" label = "创建时间" width = "180">
				  </el-table-column>
				</el-table>
				<div style = "text-align: center;margin-top: 10px;">
				  <el-pagination @size-change = "handleSizeChange2" @current-change = "handleCurrentChange2" :page-sizes = "[10, 20, 30, 40]"
                         :page-size = "size" :current-page = "page" layout = "total,sizes, prev, pager, next,jumper"
                         :total = "walletData.length">
				  </el-pagination>
				</div>
			</el-tab-pane>
			<el-tab-pane label = "充值明细" name = "ninth">
				<div style = "display: inline-block;">
					<span>开始时间：</span>
					<el-date-picker style = "width: 160px;margin-left: 10px;" v-model = "startTime" align = "right" type = "datetime"
                          format = "yyyy-MM-dd" value-format = "yyyy-MM-dd" placeholder = "选择开始时间">
					</el-date-picker>&nbsp;&nbsp;&nbsp;
					<span>截止时间：</span>
					<el-date-picker style = "width: 160px;margin-left: 10px;" v-model = "endTime" align = "right" type = "datetime"
                          format = "yyyy-MM-dd" value-format = "yyyy-MM-dd" placeholder = "选择截止时间">
					</el-date-picker>
					 <el-button style = "margin-left:15px;" size = "mini" type = "primary" icon = "document" @click = "timeDate2">查询</el-button>
				</div>
				<el-table v-loading = "tableDataLoading" :data = "rechargeData">
				  <el-table-column fixed prop = "id" label = "编号" width = "50">
				  </el-table-column>
				  <el-table-column prop = "orderId" label = "充值订单号" width = "200">
				  </el-table-column>
				  <el-table-column prop = "money" label = "充值金额">
				  </el-table-column>
				  <el-table-column prop = "userId" label = "会员编号">
				  </el-table-column>
				  <el-table-column label = "分类">
					<template slot-scope = "scope">
					  <span style = "color: #4f9dec;cursor: pointer;" v-if = "scope.row.classify == 1">微信</span>
					  <span style = "color: #4f9dec;cursor: pointer;" v-if = "scope.row.classify == 2">支付宝</span>
					</template>
				  </el-table-column>
				  <el-table-column label = "状态">
					<template slot-scope = "scope">
						  <span style = "color: #4f9dec;cursor: pointer;" v-if = "scope.row.state == 0">待支付</span>
						<span style = "color: #4f9dec;cursor: pointer;" v-if = "scope.row.state == 1">支付成功</span>
						<span style = "color: #4f9dec;cursor: pointer;" v-if = "scope.row.state == 2">支付失败</span>
					</template>
				  </el-table-column>
				  <el-table-column prop = "createTime" label = "创建时间" width = "170">
				  </el-table-column>
				  <el-table-column prop = "payTime" label = "支付时间" width = "170">
				  </el-table-column>
				</el-table>
				<div style = "text-align: center;margin-top: 10px;">
				  <el-pagination @size-change = "handleSizeChange3" @current-change = "handleCurrentChange3" :page-sizes = "[5, 10, 15]"
                         :page-size = "size" :current-page = "page" layout = "total,sizes, prev, pager, next,jumper" :total = "totalnum2">
				  </el-pagination>
				</div>
			</el-tab-pane>
			<el-tab-pane label = "消息推送" name = "tenth">
				<div style = "float: right;margin-right:2%;">
					<el-button style = "margin: 10px 0;" size = "mini" type = "primary" icon = "document" @click = "magNotice">消息推送</el-button>
				</div>
				<el-table v-loading = "tableDataLoading" :data = "userData.content">
				<el-table-column prop = "id" label = "编号" width = "80">
				 </el-table-column>
				 <el-table-column prop = "userName" label = "用户名称">
				  </el-table-column>
				  <el-table-column prop = "title" label = "消息标题">
				   </el-table-column>
				  <el-table-column prop = "content" label = "消息内容" width = "280">
				  </el-table-column>
				  <el-table-column prop = "createAt" label = "创建时间">
				  </el-table-column>
				</el-table>
				<div style = "text-align: center;margin-top: 10px;">
				  <el-pagination @size-change = "handleSizeChange1" @current-change = "handleCurrentChange1" :page-sizes = "[5, 10, 15, 20]"
                         :page-size = "size" :current-page = "page" layout = "total,sizes, prev, pager, next,jumper"
                         :total = "userData.totalElements">
				  </el-pagination>
				</div>
        <!-- 消息推送 -->
				<el-dialog title = "消息推送" :visible.sync = "dialogFormVisible" center>
					<div style = "margin-bottom: 10px;">
						<span style = "width: 200px;display: inline-block;text-align: right;">消息标题：</span>
						<el-input style = "width: 50%;" v-model = "title" placeholder = "请输入消息标题"></el-input>
					</div>
					<div style = "margin-bottom: 10px;">
						<span style = "width: 200px;display: inline-block;text-align: right;position: relative;top: -65px;">消息内容：</span>
						<el-input style = "width: 50%;" type = "textarea" rows = "4" v-model = "content" placeholder = "请输入消息内容"></el-input>
					</div>
					<div slot = "footer" class = "dialog-footer">
						<el-button @click = "dialogFormVisible = false">取 消</el-button>
						<el-button type = "primary" @click = "magNoticeTo()">确 定</el-button>
					</div>
				</el-dialog>
			</el-tab-pane>
			<el-tab-pane label = "卡券明细" name = "coupon">
				<el-table v-loading = "tableDataLoading" :data = "couponData.content">
				<el-table-column prop = "id" label = "编号" width = "80">
				 </el-table-column>
				 <el-table-column prop = "cardName" label = "卡券名称">
				 </el-table-column>
				 <el-table-column prop = "cardNo" label = "卡号">
				 </el-table-column>
				 <el-table-column prop = "cardMoney" label = "卡券金额">
				 </el-table-column>
				 <el-table-column prop = "cardType" label = "卡券类型">
				 <template slot-scope = "scope">
				   <span style = "color: #3E8EF7;" v-if = "scope.row.cardType == 1">用户</span>
				   <span style = "color: #3E8EF7;" v-if = "scope.row.cardType == 2">商户</span>
				 </template>
				 </el-table-column>
				 <el-table-column prop = "cardIsActivation" label = "是否被激活">
				 <template slot-scope = "scope">
				   <span style = "color: #3E8EF7;" v-if = "scope.row.cardIsActivation == 0">未使用</span>
				   <span v-if = "scope.row.cardIsActivation == 1">已使用</span>
				 </template>
				 </el-table-column>
				 <el-table-column prop = "createTime" label = "创建时间">
				 </el-table-column>
				</el-table>
			</el-tab-pane>
		</el-tabs>
    <!-- 不可提现添加金额 -->
		<el-dialog title = "添加金额" :visible.sync = "dialogFormVisible1" center>
			<div style = "margin-bottom: 10px;">
				<span style = "width: 200px;display: inline-block;text-align: right;">金额：</span>
				<el-input style = "width:50%;" v-model = "amount" type = "number" placeholder = "请输入金额"></el-input>
			</div>
			<div slot = "footer" class = "dialog-footer">
				<el-button @click = "dialogFormVisible1 = false">取 消</el-button>
				<el-button type = "primary" @click = "StairNoticeTo1()">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	export default {
    data () {
      return {
        openValue: 'true',
        closeValue: 'false',
        state: 'false',
        size: 10,
        page: 1,
        userId: '',
        userclass: 0,
        phone: '',
        totalnum: 0,
        totalnum2: 0,
        startTime: '',
        endTime: '',
        moneyFrom: 0,
        flag: 1,
        content: '',
        title: '',
        status: 0,
        amount: '',
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
        info: {
          stockDate: this.getNowTime(),  //日期
        },
        info2: {
          stockDate2: this.getNowTime2(),  //日期
        },
        selfData: [],
        tablejifen: '',
        tableData: {},
        userData: {},
        couponData: [],
        orderDatamin: [],
        tableDatamin: [],
        withdrawData: [],
        integralData: [],
        walletData: [],
        rechargeData: [],
        fenxiaoData: [],
        limitData: {},
        irrevocable: '',
        userDeductQuota: '',
        money: '',
        activeName: 'first',
        tableDataLoading: true,
        dialogFormVisible: false,
        dialogFormVisible1: false,
        relation_id: '',
        relationId: '',
        balance: '',
        tkstatus: '',
        invitation: '',
        nowMonthOver: '',
        lastMonthOver: '',
        nowMonthPaid: '',
        lastMonthPaid: '',
        teamMonthOver: '',
        teamMonthPaid: '',
        teamlastOver: '',
        teamlastPaid: '',
        nowMonthOrderNumber: '',
        nowDayOrderNumber: '',
        hasCash: ''
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
      // 返回上一级
      prev () {
        this.$router.back()
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
      //处理默认选中当前日期
      getNowTime2 () {
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
      // 状态
      change (val, id) {
        this.$http({
          url: this.$http.adornUrl2(`/user/updateState/${id}`),
          method: 'post',
          data: this.$http.adornData({})
        }).then(({data}) => {
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.teamSelect()
            }
          })
        })
      },
      // tabs切换
      handleClick (tab, event) {
        if (tab._props.label == '用户详情') {
          this.dataSelect()
          this.teamSelect()
          this.nowSelect(3)
          this.nowSelect(12)
          this.lastSelect(3)
          this.lastSelect(12)
          this.nowMonthSelect()
          this.nowDaySelect()
          this.accumSelect()
        }
        if (tab._props.label == '团队成员') {
          this.size = 10,
            this.page = 1,
            this.teamSelect()
        }
        if (tab._props.label == '订单详情') {
          this.size = 10,
            this.page = 1,
            this.orderSelect()
        }
        if (tab._props.label == '用户消息') {
          this.size = 10,
            this.page = 1,
            this.userclass = 5
          this.userSelect()
        }
        if (tab._props.label == '订单消息') {
          this.size = 10,
            this.page = 1,
            this.userclass = 4
          this.userSelect()
        }
        if (tab._props.label == '自营订单') {
          this.size = 10,
            this.page = 1,
            this.selfSelect()
        }
        if (tab._props.label == '任务消息') {
          this.size = 10,
            this.page = 1,
            this.userclass = 6
          this.userSelect()
        }
        if (tab._props.label == '消息推送') {
          this.size = 10,
            this.page = 1,
            this.userclass = 8
          this.userSelect()
        }
        if (tab._props.label == '提现记录') {
          this.size = 10,
            this.page = 1,
            this.withdrawSelect()
        }
        if (tab._props.label == '我的积分') {
          this.size = 10,
            this.page = 1,
            this.integralSelect()
        }
        if (tab._props.label == '分销明细') {
          this.size = 10,
            this.page = 1,
            this.phone = ''
          this.status = 0
          this.fenxiaoSelect()
        }
        if (tab._props.label == '钱包明细') {
          this.size = 10,
            this.page = 1,
            this.walletSelect()
        }
        if (tab._props.label == '充值明细') {
          this.size = 10,
            this.page = 1,
            this.rechargeSelect()
        }
        if (tab._props.label == '卡券明细') {
          this.couponSelect()
        }
      },
      handleSizeChange (val) {
        this.size = val
        this.teamSelect()
      },
      handleCurrentChange (val) {
        this.page = val
        this.teamSelect()
      },
      handleSizeChange1 (val) {
        this.size = val
        this.userSelect()
      },
      handleCurrentChange1 (val) {
        this.page = val
        this.userSelect()
      },
      handleSizeChange2 (val) {
        this.size = val
        this.walletSelect()
      },
      handleCurrentChange2 (val) {
        this.page = val
        this.walletSelect()
      },
      handleSizeChange3 (val) {
        this.size = val
        this.rechargeSelect()
      },
      handleCurrentChange3 (val) {
        this.page = val
        this.rechargeSelect()
      },
      handleSizeChange4 (val) {
        this.size = val
        this.fenxiaoSelect()
      },
      handleCurrentChange4 (val) {
        this.page = val
        this.orderSelect()
      },
      handleSizeChange5 (val) {
        this.size = val
        this.orderSelect()
      },
      handleCurrentChange5 (val) {
        this.page = val
        this.orderSelect()
      },
      handleSizeChange6 (val) {
        this.couponSelect()
      },
      handleCurrentChange6 (val) {
        this.couponSelect()
      },
      handleCurrentChange6 (val) {
        this.couponSelect()
      },
      handleSizeChange7 (val) {
        this.selfSelect()
      },
      timeDate2 () {
        this.rechargeSelect()
      },
      select () {
        this.selfSelect()
      },
      // 详情
      orderDetails (id) {
        this.$router.push({path: '/orderDetails', query: {id: id}})
      },
      // 可提现金额
      withdraw (id, val) {
        if (val == 0) {
          this.$message({
            message: '可提现金额为0元',
            type: 'error',
            duration: 1500,
            onClose: () => {
              this.dataSelect()
            }
          })
        } else {
          this.$confirm(`确定要推送提现消息吗?`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$http({
              url: this.$http.adornUrl2(`/user/notification/${id}`),
              method: 'post',
              data: this.$http.adornData({})
            }).then(({data}) => {
              this.$message({
                message: '推送成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.dataSelect()
                }
              })
            })
          }).catch(() => {
          })
        }

      },
      //授权
      accredit (id) {
        this.$confirm(`确定要授权会员权限吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl2(`/user/updateInvitation/${id}`),
            method: 'post',
            params: this.$http.adornData({})
          }).then(({data}) => {
            this.$message({
              message: '修改成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.dataSelect()
              }
            })
          })
        }).catch(() => {
        })
      },
      // 团长跳转详情页
      colonelClick (relationId) {
        this.$http({
          url: this.$http.adornUrl2('/user/relationId'),
          method: 'get',
          params: this.$http.adornParams({
            'relationId': relationId,
          })
        }).then(({data}) => {
          let returnData = data.data
          let id = returnData.id
          if (this.value == 1) {
            this.$router.push({path: '/userDetail', query: {userId: id}})
            this.valueSelect()
            this.dataSelect()
            this.teamClose(3)
            this.teamClose(12)
            this.teamlastClose(3)
            this.teamlastClose(12)
            this.nowSelect(3)
            this.nowSelect(12)
            this.lastSelect(3)
            this.lastSelect(12)
            this.nowMonthSelect()
            this.nowDaySelect()
            this.accumSelect()
            this.limitSelect()
          } else {
            this.$router.push({path: '/userDetailThree', query: {userId: id}})
            this.valueSelect()
            this.dataSelect()
            this.teamClose(3)
            this.teamClose(12)
            this.teamlastClose(3)
            this.teamlastClose(12)
            this.nowSelect(3)
            this.nowSelect(12)
            this.lastSelect(3)
            this.lastSelect(12)
            this.nowMonthSelect()
            this.nowDaySelect()
            this.accumSelect()
            this.limitSelect()
          }
        })
      },
      // 更改状态
      stateChange (id) {
        this.$confirm(`确定要更改用户状态吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl2(`/user/updateState/${id}`),
            method: 'post',
            params: this.$http.adornData({})
          }).then(({data}) => {
            this.$message({
              message: '修改成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.dataSelect()
              }
            })
          })
        }).catch(() => {
        })
      },
      // 消息推送
      magNotice () {
        this.dialogFormVisible = true
      },
      // 消息推送
      magNoticeTo () {
        if (this.title == '') {
          this.$notify({
            title: '提示',
            duration: 1800,
            message: '请输入标题',
            type: 'warning'
          })
          return
        }
        if (this.content == '') {
          this.$notify({
            title: '提示',
            duration: 1800,
            message: '请输入内容',
            type: 'warning'
          })
          return
        }
        this.$http({
          url: this.$http.adornUrl2('/cash/sendMsg'),
          method: 'get',
          params: this.$http.adornParams({
            'title': this.title,
            'content': this.content,
            'phone': this.phone,
            'flag': this.flag
          })
        }).then(({data}) => {
          this.dialogFormVisible = false
          if (data.status == -100) {
            this.$message({
              message: data.msg,
              type: 'error',
              duration: 1500,
              onClose: () => {
                this.title = ''
                this.content = ''
                this.userSelect()
              }
            })
          }
          if (data.status == 0) {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.title = ''
                this.content = ''
                this.userSelect()
              }
            })
          }
        })
      },
      // 获取数据列表
      dataSelect () {
        let userId = this.$route.query.userId
        this.$http({
          url: this.$http.adornUrl2(`/user/${userId}`),
          method: 'get',
          params: this.$http.adornParams({})
        }).then(({data}) => {
          if (data.status === 0) {
            let returnData = data.data
            this.tableData = returnData
            this.phone = returnData.phone
            this.tablejifen = Math.floor(returnData.jifen)
          }
        })
      },
      // 本月预计收入
      nowSelect (tkstatus) {
        let userId = this.$route.query.userId
        this.$http({
          url: this.$http.adornUrl2(`/user/${userId}`),
          method: 'get',
          params: this.$http.adornParams({})
        }).then(({data}) => {
          if (data.status === 0) {
            let returnData = data.data
            this.relation_id = returnData.relationId
          }
          if(returnData.relationId){
            this.$http({
              url: this.$http.adornUrl2('/order/count'),
              method: 'get',
              params: this.$http.adornParams({
                'relation_id': this.relation_id,
                'tk_status': tkstatus
              })
            }).then(({data}) => {
              let returnData = data.data
              if (tkstatus === 3) {
                this.nowMonthOver = Math.floor(returnData)
              }
              if (tkstatus === 12) {
                this.nowMonthPaid = Math.floor(returnData)
              }
            })
          }

        })
      },
      // 上月预计收入
      lastSelect (tkstatus) {
        let userId = this.$route.query.userId
        this.$http({
          url: this.$http.adornUrl2(`/user/${userId}`),
          method: 'get',
          params: this.$http.adornParams({})
        }).then(({data}) => {
          if (data.status === 0) {
            let returnData = data.data
            this.relation_id = returnData.relationId
          }
          this.$http({
            url: this.$http.adornUrl2('/order/last/count'),
            method: 'get',
            params: this.$http.adornParams({
              'relation_id': this.relation_id,
              'tk_status': tkstatus
            })
          }).then(({data}) => {
            let returnData = data.data
            if (tkstatus === 3) {
              this.lastMonthOver = Math.floor(returnData)
            }
            if (tkstatus === 12) {
              this.lastMonthPaid = Math.floor(returnData)
            }
          })
        })

      },
      // 获取本月付款订单
      nowMonthSelect () {
        let userId = this.$route.query.userId
        this.$http({
          url: this.$http.adornUrl2(`/user/${userId}`),
          method: 'get',
          params: this.$http.adornParams({})
        }).then(({data}) => {
          if (data.status === 0) {
            this.tableDataLoading = false
            let returnData = data.data
            this.relation_id = returnData.relationId
          }
          this.$http({
            url: this.$http.adornUrl2(`/order/month/${this.relation_id}`),
            method: 'get',
            params: this.$http.adornParams({})
          }).then(({data}) => {
            let returnData = data.data
            this.nowMonthOrderNumber = returnData
          })
        })
      },
      // 获取用户不可提现金额
      irrevoSelect () {
        let userId = this.$route.query.userId
        console.log(userId)
        this.$http({
          url: this.$http.adornUrl2(`/user/queryHelpTaskUserAmount?userId=${userId}`),
          method: 'post',
          data: this.$http.adornData({})
        }).then(({data}) => {
          let returnData = data.data.cannot_money
          if (returnData == null) {
            this.irrevocable = 0
          } else {
            this.irrevocable = Math.floor(returnData)
          }
        })
      },
      // 获取今日付款订单
      nowDaySelect () {
        let userId = this.$route.query.userId
        this.$http({
          url: this.$http.adornUrl2(`/user/${userId}`),
          method: 'get',
          params: this.$http.adornParams({})
        }).then(({data}) => {
          if (data.status === 0) {
            let returnData = data.data
            this.relation_id = returnData.relationId
          }
          this.$http({
            url: this.$http.adornUrl2(`/order/paidCount/${this.relation_id}`),
            method: 'get',
            params: this.$http.adornParams({})
          }).then(({data}) => {
            let returnData = data.data
            this.nowDayOrderNumber = returnData
          })
        })
      },
      // 本月团队收益
      teamClose (tkstatus) {
        this.info.stockDate = this.info.stockDate.substring(0, 7)
        let userId = this.$route.query.userId
        this.$http({
          url: this.$http.adornUrl2(`/user/${userId}`),
          method: 'get',
          params: this.$http.adornParams({})
        }).then(({data}) => {
          if (data.status === 0) {
            let returnData = data.data
            this.relationId = returnData.relationId
          }
          this.$http({
            url: this.$http.adornUrl2(`/statistics/TeamOrderTotalByRelation?relation=${this.relationId}&tk_status=${tkstatus}&time=${this.info.stockDate}`),
            method: 'get',
            params: this.$http.adornParams({})
          }).then(({data}) => {
            let returnData = data.data
            if (tkstatus === 3) {
              this.teamMonthOver = Math.floor(returnData)
            }
            if (tkstatus === 12) {
              this.teamMonthPaid = Math.floor(returnData)
            }
          })
        })
      },
      // 上月团队收益
      teamlastClose (tkstatus) {
        var date = new Date()
        var year = date.getFullYear()
        var month = date.getMonth() + 1
        var day = date.getDate()
        if (month < 10) {
          month = '0' + month
        }
        if (day < 10) {
          day = '0' + day
        }
        var month1 = date.getMonth()
        var nowDate = year + '-' + month
        if (month1 < 10) {
          month1 = '0' + month1
        }
        var lastDate = year + '-' + month1
        let userId = this.$route.query.userId
        this.$http({
          url: this.$http.adornUrl2(`/user/${userId}`),
          method: 'get',
          params: this.$http.adornParams({})
        }).then(({data}) => {
          if (data.status === 0) {
            let returnData = data.data
            this.relationId = returnData.relationId
          }
          this.$http({
            url: this.$http.adornUrl2(`/statistics/TeamOrderTotalByRelation?relation=${this.relationId}&tk_status=${tkstatus}&time=${lastDate}`),
            method: 'get',
            params: this.$http.adornParams({})
          }).then(({data}) => {
            let returnData = data.data
            if (tkstatus === 3) {
              this.teamlastOver = Math.floor(returnData)
            }
            if (tkstatus === 12) {
              this.teamlastPaid = Math.floor(returnData)
            }
          })
        })
      },
      // 获取用户提现金额
      accumSelect () {
        let userId = this.$route.query.userId
        this.$http({
          url: this.$http.adornUrl2(`/user/${userId}`),
          method: 'get',
          params: this.$http.adornParams({})
        }).then(({data}) => {
          if (data.status === 0) {
            let returnData = data.data
            this.relationId = returnData.relationId
          }
          this.$http({
            url: this.$http.adornUrl2(`/cash/countByRelationId/${this.relationId}`),
            method: 'get',
            params: this.$http.adornParams({})
          }).then(({data}) => {
            let returnData = data.data
            this.hasCash = Math.floor(returnData)
          })
        })
      },
      // 获取团队成员
      teamSelect () {
        console.log("`````````````````````````````")
        this.tableDataLoading = true
        let userId = this.$route.query.userId
        this.$http({
          url: this.$http.adornUrl2(`/user/${userId}`),
          method: 'get',
          params: this.$http.adornParams({})
        }).then(({data}) => {
          if (data.status === 0) {
            let returnData = data.data
            this.invitation = returnData.relationId
            this.$http({
              url: this.$http.adornUrl2(`/user/getInvitations/${this.invitation}/${this.page - 1}/${this.size}`),
              method: 'get',
              params: this.$http.adornParams({})
            }).then(({data}) => {
              this.tableDataLoading = false
              let returnData = data.data
              this.tableDatamin = returnData.content
              this.totalnum = returnData.totalElements
              this.balance = returnData.content.length
            })
          }
        })
      },
      // 自营订单
      selfSelect () {
        this.tableDataLoading = true
        let page = this.page - 1
        let userId = this.$route.query.userId
        this.$http({
          url: this.$http.adornUrl2('/orders/findMyList'),
          method: 'get',
          params: this.$http.adornParams({
            'page': page,
            'size': this.size,
            'userId': userId,
            'status': this.status
          })
        }).then(({data}) => {
          this.tableDataLoading = false
          let returnData = data.data
          this.selfData = returnData
        })
      },
      // 获取用户/订单消息
      userSelect () {
        this.tableDataLoading = true
        let userId = this.$route.query.userId
        this.$http({
          url: this.$http.adornUrl2(`/message/findType/${userId}/${this.userclass}/${this.page - 1}/${this.size}`),
          method: 'get',
          params: this.$http.adornParams({})
        }).then(({data}) => {
          this.tableDataLoading = false
          let returnData = data.data
          this.userData = returnData
        })
      },
      // 获取用户提现记录
      withdrawSelect () {
        this.tableDataLoading = true
        let userId = this.$route.query.userId
        this.$http({
          url: this.$http.adornUrl2(`/user/${userId}`),
          method: 'get',
          params: this.$http.adornParams({})
        }).then(({data}) => {
          if (data.status === 0) {
            let returnData = data.data
            this.relationId = returnData.relationId
            this.$http({
              url: this.$http.adornUrl2(`/cash/list/${this.relationId}`),
              method: 'get',
              params: this.$http.adornParams({})
            }).then(({data}) => {
              this.tableDataLoading = false
              let returnData = data.data
              this.withdrawData = returnData
            })
          }
        })
      },
      // 获取我的积分
      integralSelect () {
        this.tableDataLoading = true
        let userId = this.$route.query.userId
        this.$http({
          url: this.$http.adornUrl2(`/user/getUserJifenList/${userId}`),
          method: 'post',
          data: this.$http.adornData({})
        }).then(({data}) => {
          this.tableDataLoading = false
          let returnData = data.data
          this.integralData = returnData
        })
      },
      // 分销明细
      fenxiaoSelect () {
        let page = this.page - 1
        this.tableDataLoading = true
        let userId = this.$route.query.userId
        this.$http({
          url: this.$http.adornUrl2('/ordersRelation/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': page,
            'size': this.size,
            'userId': userId,
            'phone': this.phone,
            'status': this.status,
            'moneyFrom': this.moneyFrom
          })
        }).then(({data}) => {
          this.tableDataLoading = false
          let returnData = data.data
          this.fenxiaoData = returnData.content
          this.totalnum = returnData.totalElements
        })
      },
      // 获取钱包明细
      walletSelect () {
        this.tableDataLoading = true
        let userId = this.$route.query.userId
        let page = this.page - 1
        this.$http({
          url: this.$http.adornUrl2(`/user/selectUserDetails`),
          method: 'get',
          params: this.$http.adornParams({
            'page': page,
            'size': this.size,
            'userId': userId
          })
        }).then(({data}) => {
          this.tableDataLoading = false
          let returnData = data.data
          this.walletData = returnData.content
        })
      },
      // 订单详情
      orderSelect () {
        this.tableDataLoading = true
        let userId = this.$route.query.userId
        this.$http({
          url: this.$http.adornUrl2(`/order/orderListByUserId?userId=${userId}&page=${this.page - 1}&size=${this.size}`),
          method: 'get',
          params: this.$http.adornParams({})
        }).then(({data}) => {
          this.tableDataLoading = false
          let returnData = data.data
          this.orderDatamin = returnData
        })
      },
      // 卡券明细
      couponSelect () {
        this.tableDataLoading = true
        let userId = this.$route.query.userId
        this.$http({
          url: this.$http.adornUrl2(`/couponCard/findCouponCardListByUserId?userId=${userId}`),
          method: 'post',
          data: this.$http.adornData({})
        }).then(({data}) => {
          this.tableDataLoading = false
          let returnData = data.data
          this.couponData = returnData
        })
      },
      //用户卡券可抵扣额度
      limitSelect () {
        let userId = this.$route.query.userId
        this.$http({
          url: this.$http.adornUrl2(`/couponAmount/findCouponAmountByUserId?userId=${userId}`),
          method: 'post',
          data: this.$http.adornData({})
        }).then(({data}) => {
          if (data.status == 0) {
            this.tableDataLoading = false
            let returnData = data.data
            this.userDeductQuota = returnData.userDeductQuota
          } else {
            this.userDeductQuota = 0
          }

        })
      },
      // 不可提现金额充值
      rechargenone () {
        this.dialogFormVisible1 = true
      },
      StairNoticeTo1 () {
        let userId = this.$route.query.userId
        if (this.amount == '') {
          this.$notify({
            title: '提示',
            duration: 1800,
            message: '请输入金额',
            type: 'warning'
          })
          return
        }
        this.$http({
          url: this.$http.adornUrl2(`/user/addHelpTaskUserAmount?userId=${userId}&amount=${this.amount}`),
          method: 'post',
          data: this.$http.adornData({})
        }).then(({data}) => {
          if (data.status == 0) {
            this.$message({
              message: '添加金额成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.amount = ''
                this.irrevoSelect()
              }
            })
            this.dialogFormVisible1 = false
          } else {
            this.$message.error(data.msg)
          }

        })
      },
      valueSelect () {
        this.$http({
          url: this.$http.adornUrl2('/common/type/91'),
          method: 'get',
          params: this.$http.adornParams({})
        }).then(({data}) => {
          let returnData = data.data
          this.value = returnData.value
        })
      },
      // 获取用户不可提现金额
      irrevoSelect () {
        let userId = this.$route.query.userId
        console.log(userId)
        this.$http({
          url: this.$http.adornUrl2(`/user/queryHelpTaskUserAmount?userId=${userId}`),
          method: 'post',
          data: this.$http.adornData({})
        }).then(({data}) => {
          let returnData = data.data.cannotMoney
          if (returnData == null) {
            this.irrevocable = 0
          } else {
            this.irrevocable = Math.floor(returnData)
          }
        })
      },
      // 获取充值明细
      rechargeSelect () {
        if (this.endTime == '') {
          this.endTime = this.info.stockDate
        }
        if (this.startTime == '') {
          this.startTime = this.info2.stockDate2
        }
        this.tableDataLoading = true
        let userId = this.$route.query.userId
        this.$http({
          url: this.$http.adornUrl2(`/user/${userId}`),
          method: 'get',
          params: this.$http.adornParams({})
        }).then(({data}) => {
          if (data.status === 0) {
            let returnData = data.data
            this.phone = returnData.phone
            this.$http({
              url: this.$http.adornUrl2(`/cash/selectPayDetails?page=${this.page - 1}&size=${this.size}&phone=${this.phone}&startTime=${this.startTime}&endTime=${this.endTime}`),
              method: 'post',
              data: this.$http.adornData({})
            }).then(({data}) => {
              this.tableDataLoading = false
              let returnData = data.data
              this.rechargeData = returnData.content
              this.totalnum2 = returnData.totalElements
            })
          }
        })
        this.tableDataLoading = true

      }
    },
    activated () {
      this.dataSelect()
      this.teamClose(3)
      this.teamClose(12)
      this.teamlastClose(3)
      this.teamlastClose(12)
      this.teamSelect()
      this.nowSelect(3)
      this.nowSelect(12)
      this.lastSelect(3)
      this.lastSelect(12)
      this.nowMonthSelect()
      this.nowDaySelect()
      this.accumSelect()
      this.limitSelect()
      this.irrevoSelect()
      this.teamSelect()
    }
  }
</script>

<style scoped = "scoped">
	.detailtabel h2 {
    margin-top: 0;
  }

  .detailtabel .table_main table {
    width: 100%;
  }

  .detailtabel .table_main {
    border: 1px solid #e8e8e8;
  }

  .detailtabel table tr {
    border-bottom: 1px solid #e8e8e8;
  }

  .detailtabel table tr th {
    background-color: #fafafa;
    padding: 16px 24px;
    border-right: 1px solid #e8e8e8;
    border-bottom: 1px solid #e8e8e8;
  }

  .detailtabel table tr td {
    padding: 16px 24px;
    border-right: 1px solid #e8e8e8;
    border-bottom: 1px solid #e8e8e8;
  }

  .detailtabel table th {
    color: rgba(0, 0, 0, .85);
    font-weight: 400;
    font-size: 14px;
    line-height: 1.5;
  }

  .border-rt {
    border-right: none !important;
  }

  .border-bt {
    border-bottom: none !important;
  }

  .table_main tr td.border-rt {
    width: 20%;
  }
</style>
