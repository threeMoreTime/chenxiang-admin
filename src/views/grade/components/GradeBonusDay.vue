<template>
  <div>
    <div style="display: inline-block">
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
      <span>状态：</span>
      <el-select
        v-model="status"
        placeholder="请选择类型"
        style="width: 150px"
        @change="refreshData(status)"
        clearable
      >
        <el-option
          :key="0"
          label="待确认"
          value="0"
        >
        </el-option>
        <el-option
          :key="1"
          label="已确认"
          value="1"
        >
        </el-option>
        <el-option
          :key="2"
          label="已取消"
          value="2"
        >
        </el-option>
      </el-select>
      <el-button
        style="margin-left: 15px"
        size="mini"
        type="primary"
        icon="document"
        @click="testBonus"
      >测试今日分红
      </el-button>
      <el-button
        style="margin-left: 15px"
        size="mini"
        type="primary"
        icon="document"
        @click="findGradeBounsDayList"
      >查询
      </el-button>
      <el-button
        style="margin-left: 15px"
        size="mini"
        type="primary"
        icon="document"
        @click="findYesterdayData"
      >昨天
      </el-button>
    </div>
    <el-table v-loading="tableDataLoading" :data="gradeBonusDayData">
      <el-table-column fixed prop="id" label="编号" width="80">
      </el-table-column>
      <el-table-column prop="type" label="分红类型">
        <template slot-scope="scope">
        {{grdeBonusDayTypeData[scope.row.type]}}
        </template>
      </el-table-column>
      <el-table-column fixed prop="gradeCode" label="等级编码" width="80">
      </el-table-column>
      <el-table-column fixed prop="gradeName" label="等级名称" width="80">
      </el-table-column>
      <el-table-column fixed prop="bonusDate" label="分红日期" width="100">
        <template slot-scope="scope">
          {{ parseDate(scope.row.bonusDate) }}
        </template>
      </el-table-column>
      <el-table-column prop="allBonusMoney" label="总金额" width="120">
      </el-table-column>
      <el-table-column prop="bonusMoney" label="人均分红金额" width="120">
      </el-table-column>
      <el-table-column prop="maxBonusDay" label="分红调整" width="200">
        <template slot-scope="scope">
          <div>
            <el-input-number :disabled="scope.row.status==1 || scope.row.bonusUserNum == 0" style="width: 150px;"
                             v-model="scope.row.maxBonusDay" @change="(value)=>changMaxBonusDay(value,scope.row)"
                             label="最大金额"></el-input-number>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="bonusUserNum" label="分红人数（所有人数）" width="120">
        <template slot-scope="scope">
          <el-button type="text" @click="findBonusDayUserInfo(scope.row.id)">
            {{ scope.row.bonusUserNum || 0 }}（{{ scope.row.userNum || 0 }}）
          </el-button>
        </template>
      </el-table-column>
      <el-table-column prop="orderCount" label="订单数" width="120">
      </el-table-column>
      <el-table-column prop="status" label="结算状态" width="120">
        <template slot-scope="scope">
          {{ scope.row.status | getStatusName }}
        </template>
      </el-table-column>
      <el-table-column prop="bonusDayPool" label="编辑" width="200">
        <template slot-scope="scope">
          <div style="display:flex;flex-direction:row">
            <el-button
              style="margin-left: 15px"
              size="mini"
              type="primary"
              icon="document"
              :disabled="scope.row.status==1"
              @click="confirmMaxBonusDay(scope.row)"
            >确认
            </el-button>
            <el-button
              style="margin-left: 15px"
              size="mini"
              type="primary"
              icon="document"
              :disabled="scope.row.status==1"
              @click="cancerBonusDay(scope.row)"
            >取消
            </el-button>
          </div>

        </template>
      </el-table-column>
    </el-table>
    <div style="text-align: center; margin-top: 10px">
      <el-pagination
        :page-sizes="[10, 20, 30, 40]"
        :page-size="size"
        :current-page="page"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total,sizes, prev, pager, next,jumper"
        :total="total"
      >
      </el-pagination>
    </div>
    <!-- 穿梭框 start -->
    <el-dialog
      title="分红人数调整"
      :visible.sync="dialogVisible"
      width="80%" height="80%">
      <el-transfer  
        style="text-align: left; display: inline-block;width:100%"
        v-model="value"
        :data="data"
        filterable
        :titles="['不分红名单', '分红名单']"
        :button-texts="['不加入分红', '加入分红']"
        :format="{
          noChecked: '${total}',
          hasChecked: '${checked}/${total}'
        }"
        @change="handleChange">
        <span slot-scope="{ option }">{{ option.key }} - {{ option.label }}</span>
        <el-button class="transfer-footer" slot="left-footer" size="small">操作</el-button>
        <el-button class="transfer-footer" slot="right-footer" size="small">操作</el-button>
      </el-transfer>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="()=>{this.dialogVisible = false;this.findGradeBounsDayList()}">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 穿梭框 end -->
  </div>
</template>
<script>
import {parseDate, getToday, getYesterday} from '@/utils/date.js'

