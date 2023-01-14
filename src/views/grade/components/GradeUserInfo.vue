<template>
    <div>
      <div style="margin: 2% 0; display: inline-block">
        <span>销售等级：</span>
        <el-select
          v-model="gradeLevel"
          placeholder="请选择销售等级"
          style="width: 150px"
          @change="selectByGradeLevel(gradeLevel)"
        >
          <el-option label="全部" value=""></el-option>
          <el-option label="未激活用户" value="-1"></el-option>
          <el-option
            v-for="item in gradeConfigList"
            :key="item.id"
            :label="item.gradeName"
            :value="item.gradeCode"
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
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <div style="display:inline-flex">
          <el-card dis shadow="hover" >
            小毛驴中奖总数:{{userMsgCountData.isShowAwardMsgCount||0}}
          </el-card>
          <el-card dis shadow="hover" >
            虚拟账号总数:{{userMsgCountData.isVirtualCount||0}}
          </el-card>
          <el-card dis shadow="hover" >
            分红总数:{{userMsgCountData.isBonusDayCount||0}}
          </el-card>
        </div>
      </div>
      <el-table v-loading="tableDataLoading" :data="tableData.content">
        <el-table-column fixed prop="id" label="编号" width="120">
        </el-table-column>
        <el-table-column fixed prop="nickName" label="昵称" width="120">
          <template slot-scope="scope">
            <span style="color: #f56c6c">{{
              scope.row.nickName ? scope.row.nickName : "未设置"
            }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed prop="rankLevel" label="销售信息" width="120">
          <template slot-scope="scope">
            销售等级：<span style="color: #f56c6c">{{
              scope.row.gradeLevel
                ? gradeConfigList.find((a) => a.gradeCode === scope.row.gradeLevel)
                    .gradeName
                : "未设置"
            }}</span
            ><br />
            我购买的：<span style="color: #f56c6c">{{
              scope.row.gradeMySalesNum || 0
            }}</span
            ><br />
            我的销量：<span style="color: #f56c6c">{{
              scope.row.gradeSalesNum || 0
            }}</span
            ><br />
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
        <el-table-column prop="relationId" label="邀请码" width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.relationId }}</span>
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
        <el-table-column prop="isShowAwardMsg" label="小毛驴中奖信息">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.isShowAwardMsg"
              @change="changeIsShowAwardMsg(scope.row.isShowAwardMsg, scope.row.id)"
              :active-value="1"
              :inactive-value="0"
              active-color="#13ce66"
              inactive-color="#ff4949"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="isVirtual " label="虚拟账号">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.isVirtual"
              @change="changIsVirtual(scope.row.isVirtual, scope.row.id)"
              :active-value="1"
              :inactive-value="0"
              active-color="#13ce66"
              inactive-color="#ff4949"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="isVirtual " label="日分红">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.isNoBonusDay==null?0:scope.row.isNoBonusDay"
              @change="changIsNoBonusDay(scope.row.isNoBonusDay, scope.row.id)"
              :active-value="0"
              :inactive-value="1"
              active-color="#13ce66"
              inactive-color="#ff4949"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="bankIdentifyStatus " label="银行卡实名认证">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.bankIdentifyStatus"
              @change="changBankIdentifyStatus(scope.row, scope.row.id)"
              :active-value="1"
              :inactive-value="0"
              active-color="#13ce66"
              inactive-color="#ff4949"
            >
            </el-switch>
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
            <el-button size="mini" type="primary" @click="handlerChangeGrade(scope.row)">修改等级
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
      <el-dialog
      title="更改套餐等级"
      :visible.sync="changeGradeDialogVisable"
      center
    >
      <div style="margin-bottom: 10px">
        <span style="width: 200px; display: inline-block; text-align: right"
          >销售等级：</span
        >
        <el-select
          style="width: 200px"
          v-model="selectGradeCode"
          placeholder="请选择"
          size="medium"
        >
          <el-option label="无" value=""></el-option>
          <el-option
            v-for="item in gradeConfigList"
            :key="item.id"
            :label="item.gradeName"
            :value="item.gradeCode"
          >
          </el-option>
        </el-select>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button
          @click="
            () => {
              selectUserrId = null
              selectGradeCode = ''
              changeGradeDialogVisable = false;
            }
          "
          >取 消</el-button
        >
        <el-button type="primary" @click="changeGrade()">确 定</el-button>
      </div>
    </el-dialog>
    </div>
</template>

