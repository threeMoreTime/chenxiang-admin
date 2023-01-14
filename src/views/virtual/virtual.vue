<template>
  <div>
	  <div style = "margin:2% 0;display: inline-block;">
      <span>商品标题：</span>
      <el-input style = "width: 150px;" @keydown.enter.native = "select" clearable placeholder = "请输入商品标题" v-model = "title"></el-input>
	  </div>
	  <div style = "display: inline-block;">
	    <el-button style = "margin-left:15px;" size = "mini" type = "primary" icon = "document" @click = "select">查询</el-button>
	    <el-button style = "margin-left:15px;" size = "mini" type = "primary" icon = "document" @click = "cleans">重置</el-button>
      <el-button style = "margin-left:15px;" size = "mini" type = "primary" icon = "document" @click = "refresh">刷新</el-button>
    </div>
	  	<el-table v-loading = "tableDataLoading" :data = "tableData.content">
        <el-table-column prop = "id" label = "编号" width = "80">
         </el-table-column>
         <el-table-column prop = "coverImg" label = "商品图片">
          <template slot-scope = "scope">
            <img :src = "scope.row.coverImg" alt = "" width = "60" height = "60">
          </template>
          </el-table-column>
          <el-table-column prop = "title" label = "商品标题" width = "200">
           </el-table-column>
          <el-table-column prop = "originalPrice" label = "商品原价">
          </el-table-column>
          <el-table-column prop = "price" label = "商品价格">
          </el-table-column>
          <el-table-column prop = "memberPrice" label = "会员价格">
          </el-table-column>
          <el-table-column prop = "virtualSum" label = "虚拟商品总数">
         </el-table-column>
         <el-table-column prop = "virtualCount" label = "虚拟商品库存">
          </el-table-column>
          <el-table-column fixed = "right" label = "操作" width = "150">
              <template slot-scope = "scope">
                <el-button size = "mini" type = "primary" :disabled = "!isAuth('virtual:replen')" @click = "program(scope.row)">补货
                </el-button>
                <el-button size = "mini" type = "primary" @click = "compile(scope.row)">编辑
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
    <!-- 补货 -->
        <el-dialog title = "补货" :visible.sync = "dialogFormVisible" center>
          <div style = "margin-bottom: 10px;">
            <span style = "width: 200px;display: inline-block;text-align: right;">卡密链接：</span>
            <el-input style = "width:60%;" v-model = "linkUrl" placeholder = "请输入卡密链接"></el-input>
          </div>
          <div style = "margin-bottom: 10px;">
            <span style = "width: 200px;display: inline-block;text-align: right;position: relative;top: -110px;">卡密内容：</span>
            <el-input style = "width:60%;" v-model = "content" type = "textarea" :rows = "6" placeholder = "请输入卡密内容"></el-input>
            <p style = "font-size: 13px;color: #999999;padding-left: 200px;margin-top: 5px;">*可以批量新增，每行一个，可以智能去重</p>
          </div>
          <div slot = "footer" class = "dialog-footer">
            <el-button @click = "dialogFormVisible = false">取 消</el-button>
            <el-button type = "primary" @click = "programNoticeTo()">确 定</el-button>
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
        title1: '',
        linkUrl: '',
        content: '',
        goodsId: '',
        coverImg: '',
        type: '',
        status: 0,
        formLabelWidth: '200px',
        tableDataLoading: false,
        dialogFormVisible: false,
        tableData: [],
      }
    },
    methods: {
      handleSizeChange (val) {
        this.size = val
        this.shopSelect()
      },
      handleCurrentChange (val) {
        this.page = val
        this.shopSelect()
      },
      //搜索
      select () {
        this.shopSelect()
      },
      // 重置
      cleans () {
        this.title = ''
        this.status = 0
        this.shopSelect()
      },
      // 刷新
      refresh () {
        this.shopSelect()
      },
      // 编辑
      compile (rows) {
        this.$router.push({path: '/virtualAmend', query: {goodsId: rows.id}})
      },
      // 补货弹框
      program (row) {
        this.dialogFormVisible = true
        this.title1 = row.title
        this.coverImg = row.coverImg
        this.goodsId = row.id
      },
      // 补货
      programNoticeTo () {
        let content = this.content.replace(/\r\n/g, ',').replace(/\n/g, ',').replace(/\s/g, ',')
        let cont = content.split(',')
        cont = [...new Set(cont)]
        this.content = cont.join(',')
        if (this.linkUrl == '') {
          this.$notify({
            title: '提示',
            duration: 1800,
            message: '请输入卡密链接',
            type: 'warning'
          })
          return
        }
        if (this.content == '') {
          this.$notify({
            title: '提示',
            duration: 1800,
            message: '请输入卡密内容',
            type: 'warning'
          })
          return
        }
        this.$http({
          url: this.$http.adornUrl2('/selfGoodsVirtual/save'),
          method: 'post',
          data: this.$http.adornData({
            'title': this.title1,
            'content': this.content,
            'linkUrl': this.linkUrl,
            'goodsId': this.goodsId,
            'coverImg': this.coverImg,
          })
        }).then(({data}) => {
          if (data.status == 0) {
            this.dialogFormVisible = false
            this.$message({
              message: data.data,
              type: 'success',
              duration: 3500,
              onClose: () => {
                this.linkUrl = ''
                this.content = ''
                this.shopSelect()
              }
            })
          } else {
            this.$message({
              message: data.data,
              type: 'error',
              duration: 3500,
              onClose: () => {
                this.linkUrl = ''
                this.content = ''
                this.shopSelect()
              }
            })
          }

        })
      },
      // 获取商品数据
      shopSelect () {
        let page = this.page - 1
        let status = 0
        this.tableDataLoading = true
        this.$http({
          url: this.$http.adornUrl2('/goods/goodsList'),
          method: 'get',
          params: this.$http.adornParams({
            'page': page,
            'size': this.size,
            'title': this.title,
            'type': this.type,
            'status': status,
            'isExpress':2
          })
        }).then(({data}) => {
          this.tableDataLoading = false
          let returnData = data.data
          this.tableData = returnData
        })
      },
    },
    mounted () {
      this.shopSelect()
    }
  }
</script>

<style>

</style>
