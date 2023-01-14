<template>
  <div>
    <div style="display: inline-block">
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
      <span>分红类型：</span>
        <el-select
          v-model="selectBonusLogType"
          placeholder="请选择类型"
          style="width: 150px"
          @change="findByBonusLogType(gradeLevel)"
        >
          <el-option label="全部" value=""></el-option>
          <el-option
            v-for="(value,key) in grdeBonusLogTypeData"
            :key="key"
            :label="value"
            :value="key"
          >
          </el-option> </el-select
        >&nbsp;&nbsp;&nbsp;&nbsp;
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
      </el-date-picker>
      <el-button
        style="margin-left: 15px"
        size="mini"
        type="primary"
        icon="document"
        @click="findGradeBounsLogList"
        >查询
      </el-button>
    </div>
    <el-table v-loading="tableDataLoading" :data="gradeBonusLogData">
      <el-table-column fixed prop="id" label="编号" width="80">
      </el-table-column>
      <el-table-column prop="type" label="分红类型">
        <template slot-scope="scope">
        {{grdeBonusLogTypeData[scope.row.type]}}
        </template>
      </el-table-column>
      <el-table-column label="伞下分红人员信息">
       <template slot-scope="scope">
        {{scope.row.nickName+'('+scope.row.phone+')'}}
       </template>
      </el-table-column>
      <el-table-column prop="allBonusMoney" label="总金额" width="120">
      </el-table-column>
      <el-table-column prop="bonusMoney" label="实际分红总金额" width="120">
      </el-table-column>
      <el-table-column prop="bonusUserNum" label="分红人数" width="120">
      </el-table-column>
      <el-table-column prop="bounsUserMoney" label="平均分红金额" width="120">
      </el-table-column>
      <el-table-column prop="bonusGradeCode" label="分红级别编码" width="120">
      </el-table-column>
      <el-table-column prop="bonusGradeName" label="分红级别名称">
      </el-table-column>
      <el-table-column prop="bonusDate" label="分红时间">
        <template slot-scope="scope">
          {{ parseDate(new Date(scope.row.bonusDate)) }}
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
  name: 'GradeBonusLog',
  components: {

  },
  mixins: [],
  props: {

  },
  data () {
    return {
      gradeBonusLogData: [],
      grdeBonusLogTypeData:{},
      tableDataLoading: false,
      page: 1,
      size: 10,
      total: 0,
      // 搜索条件 start
      startDate: null,
      endDate: null,
      selectBonusLogType:'',
      nickName:'',
      phone:'',
      // 搜索条件 end

    }
  },
  filters:{
    getTypeName(type) {
      return this.selectBonusLogType.get(type);
    }

  },
  computed: {

  },
  watch: {

  },
  mounted () {
    this.findGradeBounsLogList()
    this.findGradeBounsLogType()
  },
  methods: {
    parseDate,parseDateTime,
    handleSizeChange(val) {
      this.size = val;
      this.findGradeBounsLogList();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.findGradeBounsLogList();
    },
    findByBonusLogType() {
      this.page = 1;
      this.findGradeBounsLogList();
    },
    /* 查询分红记录 */
    findGradeBounsLogList () {
      this.tableDataLoading = true
      this.$http({
        url: this.$http.adornUrl2("/grade/findGradeBounsLogList"),
        method: "get",
        params: this.$http.adornParams({
          page: this.page - 1,
          size: this.size,
          type: this.selectBonusLogType,
          startDate:this.startDate,
          endDate:this.endDate,
          nickName:this.nickName,
          phone:this.phone
        }),
      }).then(({ data }) => {
        this.tableDataLoading = false
        let returnData = data.data
        this.gradeBonusLogData = returnData.content
        this.total = returnData.totalElements
      })
    },
    /* 查询分红给日志类型*/
    findGradeBounsLogType() {
      this.$http({
        url: this.$http.adornUrl2("/grade/findGradeBounsLogType"),
        method: "get",
        params: this.$http.adornParams({}),
      }).then(({ data }) => {
        this.grdeBonusLogTypeData = data.data
      })
    }
  }
};
</script>
<style lang='' scoped>
</style>
