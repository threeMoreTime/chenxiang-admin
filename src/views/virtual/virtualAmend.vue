<template>
  <div>
	  <div style = "margin:2% 0;display: inline-block;">
	    <span>兑换码：</span>
	    <el-input style = "width: 150px;" @keydown.enter.native = "select" clearable placeholder = "请输入兑换码" v-model = "content"></el-input>
		<el-button style = "margin-left:15px;" size = "mini" type = "primary" icon = "document" @click = "select">查询</el-button>
		<el-button style = "margin-left:15px;" size = "mini" type = "primary" icon = "document" @click = "cleans">重置</el-button>
		<el-button style = "margin-left:15px;" :disabled = "checkBoxData.length <= 0 " size = "mini" type = "danger" icon = "document"
               @click = "closes()">批量关闭</el-button>
		<el-button style = "margin-left:15px;" :disabled = "checkBoxData.length <= 0 " size = "mini" type = "primary" icon = "document"
               @click = "closes2()">批量开启</el-button>
		<el-button style = "margin-left:15px;" size = "mini" type = "primary" icon = "document" @click = "prev">返回上一页</el-button>
		<el-button style = "margin-left:15px;" size = "mini" type = "primary" icon = "document" @click = "refresh">刷新</el-button>
	  </div>
	<el-table @selection-change = "changeFun" v-loading = "tableDataLoading" :data = "tableData.content">
		  <el-table-column type = "selection" fixed>
		  </el-table-column>
        <el-table-column prop = "id" label = "编号" width = "80">
         </el-table-column>
         <el-table-column prop = "coverImg" label = "商品图片">
          <template slot-scope = "scope">
            <img :src = "scope.row.coverImg" alt = "" width = "60" height = "60">
          </template>
          </el-table-column>
          <el-table-column prop = "title" label = "商品标题" width = "200">
           </el-table-column>
          <el-table-column prop = "content" label = "兑换码">
          </el-table-column>
          <el-table-column prop = "linkUrl" label = "兑换地址" width = "200">
          </el-table-column>
		  <el-table-column label = "订单号" width = "180">
		    	 <template slot-scope = "scope">
		  <span style = "color: #4f9dec;cursor: pointer;"
            @click = "orderDetails(scope.row.orderId)">{{ scope.row.orderNum ? scope.row.orderNum : '暂无' }}</span>
		    	 </template>
		    </el-table-column>
		    <el-table-column label = "支付金额">
		    	 <template slot-scope = "scope">
		    	   <span>{{ scope.row.payMoney ? scope.row.payMoney : '暂无' }}</span>
		    	 </template>
		    </el-table-column>
		    <el-table-column label = "支付方式">
		    	 <template slot-scope = "scope">
		    	   <span style="color: #4f9dec;" v-if="scope.row.payWay === 1 ">app微信</span>
		    	   <span style="color: #4f9dec;" v-if="scope.row.payWay === 2 ">微信公众号</span>
		    	   <span style="color: #4f9dec;" v-if="scope.row.payWay === 3 ">微信小程序</span>
		    	   <span style="color: #4f9dec;" v-if="scope.row.payWay === 4 ">app支付宝</span>
		    	   <span style="color: #4f9dec;" v-if="scope.row.payWay === 5 ">H5支付宝</span>
		    	   <span style="color: #4f9dec;" v-if="scope.row.payWay === 6 ">零钱</span>
		    	   <span style="color: #4f9dec;" v-if="scope.row.payWay === null ">未支付</span>
		    	 </template>
		    </el-table-column>
		    <el-table-column label = "用户名">
		    	 <template slot-scope = "scope">
		    	   <span>{{ scope.row.nickName ? scope.row.nickName : '暂无' }}</span>
		    	 </template>
		    </el-table-column>
		    <el-table-column label = "电话" width = "150">
		    	 <template slot-scope = "scope">
		    	   <span>{{ scope.row.phone ? scope.row.phone : '暂无' }}</span>
		    	 </template>
		    </el-table-column>
          <el-table-column prop = "status" label = "状态" fixed = "right">
             <template slot-scope = "scope">
               <span style = "color:#3E8EF7;" v-if = "scope.row.status == '1'">正常</span>
               <span v-if = "scope.row.status == '2'">关闭</span>
               <span v-if = "scope.row.status == '3'">已使用</span>
             </template>
          </el-table-column>
					<el-table-column prop = "createTime" label = "出售时间" width = "160">
							<template slot-scope = "scope">
							  <span>{{ scope.row.expressTime ? scope.row.expressTime : '未出售' }}</span>
							</template>
					    </el-table-column>
        <el-table-column prop = "createTime" label = "创建时间" width = "160">
          </el-table-column>
          <el-table-column label = "操作" width = "100" fixed = "right">
              <template slot-scope = "scope">
                <el-button size = "mini" type = "primary" v-if = "scope.row.status!==3" @click = "compile(scope.row)">修改
                </el-button>
                <el-button v-if = "scope.row.status==3" size = "mini" type = "primary" disabled>修改
                </el-button>
              </template>
          </el-table-column>
        </el-table>
        <div style = "text-align: center;margin-top: 10px;">
          <el-pagination @size-change = "handleSizeChange" @current-change = "handleCurrentChange" :page-sizes = "[10, 15, 20, 25]"
                         :page-size = "size" :current-page = "page" layout = "total,sizes, prev, pager, next,jumper"
                         :total = "tableData.totalElements">
          </el-pagination>
        </div>
    <!-- 修改兑换码 -->
        <el-dialog title = "兑换码修改" :visible.sync = "dialogFormVisible" center>
        	<el-form :model = "form">
        	  <el-form-item label = "兑换地址：" :label-width = "formLabelWidth">
        	    <el-input v-model = "form.linkUrl" style = "width:65%;" placeholder = "请输入兑换地址"></el-input>
        	  </el-form-item>
            <el-form-item label = "兑换码：" :label-width = "formLabelWidth">
              <el-input v-model = "form.content" style = "width:65%;" placeholder = "请输入兑换码"></el-input>
            </el-form-item>
            <el-form-item label = "状态：" :label-width = "formLabelWidth">
              <el-radio-group v-model = "form.status">
                  <el-radio :label = "1">正常</el-radio>
                  <el-radio :label = "2">关闭</el-radio>
                <!-- <el-radio :label="3">已使用</el-radio> -->
              </el-radio-group>
            </el-form-item>
        	</el-form>
          <div slot = "footer" class = "dialog-footer">
            <el-button @click = "dialogFormVisible = false">取 消</el-button>
            <el-button type = "primary" @click = "compileNoticeTo()">确 定</el-button>
          </div>
        </el-dialog>
  </div>
