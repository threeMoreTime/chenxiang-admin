<template>
  <el-tabs v-model = "activeName" @tab-click = "handleClick">
    <div style = "margin:2% 0;display: inline-block;">
      <span>订单状态：</span>
      <el-select v-model = "tkstatus" placeholder = "请选择类型" style = "width:150px;" @change = "selectTrigger(tkstatus)">
        <el-option v-for = "item in orderStatus" :key = "item.value" :label = "item.label" :value = "item.value">
        </el-option>
      </el-select>&nbsp;&nbsp;&nbsp;&nbsp;
      <span>结算状态：</span>
      <el-select v-model = "balance" placeholder = "请选择类型" style = "width:150px;" @change = "selectTrigger(balance)">
        <el-option v-for = "item in closeStatus" :key = "item.value" :label = "item.label" :value = "item.value">
        </el-option>
      </el-select>&nbsp;&nbsp;&nbsp;&nbsp;
      <el-input style = "width: 150px;" @keydown.enter.native = "select" clearable placeholder = "输入会员号查询"
                v-model = "relationid"></el-input>&nbsp;&nbsp;&nbsp;&nbsp;
      <el-input style = "width: 150px;" @keydown.enter.native = "select" clearable placeholder = "输入订单号查询"
                v-model = "tradeId"></el-input>&nbsp;&nbsp;&nbsp;&nbsp;
      <el-input style = "width: 150px;" @keydown.enter.native = "select" clearable placeholder = "输入团长号/直属查询"
                v-model = "invitation"></el-input>
    </div>
    <div style = "display: inline-block;">
      <el-button style = "margin-left:15px;" size = "mini" type = "primary" icon = "document" @click = "select">查询</el-button>
      <el-button style = "margin-left:15px;" size = "mini" type = "primary" icon = "document" @click = "cleans">重置</el-button>
			<el-button style = "margin-left:15px;" :disabled = "!isAuth('order:sync')" size = "mini" type = "primary" icon = "document"
                 @click = "synOrder">同步订单</el-button>
			<el-button style = "margin-left:15px;" size = "mini" type = "success" icon = "document" @click = "derive">导出Excel</el-button>
    </div>
    <el-tab-pane label = "全部订单" name = "first">
      <el-table v-loading = "tableDataLoading" :data = "tableData.content">
        <el-table-column fixed prop = "item_img" label = "商品图片">
          <template slot-scope = "scope">
            　　<img :src = "scope.row.item_img" width = "40" height = "40"/>
          </template>
        </el-table-column>
        <el-table-column prop = "item_title" label = "商品名称" width = "200">
        </el-table-column>
        <el-table-column prop = "relation_id" label = "会员号" width = "100">
          <template slot-scope = "scope">
            <span style = "color: #4f9dec;cursor: pointer;" @click = "memberClick(scope.row.relation_id)">{{ scope.row.relation_id }}</span>
          </template>
        </el-table-column>
		<el-table-column v-if = "this.valuenum==2" prop = "invitation" label = "直属" width = "100">
		  <template slot-scope = "scope">
			<span style = "color: #4f9dec;cursor: pointer;" @click = "colonelClick(scope.row.invitation,)">{{ scope.row.invitation }}</span>
		  </template>
		</el-table-column>
		<el-table-column v-if = "this.valuenum==2" prop = "invitations" label = "非直属" width = "100">
		  <template slot-scope = "scope">
			<span style = "color: #4f9dec;cursor: pointer;" @click = "colonelClick(scope.row.invitations)">{{ scope.row.invitations }}</span>
		  </template>
		</el-table-column>
        <el-table-column v-if = "this.valuenum==1" prop = "invitation" label = "团长号" width = "100">
          <template slot-scope = "scope">
            <span style = "color: #4f9dec;cursor: pointer;" @click = "colonelClick(scope.row.invitation)">{{ scope.row.invitation }}</span>
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
		<el-table-column v-if = "this.valuenum==2" prop = "invitationMoney" label = "直属佣金" width = "120">
		  <template slot-scope = "scope">
			<span style = "color: #f56c6c;">{{ scope.row.invitationMoney ? scope.row.invitationMoney : '—' }}</span>
		  </template>
		</el-table-column>
		<el-table-column v-if = "this.valuenum==2" prop = "invitationMoneys" label = "非直属佣金" width = "130">
		  <template slot-scope = "scope">
			<span style = "color: #f56c6c;">{{ scope.row.invitationMoneys ? scope.row.invitationMoneys : '—' }}</span>
		  </template>
		</el-table-column>
        <el-table-column v-if = "this.valuenum==1" prop = "invitationMoney" label = "团长佣金">
          <template slot-scope = "scope">
            <span style = "color: #f56c6c;">{{ scope.row.tk_status !== 13 ? scope.row.invitationMoney : '—' }}</span>
          </template>
        </el-table-column>
		<el-table-column v-if = "this.valuenum==2" prop = "pub_share_pre_fee_user_s" label = "平台佣金">
		  <template slot-scope = "scope">
			<span style = "color: #f56c6c;">{{
          scope.row.tk_status !== 13 ? (scope.row.pub_share_pre_fee - scope.row.pub_share_pre_fee_user - scope.row.invitationMoneys - scope.row.invitationMoney).toFixed(2) : '—'
        }}</span>
		  </template>
		</el-table-column>
        <el-table-column v-if = "this.valuenum==1" prop = "pub_share_pre_fee_user_s" label = "平台佣金">
          <template slot-scope = "scope">
            <span style = "color: #f56c6c;">{{
                scope.row.tk_status !== 13 ? (scope.row.pub_share_pre_fee - scope.row.pub_share_pre_fee_user - scope.row.invitationMoney).toFixed(2) : '—'
              }}</span>
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
        <el-pagination @size-change = "handleSizeChange" @current-change = "handleCurrentChange" :page-sizes = "[10,20,30,40,50]"
                       :page-size = "size" :current-page = "page" layout = "total,sizes, prev, pager, next,jumper"
                       :total = "tableData.totalElements">
        </el-pagination>
      </div>
    </el-tab-pane>
    <el-tab-pane label = "淘宝订单" name = "second">
      <el-table v-loading = "tableDataLoading" :data = "tableData.content">
        <el-table-column fixed prop = "item_img" label = "商品图片">
          <template slot-scope = "scope">
            　　<img :src = "scope.row.item_img" width = "40" height = "40"/>
          </template>
        </el-table-column>
        <el-table-column prop = "item_title" label = "商品名称" width = "200">
        </el-table-column>
        <el-table-column prop = "relation_id" label = "会员号" width = "100">
          <template slot-scope = "scope">
            <span style = "color: #4f9dec;cursor: pointer;" @click = "memberClick(scope.row.relation_id)">{{ scope.row.relation_id }}</span>
          </template>
        </el-table-column>
		<el-table-column v-if = "this.valuenum==2" prop = "invitation" label = "直属" width = "100">
		  <template slot-scope = "scope">
			<span style = "color: #4f9dec;cursor: pointer;" @click = "colonelClick(scope.row.invitation)">{{ scope.row.invitation }}</span>
		  </template>
		</el-table-column>
		<el-table-column v-if = "this.valuenum==2" prop = "invitations" label = "非直属" width = "100">
		  <template slot-scope = "scope">
			<span style = "color: #4f9dec;cursor: pointer;" @click = "colonelClick(scope.row.invitations)">{{ scope.row.invitations }}</span>
		  </template>
		</el-table-column>
		<el-table-column v-if = "this.valuenum==1" prop = "invitation" label = "团长号" width = "100">
		  <template slot-scope = "scope">
		    <span style = "color: #4f9dec;cursor: pointer;" @click = "colonelClick(scope.row.invitation)">{{ scope.row.invitation }}</span>
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
		<el-table-column v-if = "this.valuenum==2" prop = "invitationMoney" label = "直属佣金" width = "120">
		  <template slot-scope = "scope">
			<span style = "color: #f56c6c;">{{ scope.row.invitationMoney ? scope.row.invitationMoney : '—' }}</span>
		  </template>
		</el-table-column>
		<el-table-column v-if = "this.valuenum==2" prop = "invitationMoneys" label = "非直属佣金" width = "130">
		  <template slot-scope = "scope">
			<span style = "color: #f56c6c;">{{ scope.row.invitationMoneys ? scope.row.invitationMoneys : '—' }}</span>
		  </template>
		</el-table-column>
        <el-table-column v-if = "this.valuenum==1" prop = "invitationMoney" label = "团长佣金">
          <template slot-scope = "scope">
            <span style = "color: #f56c6c;">{{ scope.row.tk_status !== 13 ? scope.row.invitationMoney : '—' }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if = "this.valuenum==2" prop = "pub_share_pre_fee_user_s" label = "平台佣金">
          <template slot-scope = "scope">
        	<span style = "color: #f56c6c;">{{
              scope.row.tk_status !== 13 ? (scope.row.pub_share_pre_fee - scope.row.pub_share_pre_fee_user - scope.row.invitationMoneys - scope.row.invitationMoney).toFixed(2) : '—'
            }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if = "this.valuenum==1" prop = "pub_share_pre_fee_user_s" label = "平台佣金">
          <template slot-scope = "scope">
            <span style = "color: #f56c6c;">{{
                scope.row.tk_status !== 13 ? (scope.row.pub_share_pre_fee - scope.row.pub_share_pre_fee_user - scope.row.invitationMoney).toFixed(2) : '—'
              }}</span>
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
            <span v-if = "scope.row.balance == 1" style = "color: #4f9dec;cursor: pointer;">已结算</span>
            <span v-if = "scope.row.balance == 0" style = "color: #4f9dec;cursor: pointer;">未结算</span>
          </template>
        </el-table-column>
      </el-table>
      <div style = "text-align: center;margin-top: 10px;">
        <el-pagination @size-change = "handleSizeChange" @current-change = "handleCurrentChange" :page-sizes = "[10,20,30,40,50]"
                       :page-size = "size" :current-page = "page" layout = "total,sizes, prev, pager, next,jumper"
                       :total = "tableData.totalElements">
        </el-pagination>
      </div>
    </el-tab-pane>
    <el-tab-pane label = "拼多多订单" name = "third">
      <el-table v-loading = "tableDataLoading" :data = "tableData.content">
        <el-table-column fixed prop = "item_img" label = "商品图片">
          <template slot-scope = "scope">
            　　<img :src = "scope.row.item_img" width = "40" height = "40"/>
          </template>
        </el-table-column>
        <el-table-column prop = "item_title" label = "商品名称" width = "200">
        </el-table-column>
        <el-table-column prop = "relation_id" label = "会员号" width = "100">
          <template slot-scope = "scope">
            <span style = "color: #4f9dec;cursor: pointer;" @click = "memberClick(scope.row.relation_id)">{{ scope.row.relation_id }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if = "this.valuenum==2" prop = "invitation" label = "直属" width = "100">
          <template slot-scope = "scope">
        	<span style = "color: #4f9dec;cursor: pointer;" @click = "colonelClick(scope.row.invitation)">{{ scope.row.invitation }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if = "this.valuenum==2" prop = "invitations" label = "非直属" width = "100">
          <template slot-scope = "scope">
        	<span style = "color: #4f9dec;cursor: pointer;" @click = "colonelClick(scope.row.invitations)">{{ scope.row.invitations }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if = "this.valuenum==1" prop = "invitation" label = "团长号" width = "100">
          <template slot-scope = "scope">
            <span style = "color: #4f9dec;cursor: pointer;" @click = "colonelClick(scope.row.invitation)">{{ scope.row.invitation }}</span>
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
		<el-table-column v-if = "this.valuenum==2" prop = "invitationMoney" label = "直属佣金" width = "120">
		  <template slot-scope = "scope">
			<span style = "color: #f56c6c;">{{ scope.row.invitationMoney ? scope.row.invitationMoney : '—' }}</span>
		  </template>
		</el-table-column>
		<el-table-column v-if = "this.valuenum==2" prop = "invitationMoneys" label = "非直属佣金" width = "130">
		  <template slot-scope = "scope">
			<span style = "color: #f56c6c;">{{ scope.row.invitationMoneys ? scope.row.invitationMoneys : '—' }}</span>
		  </template>
		</el-table-column>
        <el-table-column v-if = "this.valuenum==1" prop = "invitationMoney" label = "团长佣金">
          <template slot-scope = "scope">
            <span style = "color: #f56c6c;">{{ scope.row.tk_status !== 13 ? scope.row.invitationMoney : '—' }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if = "this.valuenum==2" prop = "pub_share_pre_fee_user_s" label = "平台佣金">
          <template slot-scope = "scope">
        	<span style = "color: #f56c6c;">{{
              scope.row.tk_status !== 13 ? (scope.row.pub_share_pre_fee - scope.row.pub_share_pre_fee_user - scope.row.invitationMoneys - scope.row.invitationMoney).toFixed(2) : '—'
            }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if = "this.valuenum==1" prop = "pub_share_pre_fee_user_s" label = "平台佣金">
          <template slot-scope = "scope">
            <span style = "color: #f56c6c;">{{
                scope.row.tk_status !== 13 ? (scope.row.pub_share_pre_fee - scope.row.pub_share_pre_fee_user - scope.row.invitationMoney).toFixed(2) : '—'
              }}</span>
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
        <el-pagination @size-change = "handleSizeChange" @current-change = "handleCurrentChange" :page-sizes = "[10,20,30,40,50]"
                       :page-size = "size" :current-page = "page" layout = "total,sizes, prev, pager, next,jumper"
                       :total = "tableData.totalElements">
        </el-pagination>
      </div>
    </el-tab-pane>
    <el-tab-pane label = "京东订单" name = "fourth">
      <el-table v-loading = "tableDataLoading" :data = "tableData.content">
        <el-table-column fixed prop = "item_img" label = "商品图片">
          <template slot-scope = "scope">
            　　<img :src = "scope.row.item_img" width = "40" height = "40"/>
          </template>
        </el-table-column>
        <el-table-column prop = "item_title" label = "商品名称" width = "200">
        </el-table-column>
        <el-table-column prop = "relation_id" label = "会员号" width = "100">
          <template slot-scope = "scope">
            <span style = "color: #4f9dec;cursor: pointer;" @click = "memberClick(scope.row.relation_id)">{{ scope.row.relation_id }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if = "this.valuenum==2" prop = "invitation" label = "直属" width = "100">
          <template slot-scope = "scope">
        	<span style = "color: #4f9dec;cursor: pointer;" @click = "colonelClick(scope.row.invitation)">{{ scope.row.invitation }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if = "this.valuenum==2" prop = "invitations" label = "非直属" width = "100">
          <template slot-scope = "scope">
        	<span style = "color: #4f9dec;cursor: pointer;" @click = "colonelClick(scope.row.invitations)">{{ scope.row.invitations }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if = "this.valuenum==1" prop = "invitation" label = "团长号" width = "100">
          <template slot-scope = "scope">
            <span style = "color: #4f9dec;cursor: pointer;" @click = "colonelClick(scope.row.invitation)">{{ scope.row.invitation }}</span>
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
            <span style = "color: #4f9dec;">{{ scope.row.tk_status !== 13 ? scope.row.pub_share_pre_fee_user : '—' }}</span>
          </template>
        </el-table-column>
		<el-table-column v-if = "this.valuenum==2" prop = "invitationMoney" label = "直属佣金" width = "120">
		  <template slot-scope = "scope">
			<span style = "color: #f56c6c;">{{ scope.row.invitationMoney ? scope.row.invitationMoney : '—' }}</span>
		  </template>
		</el-table-column>
		<el-table-column v-if = "this.valuenum==2" prop = "invitationMoneys" label = "非直属佣金" width = "130">
		  <template slot-scope = "scope">
			<span style = "color: #f56c6c;">{{ scope.row.invitationMoneys ? scope.row.invitationMoneys : '—' }}</span>
		  </template>
		</el-table-column>
        <el-table-column v-if = "this.valuenum==1" prop = "invitationMoney" label = "团长佣金">
          <template slot-scope = "scope">
            <span style = "color: #f56c6c;">{{ scope.row.tk_status !== 13 ? scope.row.invitationMoney : '—' }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if = "this.valuenum==2" prop = "pub_share_pre_fee_user_s" label = "平台佣金">
          <template slot-scope = "scope">
        	<span style = "color: #f56c6c;">{{
              scope.row.tk_status !== 13 ? (scope.row.pub_share_pre_fee - scope.row.pub_share_pre_fee_user - scope.row.invitationMoneys - scope.row.invitationMoney).toFixed(2) : '—'
            }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if = "this.valuenum==1" prop = "pub_share_pre_fee_user_s" label = "平台佣金">
          <template slot-scope = "scope">
            <span style = "color: #f56c6c;">{{
                scope.row.tk_status !== 13 ? (scope.row.pub_share_pre_fee - scope.row.pub_share_pre_fee_user - scope.row.invitationMoney).toFixed(2) : '—'
              }}</span>
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
        <el-pagination @size-change = "handleSizeChange" @current-change = "handleCurrentChange" :page-sizes = "[10,20,30,40,50]"
                       :page-size = "size" :current-page = "page" layout = "total,sizes, prev, pager, next,jumper"
                       :total = "tableData.totalElements">
        </el-pagination>
      </div>
    </el-tab-pane>
    <el-tab-pane label = "美团订单" name = "fifth">
	  <el-table v-loading = "tableDataLoading" :data = "tableData.content">
		<el-table-column fixed prop = "item_img" label = "商品图片">
		  <template slot-scope = "scope">
			　　<img :src = "scope.row.item_img" width = "40" height = "40"/>
		  </template>
		</el-table-column>
		<el-table-column prop = "item_title" label = "商品名称" width = "200">
		</el-table-column>
		<el-table-column prop = "relation_id" label = "会员号" width = "100">
		  <template slot-scope = "scope">
			<span style = "color: #4f9dec;cursor: pointer;" @click = "memberClick(scope.row.relation_id)">{{ scope.row.relation_id }}</span>
		  </template>
		</el-table-column>
		<el-table-column v-if = "this.valuenum==2" prop = "invitation" label = "直属" width = "100">
		  <template slot-scope = "scope">
			<span style = "color: #4f9dec;cursor: pointer;" @click = "colonelClick(scope.row.invitation)">{{ scope.row.invitation }}</span>
		  </template>
		</el-table-column>
		<el-table-column v-if = "this.valuenum==2" prop = "invitations" label = "非直属" width = "100">
		  <template slot-scope = "scope">
			<span style = "color: #4f9dec;cursor: pointer;" @click = "colonelClick(scope.row.invitations)">{{ scope.row.invitations }}</span>
		  </template>
		</el-table-column>
		<el-table-column v-if = "this.valuenum==1" prop = "invitation" label = "团长号" width = "100">
		  <template slot-scope = "scope">
			<span style = "color: #4f9dec;cursor: pointer;" @click = "colonelClick(scope.row.invitation)">{{ scope.row.invitation }}</span>
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
			<span style = "color: #4f9dec;">{{ scope.row.tk_status !== 13 ? scope.row.pub_share_pre_fee_user : '—' }}</span>
		  </template>
		</el-table-column>
			<el-table-column v-if = "this.valuenum==2" prop = "invitationMoney" label = "直属佣金" width = "120">
				<template slot-scope = "scope">
				<span style = "color: #f56c6c;">{{ scope.row.invitationMoney ? scope.row.invitationMoney : '—' }}</span>
				</template>
			</el-table-column>
			<el-table-column v-if = "this.valuenum==2" prop = "invitationMoneys" label = "非直属佣金" width = "130">
				<template slot-scope = "scope">
				<span style = "color: #f56c6c;">{{ scope.row.invitationMoneys ? scope.row.invitationMoneys : '—' }}</span>
				</template>
			</el-table-column>
		<el-table-column v-if = "this.valuenum==1" prop = "invitationMoney" label = "团长佣金">
		  <template slot-scope = "scope">
			<span style = "color: #f56c6c;">{{ scope.row.tk_status !== 13 ? scope.row.invitationMoney : '—' }}</span>
		  </template>
		</el-table-column>
		<el-table-column v-if = "this.valuenum==2" prop = "pub_share_pre_fee_user_s" label = "平台佣金">
		  <template slot-scope = "scope">
			<span style = "color: #f56c6c;">{{
          scope.row.tk_status !== 13 ? (scope.row.pub_share_pre_fee - scope.row.pub_share_pre_fee_user - scope.row.invitationMoneys - scope.row.invitationMoney).toFixed(2) : '—'
        }}</span>
		  </template>
		</el-table-column>
		<el-table-column v-if = "this.valuenum==1" prop = "pub_share_pre_fee_user_s" label = "平台佣金">
		  <template slot-scope = "scope">
			<span style = "color: #f56c6c;">{{
          scope.row.tk_status !== 13 ? (scope.row.pub_share_pre_fee - scope.row.pub_share_pre_fee_user - scope.row.invitationMoney).toFixed(2) : '—'
        }}</span>
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
		<el-pagination @size-change = "handleSizeChange" @current-change = "handleCurrentChange" :page-sizes = "[10,20,30,40,50]"
                   :page-size = "size" :current-page = "page" layout = "total,sizes, prev, pager, next,jumper"
                   :total = "tableData.totalElements">
		</el-pagination>
	  </div>
	</el-tab-pane>
	<el-tab-pane label = "饿了么订单" name = "sixth">
	  <el-table v-loading = "tableDataLoading" :data = "tableData.content">
		<el-table-column fixed prop = "item_img" label = "商品图片">
		  <template slot-scope = "scope">
			　　<img :src = "scope.row.item_img" width = "40" height = "40"/>
		  </template>
		</el-table-column>
		<el-table-column prop = "item_title" label = "商品名称" width = "200">
		</el-table-column>
		<el-table-column prop = "relation_id" label = "会员号" width = "100">
		  <template slot-scope = "scope">
			<span style = "color: #4f9dec;cursor: pointer;" @click = "memberClick(scope.row.relation_id)">{{ scope.row.relation_id }}</span>
		  </template>
		</el-table-column>
		<el-table-column v-if = "this.valuenum==2" prop = "invitation" label = "直属" width = "100">
		  <template slot-scope = "scope">
			<span style = "color: #4f9dec;cursor: pointer;" @click = "colonelClick(scope.row.invitation)">{{ scope.row.invitation }}</span>
		  </template>
		</el-table-column>
		<el-table-column v-if = "this.valuenum==2" prop = "invitations" label = "非直属" width = "100">
		  <template slot-scope = "scope">
			<span style = "color: #4f9dec;cursor: pointer;" @click = "colonelClick(scope.row.invitations)">{{ scope.row.invitations }}</span>
		  </template>
		</el-table-column>
		<el-table-column v-if = "this.valuenum==1" prop = "invitation" label = "团长号" width = "100">
		  <template slot-scope = "scope">
			<span style = "color: #4f9dec;cursor: pointer;" @click = "colonelClick(scope.row.invitation)">{{ scope.row.invitation }}</span>
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
			<span style = "color: #4f9dec;">{{ scope.row.tk_status !== 13 ? scope.row.pub_share_pre_fee_user : '—' }}</span>
		  </template>
		</el-table-column>
			<el-table-column v-if = "this.valuenum==2" prop = "invitationMoney" label = "直属佣金" width = "120">
				<template slot-scope = "scope">
				<span style = "color: #f56c6c;">{{ scope.row.invitationMoney ? scope.row.invitationMoney : '—' }}</span>
				</template>
			</el-table-column>
			<el-table-column v-if = "this.valuenum==2" prop = "invitationMoneys" label = "非直属佣金" width = "130">
				<template slot-scope = "scope">
				<span style = "color: #f56c6c;">{{ scope.row.invitationMoneys ? scope.row.invitationMoneys : '—' }}</span>
				</template>
			</el-table-column>
		<el-table-column v-if = "this.valuenum==1" prop = "invitationMoney" label = "团长佣金">
		  <template slot-scope = "scope">
			<span style = "color: #f56c6c;">{{ scope.row.tk_status !== 13 ? scope.row.invitationMoney : '—' }}</span>
		  </template>
		</el-table-column>
		<el-table-column v-if = "this.valuenum==2" prop = "pub_share_pre_fee_user_s" label = "平台佣金">
		  <template slot-scope = "scope">
			<span style = "color: #f56c6c;">{{
          scope.row.tk_status !== 13 ? (scope.row.pub_share_pre_fee - scope.row.pub_share_pre_fee_user - scope.row.invitationMoneys - scope.row.invitationMoney).toFixed(2) : '—'
        }}</span>
		  </template>
		</el-table-column>
		<el-table-column v-if = "this.valuenum==1" prop = "pub_share_pre_fee_user_s" label = "平台佣金">
		  <template slot-scope = "scope">
			<span style = "color: #f56c6c;">{{
          scope.row.tk_status !== 13 ? (scope.row.pub_share_pre_fee - scope.row.pub_share_pre_fee_user - scope.row.invitationMoney).toFixed(2) : '—'
        }}</span>
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
		<el-pagination @size-change = "handleSizeChange" @current-change = "handleCurrentChange" :page-sizes = "[10,20,30,40,50]"
                   :page-size = "size" :current-page = "page" layout = "total,sizes, prev, pager, next,jumper"
                   :total = "tableData.totalElements">
		</el-pagination>
	  </div>
	</el-tab-pane>
    <el-tab-pane label = "多麦订单" name = "seventh">
	  <el-table v-loading = "tableDataLoading" :data = "tableData.content">
		<el-table-column fixed prop = "item_img" label = "商品图片">
		  <template slot-scope = "scope">
			　　<img :src = "scope.row.item_img" width = "40" height = "40"/>
		  </template>
		</el-table-column>
		<el-table-column prop = "item_title" label = "商品名称" width = "200">
		</el-table-column>
		<el-table-column prop = "relation_id" label = "会员号" width = "100">
		  <template slot-scope = "scope">
			<span style = "color: #4f9dec;cursor: pointer;" @click = "memberClick(scope.row.relation_id)">{{ scope.row.relation_id }}</span>
		  </template>
		</el-table-column>
		<el-table-column v-if = "this.valuenum==2" prop = "invitation" label = "直属" width = "100">
		  <template slot-scope = "scope">
			<span style = "color: #4f9dec;cursor: pointer;" @click = "colonelClick(scope.row.invitation)">{{ scope.row.invitation }}</span>
		  </template>
		</el-table-column>
		<el-table-column v-if = "this.valuenum==2" prop = "invitations" label = "非直属" width = "100">
		  <template slot-scope = "scope">
			<span style = "color: #4f9dec;cursor: pointer;" @click = "colonelClick(scope.row.invitations)">{{ scope.row.invitations }}</span>
		  </template>
		</el-table-column>
		<el-table-column v-if = "this.valuenum==1" prop = "invitation" label = "团长号" width = "100">
		  <template slot-scope = "scope">
			<span style = "color: #4f9dec;cursor: pointer;" @click = "colonelClick(scope.row.invitation)">{{ scope.row.invitation }}</span>
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
			<span style = "color: #4f9dec;">{{ scope.row.tk_status !== 13 ? scope.row.pub_share_pre_fee_user : '—' }}</span>
		  </template>
		</el-table-column>
			<el-table-column v-if = "this.valuenum==2" prop = "invitationMoney" label = "直属佣金" width = "120">
				<template slot-scope = "scope">
				<span style = "color: #f56c6c;">{{ scope.row.invitationMoney ? scope.row.invitationMoney : '—' }}</span>
				</template>
			</el-table-column>
			<el-table-column v-if = "this.valuenum==2" prop = "invitationMoneys" label = "非直属佣金" width = "130">
				<template slot-scope = "scope">
				<span style = "color: #f56c6c;">{{ scope.row.invitationMoneys ? scope.row.invitationMoneys : '—' }}</span>
				</template>
			</el-table-column>
		<el-table-column v-if = "this.valuenum==1" prop = "invitationMoney" label = "团长佣金">
		  <template slot-scope = "scope">
			<span style = "color: #f56c6c;">{{ scope.row.tk_status !== 13 ? scope.row.invitationMoney : '—' }}</span>
		  </template>
		</el-table-column>
		<el-table-column v-if = "this.valuenum==2" prop = "pub_share_pre_fee_user_s" label = "平台佣金">
		  <template slot-scope = "scope">
			<span style = "color: #f56c6c;">{{
          scope.row.tk_status !== 13 ? (scope.row.pub_share_pre_fee - scope.row.pub_share_pre_fee_user - scope.row.invitationMoneys - scope.row.invitationMoney).toFixed(2) : '—'
        }}</span>
		  </template>
		</el-table-column>
		<el-table-column v-if = "this.valuenum==1" prop = "pub_share_pre_fee_user_s" label = "平台佣金">
		  <template slot-scope = "scope">
			<span style = "color: #f56c6c;">{{
          scope.row.tk_status !== 13 ? (scope.row.pub_share_pre_fee - scope.row.pub_share_pre_fee_user - scope.row.invitationMoney).toFixed(2) : '—'
        }}</span>
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
		<el-pagination @size-change = "handleSizeChange" @current-change = "handleCurrentChange" :page-sizes = "[10,20,30,40,50]"
                   :page-size = "size" :current-page = "page" layout = "total,sizes, prev, pager, next,jumper"
                   :total = "tableData.totalElements">
		</el-pagination>
	  </div>
	</el-tab-pane>
  <el-tab-pane label = "唯品会订单" name = "wph">
    <el-table v-loading = "tableDataLoading" :data = "tableData.content">
  	<el-table-column fixed prop = "item_img" label = "商品图片">
  	  <template slot-scope = "scope">
  		　　<img :src = "scope.row.item_img" width = "40" height = "40"/>
  	  </template>
  	</el-table-column>
  	<el-table-column prop = "item_title" label = "商品名称" width = "200">
  	</el-table-column>
  	<el-table-column prop = "relation_id" label = "会员号" width = "100">
  	  <template slot-scope = "scope">
  		<span style = "color: #4f9dec;cursor: pointer;" @click = "memberClick(scope.row.relation_id)">{{ scope.row.relation_id }}</span>
  	  </template>
  	</el-table-column>
  	<el-table-column v-if = "this.valuenum==2" prop = "invitation" label = "直属" width = "100">
  	  <template slot-scope = "scope">
  		<span style = "color: #4f9dec;cursor: pointer;" @click = "colonelClick(scope.row.invitation)">{{ scope.row.invitation }}</span>
  	  </template>
  	</el-table-column>
  	<el-table-column v-if = "this.valuenum==2" prop = "invitations" label = "非直属" width = "100">
  	  <template slot-scope = "scope">
  		<span style = "color: #4f9dec;cursor: pointer;" @click = "colonelClick(scope.row.invitations)">{{ scope.row.invitations }}</span>
  	  </template>
  	</el-table-column>
  	<el-table-column v-if = "this.valuenum==1" prop = "invitation" label = "团长号" width = "100">
  	  <template slot-scope = "scope">
  		<span style = "color: #4f9dec;cursor: pointer;" @click = "colonelClick(scope.row.invitation)">{{ scope.row.invitation }}</span>
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
  		<span style = "color: #4f9dec;">{{ scope.row.tk_status !== 13 ? scope.row.pub_share_pre_fee_user : '—' }}</span>
  	  </template>
  	</el-table-column>
  		<el-table-column v-if = "this.valuenum==2" prop = "invitationMoney" label = "直属佣金" width = "120">
  			<template slot-scope = "scope">
  			<span style = "color: #f56c6c;">{{ scope.row.invitationMoney ? scope.row.invitationMoney : '—' }}</span>
  			</template>
  		</el-table-column>
  		<el-table-column v-if = "this.valuenum==2" prop = "invitationMoneys" label = "非直属佣金" width = "130">
  			<template slot-scope = "scope">
  			<span style = "color: #f56c6c;">{{ scope.row.invitationMoneys ? scope.row.invitationMoneys : '—' }}</span>
  			</template>
  		</el-table-column>
  	<el-table-column v-if = "this.valuenum==1" prop = "invitationMoney" label = "团长佣金">
  	  <template slot-scope = "scope">
  		<span style = "color: #f56c6c;">{{ scope.row.tk_status !== 13 ? scope.row.invitationMoney : '—' }}</span>
  	  </template>
  	</el-table-column>
  	<el-table-column v-if = "this.valuenum==2" prop = "pub_share_pre_fee_user_s" label = "平台佣金">
  	  <template slot-scope = "scope">
  		<span style = "color: #f56c6c;">{{
          scope.row.tk_status !== 13 ? (scope.row.pub_share_pre_fee - scope.row.pub_share_pre_fee_user - scope.row.invitationMoneys - scope.row.invitationMoney).toFixed(2) : '—'
        }}</span>
  	  </template>
  	</el-table-column>
  	<el-table-column v-if = "this.valuenum==1" prop = "pub_share_pre_fee_user_s" label = "平台佣金">
  	  <template slot-scope = "scope">
  		<span style = "color: #f56c6c;">{{
          scope.row.tk_status !== 13 ? (scope.row.pub_share_pre_fee - scope.row.pub_share_pre_fee_user - scope.row.invitationMoney).toFixed(2) : '—'
        }}</span>
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
  	<el-pagination @size-change = "handleSizeChange" @current-change = "handleCurrentChange" :page-sizes = "[10,20,30,40,50]"
                   :page-size = "size" :current-page = "page" layout = "total,sizes, prev, pager, next,jumper"
                   :total = "tableData.totalElements">
  	</el-pagination>
    </div>
  </el-tab-pane>
    <el-tab-pane label = "抖音订单" name = "dy">
    <el-table v-loading = "tableDataLoading" :data = "tableData.content">
  	<el-table-column fixed prop = "item_img" label = "商品图片">
  	  <template slot-scope = "scope">
  		　　<img :src = "scope.row.item_img" width = "40" height = "40"/>
  	  </template>
  	</el-table-column>
  	<el-table-column prop = "item_title" label = "商品名称" width = "200">
  	</el-table-column>
  	<el-table-column prop = "relation_id" label = "会员号" width = "100">
  	  <template slot-scope = "scope">
  		<span style = "color: #4f9dec;cursor: pointer;" @click = "memberClick(scope.row.relation_id)">{{ scope.row.relation_id }}</span>
  	  </template>
  	</el-table-column>
  	<el-table-column v-if = "this.valuenum==2" prop = "invitation" label = "直属" width = "100">
  	  <template slot-scope = "scope">
  		<span style = "color: #4f9dec;cursor: pointer;" @click = "colonelClick(scope.row.invitation)">{{ scope.row.invitation }}</span>
  	  </template>
  	</el-table-column>
  	<el-table-column v-if = "this.valuenum==2" prop = "invitations" label = "非直属" width = "100">
  	  <template slot-scope = "scope">
  		<span style = "color: #4f9dec;cursor: pointer;" @click = "colonelClick(scope.row.invitations)">{{ scope.row.invitations }}</span>
  	  </template>
  	</el-table-column>
  	<el-table-column v-if = "this.valuenum==1" prop = "invitation" label = "团长号" width = "100">
  	  <template slot-scope = "scope">
  		<span style = "color: #4f9dec;cursor: pointer;" @click = "colonelClick(scope.row.invitation)">{{ scope.row.invitation }}</span>
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
  		<span style = "color: #4f9dec;">{{ scope.row.tk_status !== 13 ? scope.row.pub_share_pre_fee_user : '—' }}</span>
  	  </template>
  	</el-table-column>
  		<el-table-column v-if = "this.valuenum==2" prop = "invitationMoney" label = "直属佣金" width = "120">
  			<template slot-scope = "scope">
  			<span style = "color: #f56c6c;">{{ scope.row.invitationMoney ? scope.row.invitationMoney : '—' }}</span>
  			</template>
  		</el-table-column>
  		<el-table-column v-if = "this.valuenum==2" prop = "invitationMoneys" label = "非直属佣金" width = "130">
  			<template slot-scope = "scope">
  			<span style = "color: #f56c6c;">{{ scope.row.invitationMoneys ? scope.row.invitationMoneys : '—' }}</span>
  			</template>
  		</el-table-column>
  	<el-table-column v-if = "this.valuenum==1" prop = "invitationMoney" label = "团长佣金">
  	  <template slot-scope = "scope">
  		<span style = "color: #f56c6c;">{{ scope.row.tk_status !== 13 ? scope.row.invitationMoney : '—' }}</span>
  	  </template>
  	</el-table-column>
  	<el-table-column v-if = "this.valuenum==2" prop = "pub_share_pre_fee_user_s" label = "平台佣金">
  	  <template slot-scope = "scope">
  		<span style = "color: #f56c6c;">{{
          scope.row.tk_status !== 13 ? (scope.row.pub_share_pre_fee - scope.row.pub_share_pre_fee_user - scope.row.invitationMoneys - scope.row.invitationMoney).toFixed(2) : '—'
        }}</span>
  	  </template>
  	</el-table-column>
  	<el-table-column v-if = "this.valuenum==1" prop = "pub_share_pre_fee_user_s" label = "平台佣金">
  	  <template slot-scope = "scope">
  		<span style = "color: #f56c6c;">{{
          scope.row.tk_status !== 13 ? (scope.row.pub_share_pre_fee - scope.row.pub_share_pre_fee_user - scope.row.invitationMoney).toFixed(2) : '—'
        }}</span>
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
  	<el-pagination @size-change = "handleSizeChange" @current-change = "handleCurrentChange" :page-sizes = "[10,20,30,40,50]"
                   :page-size = "size" :current-page = "page" layout = "total,sizes, prev, pager, next,jumper"
                   :total = "tableData.totalElements">
  	</el-pagination>
    </div>
  </el-tab-pane>
  </el-tabs>
</template>

<script>
  export default {
    data () {
      return {
        size: 10,
        page: 1,
        balance: -1,
        invitation: '',
        relationid: '',
        tradeId: '',
        invitValue: -1,
        value: '',
        content: '',
        tkstatus: -1,
        totalnum: 0,
        valuenum: '',
        from: 'all',
        activeName: 'first',
        tableDataLoading: false,
        tableData: [],
        orderStatus: [
          {
            value: -1,
            label: '全部'
          }, {
            value: 12,
            label: '已付款'
          }, {
            value: 3,
            label: '已结算'
          }, {
            value: 13,
            label: '已失效'
          }],
        closeStatus: [
          {
            value: -1,
            label: '全部'
          }, {
            value: 1,
            label: '已结算'
          }, {
            value: 0,
            label: '未结算'
          }],
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
      derive () {
        let invitation = -1
        let relationid = -1
        let tradeId = -1
        if (this.invitation) {
          invitation = this.invitation
        }
        if (this.tradeId) {
          tradeId = this.tradeId
        }
        if (this.relationid) {
          relationid = this.relationid
        }
        this.tableDataLoading = true
        this.paginationShow = false
        this.$http({
          url: this.$http.adornUrl2('/order/orderListExcel'),
          method: 'get',
          responseType: 'blob',
          params: this.$http.adornParams({
            'balance': this.balance,
            'invitation': invitation,
            'tradeId': tradeId,
            'relation_id': relationid,
            'tk_status': this.tkstatus,
            'from': this.from,
          })
        }).then(({data}) => {
          this.tableDataLoading = false
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
      handleClick (tab, event) {
        if (tab._props.label == '淘宝订单') {
          this.size = 10
          this.page = 1
          this.from = 'tb'
          this.dataSelect()
        }
        if (tab._props.label == '拼多多订单') {
          this.size = 10
          this.page = 1
          this.from = 'pdd'
          this.dataSelect()
        }
        if (tab._props.label == '京东订单') {
          this.size = 10
          this.page = 1
          this.from = 'jd'
          this.dataSelect()
        }
        if (tab._props.label == '全部订单') {
          this.size = 10
          this.page = 1
          this.from = 'all'
          this.dataSelect()
        }
        if (tab._props.label == '美团订单') {
          this.size = 10
          this.page = 1
          this.from = 'mt'
          this.dataSelect()
        }
        if (tab._props.label == '饿了么订单') {
          this.size = 10
          this.page = 1
          this.from = 'elm'
          this.dataSelect()
        }
        if (tab._props.label == '多麦订单') {
          this.size = 10
          this.page = 1
          this.from = 'dm'
          this.dataSelect()
        }
        if (tab._props.label == '唯品会订单') {
          this.size = 10
          this.page = 1
          this.from = 'wph'
          this.dataSelect()
        }
        if (tab._props.label == '抖音订单') {
          this.size = 10
          this.page = 1
          this.from = 'dy'
          this.dataSelect()
        }
      },
      // 同步订单
      synOrder () {
        this.$http({
          url: this.$http.adornUrl2('/order/tallyOrder'),
          method: 'get',
          params: this.$http.adornParams({})
        }).then(({data}) => {
          if (data.status == 0) {
            this.$message({
              message: '订单同步中',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.dataSelect()
              }
            })
          }
          if (data.status == -100) {
            this.$message({
              message: data.msg,
              type: 'error',
              duration: 1500,
            })
          }
        })
      },
      // 会员跳转详情页
      memberClick (relationId) {
        this.$http({
          url: this.$http.adornUrl2('/user/relationId'),
          method: 'get',
          params: this.$http.adornParams({
            'relationId': relationId,
          })
        }).then(({data}) => {
          let returnData = data.data
          let id = returnData.id
          if (this.valuenum == 1) {
            this.$router.push({path: '/userDetail', query: {userId: id}})
          } else {
            this.$router.push({path: '/userDetailThree', query: {userId: id}})
          }
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
          if (this.valuenum == 1) {
            this.$router.push({path: '/userDetail', query: {userId: id}})
          } else {
            this.$router.push({path: '/userDetailThree', query: {userId: id}})
          }
        })
      },
      // select自动选择
      selectTrigger () {
        this.dataSelect()
      },
      // 查询
      select () {
        if (!this.invitation) {
          if (this.$route.query.invitation) {
            this.invitation = this.$route.query.invitation
          } else {
            this.invitation = ''
          }
        }
        if (!this.tradeId) {
          if (this.$route.query.tradeId) {
            this.tradeId = this.$route.query.tradeId
          } else {
            this.tradeId = ''
          }
        }
        if (!this.relationid) {
          if (this.$route.query.relationid) {
            this.relationid = this.$route.query.relationid
          } else {
            this.relationid = ''
          }
        }
        this.dataSelect()
      },
      // 重置
      cleans () {
        this.relationid = ''
        this.invitation = ''
        this.invitValue = ''
        this.tradeId = ''
        this.tkstatus = -1
        this.balance = -1
        this.dataSelect()
      },
      // 获取数据列表
      dataSelect () {
        let invitation = -1
        let relationid = -1
        let tradeId = -1
        if (this.invitation) {
          invitation = this.invitation
        }
        if (this.relationid) {
          relationid = this.relationid
        }
        if (this.tradeId) {
          tradeId = this.tradeId.trim()
        }
        this.tableDataLoading = true
        this.paginationShow = false
        this.$http({
          url: this.$http.adornUrl2(`/order/orderList/${this.page - 1}/${this.size}`),
          method: 'get',
          params: this.$http.adornParams({
            'balance': this.balance,
            'invitation': invitation,
            'relation_id': relationid,
            'tradeId': tradeId,
            'tk_status': this.tkstatus,
            'from': this.from,
          })
        }).then(({data}) => {
          this.tableDataLoading = false
          let init=data.data;
          for(var i in init.content){
            if(init.content[i].item_img){

              if(init.content[i].item_img.indexOf('https')==-1){
                init.content[i].item_img = 'https:'+init.content[i].item_img
              }

            }
          }

          this.tableData = init

          this.$nextTick(function () {
            this.paginationShow = true
          })
        })
      },
      valueSelect () {
        this.$http({
          url: this.$http.adornUrl2('/common/type/91'),
          method: 'get',
          params: this.$http.adornParams({})
        }).then(({data}) => {
          let returnData = data.data
          this.valuenum = returnData.value
          this.dataSelect()
        })
      }
    },
    mounted () {
      this.valueSelect()
      this.select()
    }
  }
</script>

<style>

</style>
