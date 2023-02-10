<template>
  <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="全部用户" name="first">
      <div style="margin: 2% 0; display: inline-block">
        <span>渠道筛选：</span>
        <el-select
          v-model="platform"
          placeholder="请选择类型"
          style="width: 150px"
          @change="selectTrigger(platform)"
        >
          <el-option
            v-for="item in platforms"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option> </el-select
        >&nbsp;&nbsp;&nbsp;&nbsp;
        <el-input
          style="width: 150px"
          @keydown.enter.native="select"
          clearable
          placeholder="请输入手机号"
          v-model="phone"
        >
        </el-input
        >&nbsp;&nbsp;&nbsp;&nbsp;
        <el-input
          style="width: 150px"
          @keydown.enter.native="select"
          clearable
          placeholder="请输入昵称"
          v-model="nickName"
        >
        </el-input>
      </div>
      <div style="display: inline-block">
        <el-button
          style="margin-left: 15px"
          size="mini"
          type="primary"
          icon="document"
          @click="select"
          >查询</el-button
        >
        <el-button
          style="margin-left: 15px"
          size="mini"
          type="primary"
          icon="document"
          @click="cleans"
          >重置</el-button
        >
        <el-button
          style="margin-left: 15px"
          size="mini"
          type="success"
          icon="document"
          @click="derive1"
          >导出Excel
        </el-button>
      </div>
      <el-table v-loading="tableDataLoading" :data="tableData.content">
        <el-table-column fixed prop="nickName" label="昵称" width="120">
          <template slot-scope="scope">
            <span style="color: #f56c6c">{{
              scope.row.nickName ? scope.row.nickName : "未设置"
            }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column fixed prop="rankLevel" label="销售信息" width="120">
          <template slot-scope="scope">
            销售等级：<span style="color: #f56c6c">{{
              scope.row.rankLevel
                ? configList.find((a) => a.rankCode === scope.row.rankLevel)
                    .rankName
                : "未设置"
            }}</span
            ><br />
            我的销量：<span style="color: #f56c6c">{{
              scope.row.mySalesNum || 0
            }}</span
            ><br />
            团队销量：<span style="color: #f56c6c">{{
              scope.row.salesNum || 0
            }}</span
            ><br />
          </template>
        </el-table-column> -->
        <el-table-column prop="phone" label="手机号" width="120">
          <template slot-scope="scope">
            <span
              style="color: #4f9dec; cursor: pointer"
              @click="updates(scope.row)"
              >{{ scope.row.phone ? scope.row.phone : "未绑定" }}</span
            >
          </template>
        </el-table-column>
        <el-table-column prop="createAt" label="创建时间" width="180">
        </el-table-column>
        <el-table-column prop="gender" label="性别" width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.gender == 1">男</span>
            <span v-if="scope.row.gender == 2">女</span>
            <span v-if="!scope.row.gender">未知</span>
          </template>
        </el-table-column>
        <el-table-column prop="relationId" label="邀请码" width="100">
          <template slot-scope="scope">
            <span>{{
              scope.row.isInvitation === 0
                ? "未授权"
                : scope.row.relationId
                ? scope.row.relationId
                : "未绑定"
            }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="invitation" label="邀请人" width="150">
          <template slot-scope="scope">
            <span
              style="color: #4f9dec; cursor: pointer"
              @click="colonelClick(scope.row.invitation)"
              >{{
                scope.row.invitation ? scope.row.invitation : "未设置"
              }}</span
            >
          </template>
        </el-table-column>
        <!-- <el-table-column prop="invitationCode" label="邀请码" width="150"> -->
        <!-- </el-table-column> -->
        <el-table-column prop="grade" label="等级" width="150">
          <template slot-scope="scope">
            <span>{{ scope.row.grade * 100 }}%</span>
            <div>
              <el-input
                type="text"
                @keydown.enter.native="addition(scope.row)"
                v-model="scope.row.grade"
                clearable
                placeholder="例0.3"
                style="width: 120px; font-size: 14px"
              >
                <i
                  slot="suffix"
                  class="el-input__icon el-icon-search"
                  @click="addition(scope.row)"
                ></i>
              </el-input>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="zhifubao" label="支付宝">
          <template slot-scope="scope">
            <span
              >{{ scope.row.zhifubaoName
              }}{{ scope.row.zhifubao ? scope.row.zhifubao : "未绑定" }}</span
            >
          </template>
        </el-table-column>
        <el-table-column prop="cardFront" label="收款二维码" width="150">
          <template slot-scope="scope">
            <div v-if="scope.row.wxImg == null || scope.row.wxImg == ''">
              暂无图片
            </div>
            <div v-if="scope.row.wxImg" style="display: flex; flex-wrap: wrap">
              <el-popover placement="top-start" title="" trigger="hover">
                <img
                  style="width: 50px; height: 50px"
                  :src="scope.row.wxImg"
                  alt=""
                  slot="reference"
                />
                <img
                  style="width: 200px; height: 200px"
                  :src="scope.row.wxImg"
                  alt=""
                />
              </el-popover>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="jifen" label="余额" width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.jifen | numFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="orderJifen" label="积分">
          <template slot-scope="scope">
            <span>{{ scope.row.orderJifen | numFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="备注" width="150">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
            <div>
              <el-input
                type="text"
                @keydown.enter.native="remark(scope.row)"
                v-model="scope.row.name"
                clearable
                placeholder="备注"
                style="width: 120px; font-size: 14px"
              >
                <i
                  slot="suffix"
                  class="el-input__icon el-icon-search"
                  @click="remark(scope.row)"
                ></i>
              </el-input>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="pub_share_pre_fee_user_s" label="来源">
          <template slot-scope="scope">
            <span v-if="scope.row.platform == 'weixin'">公众号</span>
            <span v-if="scope.row.platform == 'wap'">网站</span>
            <span v-if="scope.row.platform == 'app'">APP</span>
            <span v-if="scope.row.platform == 'mp'">小程序</span>
            <span v-if="scope.row.platform == ''">未知</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" prop="state " label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.state"
              @change="change(scope.row.state, scope.row.id)"
              :active-value="openValue"
              :inactive-value="closeValue"
              active-color="#13ce66"
              inactive-color="#ff4949"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="120">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="updates(scope.row)"
              >用户详情
            </el-button>
            <el-button
              v-if="scope.row.relationId !== null && scope.row.pdd !== null"
              size="mini"
              type="primary"
              @click="price(scope.row)"
              >多多比价
            </el-button>
            <el-button
              :disabled="!isAuth('userList:delete')"
              size="mini"
              type="danger"
              @click="deleteuser(scope.row)"
            >
              删除用户
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align: center; margin-top: 10px">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[5, 10, 15, 20]"
          :page-size="size"
          :current-page="page"
          layout="total,sizes, prev, pager, next,jumper"
          :total="tableData.totalElements"
        >
        </el-pagination>
      </div>
    </el-tab-pane>
    <el-tab-pane label="会员用户" name="second">
      <div style="margin: 2% 0; display: inline-block">
        <span>渠道筛选：</span>
        <el-select
          v-model="platform"
          placeholder="请选择类型"
          style="width: 150px"
          @change="selectTrigger(platform)"
        >
          <el-option
            v-for="item in platforms"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option> </el-select
        >&nbsp;&nbsp;&nbsp;&nbsp;
        <el-input
          style="width: 150px"
          @keydown.enter.native="select"
          clearable
          placeholder="请输入手机号"
          v-model="phone"
        >
        </el-input
        >&nbsp;&nbsp;&nbsp;&nbsp;
        <el-input
          style="width: 150px"
          @keydown.enter.native="select"
          clearable
          placeholder="请输入昵称"
          v-model="nickName"
        >
        </el-input>
      </div>
      <div style="display: inline-block">
        <el-button
          style="margin-left: 15px"
          size="mini"
          type="primary"
          icon="document"
          @click="select"
          >查询</el-button
        >
        <el-button
          style="margin-left: 15px"
          size="mini"
          type="primary"
          icon="document"
          @click="cleans1"
          >重置</el-button
        >
        <el-button
          style="margin-left: 15px"
          size="mini"
          type="success"
          icon="document"
          @click="derive2"
          >导出Excel
        </el-button>
      </div>
      <el-table v-loading="tableDataLoading" :data="tableData.content">
        <el-table-column fixed prop="nickName" label="昵称" width="120">
          <template slot-scope="scope">
            <span style="color: #f56c6c">{{
              scope.row.nickName ? scope.row.nickName : "未设置"
            }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="手机号" width="120">
          <template slot-scope="scope">
            <span
              style="color: #4f9dec; cursor: pointer"
              @click="updates(scope.row)"
              >{{ scope.row.phone ? scope.row.phone : "未绑定" }}</span
            >
          </template>
        </el-table-column>
        <el-table-column prop="createAt" label="创建时间" width="180">
        </el-table-column>
        <el-table-column prop="gender" label="性别" width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.gender == 1">男</span>
            <span v-if="scope.row.gender == 2">女</span>
            <span v-if="!scope.row.gender">未知</span>
          </template>
        </el-table-column>
        <el-table-column prop="relationId" label="会员编号" width="100">
          <template slot-scope="scope">
            <span>{{
              scope.row.isInvitation === 0
                ? "未授权"
                : scope.row.relationId
                ? scope.row.relationId
                : "未绑定"
            }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="invitation" label="邀请人" width="150">
          <template slot-scope="scope">
            <span
              style="color: #4f9dec; cursor: pointer"
              @click="colonelClick(scope.row.invitation)"
              >{{
                scope.row.invitation ? scope.row.invitation : "未设置"
              }}</span
            >
          </template>
        </el-table-column>
        <el-table-column prop="invitationCode" label="邀请码" width="150">
        </el-table-column>
        <el-table-column prop="grade" label="等级" width="150">
          <template slot-scope="scope">
            <span>{{ scope.row.grade * 100 }}%</span>
            <div>
              <el-input
                type="text"
                @keydown.enter.native="addition(scope.row)"
                v-model="scope.row.grade"
                clearable
                placeholder="例0.3"
                style="width: 120px; font-size: 14px"
              >
                <i
                  slot="suffix"
                  class="el-input__icon el-icon-search"
                  @click="addition(scope.row)"
                ></i>
              </el-input>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="zhifubao" label="支付宝">
          <template slot-scope="scope">
            <span
              >{{ scope.row.zhifubaoName
              }}{{ scope.row.zhifubao ? scope.row.zhifubao : "未绑定" }}</span
            >
          </template>
        </el-table-column>
        <el-table-column prop="cardFront" label="收款二维码" width="150">
          <template slot-scope="scope">
            <div v-if="scope.row.wxImg == null || scope.row.wxImg == ''">
              暂无图片
            </div>
            <div v-if="scope.row.wxImg" style="display: flex; flex-wrap: wrap">
              <el-popover placement="top-start" title="" trigger="hover">
                <img
                  style="width: 50px; height: 50px"
                  :src="scope.row.wxImg"
                  alt=""
                  slot="reference"
                />
                <img
                  style="width: 200px; height: 200px"
                  :src="scope.row.wxImg"
                  alt=""
                />
              </el-popover>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="jifen" label="余额" width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.jifen | numFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="orderJifen" label="积分">
          <template slot-scope="scope">
            <span>{{ scope.row.orderJifen | numFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="备注" width="150">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
            <div>
              <el-input
                type="text"
                @keydown.enter.native="remark(scope.row)"
                v-model="scope.row.name"
                clearable
                placeholder="备注"
                style="width: 120px; font-size: 14px"
              >
                <i
                  slot="suffix"
                  class="el-input__icon el-icon-search"
                  @click="remark(scope.row)"
                ></i>
              </el-input>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="pub_share_pre_fee_user_s" label="来源">
          <template slot-scope="scope">
            <span v-if="scope.row.platform == 'weixin'">公众号</span>
            <span v-if="scope.row.platform == 'wap'">网站</span>
            <span v-if="scope.row.platform == 'app'">APP</span>
            <span v-if="scope.row.platform == 'mp'">小程序</span>
            <span v-if="scope.row.platform == ''"></span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" prop="state " label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.state"
              @change="change(scope.row.state, scope.row.id)"
              :active-value="openValue"
              :inactive-value="closeValue"
              active-color="#13ce66"
              inactive-color="#ff4949"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="120">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="updates(scope.row)"
              >用户详情
            </el-button>
            <el-button size="mini" type="primary" @click="hyorder(scope.row)"
              >会员订单
            </el-button>
            <el-button size="mini" type="primary" @click="record(scope.row)"
              >提现记录
            </el-button>
            <el-button
              v-if="scope.row.relationId !== null && scope.row.pdd !== null"
              size="mini"
              type="primary"
              @click="price(scope.row)"
              >多多比价
            </el-button>
            <el-button
              size="mini"
              type="danger"
              :disabled="!isAuth('userList:delete')"
              @click="deleteuser(scope.row)"
            >
              删除用户
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align: center; margin-top: 10px">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[5, 10, 15, 20]"
          :page-size="size"
          :current-page="page"
          layout="total,sizes, prev, pager, next,jumper"
          :total="tableData.totalElements"
        >
        </el-pagination>
      </div>
    </el-tab-pane>
    <el-tab-pane label="普通用户" name="third">
      <div style="margin: 2% 0; display: inline-block">
        <span>渠道筛选：</span>
        <el-select
          v-model="platform"
          placeholder="请选择类型"
          style="width: 150px"
          @change="selectTrigger(platform)"
        >
          <el-option
            v-for="item in platforms"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option> </el-select
        >&nbsp;&nbsp;&nbsp;&nbsp;
        <el-input
          style="width: 150px"
          @keydown.enter.native="select"
          clearable
          placeholder="请输入手机号"
          v-model="phone"
        >
        </el-input
        >&nbsp;&nbsp;&nbsp;&nbsp;
        <el-input
          style="width: 150px"
          @keydown.enter.native="select"
          clearable
          placeholder="请输入昵称"
          v-model="nickName"
        >
        </el-input>
      </div>
      <div style="display: inline-block">
        <el-button
          style="margin-left: 15px"
          size="mini"
          type="primary"
          icon="document"
          @click="select"
          >查询</el-button
        >
        <el-button
          style="margin-left: 15px"
          size="mini"
          type="primary"
          icon="document"
          @click="cleans4"
          >重置</el-button
        >
        <el-button
          style="margin-left: 15px"
          size="mini"
          type="success"
          icon="document"
          @click="derive3"
          >导出Excel
        </el-button>
      </div>
      <el-table v-loading="tableDataLoading" :data="tableData.content">
        <el-table-column fixed prop="nickName" label="昵称" width="120">
          <template slot-scope="scope">
            <span style="color: #f56c6c">{{
              scope.row.nickName ? scope.row.nickName : "未设置"
            }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="手机号" width="120">
          <template slot-scope="scope">
            <span
              style="color: #4f9dec; cursor: pointer"
              @click="updates(scope.row)"
              >{{ scope.row.phone ? scope.row.phone : "未绑定" }}</span
            >
          </template>
        </el-table-column>
        <el-table-column prop="createAt" label="创建时间" width="180">
        </el-table-column>
        <el-table-column prop="gender" label="性别" width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.gender == 1">男</span>
            <span v-if="scope.row.gender == 2">女</span>
            <span v-if="!scope.row.gender">未知</span>
          </template>
        </el-table-column>
        <el-table-column prop="relationId" label="会员编号" width="100">
          <template slot-scope="scope">
            <span>{{
              scope.row.isInvitation === 0
                ? "未授权"
                : scope.row.relationId
                ? scope.row.relationId
                : "未绑定"
            }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="invitation" label="邀请人" width="150">
          <template slot-scope="scope">
            <span
              style="color: #4f9dec; cursor: pointer"
              @click="colonelClick(scope.row.invitation)"
              >{{
                scope.row.invitation ? scope.row.invitation : "未设置"
              }}</span
            >
          </template>
        </el-table-column>
        <el-table-column prop="invitationCode" label="邀请码" width="150">
        </el-table-column>
        <el-table-column prop="grade" label="等级" width="150">
          <template slot-scope="scope">
            <span>{{ scope.row.grade * 100 }}%</span>
            <div>
              <el-input
                type="text"
                @keydown.enter.native="addition(scope.row)"
                v-model="scope.row.grade"
                clearable
                placeholder="例0.3"
                style="width: 120px; font-size: 14px"
              >
                <i
                  slot="suffix"
                  class="el-input__icon el-icon-search"
                  @click="addition(scope.row)"
                ></i>
              </el-input>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="zhifubao" label="支付宝">
          <template slot-scope="scope">
            <span
              >{{ scope.row.zhifubaoName
              }}{{ scope.row.zhifubao ? scope.row.zhifubao : "未绑定" }}</span
            >
          </template>
        </el-table-column>
        <el-table-column prop="cardFront" label="收款二维码" width="150">
          <template slot-scope="scope">
            <div v-if="scope.row.wxImg == null || scope.row.wxImg == ''">
              暂无图片
            </div>
            <div v-if="scope.row.wxImg" style="display: flex; flex-wrap: wrap">
              <el-popover placement="top-start" title="" trigger="hover">
                <img
                  style="width: 50px; height: 50px"
                  :src="scope.row.wxImg"
                  alt=""
                  slot="reference"
                />
                <img
                  style="width: 200px; height: 200px"
                  :src="scope.row.wxImg"
                  alt=""
                />
              </el-popover>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="jifen" label="余额" width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.jifen | numFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="orderJifen" label="积分">
          <template slot-scope="scope">
            <span>{{ scope.row.orderJifen | numFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="备注" width="150">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
            <div>
              <el-input
                type="text"
                @keydown.enter.native="remark(scope.row)"
                v-model="scope.row.name"
                clearable
                placeholder="备注"
                style="width: 120px; font-size: 14px"
              >
                <i
                  slot="suffix"
                  class="el-input__icon el-icon-search"
                  @click="remark(scope.row)"
                ></i>
              </el-input>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="pub_share_pre_fee_user_s" label="来源">
          <template slot-scope="scope">
            <span v-if="scope.row.platform == 'weixin'">公众号</span>
            <span v-if="scope.row.platform == 'wap'">网站</span>
            <span v-if="scope.row.platform == 'app'">APP</span>
            <span v-if="scope.row.platform == 'mp'">小程序</span>
            <span v-if="scope.row.platform == ''"></span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" prop="state " label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.state"
              @change="change(scope.row.state, scope.row.id)"
              :active-value="openValue"
              :inactive-value="closeValue"
              active-color="#13ce66"
              inactive-color="#ff4949"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="120">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="updates(scope.row)"
              >用户详情
            </el-button>
            <el-button
              v-if="scope.row.relationId !== null && scope.row.pdd !== null"
              size="mini"
              type="primary"
              @click="price(scope.row)"
              >多多比价
            </el-button>
            <el-button
              size="mini"
              type="danger"
              :disabled="!isAuth('userList:delete')"
              @click="deleteuser(scope.row)"
            >
              删除用户
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align: center; margin-top: 10px">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[5, 10, 15, 20]"
          :page-size="size"
          :current-page="page"
          layout="total,sizes, prev, pager, next,jumper"
          :total="tableData.totalElements"
        >
        </el-pagination>
      </div>
    </el-tab-pane>
    <el-tab-pane label="团长用户" name="fourth">
      <div style="margin: 2% 0; display: inline-block">
        <span>渠道筛选：</span>
        <el-select
          v-model="platform"
          placeholder="请选择类型"
          style="width: 150px"
          @change="selectTrigger(platform)"
        >
          <el-option
            v-for="item in platforms"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option> </el-select
        >&nbsp;&nbsp;&nbsp;&nbsp;
        <el-input
          style="width: 150px"
          @keydown.enter.native="select"
          clearable
          placeholder="请输入手机号"
          v-model="phone"
        >
        </el-input
        >&nbsp;&nbsp;&nbsp;&nbsp;
        <el-input
          style="width: 150px"
          @keydown.enter.native="select"
          clearable
          placeholder="请输入昵称"
          v-model="nickName"
        >
        </el-input>
      </div>
      <div style="display: inline-block">
        <el-button
          style="margin-left: 15px"
          size="mini"
          type="primary"
          icon="document"
          @click="select"
          >查询</el-button
        >
        <el-button
          style="margin-left: 15px"
          size="mini"
          type="primary"
          icon="document"
          @click="cleans5"
          >重置</el-button
        >
        <el-button
          style="margin-left: 15px"
          size="mini"
          type="success"
          icon="document"
          @click="derive4"
          >导出Excel
        </el-button>
      </div>
      <el-table v-loading="tableDataLoading" :data="tableData.content">
        <el-table-column fixed prop="nickName" label="昵称" width="120">
          <template slot-scope="scope">
            <span style="color: #f56c6c">{{
              scope.row.nickName ? scope.row.nickName : "未设置"
            }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="手机号" width="120">
          <template slot-scope="scope">
            <span
              style="color: #4f9dec; cursor: pointer"
              @click="updates(scope.row)"
              >{{ scope.row.phone ? scope.row.phone : "未绑定" }}</span
            >
          </template>
        </el-table-column>
        <el-table-column prop="createAt" label="创建时间" width="180">
        </el-table-column>
        <el-table-column prop="gender" label="性别" width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.gender == 1">男</span>
            <span v-if="scope.row.gender == 2">女</span>
            <span v-if="!scope.row.gender">未知</span>
          </template>
        </el-table-column>
        <el-table-column prop="relationId" label="会员编号" width="100">
          <template slot-scope="scope">
            <span>{{
              scope.row.isInvitation === 0
                ? "未授权"
                : scope.row.relationId
                ? scope.row.relationId
                : "未绑定"
            }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="invitation" label="邀请人" width="150">
          <template slot-scope="scope">
            <span
              style="color: #4f9dec; cursor: pointer"
              @click="colonelClick(scope.row.invitation)"
              >{{
                scope.row.invitation ? scope.row.invitation : "未设置"
              }}</span
            >
          </template>
        </el-table-column>
        <el-table-column prop="invitationCode" label="邀请码" width="150">
        </el-table-column>
        <el-table-column prop="grade" label="等级" width="150">
          <template slot-scope="scope">
            <span>{{ scope.row.grade * 100 }}%</span>
            <div>
              <el-input
                type="text"
                @keydown.enter.native="addition(scope.row)"
                v-model="scope.row.grade"
                clearable
                placeholder="例0.3"
                style="width: 120px; font-size: 14px"
              >
                <i
                  slot="suffix"
                  class="el-input__icon el-icon-search"
                  @click="addition(scope.row)"
                ></i>
              </el-input>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="zhifubao" label="支付宝">
          <template slot-scope="scope">
            <span
              >{{ scope.row.zhifubaoName
              }}{{ scope.row.zhifubao ? scope.row.zhifubao : "未绑定" }}</span
            >
          </template>
        </el-table-column>
        <el-table-column prop="cardFront" label="收款二维码" width="150">
          <template slot-scope="scope">
            <div v-if="scope.row.wxImg == null || scope.row.wxImg == ''">
              暂无图片
            </div>
            <div v-if="scope.row.wxImg" style="display: flex; flex-wrap: wrap">
              <el-popover placement="top-start" title="" trigger="hover">
                <img
                  style="width: 50px; height: 50px"
                  :src="scope.row.wxImg"
                  alt=""
                  slot="reference"
                />
                <img
                  style="width: 200px; height: 200px"
                  :src="scope.row.wxImg"
                  alt=""
                />
              </el-popover>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="jifen" label="余额" width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.jifen | numFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="orderJifen" label="积分">
          <template slot-scope="scope">
            <span>{{ scope.row.orderJifen | numFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="备注" width="150">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
            <div>
              <el-input
                type="text"
                @keydown.enter.native="remark(scope.row)"
                v-model="scope.row.name"
                clearable
                placeholder="备注"
                style="width: 120px; font-size: 14px"
              >
                <i
                  slot="suffix"
                  class="el-input__icon el-icon-search"
                  @click="remark(scope.row)"
                ></i>
              </el-input>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="pub_share_pre_fee_user_s" label="来源">
          <template slot-scope="scope">
            <span v-if="scope.row.platform == 'weixin'">公众号</span>
            <span v-if="scope.row.platform == 'wap'">网站</span>
            <span v-if="scope.row.platform == 'app'">APP</span>
            <span v-if="scope.row.platform == 'mp'">小程序</span>
            <span v-if="scope.row.platform == ''"></span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" prop="state " label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.state"
              @change="change(scope.row.state, scope.row.id)"
              :active-value="openValue"
              :inactive-value="closeValue"
              active-color="#13ce66"
              inactive-color="#ff4949"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="120">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="updates(scope.row)"
              >用户详情
            </el-button>
            <el-button size="mini" type="primary" @click="hyorder(scope.row)"
              >会员订单
            </el-button>
            <el-button size="mini" type="primary" @click="record(scope.row)"
              >提现记录
            </el-button>
            <el-button size="mini" type="primary" @click="colonel(scope.row)"
              >团长订单
            </el-button>
            <el-button
              v-if="scope.row.relationId !== null && scope.row.pdd !== null"
              size="mini"
              type="primary"
              @click="price(scope.row)"
              >多多比价
            </el-button>
            <el-button
              size="mini"
              type="danger"
              :disabled="!isAuth('userList:delete')"
              @click="deleteuser(scope.row)"
            >
              删除用户
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align: center; margin-top: 10px">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[5, 10, 15, 20]"
          :page-size="size"
          :current-page="page"
          layout="total,sizes, prev, pager, next,jumper"
          :total="tableData.totalElements"
        >
        </el-pagination>
      </div>
    </el-tab-pane>
    <el-tab-pane label="订单用户" name="fifth">
      <div style="margin: 2% 0; display: inline-block">
        <span>渠道筛选：</span>
        <el-select
          v-model="platform"
          placeholder="请选择类型"
          style="width: 150px"
          @change="selectTrigger(platform)"
        >
          <el-option
            v-for="item in platforms"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option> </el-select
        >&nbsp;&nbsp;&nbsp;&nbsp;
        <el-input
          style="width: 150px"
          @keydown.enter.native="select"
          clearable
          placeholder="请输入手机号"
          v-model="phone"
        >
        </el-input
        >&nbsp;&nbsp;&nbsp;&nbsp;
        <el-input
          style="width: 150px"
          @keydown.enter.native="select"
          clearable
          placeholder="请输入昵称"
          v-model="nickName"
        >
        </el-input>
        <el-input
          style="width: 150px"
          @keydown.enter.native="select"
          clearable
          placeholder="会员编号筛选"
          v-model="relationId"
        ></el-input>
      </div>
      <div style="display: inline-block">
        <el-button
          style="margin-left: 15px"
          size="mini"
          type="primary"
          icon="document"
          @click="select2"
          >查询</el-button
        >
        <el-button
          style="margin-left: 15px"
          size="mini"
          type="primary"
          icon="document"
          @click="cleans2"
          >重置</el-button
        >
        <el-button
          style="margin-left: 15px"
          size="mini"
          type="success"
          icon="document"
          @click="derive"
          >导出Excel
        </el-button>
      </div>
      <el-table v-loading="tableDataLoading" :data="userData.content">
        <el-table-column fixed prop="nick_name" label="昵称" width="120">
          <template slot-scope="scope">
            <span style="color: #f56c6c">{{
              scope.row.nick_name ? scope.row.nick_name : "未设置"
            }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="手机号" width="120">
          <template slot-scope="scope">
            <span
              style="color: #4f9dec; cursor: pointer"
              @click="updates(scope.row)"
              >{{ scope.row.phone ? scope.row.phone : "未绑定" }}</span
            >
          </template>
        </el-table-column>
        <el-table-column prop="create_at" label="创建时间" width="180">
        </el-table-column>
        <el-table-column prop="num" label="下单数量"> </el-table-column>
        <el-table-column prop="gender" label="性别" width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.gender == 1">男</span>
            <span v-if="scope.row.gender == 2">女</span>
            <span v-if="!scope.row.gender">未知</span>
          </template>
        </el-table-column>
        <el-table-column prop="relationId" label="会员编号" width="100">
          <template slot-scope="scope">
            <span
              style="color: #4f9dec; cursor: pointer"
              @click="updates(scope.row)"
              >{{
                scope.row.isInvitation === 0
                  ? "未授权"
                  : scope.row.relation_id
                  ? scope.row.relation_id
                  : "未绑定"
              }}</span
            >
          </template>
        </el-table-column>
        <el-table-column prop="invitation" label="邀请人" width="150">
          <template slot-scope="scope">
            <span
              style="color: #4f9dec; cursor: pointer"
              @click="colonelClick(scope.row.invitation)"
              >{{
                scope.row.invitation ? scope.row.invitation : "未设置"
              }}</span
            >
          </template>
        </el-table-column>
        <el-table-column prop="invitation_code" label="邀请码" width="150">
        </el-table-column>
        <el-table-column prop="grade" label="等级" width="150">
          <template slot-scope="scope">
            <span>{{ scope.row.grade * 100 }}%</span>
            <div>
              <el-input
                type="text"
                @keydown.enter.native="addition(scope.row)"
                v-model="scope.row.grade"
                clearable
                placeholder="例0.3"
                style="width: 120px; font-size: 14px"
              >
                <i
                  slot="suffix"
                  class="el-input__icon el-icon-search"
                  @click="addition(scope.row)"
                ></i>
              </el-input>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="zhifubao" label="支付宝">
          <template slot-scope="scope">
            <span
              >{{ scope.row.zhifubaoName
              }}{{ scope.row.zhifubao ? scope.row.zhifubao : "未绑定" }}</span
            >
          </template>
        </el-table-column>
        <el-table-column prop="cardFront" label="收款二维码" width="150">
          <template slot-scope="scope">
            <div v-if="scope.row.wxImg == null || scope.row.wxImg == ''">
              暂无图片
            </div>
            <div v-if="scope.row.wxImg" style="display: flex; flex-wrap: wrap">
              <el-popover placement="top-start" title="" trigger="hover">
                <img
                  style="width: 50px; height: 50px"
                  :src="scope.row.wxImg"
                  alt=""
                  slot="reference"
                />
                <img
                  style="width: 200px; height: 200px"
                  :src="scope.row.wxImg"
                  alt=""
                />
              </el-popover>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="jifen" label="余额" width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.jifen | numFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="order_jifen" label="积分">
          <template slot-scope="scope">
            <span>{{ scope.row.order_jifen | numFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="备注" width="150">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
            <div>
              <el-input
                type="text"
                @keydown.enter.native="remark(scope.row)"
                v-model="scope.row.name"
                clearable
                placeholder="备注"
                style="width: 120px; font-size: 14px"
              >
                <i
                  slot="suffix"
                  class="el-input__icon el-icon-search"
                  @click="remark(scope.row)"
                ></i>
              </el-input>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="pub_share_pre_fee_user_s" label="来源">
          <template slot-scope="scope">
            <span v-if="scope.row.platform == 'weixin'">公众号</span>
            <span v-if="scope.row.platform == 'wap'">网站</span>
            <span v-if="scope.row.platform == 'app'">APP</span>
            <span v-if="scope.row.platform == 'mp'">小程序</span>
            <span v-if="scope.row.platform == ''"></span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" prop="state " label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.state"
              @change="change(scope.row.state, scope.row.id)"
              :active-value="openValue"
              :inactive-value="closeValue"
              active-color="#13ce66"
              inactive-color="#ff4949"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="120">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="updates(scope.row)"
              >用户详情
            </el-button>
            <el-button
              v-if="scope.row.relationId !== null && scope.row.pdd !== null"
              size="mini"
              type="primary"
              @click="price(scope.row)"
              >多多比价
            </el-button>
            <el-button
              size="mini"
              type="danger"
              :disabled="!isAuth('userList:delete')"
              @click="deleteuser(scope.row)"
            >
              删除用户
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align: center; margin-top: 10px">
        <el-pagination
          @size-change="handleSizeChange1"
          @current-change="handleCurrentChange1"
          :page-sizes="[5, 10, 15, 20]"
          :page-size="size"
          :current-page="page"
          layout="total,sizes, prev, pager, next,jumper"
          :total="userData.totalElements"
        >
        </el-pagination>
      </div>
    </el-tab-pane>
    <el-tab-pane label="零钱用户" name="loose">
      <div style="margin: 2% 0; display: inline-block">
        <span>手机号：</span>
        <el-input
          style="width: 150px"
          @keydown.enter.native="select"
          clearable
          placeholder="请输入手机号"
          v-model="phone"
        >
        </el-input
        >&nbsp;&nbsp;&nbsp;&nbsp;
      </div>
      <div style="display: inline-block">
        <el-button
          style="margin-left: 15px"
          size="mini"
          type="primary"
          icon="document"
          @click="select3"
          >查询</el-button
        >
        <el-button
          style="margin-left: 15px"
          size="mini"
          type="primary"
          icon="document"
          @click="cleans3"
          >重置</el-button
        >
      </div>
      <el-table v-loading="tableDataLoading" :data="looseData.content">
        <el-table-column fixed prop="nickName" label="昵称" width="120">
          <template slot-scope="scope">
            <span style="color: #f56c6c">{{
              scope.row.nickName ? scope.row.nickName : "未设置"
            }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="手机号" width="120">
          <template slot-scope="scope">
            <span
              style="color: #4f9dec; cursor: pointer"
              @click="updates(scope.row)"
              >{{ scope.row.phone ? scope.row.phone : "未绑定" }}</span
            >
          </template>
        </el-table-column>
        <el-table-column prop="createAt" label="创建时间" width="180">
        </el-table-column>
        <el-table-column prop="jifen" label="余额" width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.jifen | numFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="relationId" label="会员编号" width="100">
          <template slot-scope="scope">
            <span>{{
              scope.row.isInvitation === 0
                ? "未授权"
                : scope.row.relationId
                ? scope.row.relationId
                : "未绑定"
            }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="invitation" label="邀请人" width="150">
          <template slot-scope="scope">
            <span
              style="color: #4f9dec; cursor: pointer"
              @click="colonelClick(scope.row.invitation)"
              >{{
                scope.row.invitation ? scope.row.invitation : "未设置"
              }}</span
            >
          </template>
        </el-table-column>
        <el-table-column prop="invitationCode" label="邀请码" width="150">
        </el-table-column>
        <el-table-column prop="grade" label="等级" width="150">
          <template slot-scope="scope">
            <span>{{ scope.row.grade * 100 }}%</span>
            <div>
              <el-input
                type="text"
                @keydown.enter.native="addition(scope.row)"
                v-model="scope.row.grade"
                clearable
                placeholder="例0.3"
                style="width: 120px; font-size: 14px"
              >
                <i
                  slot="suffix"
                  class="el-input__icon el-icon-search"
                  @click="addition(scope.row)"
                ></i>
              </el-input>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="zhifubao" label="支付宝">
          <template slot-scope="scope">
            <span
              >{{ scope.row.zhifubaoName
              }}{{ scope.row.zhifubao ? scope.row.zhifubao : "未绑定" }}</span
            >
          </template>
        </el-table-column>
        <el-table-column prop="cardFront" label="收款二维码" width="150">
          <template slot-scope="scope">
            <div v-if="scope.row.wxImg == null || scope.row.wxImg == ''">
              暂无图片
            </div>
            <div v-if="scope.row.wxImg" style="display: flex; flex-wrap: wrap">
              <el-popover placement="top-start" title="" trigger="hover">
                <img
                  style="width: 50px; height: 50px"
                  :src="scope.row.wxImg"
                  alt=""
                  slot="reference"
                />
                <img
                  style="width: 200px; height: 200px"
                  :src="scope.row.wxImg"
                  alt=""
                />
              </el-popover>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="gender" label="性别" width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.gender == 1">男</span>
            <span v-if="scope.row.gender == 2">女</span>
            <span v-if="!scope.row.gender">未知</span>
          </template>
        </el-table-column>
        <el-table-column prop="orderJifen" label="积分">
          <template slot-scope="scope">
            <span>{{ scope.row.orderJifen | numFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="备注" width="150">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
            <div>
              <el-input
                type="text"
                @keydown.enter.native="remark(scope.row)"
                v-model="scope.row.name"
                clearable
                placeholder="备注"
                style="width: 120px; font-size: 14px"
              >
                <i
                  slot="suffix"
                  class="el-input__icon el-icon-search"
                  @click="remark(scope.row)"
                ></i>
              </el-input>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="pub_share_pre_fee_user_s" label="来源">
          <template slot-scope="scope">
            <span v-if="scope.row.platform == 'weixin'">公众号</span>
            <span v-if="scope.row.platform == 'wap'">网站</span>
            <span v-if="scope.row.platform == 'app'">APP</span>
            <span v-if="scope.row.platform == 'mp'">小程序</span>
            <span v-if="scope.row.platform == ''"></span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" prop="state " label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.state"
              @change="change(scope.row.state, scope.row.id)"
              :active-value="openValue"
              :inactive-value="closeValue"
              active-color="#13ce66"
              inactive-color="#ff4949"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="120">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="updates(scope.row)"
              >用户详情
            </el-button>
            <el-button size="mini" type="primary" @click="record(scope.row)"
              >提现记录
            </el-button>
            <el-button
              v-if="scope.row.relationId !== null && scope.row.pdd !== null"
              size="mini"
              type="primary"
              @click="price(scope.row)"
              >多多比价
            </el-button>
            <el-button
              size="mini"
              type="danger"
              :disabled="!isAuth('userList:delete')"
              @click="deleteuser(scope.row)"
            >
              删除用户
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align: center; margin-top: 10px">
        <el-pagination
          @size-change="handleSizeChange2"
          @current-change="handleCurrentChange2"
          :page-sizes="[5, 10, 15, 20]"
          :page-size="size"
          :current-page="page"
          layout="total,sizes, prev, pager, next,jumper"
          :total="looseData.totalElements"
        >
        </el-pagination>
      </div>
    </el-tab-pane>
    <el-tab-pane label="积分用户" name="integral">
      <div style="margin: 2% 0; display: inline-block">
        <span>手机号：</span>
        <el-input
          style="width: 150px"
          @keydown.enter.native="select"
          clearable
          placeholder="请输入手机号"
          v-model="phone"
        >
        </el-input
        >&nbsp;&nbsp;&nbsp;&nbsp;
      </div>
      <div style="display: inline-block">
        <el-button
          style="margin-left: 15px"
          size="mini"
          type="primary"
          icon="document"
          @click="select3"
          >查询</el-button
        >
        <el-button
          style="margin-left: 15px"
          size="mini"
          type="primary"
          icon="document"
          @click="cleans3"
          >重置</el-button
        >
      </div>
      <el-table v-loading="tableDataLoading" :data="looseData.content">
        <el-table-column fixed prop="nickName" label="昵称" width="120">
          <template slot-scope="scope">
            <span style="color: #f56c6c">{{
              scope.row.nickName ? scope.row.nickName : "未设置"
            }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="手机号" width="120">
          <template slot-scope="scope">
            <span
              style="color: #4f9dec; cursor: pointer"
              @click="updates(scope.row)"
              >{{ scope.row.phone ? scope.row.phone : "未绑定" }}</span
            >
          </template>
        </el-table-column>
        <el-table-column prop="createAt" label="创建时间" width="180">
        </el-table-column>
        <el-table-column prop="orderJifen" label="积分">
          <template slot-scope="scope">
            <span>{{ scope.row.orderJifen | numFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="relationId" label="会员编号" width="100">
          <template slot-scope="scope">
            <span>{{
              scope.row.isInvitation === 0
                ? "未授权"
                : scope.row.relationId
                ? scope.row.relationId
                : "未绑定"
            }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="invitation" label="邀请人" width="150">
          <template slot-scope="scope">
            <span
              style="color: #4f9dec; cursor: pointer"
              @click="colonelClick(scope.row.invitation)"
              >{{
                scope.row.invitation ? scope.row.invitation : "未设置"
              }}</span
            >
          </template>
        </el-table-column>
        <el-table-column prop="invitationCode" label="邀请码" width="150">
        </el-table-column>
        <el-table-column prop="grade" label="等级" width="150">
          <template slot-scope="scope">
            <span>{{ scope.row.grade * 100 }}%</span>
            <div>
              <el-input
                type="text"
                @keydown.enter.native="addition(scope.row)"
                v-model="scope.row.grade"
                clearable
                placeholder="例0.3"
                style="width: 120px; font-size: 14px"
              >
                <i
                  slot="suffix"
                  class="el-input__icon el-icon-search"
                  @click="addition(scope.row)"
                ></i>
              </el-input>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="zhifubao" label="支付宝">
          <template slot-scope="scope">
            <span
              >{{ scope.row.zhifubaoName
              }}{{ scope.row.zhifubao ? scope.row.zhifubao : "未绑定" }}</span
            >
          </template>
        </el-table-column>
        <el-table-column prop="cardFront" label="收款二维码" width="150">
          <template slot-scope="scope">
            <div v-if="scope.row.wxImg == null || scope.row.wxImg == ''">
              暂无图片
            </div>
            <div v-if="scope.row.wxImg" style="display: flex; flex-wrap: wrap">
              <el-popover placement="top-start" title="" trigger="hover">
                <img
                  style="width: 50px; height: 50px"
                  :src="scope.row.wxImg"
                  alt=""
                  slot="reference"
                />
                <img
                  style="width: 200px; height: 200px"
                  :src="scope.row.wxImg"
                  alt=""
                />
              </el-popover>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="jifen" label="余额" width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.jifen | numFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="gender" label="性别" width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.gender == 1">男</span>
            <span v-if="scope.row.gender == 2">女</span>
            <span v-if="!scope.row.gender">未知</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="备注" width="150">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
            <div>
              <el-input
                type="text"
                @keydown.enter.native="remark(scope.row)"
                v-model="scope.row.name"
                clearable
                placeholder="备注"
                style="width: 120px; font-size: 14px"
              >
                <i
                  slot="suffix"
                  class="el-input__icon el-icon-search"
                  @click="remark(scope.row)"
                ></i>
              </el-input>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="pub_share_pre_fee_user_s" label="来源">
          <template slot-scope="scope">
            <span v-if="scope.row.platform == 'weixin'">公众号</span>
            <span v-if="scope.row.platform == 'wap'">网站</span>
            <span v-if="scope.row.platform == 'app'">APP</span>
            <span v-if="scope.row.platform == 'mp'">小程序</span>
            <span v-if="scope.row.platform == ''"></span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" prop="state " label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.state"
              @change="change(scope.row.state, scope.row.id)"
              :active-value="openValue"
              :inactive-value="closeValue"
              active-color="#13ce66"
              inactive-color="#ff4949"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="120">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="updates(scope.row)"
              >用户详情
            </el-button>
            <el-button size="mini" type="primary" @click="record(scope.row)"
              >提现记录
            </el-button>
            <el-button
              v-if="scope.row.relationId !== null && scope.row.pdd !== null"
              size="mini"
              type="primary"
              @click="price(scope.row)"
              >多多比价
            </el-button>
            <el-button
              size="mini"
              type="danger"
              :disabled="!isAuth('userList:delete')"
              @click="deleteuser(scope.row)"
            >
              删除用户
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align: center; margin-top: 10px">
        <el-pagination
          @size-change="handleSizeChange2"
          @current-change="handleCurrentChange2"
          :page-sizes="[5, 10, 15, 20]"
          :page-size="size"
          :current-page="page"
          layout="total,sizes, prev, pager, next,jumper"
          :total="looseData.totalElements"
        >
        </el-pagination>
      </div>
    </el-tab-pane>
    <!-- 多多比价弹框 -->
    <el-dialog title="拼多多比价" :visible.sync="dialogFormVisible" center>
      <div style="margin-bottom: 10px">
        <p style="word-wrap: break-word">{{ mobileUrl }}</p>
        <p>复制链接发送到微信打开授权即可</p>
      </div>
    </el-dialog>
  </el-tabs>
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
      phone: '',
      relationId: '',
      nickNam: '',
      platform: 'all',
      isRelation: -1,
      isTuan: -1,
      mobileUrl: '',
      nickName: '',
      grade: '',
      name: '',
      value: '',
      type: '',
      userData: [],
      activeName: 'first',
      dialogFormVisible: false,
      tableDataLoading: true,
      tableData: [],
      looseData: [],
      platforms: [{
        value: 'all',
        label: '全部'
      }, {
        value: 'wap',
        label: '网站'
      }, {
        value: 'app',
        label: 'APP'
      }, {
        value: 'weixin',
        label: '微信公众号'
      }, {
        value: 'mp',
        label: '微信小程序'
      }],
      configList: [],
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
    // 导出Excel
    derive1 () {
      this.isRelation = -1
      this.isTuan = -1
      this.deriveSelect()
    },
    derive2 () {
      this.isRelation = 1
      this.isTuan = -1
      this.deriveSelect()
    },
    derive3 () {
      this.isRelation = 0
      this.isTuan = -1
      this.deriveSelect()
    },
    derive4 () {
      this.isRelation = -1
      this.isTuan = 1
      this.deriveSelect()
    },
    deriveSelect () {
      let phone = -1
      if (this.phone) {
        phone = this.phone
      }
      this.tableDataLoading = true
      this.$http({
        url: this.$http.adornUrl2('/user/userListExcel'),
        method: 'get',
        responseType: 'blob',
        params: this.$http.adornParams({
          'phone': phone,
          'platform': this.platform,
          'isRelation': this.isRelation,
          'isTuan': this.isTuan,
          'nickName': this.nickName,
        })
      }).then(({
        data
      }) => {
        this.tableDataLoading = false
        let blob = new Blob([data], {
          type: 'application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        })
        if (window.navigator.msSaveOrOpenBlob) {
          navigator.msSaveBlob(blob)
        } else {
          let url = window.URL.createObjectURL(blob)
          let elink = document.createElement('a')
          elink.download = '用户信息报表.xlsx'
          elink.style.display = 'none'
          elink.href = url
          document.body.appendChild(elink)
          elink.click()
          document.body.removeChild(elink)
        }
      })
    },
    derive () {
      let phone = -1
      if (this.phone) {
        phone = this.phone
      }
      let nickName = -1
      if (this.nickName) {
        nickName = this.nickName
      }
      let relationId = -1
      if (this.relationId) {
        relationId = this.relationId
      }
      this.tableDataLoading = true
      this.$http({
        url: this.$http.adornUrl2(
          `/order/userOrderListExcel?phone=${phone}&nickName=${nickName}&relationId=${relationId}`),
        method: 'get',
        responseType: 'blob',
        params: this.$http.adornParams({})
      }).then(({
        data
      }) => {
        this.tableDataLoading = false
        let blob = new Blob([data], {
          type: 'application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        })
        if (window.navigator.msSaveOrOpenBlob) {
          navigator.msSaveBlob(blob)
        } else {
          let url = window.URL.createObjectURL(blob)
          let elink = document.createElement('a')
          elink.download = '订单用户报表.xlsx'
          elink.style.display = 'none'
          elink.href = url
          document.body.appendChild(elink)
          elink.click()
          document.body.removeChild(elink)
        }
      })
    },
    // 多多比价
    price (row) {
      this.$http({
        url: this.$http.adornUrl2(`/pdd/bijia?userId=${row.id}`),
        method: 'get',
        params: this.$http.adornParams({})
      }).then(({
        data
      }) => {
        if (data.status == 0) {
          this.dialogFormVisible = true
          this.mobileUrl = data.data[0].mobileUrl
        }
        if (data.status == 9999) {
          this.$message({
            message: data.msg,
            type: 'error',
            duration: 3600,
            onClose: () => {
              this.dataSelect()
            }
          })
        }
        if (data.status == 500) {
          this.$message({
            message: data.msg,
            type: 'error',
            duration: 3600,
            onClose: () => {
              this.dataSelect()
            }
          })
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
      }).then(({
        data
      }) => {
        let returnData = data.data
        let id = returnData.id
        if (this.value == 1) {
          this.$router.push({
            path: '/userDetail',
            query: {
              userId: id
            }
          })
        } else {
          this.$router.push({
            path: '/userDetailThree',
            query: {
              userId: id
            }
          })
        }
      })
    },
    // 修改等级
    addition (row) {
      let userId = row.id
      let grade = row.grade
      this.$confirm(`确定要修改等级吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl2('/user/updateGrades'),
          method: 'get',
          params: this.$http.adornParams({
            'userId': userId,
            'grade': grade
          })
        }).then(({
          data
        }) => {
          this.$message({
            message: '修改成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.dataSelect()
            }
          })
        })
      }).catch(() => { })
    },
    // 修改备注
    remark (row) {
      let userId = row.id
      let name = row.name
      this.$confirm(`确定要修改备注吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl2('/user/updateName'),
          method: 'get',
          params: this.$http.adornParams({
            'userId': userId,
            'name': name
          })
        }).then(({
          data
        }) => {
          this.$message({
            message: '修改成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.dataSelect()
            }
          })
        })
      }).catch(() => { })
    },
    // 状态
    change (val, id) {
      this.$http({
        url: this.$http.adornUrl2(`/user/updateState/${id}`),
        method: 'post',
        data: this.$http.adornData({})
      }).then(({
        data
      }) => {
        this.$message({
          message: '操作成功',
          type: 'success',
          duration: 1500,
          onClose: () => {
            this.dataSelect()
          }
        })
      })
    },
    // 会员订单跳转
    hyorder (row) {
      this.$router.push({
        path: '/order',
        query: {
          relationid: row.relationId
        }
      })
    },
    // 提现记录跳转
    record (row) {
      this.$router.push({
        path: '/financeList'
      })
    },
    // 团长订单跳转
    colonel (row) {
      this.$router.push({
        path: '/order',
        query: {
          invitation: row.invitation
        }
      })
    },
    // 详情跳转
    updates (row) {
      this.$http({
        url: this.$http.adornUrl2('/common/type/91'),
        method: 'get',
        params: this.$http.adornParams({})
      }).then(({
        data
      }) => {
        let returnData = data.data
        this.value = returnData.value
        if (this.value == 1) {
          this.$router.push({
            path: '/userDetail',
            query: {
              userId: row.id,
              activeName: this.activeName
            }
          })
        } else {
          this.$router.push({
            path: '/userDetailThree',
            query: {
              userId: row.id,
              activeName: this.activeName
            }
          })
        }
      })

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
      this.userSelect()
    },
    handleCurrentChange1 (val) {
      this.page = val
      this.userSelect()
    },
    handleSizeChange2 (val) {
      this.size = val
      this.looseSelect()
    },
    handleCurrentChange2 (val) {
      this.page = val
      this.looseSelect()
    },
    handleClick (tab, event) {
      if (tab._props.label == '全部用户') {
        this.page = 1
        this.size = 10
        this.isRelation = -1
        this.isTuan = -1
        this.dataSelect()
      }
      if (tab._props.label == '会员用户') {
        this.page = 1
        this.size = 10
        this.isRelation = 1
        this.isTuan = -1
        this.dataSelect()
      }
      if (tab._props.label == '普通用户') {
        this.page = 1
        this.size = 10
        this.isRelation = 0
        this.isTuan = -1
        this.dataSelect()
      }
      if (tab._props.label == '团长用户') {
        this.page = 1
        this.size = 10
        this.isRelation = -1
        this.isTuan = 1
        this.dataSelect()
      }
      if (tab._props.label == '订单用户') {
        this.page = 1
        this.size = 10
        this.activeName = tab._props.name
        this.userSelect()
      }
      if (tab._props.label == '零钱用户') {
        this.page = 1
        this.size = 10
        this.type = 2
        this.looseSelect()
      }
      if (tab._props.label == '积分用户') {
        this.page = 1
        this.size = 10
        this.type = 1
        this.activeName = tab._props.name
        this.looseSelect()
      }
    },
    // select自动选择
    selectTrigger () {
      this.page = 1
      this.dataSelect()
    },
    // 查询
    select () {
      this.page = 1
      this.dataSelect()
    },
    // 查询
    select2 () {
      this.page = 1
      this.userSelect()
    },
    // 查询
    select3 () {
      this.page = 1
      this.looseSelect()
    },
    // 重置
    cleans () {
      this.page = 1
      this.platform = 'all'
      this.phone = ''
      this.isTuan = -1
      this.isRelation = -1
      this.nickName = ''
      this.dataSelect()
    },
    // 重置
    cleans1 () {
      this.platform = 'all'
      this.phone = ''
      this.isTuan = -1
      this.isRelation = 1
      this.nickName = ''
      this.dataSelect()
    },
    // 重置
    cleans4 () {
      this.platform = 'all'
      this.phone = ''
      this.isTuan = -1
      this.isRelation = 0
      this.nickName = ''
      this.dataSelect()
    },
    // 重置
    cleans5 () {
      this.platform = 'all'
      this.phone = ''
      this.isTuan = 1
      this.isRelation = -1
      this.nickName = ''
      this.dataSelect()
    },
    cleans2 () {
      this.phone = ''
      this.relationId = ''
      this.nickName = ''
      this.userSelect()
    },
    cleans3 () {
      this.phone = ''
      this.looseSelect()
    },
    //删除用户
    deleteuser (row) {
      let delid = row.id
      this.$confirm(`确定删除此条信息?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl2(`/user/deleteByUserId/?userId=${delid}`),
          method: 'post',
          params: this.$http.adornData({})
        }).then(({
          data
        }) => {
          this.$message({
            message: '删除成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.name = ''
              this.dataSelect()
            }
          })
        })
      }).catch(() => { })
    },
    // 获取数据列表
    dataSelect () {
      let phone = -1
      if (this.phone) {
        phone = this.phone
      }
      this.tableDataLoading = true
      this.$http({
        url: this.$http.adornUrl2(`/user/userList/${this.page - 1}/${this.size}`),
        method: 'get',
        params: this.$http.adornParams({
          'phone': phone,
          'platform': this.platform,
          'isRelation': this.isRelation,
          'isTuan': this.isTuan,
          'nickName': this.nickName,
        })
      }).then(({
        data
      }) => {
        this.tableDataLoading = false
        let returnData = data.data
        this.tableData = returnData
      })
    },
    valueSelect () {
      this.$http({
        url: this.$http.adornUrl2('/common/type/91'),
        method: 'get',
        params: this.$http.adornParams({})
      }).then(({
        data
      }) => {
        let returnData = data.data
        this.value = returnData.value
      })
    },
    userSelect () {
      let phone = -1
      if (this.phone) {
        phone = this.phone
      }
      let nickName = -1
      if (this.nickName) {
        nickName = this.nickName
      }
      let relationId = -1
      if (this.relationId) {
        relationId = this.relationId
      }
      this.tableDataLoading = true
      this.$http({
        url: this.$http.adornUrl2(
          `/order/orderList?page=${this.page - 1}&size=${this.size}&phone=${phone}&nickName=${nickName}&relationId=${relationId}`
        ),
        method: 'get',
        params: this.$http.adornParams({})
      }).then(({
        data
      }) => {
        this.tableDataLoading = false
        let returnData = data.data
        this.userData = returnData
      })

    },
    // 零钱/积分用户
    looseSelect () {
      let page = this.page - 1
      this.tableDataLoading = true
      this.$http({
        url: this.$http.adornUrl2('/user/getUserList'),
        method: 'get',
        params: this.$http.adornParams({
          'page': page,
          'size': this.size,
          'type': this.type,
          'phone': this.phone
        })
      }).then(({
        data
      }) => {
        this.tableDataLoading = false
        let returnData = data.data
        this.looseData = returnData
      })
    },
    // 获取等级配置数据
    findConfigList () {
      this.$http({
        url: this.$http.adornUrl2('/rank/findConfigList'),
        method: 'get',
        params: this.$http.adornParams({})
      }).then(({
        data
      }) => {
        this.configList = data.data
      })
    },
  },
  mounted () {
    this.findConfigList()
    this.dataSelect()
    this.valueSelect()
  }
}
</script>

<style scoped>
.el-button + .el-button {
  margin-left: 0 !important;
  margin-top: 5px !important;
}
</style>