</template>

<script>
	export default {
    data () {
      return {
        size: 10,
        page: 1,
        title: '',
        linkUrl: '',
        goodsId: '',
        coverImg: '',
        content: '',
        type: '',
        status: 0,
        form: {
          id: '',
          goodsId: '',
          title: '',
          linkUrl: '',
          content: '',
          coverImg: '',
          status: '',
          createTime: '',
        },
        checkBoxData: [],//多选框选择的值
        formLabelWidth: '200px',
        tableDataLoading: false,
        dialogFormVisible: false,
        tableData: [],
      }
    },
    methods: {
      // 详情
      orderDetails (id) {
        this.$router.push({path: '/orderDetails', query: {id: id}})
      },
      // 多选
      changeFun (val) {
        this.checkBoxData = val
      },
      // 返回上一级
      prev () {
        this.$router.back()
      },
      handleSizeChange (val) {
        this.size = val
        this.shopSelect()
      },
      handleCurrentChange (val) {
        this.page = val
        this.shopSelect()
      },
      // 刷新
      refresh () {
        this.shopSelect()
      },
      // 修改弹框
      compile (row) {
        this.dialogFormVisible = true
        this.form.title = row.title
        this.form.coverImg = row.coverImg
        this.form.goodsId = row.goodsId
        this.form.linkUrl = row.linkUrl
        this.form.content = row.content
        this.form.id = row.id
        this.form.status = row.status
        this.form.createTime = row.createTime
      },
      // 修改
      compileNoticeTo () {
        this.$http({
          url: this.$http.adornUrl2('/selfGoodsVirtual/update'),
          method: 'post',
          data: this.$http.adornData({
            'title': this.form.title,
            'content': this.form.content,
            'linkUrl': this.form.linkUrl,
            'goodsId': this.form.goodsId,
            'coverImg': this.form.coverImg,
            'id': this.form.id,
            'status': this.form.status,
            'createTime': this.form.createTime,
          })
        }).then(({data}) => {
          this.dialogFormVisible = false
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.shopSelect()
            }
          })
        })
      },
      // 查询
      select () {
        if (this.content == '') {
          this.$notify({
            title: '提示',
            duration: 1800,
            message: '请输入兑换码查询',
            type: 'warning'
          })
          return
        }
        let page = this.page - 1
        let goodsId = this.$route.query.goodsId
        this.tableDataLoading = true
        this.$http({
          url: this.$http.adornUrl2('/selfGoodsVirtual/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': page,
            'size': this.size,
            'content': this.content,
            'goodsId': goodsId,
            
          })
        }).then(({data}) => {
          this.tableDataLoading = false
          let returnData = data.data
          this.tableData = returnData
        })
      },
      cleans () {
        this.content = ''
        this.shopSelect()
      },
      // 批量关闭
      closes (id) {
        let checkBoxData = this.checkBoxData
        for (var i in checkBoxData) {
          this.$http({
            url: this.$http.adornUrl2('/selfGoodsVirtual/update'),
            method: 'post',
            data: this.$http.adornData({
              'title': checkBoxData[i].title,
              'content': checkBoxData[i].content,
              'linkUrl': checkBoxData[i].linkUrl,
              'goodsId': checkBoxData[i].goodsId,
              'coverImg': checkBoxData[i].coverImg,
              'id': checkBoxData[i].id,
              'status': 2,
              'createTime': checkBoxData[i].createTime,
            })
          }).then(({data}) => {
            this.$message({
              message: '批量关闭成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.shopSelect()
              }
            })
          })
        }
      },
      // 批量开启
      closes2 (id) {
        let checkBoxData = this.checkBoxData
        for (var i in checkBoxData) {
          this.$http({
            url: this.$http.adornUrl2('/selfGoodsVirtual/update'),
            method: 'post',
            data: this.$http.adornData({
              'title': checkBoxData[i].title,
              'content': checkBoxData[i].content,
              'linkUrl': checkBoxData[i].linkUrl,
              'goodsId': checkBoxData[i].goodsId,
              'coverImg': checkBoxData[i].coverImg,
              'id': checkBoxData[i].id,
              'status': 1,
              'createTime': checkBoxData[i].createTime,
            })
          }).then(({data}) => {
            this.$message({
              message: '批量关闭成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.shopSelect()
              }
            })
          })
        }
      },
      // 获取商品数据
      shopSelect () {
        let page = this.page - 1
        let goodsId = this.$route.query.goodsId
        this.tableDataLoading = true
        this.$http({
          url: this.$http.adornUrl2('/selfGoodsVirtual/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': page,
            'size': this.size,
            'goodsId': goodsId,
          })
        }).then(({data}) => {
          this.tableDataLoading = false
          let returnData = data.data
          this.tableData = returnData
        })
      },
    },
    activated () {
      this.shopSelect()
    }
  }
</script>

<style>

</style>