export default {
  name: 'GradeBonusDay',
  components: {},
  mixins: [],
  props: {
    refreshWaitProcessData: {
      type: Function,
      required: true
    },
  },
  data () {
    return {
      gradeBonusDayData: [],
      grdeBonusDayTypeData:[],
      tableDataLoading: false,
      page: 1,
      size: 10,
      total: 0,
      startDate: null,
      endDate: null,
      status: '0',
      originData: [],
      selectBonusLogType:"",
      /* 穿梭框 显隐 */
      dialogVisible: false,
      data: [],
      value: [],
      /* 参与分红人员 */
      bonusUserList: [],
      /* 不参与分红人员 */
      noBonusUserList: [],
      bonusRowId:null,
    }
  },
  computed: {},
  watch: {},
  mounted () {
    this.findGradeBounsDayList()
    this.findGradeBounsDayType()
  },
  filters: {
    getStatusName (status) {
      switch (status) {
        case 0:
          return '待结算'
        case 1:
          return '已确认'
        case 2:
          return '已取消'
      }

    }
  },
  methods: {
    parseDate,
    refreshData () {
      this.page = 1
      this.findGradeBounsDayList()
    },
    findYesterdayData () {
      this.page = 1
      this.startDate = getYesterday()
      this.endDate = getYesterday()
      this.findGradeBounsDayList()
    },
    handleSizeChange (val) {
      this.size = val
      this.findGradeBounsDayList()
    },
    handleCurrentChange (val) {
      this.page = val
      this.findGradeBounsDayList()
    },
    /* 测试分红*/
    testBonus() {
      this.$http({
        url: this.$http.adornUrl2('/grade/test'),
        method: 'get',
        params: this.$http.adornParams({ }),
      }).then(({ }) => {
        this.refreshWaitProcessData()
      }) 
    },
    /* 查询分红记录 */
    findGradeBounsDayList () {
      this.tableDataLoading = true
      this.$http({
        url: this.$http.adornUrl2('/grade/findGradeBounsDayList'),
        method: 'get',
        params: this.$http.adornParams({
          page: this.page - 1,
          size: this.size,
          startDate: this.startDate,
          endDate: this.endDate,
          status: this.status,
          type:this.selectBonusLogType,
        }),
      }).then(({data}) => {
        this.tableDataLoading = false
        let returnData = data.data
        this.gradeBonusDayData = returnData.content
        this.originData = []
        for (let d of returnData.content) {
          let object = {}
          this.originData.push(Object.assign(object, d))
        }
        this.total = returnData.totalElements
        this.refreshWaitProcessData()
      })
    },
    // 修改日分红
    changMaxBonusDay (value, row) {
      const originRowData = this.originData.find((a) => {
        return a.id == row.id
      })
      if (value > originRowData.bonusMoney) {
        row.bonusDayPool = originRowData.bonusDayPool - ((value - originRowData.bonusMoney) * row.bonusUserNum)
      }
      if (value < originRowData.bonusMoney) {
        row.bonusDayPool = originRowData.bonusDayPool + (originRowData.bonusMoney - value) * row.bonusUserNum
      }
    },
    // 确认日分红
    confirmMaxBonusDay (row) {
      this.$confirm(`确认发放?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl2('/grade/checkGradeBonusDay'),
          method: 'post',
          data: row,
        }).then(({data}) => {
          if (data.status == 0) {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1000,
              onClose: () => {
                this.findGradeBounsDayList()
              }
            })
          } else {
            this.$message({
              message: data.msg || '操作失败',
              type: 'error',
              duration: 2500
            })
          }
        })
      })
    },
    // 取消日分红
    cancerBonusDay (row) {
      this.$confirm(`确认取消?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl2(`/grade/cancelGradeBonusDay/${row.id}`),
          method: 'post',
          data: row,
        }).then(({data}) => {
          if (data.status == 0) {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1000,
              onClose: () => {
                this.findGradeBounsDayList()
              }
            })
          } else {
            this.$message({
              message: data.msg || '操作失败',
              type: 'error',
              duration: 2500
            })
          }
        })
      })
    },

    /* 查询分红人员详情 */
    findBonusDayUserInfo (id) {
      this.$http({
        url: this.$http.adornUrl2(`/grade/findBonusDayUserInfo/${id}`),
        method: 'get',
        params: this.$http.adornParams({}),
      }).then(({data}) => {
        this.dialogVisible = true
        this.bonusRowId = id;
        this.bonusUserList = data.data.bonusUserList || []
        this.noBonusUserList = data.data.noBonusUserList || []
        this.generateData()
      })
    },
    /* 处理穿梭框数据 */
    generateData () {
      this.value = this.bonusUserList.map(a => a.id)
      let data = this.bonusUserList.concat(this.noBonusUserList)
      for (const item of data) {
        item.key = item.id
        item.label = `${item.nickName}(${item.phone})`
      }
      this.data = data
       
    },
    /* 添加，减少分红人员 */
    updateBonusDayUserInfo (id, isAdd, userIds) {
      console.log('updateBonusDayUserInfo', id)
      this.$http({
        url: this.$http.adornUrl2(`/grade/updateBonusDayUserInfo/${id}`),
        method: 'get',
        params: this.$http.adornParams({
          isAdd: isAdd,// 添加/减少
          userIds: String(userIds),// 添加/减少的用户
        }),
      }).then(({data}) => {
        this.findBonusDayUserInfo(id);
      })
    },
    /* 关闭穿梭框  */
    handleClose (done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {
        })
    },
    /* 穿梭框人员操作 */
    handleChange (value, direction, movedKeys) {
      console.log('value', value)
      console.log('direction', direction)
      console.log('movedKeys', movedKeys)
      const userIds = movedKeys.join(",");
      if (direction == 'left') {
        this.updateBonusDayUserInfo(this.bonusRowId, false, userIds)
      } else {
        this.updateBonusDayUserInfo(this.bonusRowId, true, userIds)
      }
     },
     /* 查询分红类型*/
     findGradeBounsDayType() {
      this.$http({
        url: this.$http.adornUrl2("/grade/findGradeBounsDayType"),
        method: "get",
        params: this.$http.adornParams({}),
      }).then(({ data }) => {
        this.grdeBonusDayTypeData = data.data
      })
    }

  }
}
</script>
<style>
.el-dialog {
  height:80%;
}
 
.el-transfer-panel {
  width:40%!important;
  height: 550px!important;
}
</style>