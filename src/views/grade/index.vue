<template>
  <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="用户列表" name="gradeUserInfo">
      <GradeUserInfo :gradeConfigList="gradeConfigList" v-if="activeName=='gradeUserInfo'" :key="GradeUserInfoRefreshKey" />
    </el-tab-pane>
    <el-tab-pane label="分红确认" name="gradeBonusDay">
      <span slot="label">
        分红确认<el-badge v-if="waitProcessData.waitGradeBonusDay>0" :value="waitProcessData.waitGradeBonusDay"></el-badge>
      </span>
      <GradeBonusDay :refreshWaitProcessData="()=>{this.findWaitProcessData()}" v-if="activeName=='gradeBonusDay'" :key="gradeBonusDayRefreshKey" />
    </el-tab-pane>
    <el-tab-pane label="分红配置" name="gradeConfig">
      <GradeConfig v-if="activeName=='gradeConfig'" :key="configRefreshKey" />
    </el-tab-pane>
    <el-tab-pane label="分红日志" name="gradeBonusLog">
      <GradeBonusLog v-if="activeName=='gradeBonusLog'" :key="bonusLogRefreshKey" />
    </el-tab-pane>
    <el-tab-pane label="等级变更日志" name="gradeUpdateLog">
      <GradeUpdateLog v-if="activeName=='gradeUpdateLog'" :key="gradeUpdateLogRefreshKey" />
    </el-tab-pane>
    <el-tab-pane label="团队结构" name="findTeamUserList">
      <findTeamUserList v-if="activeName=='findTeamUserList'" :key="findTeamUserListRefreshKey" :gradeConfigList="gradeConfigList" />
    </el-tab-pane>
    <el-tab-pane label="树苗管理" name="UserTreeList">
      <UserTreeList v-if="activeName=='UserTreeList'" :key="UserTreeListRefreshKey"  />
    </el-tab-pane>

  </el-tabs>
</template>

<script>
import GradeConfig from './components/GradeConfig.vue'
import GradeBonusLog from './components/GradeBonusLog.vue'
import GradeBonusDay from './components/GradeBonusDay.vue'
import GradeUserInfo from './components/GradeUserInfo.vue'
import GradeUpdateLog from './components/GradeUpdateLog.vue'
import findTeamUserList from './components/findTeamUserList.vue'
import UserTreeList from './components/UserTreeList.vue'
export default {
  data () {
    return {
      activeName: 'gradeUserInfo',
      configRefreshKey: 1,
      bonusLogRefreshKey: 2,
      gradeBonusDayRefreshKey:3,
      GradeUserInfoRefreshKey:4,
      gradeUpdateLogRefreshKey:5,
      gradeMonthAwardRefreshKey:6,
      findTeamUserListRefreshKey:7,
      UserTreeListRefreshKey:8,
      gradeConfigList:[],
      waitProcessData:{}
    }
  },
  components: {
    GradeConfig,
    GradeBonusLog,
    GradeBonusDay,
    GradeUserInfo,
    GradeUpdateLog,
    findTeamUserList,
    UserTreeList
},
  created() {
    this.findGradeConfigList();
    this.findWaitProcessData();
  },
  methods: {
    /* 获取套餐2分红配置 */
    findGradeConfigList () {
      this.$http({
        url: this.$http.adornUrl2('/grade/findGradeConfigList'),
        method: 'get'
      }).then(({ data }) => {
        if (data && data.status === 0) {
          this.gradeConfigList = data.data
        }
      })
    },
    handleClick (tab, event) {
      // console.log({tab})
      if (tab._props.label == '分红配置') {
        this.configRefreshKey = new Date().getTime()
      };
      if (tab._props.label == '分红日志') {
        this.bonusLogRefreshKey = new Date().getTime()
      };
      if (tab._props.label == '日分红') {
        this.gradeBonusDayRefreshKey = new Date().getTime()
      };
      if (tab._props.label == '用户列表') {
        this.GradeUserInfoRefreshKey = new Date().getTime()
      };
      if (tab._props.label == '等级变更日志') {
        this.gradeUpdateLogRefreshKey = new Date().getTime()
      };
      if (tab._props.label == '团队结构') {
        this.findTeamUserListRefreshKey = new Date().getTime()
      };
      if (tab._props.label == '树苗管理') {
        this.UserTreeListRefreshKey = new Date().getTime()
      };
    },
    // 获取待处理总数
    findWaitProcessData() {
      this.$http({
        url: this.$http.adornUrl2('/grade/findWaitProcessData'),
        method: 'get'
      }).then(({ data }) => {
        if (data && data.status === 0) {
          this.waitProcessData = data.data
        }
      })
    }
  },
  mounted () {
  }
}
</script>

<style>
.customWidth {
  width: 80% !important;
}

.adver_main.box {
  display: block;
  max-width: 100%;
  text-align: center;
  border: 1px dotted rgba(67, 79, 103, 0.4);
}

.cards {
  padding: 0 8px;
  margin-bottom: 15px;
}

.adver_main.box a {
  display: flex;
  justify-content: center;
  height: 150px;
  line-height: 150px;
  text-decoration: none;
}

.bannerManin {
  border: 1px solid #e8e8e8;
  font-size: 14px;
  padding: 0 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 113px;
  color: rgba(0, 0, 0, 0.65);
}

.bannerManin span {
  display: inline-block;
  margin-left: 5px;
}

.bannerManin img {
  width: 48px;
  height: 48px;
  border-radius: 50%;
}

.bannerbtn {
  display: flex;
  border-top: none !important;
  border: 1px solid #e8e8e8;
  padding: 11px;
  font-size: 14px;
  color: #3e8ef7;
}

.bannerbtn a {
  flex: 1;
  text-align: center;
  color: #3e8ef7 !important;
  text-decoration: none;
}
</style>
