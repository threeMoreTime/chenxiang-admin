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
      <el-table-column prop="oldGrade" label="旧等级" width="120">
      </el-table-column>
      <el-table-column prop="newGrade" label="新等级" width="120">
      </el-table-column>
      <el-table-column prop="remark" label="升级方式" width="120">
      </el-table-column>
      <el-table-column prop="createTime" label="升级时间" width="120">
        <template slot-scope="scope">
          {{ parseDateTime(new Date(scope.row.createTime)) }}
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
  name: 'GradeUpdateLog',
  components: {

  },
  mixins: [],
  props: {

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
      // 搜索条件 end
      
    }
  },
  computed: {

  },
  watch: {

  },
  mounted () {
    this.findGradeUpdateLogList()
    this.findGradeBounsLogType()
  },
  methods: {
    parseDate,parseDateTime,
    handleSizeChange(val) {
      this.size = val;
      this.findGradeUpdateLogList();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.findGradeUpdateLogList();
    },
    findByBonusLogType() {
      this.page = 1;
      this.findGradeUpdateLogList();
    },
    /* 查询升级记录 */
    findGradeUpdateLogList () {
      this.tableDataLoading = true
      this.$http({
        url: this.$http.adornUrl2("/grade/findGradeUpdateLogList"),
        method: "get",
        params: this.$http.adornParams({
          page: this.page - 1,
          size: this.size,
          phone:this.phone,
          nickName:this.nickName
        }),
      }).then(({ data }) => {
        this.tableDataLoading = false
        let returnData = data.data
        this.gradeUpdateLogData = returnData.content
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
        this.gradeBonlusLogTypeData = data.data
      })
    },
    // 查询
    select () {
      this.page = 1
      this.findGradeUpdateLogList()
    },
   
    // 重置
    cleans () {
      this.page = 1
      this.nickName = ''
      this.phone = ''
      this.findGradeUpdateLogList()
    },
  }
};
</script>
<style lang='' scoped>
</style>