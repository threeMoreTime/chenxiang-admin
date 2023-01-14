<template>
	<div>
		<div class = "record_date">
			<el-row>
				<el-col :span = "6" class = "cards">
				  <div class = "box">
					 <div class = "box_num">
						 <div class = "box_color">公众号关注用户</div>
						 <div class = "text_color"><span>{{ consultNumber ? consultNumber : 0 }}</span>人</div>
					 </div>
				  </div>
				</el-col>
				<el-col :span = "6" class = "cards">
				  <div class = "box">
					 <div class = "box_num">
						 <div class = "box_color">累计用户</div>
						 <div class = "text_color"><span>{{ skillNumber - amorNumber ? skillNumber - amorNumber : 0 }}</span>人</div>
					 </div>
				  </div>
				</el-col>
				<el-col :span = "6" class = "cards">
				  <div class = "box">
					 <div class = "box_num">
						 <div class = "box_color">累计会员</div>
						 <div class = "text_color"><span>{{ amorNumber ? amorNumber : 0 }}</span>人</div>
					 </div>
				  </div>
				</el-col>
				<el-col :span = "6" class = "cards">
				  <div class = "box">
					 <div class = "box_num">
						 <div class = "box_color">总用户</div>
						 <div class = "text_color"><span>{{ skillNumber ? skillNumber : 0 }}</span>人</div>
					 </div>
				  </div>
				</el-col>
				<el-col :span = "6" class = "cards">
				  <div class = "box">
					 <div class = "box_num">
						 <div class = "box_color">今日交易订单</div>
						 <div class = "text_color"><span>{{ phraseNumber ? phraseNumber : 0 }}</span>笔</div>
					 </div>
				  </div>
				</el-col>
				<el-col :span = "6" class = "cards">
				  <div class = "box">
					 <div class = "box_num">
						 <div class = "box_color">本月交易订单</div>
						 <div class = "text_color"><span>{{ monthNumber ? monthNumber : 0 }}</span>笔</div>
					 </div>
				  </div>
				</el-col>
				<el-col :span = "6" class = "cards">
				  <div class = "box">
					 <div class = "box_num">
						 <div class = "box_color">今日收入</div>
						 <div class = "text_color"><span>{{ nowDayNumber + nowDayJieSuan ? nowDayNumber + nowDayJieSuan : 0 }}</span>元</div>
					 </div>
				  </div>
				</el-col>
				<el-col :span = "6" class = "cards">
				  <div class = "box">
					 <div class = "box_num">
						 <div class = "box_color">本月总收入</div>
						 <div
               class = "text_color"><span>{{ nowMonthPayNumber + nowMonthJieSuan ? nowMonthPayNumber + nowMonthJieSuan : 0 }}</span>元</div>
					 </div>
				  </div>
				</el-col>
			</el-row>
			<div>
				<el-select v-model = "way" style = "width:150px;margin-left: 10px;" @change = "orderfenxi">
				  <el-option v-for = "item in ways" :key = "item.value" :label = "item.label" :value = "item.value">
				  </el-option>
				</el-select>&nbsp;&nbsp;&nbsp;
				<el-date-picker style = "width: 160px;margin-left: 10px;" v-model = "info.stockDate" align = "right" type = "datetime"
                        format = "yyyy-MM-dd" value-format = "yyyy-MM-dd" placeholder = "选择开始时间" @change = "animeOrder">
				 </el-date-picker>
			</div>
			<el-tabs v-model = "activeName" @tab-click = "handleClick" style = "margin-left: 10px;">
				<el-tab-pane label = "用户分析" name = "first">
					<el-row>
						<el-col :span = "6" class = "cards">
						  <div class = "box">
							 <div class = "box_num">
								 <div class = "box_color">总用户统计</div>
								 <div class = "text_color"><span>{{ userStat ? userStat : 0 }}</span>人</div>
							 </div>
						  </div>
						</el-col>
						<el-col :span = "6" class = "cards">
						  <div class = "box">
							 <div class = "box_num">
								 <div class = "box_color">会员统计</div>
								 <div class = "text_color"> <span>{{ memberStat ? memberStat : 0 }}</span>人</div>
							 </div>
						  </div>
						</el-col>
						<el-col :span = "6" class = "cards">
						  <div class = "box">
							 <div class = "box_num">
								 <div class = "box_color">非会员统计</div>
								 <div class = "text_color"><span>{{ notmberStat ? notmberStat : 0 }}</span>人</div>
							 </div>
						  </div>
						</el-col>
						<el-col :span = "6" class = "cards">
						  <div class = "box">
							 <div class = "box_num">
								 <div class = "box_color">APP渠道用户统计</div>
								 <div class = "text_color"><span>{{ appStat ? appStat : 0 }}</span>人</div>
							 </div>
						  </div>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span = "6" class = "cards">
						  <div class = "box">
							 <div class = "box_num">
								 <div class = "box_color">公众号渠道用户统计</div>
								 <div class = "text_color"><span>{{ weixinStat ? weixinStat : 0 }}</span>人</div>
							 </div>
						  </div>
						</el-col>
						<el-col :span = "6" class = "cards">
						  <div class = "box">
							 <div class = "box_num">
								 <div class = "box_color">网站渠道用户统计</div>
								 <div class = "text_color"> <span>{{ wapStat ? wapStat : 0 }}</span>人</div>
							 </div>
						  </div>
						</el-col>
						<el-col :span = "6" class = "cards">
						  <div class = "box">
							 <div class = "box_num">
								 <div class = "box_color">手机号用户</div>
								 <div class = "text_color"><span>{{ phoneStat ? phoneStat : 0 }}</span>人</div>
							 </div>
						  </div>
						</el-col>
						<el-col :span = "6" class = "cards">
						  <div class = "box">
							 <div class = "box_num">
								 <div class = "box_color">未绑定手机号用户</div>
								 <div class = "text_color"><span>{{ userStat - phoneStat }}</span>人</div>
							 </div>
						  </div>
						</el-col>
					</el-row>
			 	</el-tab-pane>
				<el-tab-pane label = "平台订单分析" name = "second">
					<el-row>
						<el-col :span = "6" class = "cards">
						  <div class = "box">
							 <div class = "box_num">
								 <div class = "box_color">淘宝总订单</div>
								 <div class = "text_color"><span>{{ tbPay + tbOver + tbExit }}</span>笔</div>
							 </div>
						  </div>
						</el-col>
						<el-col :span = "6" class = "cards">
						  <div class = "box">
							 <div class = "box_num">
								 <div class = "box_color">淘宝付款</div>
								 <div class = "text_color"> <span>{{ tbPay }}</span>笔</div>
							 </div>
						  </div>
						</el-col>
						<el-col :span = "6" class = "cards">
						  <div class = "box">
							 <div class = "box_num">
								 <div class = "box_color">淘宝结算</div>
								 <div class = "text_color"><span>{{ tbOver }}</span>笔</div>
							 </div>
						  </div>
						</el-col>
						<el-col :span = "6" class = "cards">
						  <div class = "box">
							 <div class = "box_num">
								 <div class = "box_color">淘宝退款</div>
								 <div class = "text_color"><span>{{ tbExit }}</span>笔</div>
							 </div>
						  </div>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span = "6" class = "cards">
						  <div class = "box">
							 <div class = "box_num">
								 <div class = "box_color">京东总订单</div>
								 <div class = "text_color"><span>{{ jdPay + jdPay + jdExit }}</span>笔</div>
							 </div>
						  </div>
						</el-col>
						<el-col :span = "6" class = "cards">
						  <div class = "box">
							 <div class = "box_num">
								 <div class = "box_color">京东付款</div>
								 <div class = "text_color"> <span>{{ jdPay }}</span>笔</div>
							 </div>
						  </div>
						</el-col>
						<el-col :span = "6" class = "cards">
						  <div class = "box">
							 <div class = "box_num">
								 <div class = "box_color">京东结算</div>
								 <div class = "text_color"><span>{{ jdOver }}</span>笔</div>
							 </div>
						  </div>
						</el-col>
						<el-col :span = "6" class = "cards">
						  <div class = "box">
							 <div class = "box_num">
								 <div class = "box_color">京东退款</div>
								 <div class = "text_color"><span>{{ jdExit }}</span>笔</div>
							 </div>
						  </div>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span = "6" class = "cards">
						  <div class = "box">
							 <div class = "box_num">
								 <div class = "box_color">拼多多总订单</div>
								 <div class = "text_color"><span>{{ pddPay + pddOver + pddExit }}</span>笔</div>
							 </div>
						  </div>
						</el-col>
						<el-col :span = "6" class = "cards">
						  <div class = "box">
							 <div class = "box_num">
								 <div class = "box_color">拼多多付款</div>
								 <div class = "text_color"> <span>{{ pddPay }}</span>笔</div>
							 </div>
						  </div>
						</el-col>
						<el-col :span = "6" class = "cards">
						  <div class = "box">
							 <div class = "box_num">
								 <div class = "box_color">拼多多结算</div>
								 <div class = "text_color"><span>{{ pddOver }}</span>笔</div>
							 </div>
						  </div>
						</el-col>
						<el-col :span = "6" class = "cards">
						  <div class = "box">
							 <div class = "box_num">
								 <div class = "box_color">拼多多退款</div>
								 <div class = "text_color"><span>{{ pddExit }}</span>笔</div>
							 </div>
						  </div>
						</el-col>
					</el-row>
          <el-row>
						<el-col :span = "6" class = "cards">
						  <div class = "box">
							 <div class = "box_num">
								 <div class = "box_color">美团总订单</div>
								 <div class = "text_color"><span>{{ mtPay + mtOver + mtExit }}</span>笔</div>
							 </div>
						  </div>
						</el-col>
						<el-col :span = "6" class = "cards">
						  <div class = "box">
							 <div class = "box_num">
								 <div class = "box_color">美团付款</div>
								 <div class = "text_color"> <span>{{ mtPay }}</span>笔</div>
							 </div>
						  </div>
						</el-col>
						<el-col :span = "6" class = "cards">
						  <div class = "box">
							 <div class = "box_num">
								 <div class = "box_color">美团结算</div>
								 <div class = "text_color"><span>{{ mtOver }}</span>笔</div>
							 </div>
						  </div>
						</el-col>
						<el-col :span = "6" class = "cards">
						  <div class = "box">
							 <div class = "box_num">
								 <div class = "box_color">美团退款</div>
								 <div class = "text_color"><span>{{ mtExit }}</span>笔</div>
							 </div>
						  </div>
						</el-col>
					</el-row>
          <el-row>
						<el-col :span = "6" class = "cards">
						  <div class = "box">
							 <div class = "box_num">
								 <div class = "box_color">饿了么总订单</div>
								 <div class = "text_color"><span>{{ elmPay + elmOver + elmExit }}</span>笔</div>
							 </div>
						  </div>
						</el-col>
						<el-col :span = "6" class = "cards">
						  <div class = "box">
							 <div class = "box_num">
								 <div class = "box_color">饿了么付款</div>
								 <div class = "text_color"> <span>{{ elmPay }}</span>笔</div>
							 </div>
						  </div>
						</el-col>
						<el-col :span = "6" class = "cards">
						  <div class = "box">
							 <div class = "box_num">
								 <div class = "box_color">饿了么结算</div>
								 <div class = "text_color"><span>{{ elmOver }}</span>笔</div>
							 </div>
						  </div>
						</el-col>
						<el-col :span = "6" class = "cards">
						  <div class = "box">
							 <div class = "box_num">
								 <div class = "box_color">饿了么退款</div>
								 <div class = "text_color"><span>{{ elmExit }}</span>笔</div>
							 </div>
						  </div>
						</el-col>
					</el-row>
          <el-row>
						<el-col :span = "6" class = "cards">
						  <div class = "box">
							 <div class = "box_num">
								 <div class = "box_color">多麦总订单</div>
								 <div class = "text_color"><span>{{ dmPay + dmOver + dmExit }}</span>笔</div>
							 </div>
						  </div>
						</el-col>
						<el-col :span = "6" class = "cards">
						  <div class = "box">
							 <div class = "box_num">
								 <div class = "box_color">多麦付款</div>
								 <div class = "text_color"> <span>{{ dmPay }}</span>笔</div>
							 </div>
						  </div>
						</el-col>
						<el-col :span = "6" class = "cards">
						  <div class = "box">
							 <div class = "box_num">
								 <div class = "box_color">多麦结算</div>
								 <div class = "text_color"><span>{{ dmOver }}</span>笔</div>
							 </div>
						  </div>
						</el-col>
						<el-col :span = "6" class = "cards">
						  <div class = "box">
							 <div class = "box_num">
								 <div class = "box_color">多麦退款</div>
								 <div class = "text_color"><span>{{ dmExit }}</span>笔</div>
							 </div>
						  </div>
						</el-col>
					</el-row>
          <el-row>
          	<el-col :span = "6" class = "cards">
          	  <div class = "box">
          		 <div class = "box_num">
          			 <div class = "box_color">唯品会总订单</div>
          			 <div class = "text_color"><span>{{ wphPay + wphOver + wphExit }}</span>笔</div>
          		 </div>
          	  </div>
          	</el-col>
          	<el-col :span = "6" class = "cards">
          	  <div class = "box">
          		 <div class = "box_num">
          			 <div class = "box_color">唯品会付款</div>
          			 <div class = "text_color"> <span>{{ wphPay }}</span>笔</div>
          		 </div>
          	  </div>
          	</el-col>
          	<el-col :span = "6" class = "cards">
          	  <div class = "box">
          		 <div class = "box_num">
          			 <div class = "box_color">唯品会结算</div>
          			 <div class = "text_color"><span>{{ wphOver }}</span>笔</div>
          		 </div>
          	  </div>
          	</el-col>
          	<el-col :span = "6" class = "cards">
          	  <div class = "box">
          		 <div class = "box_num">
          			 <div class = "box_color">唯品会退款</div>
          			 <div class = "text_color"><span>{{ wphExit }}</span>笔</div>
          		 </div>
          	  </div>
          	</el-col>
          </el-row>
          <el-row>
          	<el-col :span = "6" class = "cards">
          	  <div class = "box">
          		 <div class = "box_num">
          			 <div class = "box_color">抖音总订单</div>
          			 <div class = "text_color"><span>{{ dyPay + dyOver + dyExit }}</span>笔</div>
          		 </div>
          	  </div>
          	</el-col>
          	<el-col :span = "6" class = "cards">
          	  <div class = "box">
          		 <div class = "box_num">
          			 <div class = "box_color">抖音付款</div>
          			 <div class = "text_color"> <span>{{ dyPay }}</span>笔</div>
          		 </div>
          	  </div>
          	</el-col>
          	<el-col :span = "6" class = "cards">
          	  <div class = "box">
          		 <div class = "box_num">
          			 <div class = "box_color">抖音结算</div>
          			 <div class = "text_color"><span>{{ dyOver }}</span>笔</div>
          		 </div>
          	  </div>
          	</el-col>
          	<el-col :span = "6" class = "cards">
          	  <div class = "box">
          		 <div class = "box_num">
          			 <div class = "box_color">抖音退款</div>
          			 <div class = "text_color"><span>{{ dyExit }}</span>笔</div>
          		 </div>
          	  </div>
          	</el-col>
          </el-row>
				</el-tab-pane>
				<el-tab-pane label = "团长分析" name = "third">
					<el-table v-loading = "tableDataLoading" :data = "tableData" height = "220px">
					  <el-table-column type = "index" label = "排名" width = "350">
						  <template slot-scope = "scope">
							<span>{{ (page - 1) * size + scope.$index + 1 }}</span>
						  </template>
					  </el-table-column>
					  <el-table-column prop = "grade" label = "团长编号">
						<template slot-scope = "scope">
								<span style = "color: #4f9dec;">{{ scope.row.grade }}</span>
						</template>
					  </el-table-column>
					  <el-table-column prop = "money" label = "邀请人数">
					  </el-table-column>
					</el-table>
				</el-tab-pane>
				<el-tab-pane label = "团长订单分析" name = "fourth">
					<el-table v-loading = "tableDataLoading" :data = "colonelData" height = "220px">
					  <el-table-column type = "index" label = "排名" width = "50">
						  <template slot-scope = "scope">
							<span>{{ (page - 1) * size + scope.$index + 1 }}</span>
						  </template>
					  </el-table-column>
					  <el-table-column prop = "invitaion" label = "团长编号">
					  </el-table-column>
					  <el-table-column prop = "paidMoney" label = "付款金额(元)">
					  </el-table-column>
					  <el-table-column prop = "jieSuanMoney" label = "结算金额(元)">
					  </el-table-column>
					  <el-table-column prop = "totalMoney" label = "累计金额(元)">
					  </el-table-column>
					  <el-table-column prop = "paidNumber" label = "付款订单(笔)">
					  </el-table-column>
					  <el-table-column prop = "jieSuanNumber" label = "结算订单(笔)">
					  </el-table-column>
					  <el-table-column prop = "totalNumber" label = "累计订单(笔)">
					  </el-table-column>
					</el-table>
				</el-tab-pane>
				<el-tab-pane label = "购买商品分析" name = "fifth">
					<el-table v-loading = "tableDataLoading" :data = "commodityData" height = "250px">
					  <el-table-column type = "index" label = "排名" width = "100">
						  <template slot-scope = "scope">
							<span>{{ (page - 1) * size + scope.$index + 1 }}</span>
						  </template>
					  </el-table-column>
					  <el-table-column prop = "time" label = "商品图片">
							<template slot-scope = "scope">
								<img :src = "scope.row.time" alt = "" width = "40" height = "40">
							</template>
					  </el-table-column>
					  <el-table-column prop = "userName" label = "商品名称">
					  </el-table-column>
					  <el-table-column prop = "grade" label = "商品编号">
					  </el-table-column>
					  <el-table-column prop = "money" label = "购买人数">
					  </el-table-column>
					</el-table>
				</el-tab-pane>
				<el-tab-pane label = "用户积分分析" name = "sixth">
					<el-table v-loading = "tableDataLoading" :data = "userjfData" height = "250px">
					  <el-table-column type = "index" label = "排名" width = "200">
						  <template slot-scope = "scope">
							<span>{{ (page - 1) * size + scope.$index + 1 }}</span>
						  </template>
					  </el-table-column>
					  <el-table-column prop = "userName" label = "会员编号">
						<template slot-scope = "scope">
								<span style = "color: #4f9dec;">{{ scope.row.userName }}</span>
						</template>
					  </el-table-column>
					  <el-table-column prop = "grade" label = "积分数量">
					  </el-table-column>
					  <el-table-column prop = "money" label = "积分额度">
					  </el-table-column>
					</el-table>
				</el-tab-pane>
				<el-tab-pane label = "自营订单分析" name = "ziying">
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
				<el-tab-pane label = "任务分析" name = "renwu">
					<el-row>
						<el-col :span = "6" class = "cards">
						  <div class = "box">
							 <div class = "box_num">
								 <div class = "box_color">发单总金额</div>
								 <div class = "text_color"><span>{{ taskStat.takeOrderSum ? taskStat.takeOrderSum : 0 }}</span>元</div>
							 </div>
						  </div>
						</el-col>
						<el-col :span = "6" class = "cards">
						  <div class = "box">
							 <div class = "box_num">
								 <div class = "box_color">接单总金额</div>
								 <div class = "text_color"> <span>{{ taskStat.sendOrderSum ? taskStat.sendOrderSum : 0 }}</span>元</div>
							 </div>
						  </div>
						</el-col>
						<el-col :span = "6" class = "cards">
						  <div class = "box">
							 <div class = "box_num">
								 <div class = "box_color">发单数量</div>
								 <div class = "text_color"><span>{{ taskStat.takeOrderCount ? taskStat.takeOrderCount : 0 }}</span>笔</div>
							 </div>
						  </div>
						</el-col>
						<el-col :span = "6" class = "cards">
						  <div class = "box">
							 <div class = "box_num">
								 <div class = "box_color">接单数量</div>
								 <div class = "text_color"><span>{{ taskStat.sendOrderCount ? taskStat.sendOrderCount : 0 }}</span>笔</div>
							 </div>
						  </div>
						</el-col>
					</el-row>
				</el-tab-pane>
        <el-tab-pane label = "活跃用户分析" name = "active">
					<el-row>
						<el-col :span = "6" class = "cards">
						  <div class = "box">
							 <div class = "box_num">
								 <div class = "box_color">本年活跃</div>
								 <div class = "text_color"><span>{{ dynamic.year ? dynamic.year : 0 }}</span>人</div>
							 </div>
						  </div>
						</el-col>
						<el-col :span = "6" class = "cards">
						  <div class = "box">
							 <div class = "box_num">
								 <div class = "box_color">本月活跃</div>
								 <div class = "text_color"><span>{{ dynamic.month ? dynamic.month : 0 }}</span>人</div>
							 </div>
						  </div>
						</el-col>
						<el-col :span = "6" class = "cards">
						  <div class = "box">
							 <div class = "box_num">
								 <div class = "box_color">昨日活跃</div>
								 <div class = "text_color"><span>{{ dynamic.yesterday ? dynamic.yesterday : 0 }}</span>人</div>
							 </div>
						  </div>
						</el-col>
						<el-col :span = "6" class = "cards">
						  <div class = "box">
							 <div class = "box_num">
								 <div class = "box_color">今日活跃</div>
								 <div class = "text_color"><span>{{ dynamic.day ? dynamic.day : 0 }}</span>人</div>
							 </div>
						  </div>
						</el-col>
					</el-row>
					<div>
						<el-table v-loading = "tableDataLoading" :data = "activeData.content">
						  <el-table-column prop = "userId" label = "编号">
						  </el-table-column>
						  <el-table-column prop = "userName" label = "用户名">
							<template slot-scope = "scope">
							  <span style = "color: #4f9dec;cursor: pointer;"
                      @click = "updates(scope.row)">{{ scope.row.userName ? scope.row.userName : '未设置' }}</span>
							</template>
						  </el-table-column>
						 <el-table-column prop = "updateTime" label = "创建时间" width = "160">
						 </el-table-column>
						</el-table>
						<div style = "text-align: center;margin-top: 10px;">
						  <el-pagination @size-change = "handleSizeChangeactive" @current-change = "handleCurrentChangeactive"
                             :page-sizes = "[5, 10, 15, 20]" :page-size = "size" :current-page = "page"
                             layout = "total,sizes, prev, pager, next,jumper" :total = "activeData.totalElements">
						  </el-pagination>
						</div>
					</div>
				</el-tab-pane>
			</el-tabs>
		</div>
	</div>
