<template>
  <div style="width: 100%;">
    <!-- <div style="display: inline-block;font-size:18px;margin-bottom: 15px;">
			<a href="#" @click="prev" style="text-decoration:none;font-size: 14px;">
				<icon-svg name="jiantou" style="width: 1.2em;height: 1.2em;position: relative;top: 0.3em;"></icon-svg>
				返回
			</a>
			<span style="display: inline-block;margin: 0 15px;color: #D9D9D9;">|</span>
			<span>订单详情</span>
		</div> -->
    <el-row>
      <el-col :span="15">
        <el-row class="item_left">
          <el-col :span="24">
            <h3>订单信息:</h3>
            <el-row class="order_item">
              <el-col :span="16">
                <span>订单号:</span>
                <span>{{tableData.orderNum}}</span>
              </el-col>
              <el-col :span="8">
                <span>订单备注:</span>
                <span>{{tableData.descrition ? tableData.descrition : '暂无备注'}}</span>
              </el-col>
            </el-row>
            <el-row class="order_item">
              <el-col :span="16">
                <span>订单状态:</span>
                <span v-if="tableData.status == 1">待付款</span>
                <span v-if="tableData.status == 2">待发货</span>
                <span v-if="tableData.status == 3">已发货</span>
                <span v-if="tableData.status == 4">已收货</span>
                <span v-if="tableData.status == 5">已取消</span>
                <span v-if="tableData.status == 6">退款中</span>
                <span v-if="tableData.status == 7">已退款</span>
                <span v-if="tableData.status == 8">已驳回</span>
              </el-col>
              <el-col :span="8">
                <span>支付方式:</span>
                <span style="color: #4f9dec;" v-if="tableData.payWay === 1 ">app微信</span>
                <span style="color: #4f9dec;" v-if="tableData.payWay === 2 ">支付宝</span>
                <span style="color: #4f9dec;" v-if="tableData.payWay === 3 ">微信小程序</span>
                <span style="color: #4f9dec;" v-if="tableData.payWay === 4 ">app支付宝</span>
                <span style="color: #4f9dec;" v-if="tableData.payWay === 5 ">H5支付宝</span>
                <span style="color: #4f9dec;" v-if="tableData.payWay === 6 ">零钱</span>
                <span style="color: #4f9dec;" v-if="tableData.payWay === 7 ">积分</span>
                <span style="color: #4f9dec;" v-if="tableData.payWay === null ">未支付</span>
              </el-col>
            </el-row>
            <el-row class="order_item">
              <el-col :span="16">
                <span>创建时间:</span>
                <span>{{tableData.createAt}}</span>
              </el-col>
              <el-col :span="8">
                <span>付款时间:</span>
                <span>{{tableData.payTime}}</span>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-row class="item_left">
          <el-col :span="24">
            <h3>商品信息:</h3>
            <el-row class="order_item">
              <el-col :span="4">
                <span>商品图片</span>
              </el-col>
              <el-col :span="8">
                <span>商品标题</span>
              </el-col>
              <el-col :span="6">
                <span>商品价格</span>
              </el-col>
              <el-col :span="6">
                <span>支付金额</span>
              </el-col>
            </el-row>
            <el-row class="order_item border-top">
              <el-col :span="4">
                <img :src="tableData.img" alt="" width="40px" height="40px">
              </el-col>
              <el-col :span="8">
                <span style="line-height: 21px;margin-right:15px;">{{tableData.title}}</span>
                <div>规格：{{tableData.detailJson?tableData.detailJson:'-'}}</div>

              </el-col>
              <el-col :span="6">
                <span>￥{{tableData.price}} x {{tableData.number}}</span>
              </el-col>
              <el-col :span="6">
                <span>￥{{tableData.payMoney}}</span>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="8" style="float: right;">
        <el-row class="item_right">
          <el-col :span="24">
            <h3>发货信息:</h3>
            <el-row class="order_item">
              <el-col :span="14">
                <span>发货人:</span>
                <span>官方</span>
              </el-col>
              <el-col :span="10">
                <span>订单数量:</span>
                <span>{{tableData.number}}件</span>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-row class="item_right">
          <el-col :span="24">
            <h3>收货信息:</h3>
            <el-row class="order_item">
              <el-col :span="14">
                <span>收货人:</span>
                <span>{{tableData.consignee}}</span>
              </el-col>
              <el-col :span="10">
                <span>手机号:</span>
                <span>{{tableData.mobile}}</span>
              </el-col>
            </el-row>
            <el-row class="order_item">
              <el-col :span="24">
                <span>收货地址:</span>
                <span>{{tableData.provinces}}{{tableData.detail}}</span>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-row class="item_right" v-if="tableData.isExpress == 1">
          <el-col :span="24">
            <h3>物流信息:</h3>
            <el-row class="order_item" v-if="tableData.status == 3 || tableData.status == 4">
              <el-col :span="12">
                <span>物流公司:</span>
                <span>{{tableData.expressName}}</span>
              </el-col>
              <el-col :span="12">
                <span>运单号:</span>
                <span>{{tableData.expressNumber}}</span>
              </el-col>
            </el-row>
            <el-row class="order_item" v-if="tableData.status !== 3 && tableData.status !== 4">
              暂无信息
            </el-row>
          </el-col>
        </el-row>
        <el-row class="item_right" v-else>
          <el-col :span="24">
            <h3>虚拟商品信息:</h3>
            <el-row class="order_item">
              <el-col :span="12">
                <span>商品标题:</span>
                <span>{{virtualData.title}}</span>
              </el-col>
              <el-col :span="12">
                <span>兑换码:</span>
                <span>{{virtualData.content}}</span>

              </el-col>
            </el-row>
            <el-row class="order_item">
              <el-col :span="24" style="margin-top: 10px;">
                <span>兑换地址:</span>
                <span>{{virtualData.linkUrl}}</span>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        id: '',
        expressName: '',
        expressNumber: '',
        orderName: '',
        orderNumber: '',
        virtualId: '',
        dialogFormVisible: false,
        tableData: {},
        virtualData: {},
      }
    },

    methods: {
      // 返回上一级
      prev() {
        this.$router.back()
      },
      // 获取订单详情数据
      dataSelect() {
        let id = this.$route.query.id
        this.tableDataLoading = true
        this.$http({
          url: this.$http.adornUrl2('/orders/find'),
          method: 'get',
          params: this.$http.adornParams({
            'id': id
          })
        }).then(({
          data
        }) => {
          this.tableDataLoading = false
          let returnData = data.data;
          this.tableData = returnData
          this.virtualId = returnData.virtualId
          console.log(this.virtualId, returnData)
          if (this.virtualId) {
              this.$http({
              url: this.$http.adornUrl2('/selfGoodsVirtual/find'),
              method: 'get',
              params: this.$http.adornParams({
                'id': this.virtualId
              })
            }).then(({
              data
            }) => {
              this.tableDataLoading = false
              let returnData = data.data;
              this.virtualData = returnData
            })
          }
          
        })
      }
    },
    activated() {
      this.dataSelect()
    }
  };
</script>

<style scoped="scoped">
  .order_item {
    font-size: 14px;
    color: #666;
    padding: 20px 5px;
  }

  .border-top {
    border-top: 1px solid #ddd;
  }

  .item_left {
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 10px 15px;
    margin-bottom: 20px;
  }

  .item_right {
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 10px 15px;
    margin-bottom: 20px;
  }
</style>
