<template>
  <div>
	  <div style="margin:2% 0;display: inline-block;">
      <span>活动状态:</span>
      <el-select v-model="status" placeholder="请选择活动状态" style="width:150px;" @change="select(status)">
        <el-option v-for="item in statusmain" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
    </div>
	  <div style="display: inline-block;"> 
	    <el-button style='margin-left:15px;' size="mini" type="primary" icon="document" @click="select">查询</el-button>
	    <el-button style='margin-left:15px;' size="mini" type="primary" icon="document" @click="cleans">重置</el-button>
      <el-button style='margin-left:15px;' size="mini" type="primary" icon="document" @click="refresh">刷新</el-button>
    </div>
	  	<el-table
        v-loading="tableDataLoading"
	  	  :data="tableData.content">
        <el-table-column
          fixed
          prop="id"
          label="编号"
          width="80">
        </el-table-column>
        <el-table-column
          label="拼团商品"
          width="200">
          <template slot-scope="scope">
            <div>
              商品主图:<img :src="scope.row.selfGroup.coverImg" alt="" width="32" height="32" style="border-radius: 50%;">
            </div>
            <div>
              拼团商品名称: <span>{{scope.row.selfGroup.title}}</span>
            </div>
            <div>
              拼团id: <span>{{scope.row.selfGroup.id}}</span>
            </div>
          </template>
	  	  </el-table-column>
        <el-table-column
          prop="startTime"
          label="拼团开始时间"
          width="160">
        </el-table-column>
        <el-table-column
          prop="needNumber"
          label="拼团需要人数"
          width="120">
        </el-table-column>
        <el-table-column
          prop="countNumber"
          label="拼团人数">
        </el-table-column>
        <el-table-column
          prop="endTime"
          label="拼团结束时间"
          width="160">
        </el-table-column>
        <el-table-column
          prop="status"
          label="活动状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 1">拼团中</span>
            <span v-if="scope.row.status == 2">已完成</span>
            <span v-if="scope.row.status == 3">未完成</span>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="150">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="lookClick(scope.row)">查看拼团用户
            </el-button>
          </template>
        </el-table-column>
	  	</el-table>
	  	<div style="text-align: center;margin-top: 10px;">
	  	  <el-pagination
	  	    @size-change="handleSizeChange"
	  	    @current-change="handleCurrentChange"
	  	    :page-sizes="[5, 10, 15, 20]"
	  	    :page-size="size"
	  	    :current-page="page"
	  	    layout="total,sizes, prev, pager, next"
	  	    :total="tableData.totalElements">
	  	  </el-pagination>
	  	</div>
      <!-- 拼团用户 -->
      <el-dialog title="拼团用户" :visible.sync="dialogFormVisible" center>
      	<div v-for="(item,index) in userData" :key="index" style="margin-bottom: 10px;">
          <span>用户{{index+1}}</span>
          <div class="user_item" style="display: flex;align-items: center;border: 1px solid #EEEEEE;padding: 5px 0;">
            <div>用户id: <span>{{item.userId}}</span></div>
            <div>头像: <img :src="item.headerImg" alt="" width="50" height="50"></div>
            <div>昵称: <span>{{item.nickName}}</span></div>
            <div>手机号: <span>{{item.mobile}}</span></div>
          </div>
      	</div>
      </el-dialog>
  </div>
</template>

<script>
	export default {
        data() {
          return {
          size:5,
          page:1,
          id:'',
          img:'',
          title:'',
          readonly:true,
          status:0,
          userData:'',
          statusmain:[
            {
            	value:0,
            	label:'全部'
            },
          	{
          		value:1,
          		label:'拼团中'
          	},
          	{
          		value:2,
          		label:'已完成'
          	},
            {
            	value:3,
            	label:'未完成'
            }
          ],
          formLabelWidth:'200px',
          dialogFormVisible:false,
          tableDataLoading:false,
          tableDataLoading1:false,
          tableData:[],
        }
      },
      methods: {
        handleChange(value) {
          this.value.forEach(element => {
            this.typeId = element;
          });
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
        select(){
           this.shopSelect()
        },
        // 刷新
        refresh(){
          this.shopSelect()
        },
        // 重置
        cleans(){
          this.status = 0
          this.shopSelect()
        },
        // 获取商品数据
        shopSelect () {
          let page = this.page-1
          this.tableDataLoading = true
          this.$http({
          url: this.$http.adornUrl2('/selfGroupPink/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page':page,
            'size':this.size,
            'status':this.status
          })
          }).then(({data}) => {
            this.tableDataLoading = false
            let returnData = data.data;
            this.tableData = returnData
            this.id = returnData.id
           console.log(returnData)
          })
        },
        // 查看
        lookClick(row){
          this.$http({
          url: this.$http.adornUrl2('/selfGroupPink/find'),
          method: 'get',
          params: this.$http.adornParams({
            'id':row.id,
          })
          }).then(({data}) => {
            let returnData = data.data;
            this.userData = returnData.pinkUserList
            this.dialogFormVisible = true
          })
        }
      },
      mounted() {
        this.shopSelect()
      }
	  };
</script>

<style scoped="scoped">
  .user_item div{
    flex: 1;
    text-align: center;
  }
</style>
