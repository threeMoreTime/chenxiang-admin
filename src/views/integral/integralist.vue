<template>
  <div>
    <div style="margin:2% 0;display: inline-block;">
      <span>商品标题：</span>
      <el-input style="width: 150px;" @keydown.enter.native="select" clearable placeholder="请输入商品标题" v-model="title">
      </el-input>&nbsp;&nbsp;&nbsp;&nbsp;
      <span>商品状态：</span>
      <el-select v-model="status" placeholder="请选择商品状态" style="width:150px;" @change="select(status)">
        <el-option v-for="item in statusmain" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>&nbsp;&nbsp;&nbsp;&nbsp;
    </div>
    <div style="display: inline-block;">
      <el-button style='margin-left:15px;' size="mini" type="primary" icon="document" @click="select">查询</el-button>
      <el-button style='margin-left:15px;' size="mini" type="primary" icon="document" @click="cleans">重置</el-button>
      <el-button style='margin-left:15px;' :disabled="!isAuth('integralist:add')" size="mini" type="primary"
        icon="document" @click="addShop">发布商品</el-button>
      <el-button style='margin-left:15px;' size="mini" type="primary" icon="document" @click="refresh">刷新</el-button>
    </div>
    <el-table v-loading="tableDataLoading" :data="tableData.content">
      <el-table-column fixed prop="id" label="编号" width="80">
      </el-table-column>
      <el-table-column fixed prop="coverImg" label="商品图片">
        <template slot-scope="scope">
          <img :src="scope.row.coverImg" alt="" width="60" height="60">
        </template>
      </el-table-column>
      <el-table-column prop="title" label="商品标题" width="200">
      </el-table-column>
      <el-table-column prop="price" label="商品积分">
        <template slot-scope="scope">
          <span style="color: #f56c6c;">{{scope.row.price}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="memberPrice" label="会员商品积分">
        <template slot-scope="scope">
          <span style="color: #f56c6c;">{{scope.row.memberPrice}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="sales" label="商品销量">
      </el-table-column>
      <el-table-column prop="buyReason" label="商品参数" width="200">
      </el-table-column>
      <el-table-column label="是否需要发货" width="150">
        <template slot-scope="scope">
          <span v-if="scope.row.isExpress == 1">普通商品需要发货</span>
          <span v-if="scope.row.isExpress== 2">虚拟商品无需发货</span>
          <span v-if="scope.row.isExpress == 3">门店核销无需发货</span>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="商品状态">
        <template slot-scope="scope">
          <span style="color: #4f9dec;cursor: pointer;" v-if="scope.row.status === 1 ">上架</span>
          <span style="color: #4f9dec;cursor: pointer;" v-if="scope.row.status === 2 ">下架</span>
        </template>
      </el-table-column>
      <el-table-column prop="createAt" label="创建时间" width="160">
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" :disabled="!isAuth('integralist:update')"
            @click="shopUpdates(scope.$index, scope.row)">修改
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="text-align: center;margin-top: 10px;">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :page-sizes="[10, 20, 30, 50, 100]" :page-size="size" :current-page="page"
        layout="total,sizes, prev, pager, next" :total="tableData.totalElements">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        size: 10,
        page: 1,
        id: '',
        img: '',
        title: '',
        type: '',
        typeId: '',
        readonly: true,
        merchants: '',
        price: '',
        memberPrice: '',
        originalPrice: '',
        sales: '',
        status: 0,
        status2: '',
        descrition: '',
        totalnum: 0,
        imgUrl: '',
        linkUrl: '',
        value: [],
        classDatas: [],
        isJiFenGoods: 1,
        form1: {
          id: '',
          title: '',
          img: '',
          typeId: '',
          merchants: '',
          price: '',
          memberPrice: '',
          status: '',
          sales: '',
          descrition: '',
          originalPrice: '',
          createAt: ''
        },
        statusmain: [{
            value: 0,
            label: '全部'
          },
          {
            value: 1,
            label: '上架'
          },
          {
            value: 2,
            label: '下架'
          }
        ],
        statusmain2: [{
            value: 1,
            label: '上架'
          },
          {
            value: 2,
            label: '下架'
          }
        ],
        formLabelWidth: '200px',
        tableDataLoading: false,
        dialogFormVisible2: false,
        dialogFormVisible3: false,
        typeDatas: [],
        advertData: [],
        tableData: [],
      }
    },
    filters: {
      numFilter(value) {
        let realVal = ''
        if (!isNaN(value) && value !== '') {
          // 截取当前数据到小数点后三位
          let tempVal = parseFloat(value).toFixed(3)
          realVal = tempVal.substring(0, tempVal.length - 1)
        } else {
          realVal = '--'
        }
        return realVal
      }
    },
    methods: {
      // 刷新
      refresh() {
        this.shopSelect()
      },
      handleChange(value) {
        this.value.forEach(element => {
          this.typeId = element;
        });
      },

      handleAvatarSuccess(file) {
        this.img = file.data;
      },
      handleAvatarSuccess2(file) {
        this.form1.img = file.data;
      },
      handleSizeChange(val) {
        this.size = val;
        this.shopSelect()
      },
      handleCurrentChange(val) {
        this.page = val;
        this.shopSelect()
      },
      //搜索
      select() {
        this.page = 1
        this.size = 10
        this.shopSelect()
      },
      // 重置
      cleans() {
        this.page = 1
        this.size = 10
        this.title = ''
        this.status = 0
        this.typeId = ''
        this.value = []
        this.shopSelect()
      },
      //发布商品
      addShop() {
        this.$router.push({
          path: '/intepublich'
        })
      },
      // 修改商品
      shopUpdates(index, rows) {
        this.$router.push({
          path: '/inteAmend',
          query: {
            id: rows.id
          }
        });
      },
      // 商品评价跳转
      discuss(index, rows) {
        this.$router.push({
          path: '/discuss',
          query: {
            goodsId: rows.id
          }
        });
      },
      // 删除商品
      shopdeletes(row) {
        this.$confirm(`确定删除此条信息?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl2('/goods/delete'),
            method: 'get',
            params: this.$http.adornParams({
              'id': row.id
            })
          }).then(({
            data
          }) => {
            this.$message({
              message: '删除成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.shopSelect()
              }
            })
          })
        }).catch(() => {})
      },
      // 获取商品数据
      shopSelect() {
        let page = this.page - 1
        this.tableDataLoading = true
        this.$http({
          url: this.$http.adornUrl2('/goods/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': page,
            'size': this.size,
            'title': this.title,
            'type': this.typeId,
            'status': this.status,
            'isJiFenGoods': this.isJiFenGoods
          })
        }).then(({
          data
        }) => {
          this.tableDataLoading = false
          let returnData = data.data;
          this.tableData = returnData
        })
      },
      // 商品分类
      dataSelect() {
        this.tableDataLoading = true
        this.$http({
          url: this.$http.adornUrl2('/goodsType/result'),
          method: 'get',
          params: this.$http.adornParams({})
        }).then(({
          data
        }) => {
          this.tableDataLoading = false
          let returnData = data.data;
          this.classDatas = returnData
        })
      }
    },
    mounted() {
      this.shopSelect()
    }
  };
</script>

<style>

</style>