</template>

<script>
	export default {
    data () {
      return {
        size: 5,
        page: 1,
        tableData: [],
        colonelData: [],
        commodityData: [],
        userjfData: [],
        fenxiaoData: [],
        totalnum: 0,
        status: 0,
        vanumber:3,
        consultNumber: '',
        stallNumber: '',
        amorNumber: '',
        skillNumber: '',
        phraseNumber: '',
        monthNumber: '',
        nowDayNumber: '',
        nowDayJieSuan: '',
        nowMonthPayNumber: '',
        nowMonthJieSuan: '',
        activeName: 'first',
        tableDataLoading: true,
        intervalId: 0,
        jdPay: 0,//京东付款订单
        jdOver: 0,//京东结算订单
        jdExit: 0,//京东退款订单
        pddPay: 0,//拼多多付款订单
        pddOver: 0,//拼多多结算订单
        pddExit: 0,//拼多多退款订单
        tbPay: 0,//淘宝付款订单
        tbOver: 0,//淘宝结算订单
        tbExit: 0,//淘宝退款订单
        mtPay: 0,//美团付款订单
        mtOver: 0,//美团结算订单
        mtExit: 0,//美团退款订单
        elmPay: 0,//饿了么付款订单
        elmOver: 0,//饿了么结算订单
        elmExit: 0,//饿了么退款订单
        dmPay: 0,//多麦付款订单
        dmOver: 0,//多麦结算订单
        dmExit: 0,//多麦退款订单
        wphPay: 0,//唯品会付款订单
        wphOver: 0,//唯品会结算订单
        wphExit: 0,//唯品会退款订单
        dyPay: 0,//抖音付款订单
        dyOver: 0,//抖音结算订单
        dyExit: 0,//抖音退款订单
        userStat: 0,//总用户统计
        sumincome: '',
        income: '',
        wxincome: '',
        zfbincome: '',
        yueicome: '',
        ordersum0: '',
        ordersum1: '',
        ordersum2: '',
        memberStat: 0,
        notmberStat: 0,
        appStat: 0,
        weixinStat: 0,
        wapStat: 0,
        phoneStat: 0,
        notphoneStat: 0,//未绑定手机号
        data: '',
        time: '',
        platform: '',
        type: '',
        balance: -1,
        way: 3,
        tk_status0: 12,
        tk_status1: 3,
        taskStat: {},
        activeData: [],
        dynamic: {},
        info: {
          stockDate: this.getNowTime(),  //日期
        },
        infoDate:'',
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
    mounted () {
      this.infoDate = this.info.stockDate
      this.colonel()
      this.phoneData()
      this.colonelOrder()
      this.shoppData()
      this.userinteData()
      this.consultData()//公众号关注用户
      this.amorData()//累计会员
      this.skillData()//总用户数
      this.phraseData()//今日交易订单
      this.monthData()//本月交易订单
      this.nowDayData()//今日付款
      this.JieSuanData()//今日结算
      this.nowMonthData()//本月付款
      this.MonthJieData()//本月结算
      this.orderData('tb', 3)
      this.orderData('tb', 12)
      this.orderData('tb', 13)
      this.orderData('jd', 3)
      this.orderData('jd', 12)
      this.orderData('jd', 13)
      this.orderData('pdd', 3)
      this.orderData('pdd', 12)
      this.orderData('pdd', 13)
      this.orderData('mt', 3)
      this.orderData('mt', 12)
      this.orderData('mt', 13)
      this.orderData('elm', 3)
      this.orderData('elm', 12)
      this.orderData('elm', 13)
      this.orderData('dm', 3)
      this.orderData('dm', 12)
      this.orderData('dm', 13)
      this.orderData('wph', 3)
      this.orderData('wph', 12)
      this.orderData('wph', 13)
      this.orderData('dy', 3)
      this.orderData('dy', 12)
      this.orderData('dy', 13)
      this.userData('app', -1)
      this.userData('wap', -1)
      this.userData('weixin', -1)
      this.userData('all', 1)
      this.userData('all', 0)
      this.userData('all', -1)
    },
    methods: {
      // 订单分析选择日期
      animeOrder () {
        this.infoDate = this.info.stockDate
        if(this.vanumber==1){
        	this.infoDate = this.info.stockDate.substring(0, 4)
        }else if(this.vanumber==2){
        	this.infoDate = this.info.stockDate.substring(0, 7)
        }
        this.orderData('tb', 3)
        this.orderData('tb', 12)
        this.orderData('tb', 13)
        this.orderData('jd', 3)
        this.orderData('jd', 12)
        this.orderData('jd', 13)
        this.orderData('pdd', 3)
        this.orderData('pdd', 12)
        this.orderData('pdd', 13)
        this.orderData('mt', 3)
        this.orderData('mt', 12)
        this.orderData('mt', 13)
        this.orderData('elm', 3)
        this.orderData('elm', 12)
        this.orderData('elm', 13)
        this.orderData('dm', 3)
        this.orderData('dm', 12)
        this.orderData('dm', 13)
        this.orderData('wph', 3)
        this.orderData('wph', 12)
        this.orderData('wph', 13)
        this.orderData('dy', 3)
        this.orderData('dy', 12)
        this.orderData('dy', 13)
        this.userData('app', -1)
        this.userData('wap', -1)
        this.userData('weixin', -1)
        this.userData('all', 1)
        this.userData('all', 0)
        this.userData('all', -1)
        this.phoneData()
        this.colonel()
        this.colonelOrder()
        this.shoppData()
        this.userinteData()
        this.moneySelect()
        this.orderSelect()
        this.taskData()
      },
      // 订单分析年月日
      orderfenxi (value) {
        let vanumber = value
        this.vanumber=vanumber
        if (vanumber === 3) {
          this.infoDate = this.info.stockDate
          this.orderData('tb', 3)
          this.orderData('tb', 12)
          this.orderData('tb', 13)
          this.orderData('jd', 3)
          this.orderData('jd', 12)
          this.orderData('jd', 13)
          this.orderData('pdd', 3)
          this.orderData('pdd', 12)
          this.orderData('pdd', 13)
          this.orderData('mt', 3)
          this.orderData('mt', 12)
          this.orderData('mt', 13)
          this.orderData('elm', 3)
          this.orderData('elm', 12)
          this.orderData('elm', 13)
          this.orderData('dm', 3)
          this.orderData('dm', 12)
          this.orderData('dm', 13)
          // this.orderData('wph', 3)
          // this.orderData('wph', 12)
          // this.orderData('wph', 13)
          // this.orderData('dy', 3)
          // this.orderData('dy', 12)
          // this.orderData('dy', 13)
          this.userData('app', -1)
          this.userData('wap', -1)
          this.userData('weixin', -1)
          this.userData('all', 1)
          this.userData('all', 0)
          this.userData('all', -1)
          this.phoneData()
          this.colonel()
          this.colonelOrder()
          this.shoppData()
          this.userinteData()
          this.moneySelect()
          this.orderSelect()
          this.taskData()
          this.dynamicList()
        }
        if (vanumber === 2) {
          this.infoDate = this.info.stockDate.substring(0, 7)
          this.orderData('tb', 3)
          this.orderData('tb', 12)
          this.orderData('tb', 13)
          this.orderData('jd', 3)
          this.orderData('jd', 12)
          this.orderData('jd', 13)
          this.orderData('pdd', 3)
          this.orderData('pdd', 12)
          this.orderData('pdd', 13)
          this.orderData('mt', 3)
          this.orderData('mt', 12)
          this.orderData('mt', 13)
          this.orderData('elm', 3)
          this.orderData('elm', 12)
          this.orderData('elm', 13)
          this.orderData('dm', 3)
          this.orderData('dm', 12)
          this.orderData('dm', 13)
          this.orderData('wph', 3)
          this.orderData('wph', 12)
          this.orderData('wph', 13)
          this.orderData('dy', 3)
          this.orderData('dy', 12)
          this.orderData('dy', 13)
          this.userData('app', -1)
          this.userData('wap', -1)
          this.userData('weixin', -1)
          this.userData('all', 1)
          this.userData('all', 0)
          this.userData('all', -1)
          this.phoneData()
          this.colonel()
          this.colonelOrder()
          this.shoppData()
          this.userinteData()
          this.moneySelect()
          this.taskData()
          this.dynamicList()
          // this.info.stockDate = this.getNowTime()
        }
        if (vanumber === 1) {
          this.infoDate = this.info.stockDate.substring(0, 4)
          this.orderData('tb', 3)
          this.orderData('tb', 12)
          this.orderData('tb', 13)
          this.orderData('jd', 3)
          this.orderData('jd', 12)
          this.orderData('jd', 13)
          this.orderData('pdd', 3)
          this.orderData('pdd', 12)
          this.orderData('pdd', 13)
          this.orderData('mt', 3)
          this.orderData('mt', 12)
          this.orderData('mt', 13)
          this.orderData('elm', 3)
          this.orderData('elm', 12)
          this.orderData('elm', 13)
          this.orderData('dm', 3)
          this.orderData('dm', 12)
          this.orderData('dm', 13)
          this.orderData('wph', 3)
          this.orderData('wph', 12)
          this.orderData('wph', 13)
          this.orderData('dy', 3)
          this.orderData('dy', 12)
          this.orderData('dy', 13)
          this.userData('app', -1)
          this.userData('wap', -1)
          this.userData('weixin', -1)
          this.userData('all', 1)
          this.userData('all', 0)
          this.userData('all', -1)
          this.phoneData()
          this.colonel()
          this.colonelOrder()
          this.shoppData()
          this.userinteData()
          this.moneySelect()
          this.taskData()
          this.dynamicList()
          // this.info.stockDate = this.getNowTime()
        }
      },
      // Tabs点击事件
      handleClick (tab, event) {

        if (tab._props.label == '用户分析') {
          this.info.stockDate = this.getNowTime()
        }
        if (tab._props.label == '订单分析') {
          this.info.stockDate = this.getNowTime()
        }
        if (tab._props.label == '自营订单分析') {
          this.moneySelect()
          this.orderSelect()
        }

        if (tab._props.label == '任务分析') {
          this.taskData()
        }
        if (tab._props.label == '活跃用户分析') {
          this.dynamicList()
          this.dynamicSelect()
        }
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
      handleSizeChangeactive (val) {
        this.size = val
        this.dynamicList()
      },
      handleCurrentChangeactive (val) {
        this.page = val
        this.dynamicList()
      },
      // 活跃统计
      dynamicSelect () {
        let userId = this.$route.query.userId
        this.$http({
          url: this.$http.adornUrl2('/statistics/selectTeamUserLogCount'),
          method: 'get',
          params: this.$http.adornParams({
            'userId': userId,
          })
        }).then(({data}) => {
          let returnData = data.data
          this.dynamic = returnData
        })
      },
      // 活跃统计列表
      dynamicList () {
        this.tableDataLoading = true
        let page = this.page - 1
        this.$http({
          url: this.$http.adornUrl2('/statistics/selectTeamUserLogList'),
          method: 'get',
          params: this.$http.adornParams({
            'page': page,
            'size': this.size,
            'flag': this.way,
            'time': this.info.stockDate,
          })
        }).then(({data}) => {
          this.tableDataLoading = false
          let returnData = data.data
          this.activeData = returnData
        })
      },
      //任务分析
      taskData () {
        this.$http({
          url: this.$http.adornUrl2('/statistics/taskAnalysis'),
          method: 'get',
          params: this.$http.adornParams({
            'time': this.info.stockDate,
            'flag': this.way
          })
        }).then(({data}) => {
          let returnData = data.data
          this.taskStat = returnData
        })
      },
      // 公众号关注用户
      consultData () {
        this.$http({
          url: this.$http.adornUrl2('/wx/getUserTotal'),
          method: 'get',
          params: this.$http.adornParams({})
        }).then(({data}) => {
          let returnData = data.data
          this.consultNumber = returnData
        })
      },
      //累计会员
      amorData () {
        this.$http({
          url: this.$http.adornUrl2('/user/findAllByRelationIdNotNull'),
          method: 'get',
          params: this.$http.adornParams({})
        }).then(({data}) => {
          let returnData = data.data
          this.amorNumber = returnData
        })
      },
      //总用户
      skillData () {
        this.$http({
          url: this.$http.adornUrl2('/user/getCountNumber'),
          method: 'get',
          params: this.$http.adornParams({})
        }).then(({data}) => {
          let returnData = data.data
          this.skillNumber = returnData
        })
      },
      //今日交易订单
      phraseData () {
        this.$http({
          url: this.$http.adornUrl2('/order/getPaidCountNoRelation'),
          method: 'get',
          params: this.$http.adornParams({
            'time': this.info.stockDate,
          })
        }).then(({data}) => {
          let returnData = data.data
          this.phraseNumber = returnData
        })
      },
      //本月交易订单
      monthData () {
        const time2 = this.info.stockDate.substring(0, 7)
        this.$http({
          url: this.$http.adornUrl2('/order/getPaidCountNoRelation'),
          method: 'get',
          params: this.$http.adornParams({
            'time': time2,
          })
        }).then(({data}) => {
          let returnData = data.data
          this.monthNumber = returnData
        })
      },
      //今日付款
      nowDayData () {
        this.$http({
          url: this.$http.adornUrl2(`/order/getTotalByTimeNoBalance/${this.tk_status0}`),
          method: 'get',
          params: this.$http.adornParams({
            'time': this.info.stockDate,
          })
        }).then(({data}) => {
          let returnData = data.data
          this.nowDayNumber = Math.round(returnData)
        })
      },
      //今日结算
      JieSuanData () {
        this.$http({
          url: this.$http.adornUrl2(`/order/getTotalByTimeNoBalance/${this.tk_status1}`),
          method: 'get',
          params: this.$http.adornParams({
            'time': this.info.stockDate
          })
        }).then(({data}) => {
          let returnData = data.data
          this.nowDayJieSuan = Math.round(returnData)
        })
      },
      //本月付款
      nowMonthData () {
        const time2 = this.info.stockDate.substring(0, 7)
        this.$http({
          url: this.$http.adornUrl2(`/order/getTotalByTimeNoBalance/${this.tk_status0}`),
          method: 'get',
          params: this.$http.adornParams({
            'time': time2,
          })
        }).then(({data}) => {
          let returnData = data.data
          this.nowMonthPayNumber = Math.round(returnData)
        })
      },
      //本月结算
      MonthJieData () {
        const time2 = this.info.stockDate.substring(0, 7)
        this.$http({
          url: this.$http.adornUrl2(`/order/getTotalByTimeNoBalance/${this.tk_status1}`),
          method: 'get',
          params: this.$http.adornParams({
            'time': time2,
          })
        }).then(({data}) => {
          let returnData = data.data
          this.nowMonthJieSuan = Math.round(returnData)
        })
      },
      //订单数据
      orderData (platform, type) {
        this.$http({
          url: this.$http.adornUrl2('/statistics/getOrderTotal'),
          method: 'get',
          params: this.$http.adornParams({
            'time': this.infoDate,
            'platform': platform,
            'type': type,
            'balance': this.balance,
          })
        }).then(({data}) => {
          let returnData = data.data

          if (platform === 'tb' && type === 3) {
            this.tbOver = returnData
          }
          if (platform === 'tb' && type === 12) {
            this.tbPay = returnData
          }
          if (platform === 'tb' && type === 13) {
            this.tbExit = returnData
          }

          if (platform === 'jd' && type === 3) {
            this.jdOver = returnData
          }
          if (platform === 'jd' && type === 12) {
            this.jdPay = returnData
          }
          if (platform === 'jd' && type === 13) {
            this.jdExit = returnData
          }

          if (platform === 'pdd' && type === 3) {
            this.pddOver = returnData
          }
          if (platform === 'pdd' && type === 12) {
            this.pddPay = returnData
          }
          if (platform === 'pdd' && type === 13) {
            this.pddExit = returnData
          }

          if (platform === 'mt' && type === 3) {
            this.mtOver = returnData
          }
          if (platform === 'mt' && type === 12) {
            this.mtPay = returnData
          }
          if (platform === 'mt' && type === 13) {
            this.mtExit = returnData
          }

          if (platform === 'elm' && type === 3) {
            this.elmOver = returnData
          }
          if (platform === 'elm' && type === 12) {
            this.elmPay = returnData
          }
          if (platform === 'elm' && type === 13) {
            this.elmExit = returnData
          }

          if (platform === 'dm' && type === 3) {
            this.dmOver = returnData
          }
          if (platform === 'dm' && type === 12) {
            this.dmPay = returnData
          }
          if (platform === 'dm' && type === 13) {
            this.dmExit = returnData
          }

          if (platform === 'wph' && type === 3) {
            this.wphOver = returnData
          }
          if (platform === 'wph' && type === 12) {
            this.wphPay = returnData
          }
          if (platform === 'wph' && type === 13) {
            this.wphExit = returnData
          }

          if (platform === 'dy' && type === 3) {
            this.dyOver = returnData
          }
          if (platform === 'dy' && type === 12) {
            this.dyPay = returnData
          }
          if (platform === 'dy' && type === 13) {
            this.dyExit = returnData
          }
        })
      },
      // 用户分析
      userData (platform, type) {
        this.$http({
          url: this.$http.adornUrl2('/statistics/getUserTotal'),
          method: 'get',
          params: this.$http.adornParams({
            'time': this.infoDate,
            'platform': platform,
            'type': type,
          })
        }).then(({data}) => {
          let returnData = data.data
          if (platform === 'app' && type === -1) {
            this.appStat = returnData
          }

          if (platform === 'wap' && type === -1) {
            this.wapStat = returnData
          }

          if (platform === 'weixin' && type === -1) {
            this.weixinStat = returnData
          }

          if (platform === 'all' && type === -1) {
            this.userStat = returnData
          }

          if (platform === 'all' && type === 1) {
            this.memberStat = returnData
          }

          if (platform === 'all' && type === 0) {
            this.notmberStat = returnData
          }
        })
      },
      // 手机号统计
      phoneData () {
        this.$http({
          url: this.$http.adornUrl2('/statistics/getCountNumberByTimeByPhone'),
          method: 'get',
          params: this.$http.adornParams({
            'time': this.infoDate,
          })
        }).then(({data}) => {
          let returnData = data.data
          this.phoneStat = returnData
        })
      },
      // 团长分析
      colonel () {
        this.tableDataLoading = true
        this.$http({
          url: this.$http.adornUrl2('/statistics/getCountByTime'),
          method: 'get',
          params: this.$http.adornParams({
            'time': this.infoDate,
          })
        }).then(({data}) => {
          this.tableDataLoading = false
          let returnData = data.data
          this.tableData = returnData
        })
      },
      // 团长订单分析
      colonelOrder () {
        this.tableDataLoading = true
        this.$http({
          url: this.$http.adornUrl2('/statistics/getTuanOrderMoney'),
          method: 'get',
          params: this.$http.adornParams({
            'time': this.infoDate,
          })
        }).then(({data}) => {
          this.tableDataLoading = false
          let returnData = data.data
          this.colonelData = returnData
        })
      },
      // 购买商品分析
      shoppData () {
        this.tableDataLoading = true
        this.$http({
          url: this.$http.adornUrl2('/statistics/totalGoods'),
          method: 'get',
          params: this.$http.adornParams({
            'time': this.infoDate,
          })
        }).then(({data}) => {
          this.tableDataLoading = false
          let returnData = data.data
          this.commodityData = returnData
        })
      },
      // 用户积分分析
      userinteData () {
        this.tableDataLoading = true
        this.$http({
          url: this.$http.adornUrl2('/statistics/totalJiFen'),
          method: 'get',
          params: this.$http.adornParams({
            'time': this.infoDate,
          })
        }).then(({data}) => {
          this.tableDataLoading = false
          let returnData = data.data
          this.userjfData = returnData
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
            'data': this.infoDate,
          })
        }).then(({data}) => {
          this.tableDataLoading = false
          let returnData = data.data
          this.ordersum0 = returnData.sum0
          this.ordersum1 = returnData.sum1
          this.ordersum2 = returnData.sum2

        })
      }
    }
  }
</script>

<style scoped>
	.box {
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
