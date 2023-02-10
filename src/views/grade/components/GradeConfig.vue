<template>
  <el-table v-loading="tableDataLoading" :data="gradeConfigData">
    <el-table-column fixed prop="id" label="编号" align="center" width="80">
    </el-table-column>
    <el-table-column prop="gradeCode" label="等级编码"> </el-table-column>
    <el-table-column prop="gradeName" label="等级名称"> </el-table-column>
    <el-table-column prop="updateGradeTeam" label="升级团队结构（部门数x编码)">
    </el-table-column>
    <el-table-column prop="remark" label="说明"> </el-table-column>
    <!-- <el-table-column label="操作" prop="id" width="120"> -->
      <!-- <template slot-scope="scope">
        <el-button
          size="mini"
          type="primary"
          disabled
          @click="findConfigById(scope.row.id)"
          >编辑
        </el-button>
      </template> -->
    <!-- </el-table-column> -->
  </el-table>
</template>
<script>
export default {
  name: 'GradeConfig',
  components: {

  },
  mixins: [],
  props: {

  },
  data () {
    return {
      gradeConfigData: [],
      tableDataLoading: false,
    }
  },
  computed: {

  },
  watch: {

  },
  mounted () {
    this.findGradeConfigList()
  },
  methods: {
    /* 获取套餐2分红配置 */
    findGradeConfigList () {
      this.tableDataLoading = true
      this.$http({
        url: this.$http.adornUrl2('/grade/findGradeConfigList'),
        method: 'get'
      }).then(({ data }) => {
        if (data && data.status === 0) {
          this.tableDataLoading = false
          this.gradeConfigData = data.data
        }
      })
    },
  }
};
</script>
<style lang='' scoped>
</style>