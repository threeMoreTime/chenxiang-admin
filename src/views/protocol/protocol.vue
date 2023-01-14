<template>
  <el-tabs>
    <div style="float: right;margin-right:2%;">
      <el-button style='margin: 10px 0;' :disabled="!isAuth('protocol:add')" size="mini" type="primary" icon="document"
        @click="addUpgrade">添加</el-button>
    </div>
    <el-table v-loading="tableDataLoading" :data="tabeData.content">
      <el-table-column fixed prop="id" label="编号" width="80">
      </el-table-column>
      <el-table-column prop="title" label="协议标题">
      </el-table-column>
      <el-table-column label="用户端路由">
        <template slot-scope="scope">
          <span>/pages/member/gonggao?id={{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="content" label="内容" width="500">
        <template slot-scope="scope">
          <div style="display: -webkit-box;-webkit-box-orient: vertical;-webkit-line-clamp: 3;overflow: hidden;max-height:80px;">{{scope.row.content}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间">
      </el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">

          <el-button size="mini" type="primary" :disabled="!isAuth('protocol:update')"
            @click="upgradebj(scope.$index, scope.row)">编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="text-align: center;margin-top: 10px;">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :page-sizes="[10, 20, 30, 40]" :page-size="size" :current-page="page"
        layout="total,sizes, prev, pager, next,jumper" :total="tabeData.totalElements">
      </el-pagination>
    </div>
  </el-tabs>
</template>

<script>
  export default {
    data() {
      return {
        size: 10,
        page: 1,
        title: '',
        tabeData: [],
        tableDataLoading: true,
        dialogFormVisible: false
      }
    },
    methods: {

      handleSizeChange(val) {
        this.size = val;
        this.dataSelect()
      },
      handleCurrentChange(val) {
        this.page = val;
        this.dataSelect()
      },

      handleClick(tab, event) {
        this.dataSelect()
      },
      // 添加升级弹框
      addUpgrade() {
        this.$router.push({
          path: '/protocoladd'
        })
      },

      // 修改升级弹框
      upgradebj(index, rows) {
        this.$router.push({
          path: '/protocolAmend',
          query: {
            id: rows.id
          }
        })
      },
      // 删除升级
      upgradelete(row) {
        this.$confirm(`确定删除此条信息?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl2(`/agreement/delete?id=${row.id}`),
            method: 'get',
            params: this.$http.adornParams({})
          }).then(({
            data
          }) => {
            this.$message({
              message: '删除成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.dataSelect()
              }
            })
          })
        }).catch(() => {})
      },

      // 升级配置数据列表
      dataSelect() {
        this.tableDataLoading = true
        let page = this.page - 1
        this.$http({
          url: this.$http.adornUrl2('/agreement/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': page,
            'size': this.size,
            'title': this.title
          })
        }).then(({
          data
        }) => {
          this.tableDataLoading = false
          let returnData = data.data;
          this.tabeData = returnData
        })
      },

    },
    mounted() {
      this.dataSelect()
    }
  };
</script>

<style>
  .customWidth {
    width: 80% !important;
  }

  .adver_main.box {
    display: block;
    max-width: 100%;
    text-align: center;
    border: 1px dotted rgba(67, 79, 103, .4);
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
    text-decoration: none
  }

  .bannerManin {
    border: 1px solid #e8e8e8;
    font-size: 14px;
    padding: 0 24px;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 113px;
    color: rgba(0, 0, 0, .65);
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
    color: #3E8EF7;
  }

  .bannerbtn a {
    flex: 1;
    text-align: center;
    color: #3E8EF7 !important;
    text-decoration: none;
  }
</style>