<script>
export default {
  props:{
    // 所有分红配置
    gradeConfigList: {
      type: Array,
      required: true
    },
  },
  data () {
    return {
      openValue: 'true',
      closeValue: 'false',
      state: 'false',
      size: 10,
      page: 1,
      activeName: 'first',
      tableDataLoading: true,
      tableData: [],
      // 搜索条件 start
      phone: '',
      nickName: '',
      gradeLevel:'',
      // 搜索条件 end
      // 弹窗 start
      changeGradeDialogVisable:false,
      selectUserrId:null,
      selectGradeCode:'',
      // 弹窗 end
      userMsgCountData:{},
      
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
      })=> {
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
    // 修改状态
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
        })
        this.dataSelect()
      })
    },
    // 修改虚拟账号状态
    changIsVirtual(val, id) {
      this.$http({
        url: this.$http.adornUrl2(`/grade/updateIsVistrual/${id}`),
        method: 'post',
        data: this.$http.adornData({})
      }).then(({
        data
      }) => {
        this.$message({
          message: '操作成功',
          type: 'success',
        })
        this.dataSelect()
      })
    },
    // 修改日分红状态
    changIsNoBonusDay(val, id) {
      this.$http({
        url: this.$http.adornUrl2(`/grade/updateIsNoBonusDay/${id}`),
        method: 'post',
        data: this.$http.adornData({})
      }).then(({
        data
      }) => {
        this.$message({
          message: '操作成功',
          type: 'success',
        })
        this.dataSelect()
      })
    },
    // 修改银行卡状态
    changBankIdentifyStatus(row, id) {
      this.$confirm(`确定更改认证状态?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl2(`/grade/updateBankIdentifyStatus/${id}`),
          method: 'post',
          params: this.$http.adornData({})
        }).then(({
          data
        }) => {
          if (data.status != 0) {
            this.$message({
              message: data.msg||'修改失败',
              type: 'error',
              onClose: () => {
                row.bankIdentifyStatus = !row.bankIdentifyStatus
              }
            })
          } else {
            this.$message({
              message: '操作成功',
              type: 'success',
              onClose: () => {
                this.dataSelect()
              }
            }) 
          }
          
        })
      }).catch(() => { })

    },
     // 小毛驴中奖信息
     changeIsShowAwardMsg(val, id) {
      this.$http({
        url: this.$http.adornUrl2(`/grade/updateIsShowAwardMsg/${id}`),
        method: 'post',
        data: this.$http.adornData({})
      }).then(({
        data
      }) => {
        if (data.status == 0) {
          this.$message({
            message: '操作成功',
            type: 'success',
          })
        } else {
          this.$message({
            message: data.msg||'操作失败',
            type: 'error',
          })
        }
        this.dataSelect() 
        
      })
    },
    // 修改等级弹窗
    handlerChangeGrade(row) {
      this.selectUserrId = row.id;
      this.selectGradeCode = row.gradeLevel;
      this.changeGradeDialogVisable = true;
    },
    // 修改等级
    changeGrade(id) {
      this.$http({
        url: this.$http.adornUrl2(`/grade/updateGradeLevel?userId=${this.selectUserrId}&gradeLevel=${this.selectGradeCode}`),
        method: 'get',
        data: this.$http.adornData({})
      }).then(({
        data
      }) => {
        if (data.status !== 0) {
          return this.$message({message:data.msg||'修改失败',type:'error'})
        }
        this.$message({
          message: '操作成功',
          type: 'success',
          duration: 100,
          onClose: () => {
            this.changeGradeDialogVisable = false;
            this.dataSelect()
          }
        })
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
    // select自动选择
    selectTrigger () {
      this.page = 1
      this.dataSelect()
    },
    // 根据销售等级查询
    selectByGradeLevel() {
      this.page = 1;
      this.dataSelect();
    },
    // 查询
    select () {
      this.page = 1
      this.dataSelect()
    },
   
    // 重置
    cleans () {
      this.page = 1
      this.phone = ''
      this.nickName = ''
      this.gradeLevel = ''
      this.dataSelect()
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
          if (data.status != 0) {
            return this.$message({message:data.msg||'删除失败',type:'error'})
          }
          this.$message({
            message: '删除成功',
            type: 'success',
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
          'platform': 'all',
          'isRelation': -1,
          'isTuan': -1,
          'nickName': this.nickName,
          'gradeLevel':this.gradeLevel
        })
      }).then(({
        data
      }) => {
        this.tableDataLoading = false
        let returnData = data.data
        this.tableData = returnData
        this.findUserMsgCount();
      })
    },
    // 获取统计信息
    findUserMsgCount () {
      this.$http({
        url: this.$http.adornUrl2(`/grade/findUserMsgCount`),
        method: 'get',
        params: this.$http.adornParams({
           
        })
      }).then(({
        data
      }) => {
        this.userMsgCountData = data.data;
      })
    },
   
  },
  mounted () {
    this.dataSelect()
  }
}
</script>

<style scoped>
.el-button + .el-button {
  margin-left: 0 !important;
  margin-top: 5px !important;
}
</style>
