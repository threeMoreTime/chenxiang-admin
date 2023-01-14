<template>
  <div>
    <div style="margin: 2% 0; display: inline-block">
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
    <div style="margin: 2% 0; display: inline-block">
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
          clearable
        >
          <el-option 
            :key="0"
            label="待考核"
            value="0"
          >
          </el-option> 
          <el-option 
            :key="1"
            label="已考核"
            value="1"
          >
          </el-option> 
          <el-option 
            :key="2"
            label="废弃"
            value="-1"
          >
          </el-option> 
      </el-select>
      <el-select
          v-model="isAward"
          placeholder="请选择类型"
          style="width: 150px"
          clearable
        >
          <el-option 
            :key="0"
            label="待发放"
            value="0"
          >
          </el-option> 
          <el-option 
            :key="1"
            label="发放"
            value="1"
          >
          </el-option> 
          <el-option 
            :key="2"
            label="不发放"
            value="-1"
          >
          </el-option> 
      </el-select>
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
      </div>
    <el-table v-loading="tableDataLoading" :data="gradeUpdateLogData">
      <el-table-column fixed prop="id" label="编号" width="80">
      </el-table-column>
      <el-table-column prop="userId" label="用户Id" width="120">
      </el-table-column>
      <el-table-column prop="nickName" label="昵称" width="120">
      </el-table-column>
      <el-table-column prop="phone" label="手机号" width="120">
      </el-table-column>
      <el-table-column prop="startDate" label="考核开始时间" width="120">
        <template slot-scope="scope">
          {{ parseDate(scope.row.startDate) }}
        </template>
      </el-table-column>
      <el-table-column prop="endDate" label="考核结束时间" width="120">
        <template slot-scope="scope">
          {{ parseDate(scope.row.endDate) }}
        </template>
      </el-table-column>
      <el-table-column prop="newGrade" label="状态" width="120">
        <template slot-scope="scope">
          {{ scope.row.status|getStatusName }}
        </template>
      </el-table-column>
      <el-table-column prop="gradeName" label="考核信息" width="120">
       <template slot-scope="scope">
        <span>级别：{{scope.row.gradeName}}</span><br>
        <span>考核业绩：{{scope.row.checkMonthNum}}</span><br>
        <span>本月业绩：{{scope.row.currentMonthNum}}</span>
       </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注" width="120">
      </el-table-column> 
      <el-table-column prop="award" label="实发工资" width="200">
        <template slot-scope="scope">
          <el-input-number :disabled="scope.row.isAward!==0"  style="width: 120px;" v-model="scope.row.award"  label="最大金额"></el-input-number>
        </template>
        <div>
            
        </div>
      </el-table-column> 
      <el-table-column prop="isAward" label="是否发放工资" width="120">
        <template slot-scope="scope">
          {{scope.row.isAward|getIsAwardName}}
        </template>
      </el-table-column> 
      <el-table-column label="操作" width="300">
        <template slot-scope="scope">
          <el-button
            style="margin-left: 15px"
            size="mini"
            type="primary"
            icon="document"
            :disabled="scope.row.isAward!=0"
            @click="confirmCheckMonthAward(scope.row,true)"
            >发放
          </el-button>

          <el-button
            style="margin-left: 15px"
            size="mini"
            type="primary"
            icon="document"
            :disabled="scope.row.isAward!=0"
            @click="confirmCheckMonthAward(scope.row,false)"
            >取消
          </el-button>
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
  </div>
</template>
<script>
import { parseDate,parseDateTime } from '@/utils/date.js'
export default {
  name: 'GradeMonthAward',
  components: {

  },
  mixins: [],
  props: {
    refreshWaitProcessData: {
      type: Function,
      required: true
    },
  },
  data () {
    return {
      gradeUpdateLogData: [],
      gradeBonlusLogTypeData:{},
      tableDataLoading: false,
      page: 1,
      size: 10,
      total: 0,
      // 搜索条件 start
      nickName: null,
      phone: null,
      startDate:null,
      endDate:null,
      status:"1",
      isAward:"0",
      // 搜索条件 end 
      
    }
  },
  computed: {

  },
  filters: {
    getStatusName(status) {
      switch (status) {
        case -1:
          return '废除'
        case 0:
        return '待考核'
        case 1:
        return '通过'
        case 2:
        return '不通过'
        default:
          break;
      }
    },
    getIsAwardName(isAward) {
        switch (isAward) {
          case 0:
          return '待发放'
          case 1:
          return '发放'
          case 2:
          return '不发放'
          default:
            break;
      }
    }
  },
  mounted () {
    this.findCheckMonthAwardList()
    this.findGradeBounsLogType()
  },
  methods: {
    parseDate,parseDateTime,
    handleSizeChange(val) {
      this.size = val;
      this.findCheckMonthAwardList();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.findCheckMonthAwardList();
    },
    findByBonusLogType() {
      this.page = 1;
      this.findCheckMonthAwardList();
    },
    /* 查询升级记录 */
    findCheckMonthAwardList () {
      this.tableDataLoading = true
      this.$http({
        url: this.$http.adornUrl2("/grade/findCheckMonthAwardList"),
        method: "get",
        params: this.$http.adornParams({
          page: this.page - 1,
          size: this.size,
          phone:this.phone,
          nickName:this.nickName,
          startDate:this.startDate,
          endDate:this.endDate,
          status:this.status,
          isAward:this.isAward,
        }),
      }).then(({ data }) => {
        this.tableDataLoading = false
        let returnData = data.data
        this.gradeUpdateLogData = returnData.content
        this.total = returnData.totalElements
        this.refreshWaitProcessData()
      })
    },
    /* 查询分红给日志类型*/
    findGradeBounsLogType() {
      this.$http({
        url: this.$http.adornUrl2("/grade/findGradeBounsLogType"),
        method: "get",
        params: this.$http.adornParams({}),
      }).then(({ data }) => {
        this.gradeBonlusLogTypeData = data.data
      })
    },
    // 查询
    select () {
      this.page = 1
      this.findCheckMonthAwardList()
    },
   
    // 重置
    cleans () {
      this.page = 1
      this.nickName = ''
      this.phone = ''
      this.findCheckMonthAwardList()
    },
    // 确认发放工资
    confirmCheckMonthAward(row,isAward = false) {

      this.$confirm(`确认${isAward?'发放':'取消'}?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http({
        url: this.$http.adornUrl2(`/grade/confirmCheckMonthAward/${row.id}?isAward=${isAward}&award=${row.award}`),
        method: "get",
        params: this.$http.adornParams({}),
      }).then(({ data }) => {
        if (data.status == 0) {
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 1000,
            onClose: () => {
              this.findCheckMonthAwardList()
            }
          })
        } else {
          this.$message({
            message: data.msg||'操作失败',
            type: 'error',
            duration: 2500
          })
        }
      })
      });
      
    },
  }
};
</script>
<style lang='' scoped>
</style>