<template>
  <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="提现管理" name="first">
      <span>订单状态：</span>
      <el-select v-model="state" placeholder="请选择类型" style="width:150px;" @change="selectTrigger(tkstatus)">
        <el-option v-for="item in orderStatus" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>&nbsp;&nbsp;&nbsp;&nbsp;
      <span>提现方式：</span>
      <el-select v-model="classify" placeholder="请选择提现方式" style="width:150px;" @change="selectTrigger(tkstatus)">
        <el-option v-for="item in classifyStatus" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>&nbsp;&nbsp;&nbsp;&nbsp;
      <div style="margin:2% 0;display: inline-block;">
        <div style="position: relative;display: inline-block;">
          <el-input style="width: 200px;" @keydown.enter.native="zfbselect" placeholder="请输入支付宝号查询" v-model="zhifubao">
          </el-input>&nbsp;&nbsp;
          <span @click="zfbselect" style="position: absolute;right: 18px;top:8px;">
            <icon-svg name="shousuo" class="site-sidebar__menu-icon"></icon-svg>
          </span>
        </div>
        <div style="position: relative;display: inline-block;">
          <el-input style="width: 200px;" @keydown.enter.native="qdselect" placeholder="请输入会员编号查询" v-model="relationId">
          </el-input>&nbsp;&nbsp;
          <span @click="qdselect" style="position: absolute;right: 18px;top:8px;">
            <icon-svg name="shousuo" class="site-sidebar__menu-icon"></icon-svg>
          </span>
        </div>
      </div>
      <div style="display: inline-block;">
        <el-button style="margin:0 0 20px 20px;" size="mini" type="primary" icon="document" @click="transferClcik()"
          :disabled="checkBoxData.length <= 0 || !isAuth('financeList:accounts')">批量转账
        </el-button>
        <el-button style="margin:0 0 20px 20px;"
          :disabled="checkBoxData.length <= 0 || !isAuth('financeList:statement')" size="mini" type="primary"
          icon="document" @click="close()">开始结算
        </el-button>
        <el-button style="margin-left:15px;" size="mini" type="primary" icon="document" @click="cleans">重置</el-button>
      </div>
      <el-table @selection-change="changeFun" v-loading="tableDataLoading" :data="tableData">
        <el-table-column type="selection">
        </el-table-column>
        <el-table-column fixed prop="id" label="编号" width="80">
        </el-table-column>
        <el-table-column fixed prop="relationId" label="会员编号" width="120">
          <template slot-scope="scope">
            <span style="color: #4f9dec;cursor: pointer;" @click="updates(scope.row)">{{ scope.row.relationId }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="zhifubao" label="支付宝" width="150">
        </el-table-column>
        <el-table-column  prop="cardFront" label="收款二维码" width="150">
          <template slot-scope="scope">
            <div v-if="scope.row.wxImg == null || scope.row.wxImg == ''">
              暂无图片
            </div>
            <div v-if="scope.row.wxImg" style="display:flex;flex-wrap: wrap;">
              <el-popover placement="top-start" title="" trigger="hover">
                <img style="width: 50px; height: 50px" :src="scope.row.wxImg" alt="" slot="reference">
                <img style="width: 200px; height: 200px" :src="scope.row.wxImg" alt="">
              </el-popover>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="zhifubaoName" label="姓名" width="100">
        </el-table-column>
        <el-table-column prop="money" label="提现金额" width="100">
        </el-table-column>
        <el-table-column prop="classify" label="提现方式" width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.classify == 1">支付宝</span>
            <span v-else-if="scope.row.classify == 2">微信小程序</span>
            <span v-else-if="scope.row.classify == 3">微信公众号</span>
            <span v-else-if="scope.row.classify == 4">银行卡</span>
            <span v-else>暂无</span>
          </template>
        </el-table-column>
        <el-table-column prop="state" label="状态" width="100">
          <template slot-scope="scope">
            <span style="color: #4f9dec;cursor: pointer;" v-if="scope.row.state == 0">待转账</span>
            <span v-if="scope.row.state == 1">已转账</span>
            <span v-if="scope.row.state == -1">已拒绝</span>
          </template>
        </el-table-column>
        <el-table-column prop="refund" label="拒绝原因" width="220">
        </el-table-column>
        <el-table-column prop="notifyStatus" label="银行卡信息" width="220">
          <template v-if="scope.row.classify==4" slot-scope="scope">
            <span>姓名：{{scope.row.bankUserName }}</span><br/>
            <span>开户行：{{scope.row.bankName}}</span><br/>
            <span>卡号：{{scope.row.bankCode}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createAt" label="申请时间" width="170">
        </el-table-column>
        <el-table-column prop="outAt" label="转账/拒绝时间" width="180">
        </el-table-column>
        <el-table-column prop="orderNumber" label="转账订单号" width="150">
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="150">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" :disabled="!isAuth('financeList:accounts')" @click="batch(scope.row)">
              转账
            </el-button>
            <el-button size="mini" type="primary" :disabled="!isAuth('financeList:refund')" @click="refund(scope.row)">
              拒绝
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align: center;margin-top: 10px;">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
          :page-sizes="[10, 20, 30, 40]" :page-size="size" :current-page="page"
          layout="total,sizes, prev, pager, next,jumper" :total="totalnum">
        </el-pagination>
      </div>
      <!-- 拒绝弹框 -->
      <el-dialog title="拒绝" :visible.sync="dialogFormVisible" center>
        <el-form :model="form">
          <el-form-item label="拒绝原因：" :label-width="formLabelWidth">
            <el-input v-model="form.content" type="textarea" rows="4" placeholder="请输入拒绝原因" style="width:65%;">
            </el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="refundNoticeTo()">确 定</el-button>
        </div>
      </el-dialog>
    </el-tab-pane>
    <el-tab-pane label="收入统计" name="second" v-if="value == 1">
      <div>
        <el-select v-model="way" style="width:150px;margin-left: 10px;" @change="animeDat">
          <el-option v-for="item in ways" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>&nbsp;&nbsp;&nbsp;
        <el-date-picker style="width: 160px;margin-left: 10px;" v-model="info.stockDate" align="right" type="datetime"
          format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="选择开始时间" @change="timeDate">
        </el-date-picker> &nbsp;&nbsp;&nbsp;
        <span>平台筛选</span>
        <el-select v-model="platform" style="width:150px;margin-left: 10px;" @change="screen">
          <el-option v-for="item in platforms" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </div>
      <el-row v-loading="tableDataLoading">
        <el-col :span="6" class="cards">
          <div class="box">
            <div class="box_num">
              <div class="box_color">平台商品总收入（包括团队和用户）</div>
              <div class="text_color"><span>{{ sqxTotal }}</span>元</div>
            </div>
          </div>
        </el-col>
        <el-col :span="6" class="cards">
          <div class="box">
            <div class="box_num">
              <div class="box_color">商品用户收入</div>
              <div class="text_color"><span>{{ userTotal }}</span>元</div>
            </div>
          </div>
        </el-col>
        <el-col :span="6" class="cards">
          <div class="box">
            <div class="box_num">
              <div class="box_color">团队商品总收益</div>
              <div class="text_color"><span>{{ taunTotal }}</span>元</div>
            </div>
          </div>
        </el-col>
        <el-col :span="6" class="cards">
          <div class="box">
            <div class="box_num">
              <div class="box_color">平台商品实际收益（除去团队用户收益）</div>
              <div class="text_color"><span>{{ (sqxTotal - userTotal - taunTotal).toFixed(2) }}</span>元</div>
            </div>
          </div>
        </el-col>
        <el-col :span="6" class="cards">
          <div class="box">
            <div class="box_num">
              <div class="box_color">发布任务支出金额</div>
              <div class="text_color"><span>{{ MoneyData.sumPrice ? MoneyData.sumPrice.toFixed(2) : 0 }}</span>元</div>
            </div>
          </div>
        </el-col>
        <el-col :span="6" class="cards">
          <div class="box">
            <div class="box_num">
              <div class="box_color">任务用户收益</div>
              <div class="text_color"><span>{{ MoneyData.sumMoneyBySend ? MoneyData.sumMoneyBySend.toFixed(2) : 0
              }}</span>元</div>
            </div>
          </div>
        </el-col>
        <el-col :span="6" class="cards">
          <div class="box">
            <div class="box_num">
              <div class="box_color">平台任务收益</div>
              <div class="text_color"><span>{{ MoneyData.sumMoneyByProfit ? MoneyData.sumMoneyByProfit.toFixed(2) : 0
              }}</span>元</div>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-tab-pane>
    <el-tab-pane label="收入统计" name="second" v-if="value == 2">
      <div>
        <el-select v-model="way" style="width:150px;margin-left: 10px;" @change="animeDat">
          <el-option v-for="item in ways" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>&nbsp;&nbsp;&nbsp;
        <el-date-picker style="width: 160px;margin-left: 10px;" v-model="info.stockDate" align="right" type="datetime"
          format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="选择开始时间" @change="timeDate">
        </el-date-picker> &nbsp;&nbsp;&nbsp;
        <span>平台筛选</span>
        <el-select v-model="platform" style="width:150px;margin-left: 10px;" @change="screen">
          <el-option v-for="item in platforms" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </div>
      <el-row v-loading="tableDataLoading">
        <el-col :span="6" class="cards">
          <div class="box">
            <div class="box_num">
              <div class="box_color">平台总收入（包括团队和用户）</div>
              <div class="text_color"><span>{{ sqxTotal }}</span>元</div>
            </div>
          </div>
        </el-col>
        <el-col :span="6" class="cards">
          <div class="box">
            <div class="box_num">
              <div class="box_color">用户收入</div>
              <div class="text_color"><span>{{ userTotal }}</span>元</div>
            </div>
          </div>
        </el-col>
        <el-col :span="6" class="cards">
          <div class="box">
            <div class="box_num">
              <div class="box_color">团队总收益（包含一级和二级）</div>
              <div class="text_color"><span>{{ taunTotal }}</span>元</div>
            </div>
          </div>
        </el-col>
        <el-col :span="6" class="cards">
          <div class="box">
            <div class="box_num">
              <div class="box_color">平台实际收益（除去团队用户收益）</div>
              <div class="text_color"><span>{{ (sqxTotal - userTotal - taunTotal).toFixed(2) }}</span>元</div>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-tab-pane>
    <el-tab-pane label="提现统计" name="third">
      <div>
        <el-select v-model="way" style="width:150px;margin-left: 10px;" @change="animeDat">
          <el-option v-for="item in ways" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>&nbsp;&nbsp;&nbsp;
        <el-date-picker style="width: 160px;margin-left: 10px;" v-model="info.stockDate" align="right" type="datetime"
          format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="选择开始时间" @change="timeDate">
        </el-date-picker> &nbsp;&nbsp;&nbsp;
      </div>
      <el-row v-loading="tableDataLoading">
        <el-col :span="6" class="cards">
          <div class="box">
            <div class="box_num">
              <div class="box_color">累计提现金额</div>
              <div class="text_color" v-if="!isNaN(sumMoneyByTime)">
                <span>{{ sumMoneyByTime ? sumMoneyByTime : 0 }}</span>元
              </div>
              <div class="text_color" v-if="isNaN(sumMoneyByTime)"><span>0</span>元</div>
            </div>
          </div>
        </el-col>
        <el-col :span="6" class="cards">
          <div class="box">
            <div class="box_num">
              <div class="box_color">提现笔数</div>
              <div class="text_color">
                <span>{{ withdrawData && withdrawData.countNumberByTime ? withdrawData.countNumberByTime : 0 }}</span>笔
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="6" class="cards">
          <div class="box">
            <div class="box_num">
              <div class="box_color">待转账人数</div>
              <div class="text_color" v-if="withdrawData && withdrawData.notOutMoneyByTime">
                <span>{{ withdrawData.notOutMoneyByTime }}</span>人
              </div>
              <div class="text_color" v-else>
                <span>0</span>人
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-tab-pane>
    <el-tab-pane label="任务充值记录" name="fourth">
      <div style="display: inline-block;">
        <span>开始时间：</span>
        <el-date-picker style="width: 160px;margin-left: 10px;" v-model="startTime" align="right" type="datetime"
          format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="选择开始时间">
        </el-date-picker>&nbsp;&nbsp;&nbsp;
        <span>截止时间：</span>
        <el-date-picker style="width: 160px;margin-left: 10px;" v-model="endTime" align="right" type="datetime"
          format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="选择截止时间">
        </el-date-picker>
        <el-button style="margin-left:15px;" size="mini" type="primary" icon="document" @click="timeDate2">查询
        </el-button>
      </div>
      <el-table v-loading="tableDataLoading" :data="rechargeData">
        <el-table-column fixed prop="id" label="编号" width="80">
        </el-table-column>
        <el-table-column prop="nickName" label="用户名称">
          <template slot-scope="scope">
            <span style="color: #4f9dec;cursor: pointer;" @click="updates(scope.row)">{{ scope.row.nickName ?
                scope.row.nickName : 'null'
            }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="orderId" label="充值订单号" width="250">
        </el-table-column>
        <el-table-column prop="money" label="充值金额" width="100">
        </el-table-column>
        <el-table-column label="支付凭证" >
          <template slot-scope="scope">
              <el-image
                ref="voucherImg"
                style="width: 100px; height: 100px"
                :src="scope.row.voucherImg"
                :preview-src-list="[scope.row.voucherImg]"
                fit="cover"
              />
             
          </template>
        </el-table-column>
        <el-table-column label="拒绝原因" prop="content" ></el-table-column>
        <el-table-column prop="userId" label="编号" width="100">
        </el-table-column>
        <el-table-column label="分类" width="120">
          <template slot-scope="scope">
            <span style="color: #4f9dec;cursor: pointer;" v-if="scope.row.classify == 1">微信</span>
            <span style="color: #4f9dec;cursor: pointer;" v-if="scope.row.classify == 2">支付宝</span>
            <span style="color: #4f9dec;cursor: pointer;" v-if="scope.row.classify == 3">上传凭证</span>

          </template>
        </el-table-column>
        <el-table-column label="状态" width="120">
          <template slot-scope="scope">
            <span style="color: #4f9dec;" v-if="scope.row.state == 0">待支付</span>
            <span style="color: #4f9dec;" v-if="scope.row.state == 1">支付成功</span>
            <span style="color: #4f9dec;" v-if="scope.row.state == 2">支付失败</span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="170">
        </el-table-column>
        <el-table-column prop="payTime" label="支付时间">
        </el-table-column>
        <el-table-column prop="edit" label="审核">
          <template slot-scope="scope" v-if="scope.row.classify==3">
            <el-button size="mini" type="primary"  @click="agreeVoucher(scope.row)">
              转账
            </el-button>
            <el-button size="mini" type="primary" @click="refuseVoucher(scope.row)">
              拒绝
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align: center;margin-top: 10px;">
        <el-pagination @size-change="handleSizeChange1" @current-change="handleCurrentChange1"
          :page-sizes="[10, 20, 30, 40]" :page-size="size" :current-page="page"
          layout="total,sizes, prev, pager, next,jumper" :total="totalnum2">
        </el-pagination>
      </div>
    </el-tab-pane>
     <!-- 充值拒绝弹框 -->
     <el-dialog title="拒绝" :visible.sync="dialogPayVisible" center>
        <el-form :model="payForm">
          <el-form-item label="拒绝原因：" :label-width="formLabelWidth">
            <el-input v-model="payForm.content" type="textarea" rows="4" placeholder="请输入拒绝原因" style="width:65%;">
            </el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogPayVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleRefuseVoucher()">确 定</el-button>
        </div>
      </el-dialog>
    <!-- 用户钱包 -->
    <el-tab-pane label="用户钱包" name="fifth">
      <div style="display: inline-block">
        <el-input
          style="width: 150px"
          @keydown.enter.native="findMoneyDetailsChange"
          clearable
          placeholder="请输入手机号"
          v-model="phone"
        >
        </el-input
        >&nbsp;&nbsp;&nbsp;&nbsp;
        <el-input
          style="width: 150px"
          @keydown.enter.native="findMoneyDetailsChange"
          clearable
          placeholder="请输入昵称"
          v-model="nickName"
        >
        </el-input>
      <span>开始时间：</span>
      <el-date-picker
        style="width: 160px; margin-left: 10px"
        v-model="startDate"
        align="right"
        type="datetime"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
        placeholder="选择开始时间"
      >
      </el-date-picker
      >&nbsp;&nbsp;&nbsp;
      <span>截止时间：</span>
      <el-date-picker
        style="width: 160px; margin-left: 10px"
        v-model="endDate"
        align="right"
        type="datetime"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
        placeholder="选择截止时间"
      >
      </el-date-picker>&nbsp;
      <span>类型：</span>
      <el-select
        v-model="type"
        placeholder="请选择类型"
        style="width: 150px"
        @change="findMoneyDetailsChange(status)"
        clearable
      >
        <el-option
          :key="1"
          label="收入"
          value="1"
        >
        </el-option>
        <el-option
          :key="2"
          label="支出"
          value="2"
        >
        </el-option>
      </el-select>

      <el-button
        style="margin-left: 15px"
        size="mini"
        type="primary"
        icon="document"
        @click="findMoneyDetailsChange"
      >查询
      </el-button>
      <el-button
        style="margin-left: 15px"
        size="mini"
        type="primary"
        icon="document"
        @click="clearFindMoneyDetails"
      >重置
      </el-button>
    </div>

      <el-table v-loading="tableDataLoading" :data="moneyDetailsData">
        <el-table-column fixed prop="id" label="编号" width="80">
        </el-table-column>
        <el-table-column prop="nickName" label="昵称" width="150">
        </el-table-column>
        <el-table-column prop="phone" label="手机号" width="150">
        </el-table-column>
        <el-table-column prop="type" label="类型" width="80">
          <template slot-scope="scope">
            {{scope.row.type == 1?'收入':'支出'}}
          </template>
        </el-table-column>
        <el-table-column prop="money" label="金额" width="80">
        </el-table-column>
        <el-table-column prop="title" label="标题" width="80">
        </el-table-column>
        <el-table-column prop="createTime" label="时间" width="150">
          <template slot-scope="scope">
            {{ parseDateTime(new Date(scope.row.createTime)) }}
          </template>
        </el-table-column>
        <el-table-column prop="content" label="内容" width="600">
        </el-table-column>
      </el-table>
      <div style="text-align: center;margin-top: 10px;">
        <el-pagination @size-change="handleMoneyDetailsSizeChange1" @current-change="handleMoneyDetailsCurrentChange1"
          :page-sizes="[10, 20, 30, 40]" :page-size="size" :current-page="page"
          layout="total,sizes, prev, pager, next,jumper" :total="moneDetailsTotal">
        </el-pagination>
      </div>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import { parseDateTime } from '@/utils/date.js';
export default {
  data() {
    return {
      state: 2,
      orderStatus: [
        {
          value: 2,
          label: '全部'
        }, {
          value: 0,
          label: '待转账'
        }, {
          value: 1,
          label: '已转账'
        }, {
          value: -1,
          label: '已拒绝'
        }],
      classify:'',  
      classifyStatus:[
        {
          value:'',
          label:'全部'
        },
        {
          value: 1,
          label: '支付宝'
        },
        {
          value: 4,
          label: '银行卡'
        }
      ],  
      page: 1,
      size: 10,
      balance: -1,
      zhifubao: '',
      tkstatus: -1,
      platform: 'all',
      phone: '',
      content: '',
      startTime: '',
      endTime: '',
      cashId: '',
      type: -1,
      value: '',
      totalnum: 0,
      totalnum2: 0,
      sqxTotal: 0,
      userTotal: 0,
      taunTotal: 0,
      relationId: '',
      sumMoneyByTime: 0,
      activeName: 'first',
      formLabelWidth: '200px',
      dialogFormVisible: false,
      tableDataLoading: false,
      tableData: [],
      rechargeData: [],
      withdrawData: {},
      checkBoxData: [],  //多选框选择的值
      MoneyData: {},
      time: '',
      way: 3,
      form: {
        cashId: '',
        content: '',
      },
      info: {
        stockDate: this.getNowTime(),  //日期
      },
      info2: {
        stockDate2: this.getNowTime2(),  //日期
      },
      platforms: [
        {
          value: 'all',
          label: '全部'
        }, {
          value: 'tb',
          label: '淘宝'
        }, {
          value: 'jd',
          label: '京东'
        }, {
          value: 'pdd',
          label: '拼多多'
        }, {
          value: 'mt',
          label: '美团'
        }, {
          value: 'elm',
          label: '饿了么'
        }],
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
      /* 用户钱包--start */
      nickName:'',
      phone:'',
      moneyDetailsData:[],
      moneDetailsTotal:0,
      startDate:null,
      endDate:null,
      type:'',
      /* 用户钱包--end */
      /* 充值审核--start */
      payForm:{
        id:'',
        content:''
      },
      dialogPayVisible: false,
       /* 充值审核--end */

    }

  },
  methods: {
    parseDateTime,
    // 会员详情跳转
    updates(row) {
      console.log(row)
      this.$http({
        url: this.$http.adornUrl2('/common/type/91'),
        method: 'get',
        params: this.$http.adornParams({})
      }).then(({ data }) => {
        let returnData = data.data
        this.value = returnData.value
        if (this.value == 1) {
          this.$router.push({ path: '/userDetail', query: { userId: row.userId } })
        } else {
          this.$router.push({ path: '/userDetailThree', query: { userId: row.userId } })
        }
      })
      // this.$router.push({path: '/userDetail', query: {userId: row.userId}})
    },
    // 批量转账
    transferClcik(id) {
      let _this = this
      var ids = id ? [id] : this.checkBoxData.map(item => {
        return item.id
      })
      for (var i in ids) {
        _this.$http({
          url: _this.$http.adornUrl2(`/cash/v1/alipay/${ids[i]}`),
          method: 'post',
          data: _this.$http.adornData({})
        }).then(({ data }) => {
          if (data.status == 0) {
            _this.$notify({
              title: '提示',
              duration: 1800,
              message: data.msg,
              type: 'warning'
            })
            return
          }
          if (data.status == 9999) {
            _this.$notify({
              title: '提示',
              duration: 1800,
              message: data.msg,
              type: 'error'
            })
            return
          }
        })
      }
    },
    // 多选
    changeFun(val) {
      this.checkBoxData = val
    },
    cleans() {
      this.zhifubao = ''
      this.relationId = ''
      this.state = 2
      this.classify = ''
      this.dataSelect()
    },
    // 结算
    close() {
      this.$http({
        url: this.$http.adornUrl2('/cash/userToTalMoney'),
        method: 'post',
        data: this.$http.adornData({})
      }).then(({ data }) => {
        if (data.status == 0) {
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.dataSelect()
            }
          })
        }
      })
    },
    //转账
    batch(row) {
      let cashId = row.id
      if (row.state == 1) {
        this.$message({
          message: '已转账，请勿重复操作！',
          type: 'error',
          duration: 2500
        })
        return
      }
      this.$confirm(`确定转账?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl2(`/cash/v1/alipay/${cashId}`),
          method: 'post',
          data: this.$http.adornData(cashId, false)
        }).then(({ data }) => {
          if (data.status == 0) {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.dataSelect()
              }
            })
            return
          }
          if (data.status == 9999) {
            this.$message({
              message: data.msg,
              type: 'error',
              duration: 2500
            })
            return
          }
        })
      })

    },
    // 拒绝
    refund(row) {
      if (row.state == -1) {
        this.$message({
          message: '已拒绝，请勿重复操作！',
          type: 'error',
          duration: 2500
        })
      } else {
        this.dialogFormVisible = true
        this.form.cashId = row.id
      }
    },
    // 拒绝操作
    refundNoticeTo() {
      if (this.form.content == '') {
        this.$message({
          message: '请输入拒绝原因！',
          type: 'error',
          duration: 1500
        })
        return
      }
      this.$http({
        url: this.$http.adornUrl2(`/cash/v1/refund/${this.form.cashId}/${this.form.content}`),
        method: 'post',
        data: this.$http.adornData({})
      }).then(({ data }) => {
        if (data.status == 0) {
          this.dialogFormVisible = false
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.form.content = ''
              this.dataSelect()
            }
          })
          return
        }
        if (data.status == -100) {
          this.dialogFormVisible = false
          this.$message({
            message: data.msg,
            type: 'error',
            duration: 2500,
            onClose: () => {
              this.form.content = ''
            }
          })
          return
        }
      })
    },
    timeDate() {
      this.incomeSelect()
      this.withdrawSelect()
    },
    timeDate2() {
      this.rechargeSelect()
    },
    // 日期选择
    animeDat(value) {
      let vanumber = value
      if (vanumber === 3) {
        this.incomeSelect()
        this.withdrawSelect()
        this.incomeSelect2()
      }
      if (vanumber === 2) {
        this.time = this.info.stockDate
        this.info.stockDate = this.info.stockDate.substring(0, 7)
        this.incomeSelect()
        this.withdrawSelect()
        this.incomeSelect2()
        this.info.stockDate = this.time
      }
      if (vanumber === 1) {
        this.info.stockDate = this.info.stockDate.substring(0, 4)
        this.incomeSelect()
        this.withdrawSelect()
        this.incomeSelect2()
        // this.info.stockDate = this.getNowTime()
        this.info.stockDate = this.time
      }
    },
    // 渠道筛选事件
    screen(value) {
      if (value == 'all') {
        this.platform = 'all'
        this.incomeSelect()
      }
      if (value == 'tb') {
        this.platform = 'tb'
        this.incomeSelect()
      }
      if (value == 'jd') {
        this.platform = 'jd'
        this.incomeSelect()
      }
      if (value == 'pdd') {
        this.platform = 'pdd'
        this.incomeSelect()
      }
    },
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
    },
    handleSizeChange(val) {
      this.size = val
      this.dataSelect()
    },
    handleCurrentChange(val) {
      this.page = val
      this.dataSelect()
    },
    handleSizeChange1(val) {
      this.size = val
      this.rechargeSelect()
    },
    handleCurrentChange1(val) {
      this.page = val
      this.rechargeSelect()
    },
    handleClick(tab, event) {
      if (tab._props.label == '提现管理') {
        this.page = 1
        this.size = 10
        this.dataSelect()
      }
      if (tab._props.label == '收入统计') {
        this.way = 3
        this.incomeSelect()
        this.incomeSelect2()
      }
      if (tab._props.label == '提现统计') {
        this.way = 3
        this.withdrawSelect()
      }
      if (tab._props.label == '任务充值记录') {
        this.page = 1
        this.size = 10
        this.rechargeSelect()
      }
      if (tab._props.label == '用户钱包') {
        this.page = 1;
        this.size = 10;
        this.findMoneyDetailsList();
      }
    },
    // 收入统计
    incomeSelect2() {
      this.$http({
        url: this.$http.adornUrl2('/statistics/statisticsIncomeMoney'),
        method: 'get',
        params: this.$http.adornParams({
          'time': this.info.stockDate,
          'flag': this.way
        })
      }).then(({ data }) => {
        if (data.status == 0) {
          let returnData = data.data
          this.MoneyData = returnData
        }
      })
    },
    // select自动选择
    selectTrigger() {
      this.$http({
        url:
          this.$http.adornUrl2(`/cash/selectCashList?page=${this.page - 1}&size=${this.size}&zhifubao=${this.zhifubao}&relationId=${this.relationId}&state=${this.state}&classify=${this.classify}`),
        method: 'get',
        params: this.$http.adornParams({})
      }).then(({ data }) => {
        this.tableDataLoading = false
        let returnData = data.data
        this.tableData = returnData.content
        this.totalnum = returnData.totalElements
      })
    },
    // 支付宝账号查询
    zfbselect() {
      if (this.zhifubao == '') {
        this.$notify({
          title: '提示',
          duration: 1800,
          message: '请输入支付宝账号',
          type: 'error'
        })
        return
      }
      this.tableDataLoading = true
      this.$http({
        url: this.$http.adornUrl2(`/cash/phone/${this.zhifubao}`),
        method: 'get',
        params: this.$http.adornParams({})
      }).then(({ data }) => {
        this.tableDataLoading = false
        let returnData = data.data
        this.tableData = returnData
        this.totalnum = returnData.length
      })
    },
    // 渠道账号查询
    qdselect() {
      if (this.relationId == '') {
        this.$notify({
          title: '提示',
          duration: 1800,
          message: '请输入渠道账号',
          type: 'error'
        })
        return
      }
      this.tableDataLoading = true
      this.$http({
        url: this.$http.adornUrl2(`/cash/list/${this.relationId}`),
        method: 'get',
        params: this.$http.adornParams({})
      }).then(({ data }) => {
        this.tableDataLoading = false
        let returnData = data.data
        this.tableData = returnData
        this.totalnum = returnData.length
      })
    },
    // 获取数据列表
    dataSelect() {
      this.tableDataLoading = true
      this.$http({
        url: this.$http.adornUrl2(`/cash/selectCashList?page=${this.page - 1}&size=${this.size}&zhifubao=${this.zhifubao}&relationId=${this.relationId}&state=${this.state}`),
        method: 'get',
        params: this.$http.adornParams({})
      }).then(({ data }) => {
        this.tableDataLoading = false
        let returnData = data.data
        this.tableData = returnData.content
        this.totalnum = returnData.totalElements
      })
    },
    // 收入统计
    incomeSelect() {
      this.tableDataLoading = true
      this.$http({
        url: this.$http.adornUrl2('/statistics/getOrderMoneyTotal'),
        method: 'get',
        params: this.$http.adornParams({
          'time': this.info.stockDate,
          'platform': this.platform,
          'type': this.type,
          'balance': this.balance
        })
      }).then(({ data }) => {
        let returnData = data.data
        if (returnData && returnData.sqxTotal) {
          this.sqxTotal = parseFloat(returnData.sqxTotal).toFixed(2)

        }
        if (returnData && returnData.userTotal) {
          this.userTotal = parseFloat(returnData.userTotal).toFixed(2)

        }
        if (returnData && returnData.taunTotal) {
          this.taunTotal = parseFloat(returnData.taunTotal).toFixed(2)

        }
        this.tableDataLoading = false
      })
    },
    // 提现统计
    withdrawSelect() {
      this.tableDataLoading = true
      this.$http({
        url: this.$http.adornUrl2('/statistics/getSumMoneyByTime'),
        method: 'get',
        params: this.$http.adornParams({
          'time': this.info.stockDate,
        })
      }).then(({ data }) => {
        let returnData = data.data
        this.withdrawData = returnData
        this.sumMoneyByTime = parseFloat(returnData.sumMoneyByTime).toFixed(2)
        this.tableDataLoading = false
      })
    },
    // 获取充值记录
    rechargeSelect() {
      if (this.endTime == '') {
        this.endTime = this.info.stockDate
      }
      if (this.startTime == '') {
        this.startTime = this.info2.stockDate2
      }
      this.tableDataLoading = true
      this.$http({
        url: this.$http.adornUrl2(`/cash/selectPayDetails?page=${this.page - 1}&size=${this.size}&startTime=${this.startTime}&endTime=${this.endTime}`),
        method: 'post',
        data: this.$http.adornData({})
      }).then(({ data }) => {
        this.tableDataLoading = false
        let returnData = data.data
        this.rechargeData = returnData.content
        this.totalnum2 = returnData.totalElements
      })
    },
    valueSelect() {
      this.$http({
        url: this.$http.adornUrl2('/common/type/91'),
        method: 'get',
        params: this.$http.adornParams({})
      }).then(({ data }) => {
        let returnData = data.data
        this.value = returnData.value
      })
    },
    /* 查询用户钱包 */
    findMoneyDetailsList() {
      this.tableDataLoading = true
      this.$http({
        url: this.$http.adornUrl2('/grade/findMoneyDetailsList'),
        method: 'get',
        params: this.$http.adornParams({
          'page': this.page - 1,
          'size': this.size,
          'startDate': this.startDate,
          'endDate': this.endDate,
          'nickName':this.nickName,
          'phone':this.phone,
          'type':this.type,
        })
      }).then(({ data }) => {
        this.tableDataLoading = false
        let returnData = data.data
        this.moneyDetailsData = returnData.content
        this.moneDetailsTotal = returnData.totalElements
      })
    },
    // 刷新
    findMoneyDetailsChange() {
      this.page = 1;
      this.size = 10;
      this.findMoneyDetailsList();
    },
    // 清楚所有查找条件
    clearFindMoneyDetails() {
      this.page = 1;
      this.size = 10;
      this.startDate = '';
      this.endDate = '';
      this.nickName = '';
      this.phone = '';
      this.type = '';
      this.findMoneyDetailsList();
    },
    handleMoneyDetailsSizeChange1(val) {
      this.size = val
      this.findMoneyDetailsList()
    },
    handleMoneyDetailsCurrentChange1(val) {
      this.page = val
      this.findMoneyDetailsList()
    },
    // 同意充值
    // 拒绝
    agreeVoucher(row) {
      if (row.state  !=0) {
        this.$message({
          message: '已转账，请勿重复操作！',
          type: 'error',
          duration: 2500
        })
        return
      } 

      this.$confirm(`确定转账?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl2(`/cash/agreeVoucher/${row.id}`),
          method: 'get',
          data: this.$http.adornData({})
        }).then(({ data }) => {
          if (data.status == 0) {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.rechargeSelect
                ()
              }
            })
            return
          } else {
            this.$message({
              message: data.msg,
              type: 'error',
              duration: 2500
            })
            return
          }
        })
      })
    },
    refuseVoucher(row) {
      // 拒绝
      if (row.state !=0) {
        this.$message({
          message: '已拒绝，请勿重复操作！',
          type: 'error',
          duration: 2500
        })
      } else {
        this.dialogPayVisible = true
        this.payForm.id = row.id
      }
    },
    handleRefuseVoucher(row) {
      if (this.payForm.content == '') {
        this.$message({
          message: '请输入拒绝原因！',
          type: 'error',
          duration: 1500
        })
        return
      }
      this.$http({
        url: this.$http.adornUrl2(`/cash/refuseVoucher/${this.payForm.id}?content=${this.payForm.content}`),
        method: 'get',
        data: this.$http.adornData({})
      }).then(({ data }) => {
        if (data.status == 0) {
          this.dialogPayVisible = false
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.form.content = ''
              this.rechargeSelect()
            }
          })
          return
        }
        this.dialogFormVisible = false
        this.$message({
          message: data.msg,
          type: 'error',
          duration: 2500,
          onClose: () => {
            this.form.content = ''
          }
        })
        return
      })
    }
  },
  mounted() {
    this.dataSelect()
    this.valueSelect()
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
