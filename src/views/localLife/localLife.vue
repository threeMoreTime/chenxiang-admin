<template>
  <el-tabs v-model="activeName" @tab-click="handleClick">

    <el-tab-pane label="金刚区分类" name="first">
      <div style="float: left;margin-right:2%;">
        <span>小程序是否显示：</span>
        <el-select v-model="types1" placeholder="请选择类型" style="width:150px;" @change="selectTrigger(types1)">
          <el-option v-for="item in platforms" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>&nbsp;&nbsp;&nbsp;&nbsp;
      </div>
      <div style="float: right;margin-right:2%;">
        <el-button style="margin: 10px 0;" :disabled="!isAuth('localLife:add')" size="mini" type="primary"
          icon="document" @click="addNavigation">添加</el-button>
      </div>
      <el-table v-loading="tableDataLoading" :data="homeData.content">
        <el-table-column fixed prop="id" label="编号" width="80">
        </el-table-column>
        <el-table-column prop="title" label="名称">
        </el-table-column>
        <el-table-column prop="url" label="路由">
        </el-table-column>
        <el-table-column prop="content" label="图片">
          <template slot-scope="scope">
            <img :src="scope.row.image_url" alt="" width="40" height="40">
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="排序">
          <template slot-scope="scope">
            <el-input-number size="small" v-model="scope.row.sort" :min="0" @change="paixu(scope.row)">
            </el-input-number>
          </template>
        </el-table-column>
        <el-table-column prop="type " label="小程序是否显示">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.type" @change="change(scope.row.type,scope.row)" :active-value="openValue"
              :inactive-value="closeValue" active-color="#13ce66" inactive-color="#ff4949">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="createAt" label="创建时间" width="160">
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" :disabled="!isAuth('localLife:update')"
              @click="compile(scope.$index, scope.row)">编辑
            </el-button>
            <el-button size="mini" type="danger" :disabled="!isAuth('localLife:delete')" @click="navdeletes(scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align: center;margin-top: 10px;">
        <el-pagination @size-change="handleSizeChange1" @current-change="handleCurrentChange1"
          :page-sizes="[10, 20, 30, 40]" :page-size="size" :current-page="page"
          layout="total,sizes, prev, pager, next,jumper" :total="homeData.totalElements">
        </el-pagination>
      </div>

    </el-tab-pane>
    <el-tab-pane label="推广配置" name="third">
      <div style="float: right;margin-right:2%;">
        <el-button style="margin: 10px 0;" :disabled="!isAuth('localLife:add')" size="mini" type="primary"
          icon="document" @click="addNavigation">添加</el-button>
      </div>
      <el-table v-loading="tableDataLoading" :data="homeData.content">
        <el-table-column fixed prop="id" label="编号" width="80">
        </el-table-column>
        <el-table-column prop="title" label="名称">
        </el-table-column>
        <el-table-column prop="url" label="路由">
        </el-table-column>
        <el-table-column prop="content" label="图片">
          <template slot-scope="scope">
            <img :src="scope.row.image_url" alt="" width="40" height="40">
          </template>
        </el-table-column>
        <el-table-column prop="backgroundImage" label="背景图">
          <template slot-scope="scope">
            <img :src="scope.row.backgroundImage" alt="" width="40" height="40">
          </template>
        </el-table-column>
        <!-- <el-table-column prop="sort" label="排序">
        <template slot-scope="scope">
          <el-input-number size="small" v-model="scope.row.sort" :min="0" @change="paixu(scope.row)"></el-input-number>
        </template>
      </el-table-column> -->
        <el-table-column prop="createAt" label="创建时间" width="160">
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" :disabled="!isAuth('localLife:update')"
              @click="compile(scope.$index, scope.row)">编辑
            </el-button>
            <el-button size="mini" type="danger" :disabled="!isAuth('localLife:delete')" @click="navdeletes(scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align: center;margin-top: 10px;">
        <el-pagination @size-change="handleSizeChange1" @current-change="handleCurrentChange1"
          :page-sizes="[10, 20, 30, 40]" :page-size="size" :current-page="page"
          layout="total,sizes, prev, pager, next,jumper" :total="homeData.totalElements">
        </el-pagination>
      </div>
    </el-tab-pane>


    <el-tab-pane label="轮播图配置" name="sixth">
      <div>
        <el-row>
          <el-col :span="6" class="cards" v-if="isAuth('localLife:add')">
            <div class="adver_main box">
              <a href="javascript:;" @click="addNavigation">
                + 新增轮播图
              </a>
            </div>
          </el-col>
          <el-col :span="6" class="cards" v-for="(item,index) in homeData.content" :key="index">
            <div class="adver_main bannerManin">
              <img :src="item.image_url" alt="">
              <span>{{ item.url }}</span>
            </div>
            <div class="bannerbtn">
              <a href="javascript:;" v-if="isAuth('localLife:update')" @click="compile(index, item)">编辑</a>
              <a href="javascript:;" v-if="isAuth('localLife:delete')" @click="navdeletes(item)">删除</a>
            </div>
          </el-col>
        </el-row>
      </div>
      <!-- 添加弹框 -->
      <el-dialog title="添加轮播图信息" :visible.sync="dialogFormVisible6" center>
        <div style="margin-bottom: 10px;">
          <span style="width: 200px;display: inline-block;text-align: right;">链接：</span>
          <el-input style="width:50%;" v-model="url" placeholder="请输入轮播图链接"></el-input>
        </div>
        <div style="margin-bottom: 10px;display: flex;">
          <span style="width: 200px;display: inline-block;text-align: right;">轮播图片：</span>
          <div
            style=" width:148px;height:148px;border: 1px dashed #c0ccda;border-radius: 6px;text-align: center;line-height: 148px;">
            <el-upload class="avatar-uploader" v-model="image_url" action="https://sqx.gomyorder.cn/tao/alioss/upload"
              :show-file-list="false" :on-success="handleAvatarSuccess">
              <img v-if="image_url" :src="image_url" class="avatar"
                style="border-radius: 6px;width: 148px;height: 148px;" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </div>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible6 = false">取 消</el-button>
          <el-button type="primary" @click="releaslunNoticeTo()">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 编辑弹框 -->
      <el-dialog title="修改" :visible.sync="dialogFormVisible7" center>
        <el-form :model="form1">
          <el-form-item label="链接：" :label-width="formLabelWidth">
            <el-input v-model="form1.url" style="width:65%;"></el-input>
          </el-form-item>
          <el-form-item label="轮播图片：" :label-width="formLabelWidth">
            <div
              style=" width:148px;height:148px;border: 1px dashed #c0ccda;border-radius: 6px;text-align: center;line-height: 148px;">
              <el-upload class="avatar-uploader" v-model="image_url2"
                action="https://sqx.gomyorder.cn/tao/alioss/upload" :show-file-list="false"
                :on-success="handleAvatarSuccess2">
                <img v-if="form1.image_url" :src="form1.image_url" class="avatar"
                  style="border-radius: 6px;width: 148px;height: 148px;" />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </div>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible7 = false">取 消</el-button>
          <el-button type="primary" @click="upgradbianTo()">确 定</el-button>
        </div>
      </el-dialog>
    </el-tab-pane>

    <!-- 添加导航弹框 -->
    <el-dialog title="添加" :visible.sync="dialogFormVisible9" center>
      <div style="margin-bottom: 10px;" v-if="nav!=13">
        <span style="width: 200px;display: inline-block;text-align: right;">标题：</span>
        <el-input style="width:50%;" v-model="title" placeholder="请输入导航标题"></el-input>
      </div>
      <div style="margin-bottom: 10px;">
        <span style="width: 200px;display: inline-block;text-align: right;">路由：</span>
        <el-input style="width: 50%;" v-model="url" placeholder="请输入导航路由"></el-input>
      </div>
      <div style="display: flex;">
        <span style="width: 200px;display: inline-block;text-align: right;">图片：</span>
        <div
          style=" width:148px;height:148px;border: 1px dashed #c0ccda;border-radius: 6px;text-align: center;line-height: 148px;">
          <el-upload class="avatar-uploader" v-model="image_url" action="https://sqx.gomyorder.cn/tao/alioss/upload"
            :show-file-list="false" :on-success="handleAvatarSuccess4">
            <img v-if="image_url" :src="image_url" class="avatar"
              style="border-radius: 6px;width: 86px;height: 86px;" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </div>
      </div>
      <div style="display: flex;"  v-if="nav==12">
        <span style="width: 200px;display: inline-block;text-align: right;" >背景图：</span>
        <div
          style=" width:148px;height:148px;border: 1px dashed #c0ccda;border-radius: 6px;text-align: center;line-height: 148px;">
          <el-upload class="avatar-uploader" v-model="backgroundImage" action="https://sqx.gomyorder.cn/tao/alioss/upload"
            :show-file-list="false" :on-success="handleAvatarSuccess6">
            <img v-if="backgroundImage" :src="backgroundImage" class="avatar"
              style="border-radius: 6px;width: 86px;height: 86px;" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </div>
      </div>
      <div style="margin-bottom: 10px;margin-top: 10px;" v-if="nav != 13">
        <span style="width: 200px;display: inline-block;text-align: right;">排序：</span>
        <el-input-number size="medium" v-model="sort"></el-input-number>
      </div>
      <div style="margin-bottom: 10px;" v-if="nav != 13">
        <span style="width: 200px;display: inline-block;text-align: right;"> {{nav==10?'状态':'小程序是否显示'}} ：</span>
        <el-radio-group v-model="type">
          <el-radio :label="1">显示</el-radio>
          <el-radio :label="2">不显示</el-radio>
        </el-radio-group>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible9 = false">取 消</el-button>
        <el-button type="primary" @click="NagNoticeTo()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 首页编辑 -->
    <el-dialog title="修改" :visible.sync="dialogFormVisible2" center>
      <el-form :model="formcomp">
        <el-form-item label="标题：" :label-width="formLabelWidth" v-if="nav!=13">
          <el-input v-model="formcomp.title" style="width:65%;"></el-input>
        </el-form-item>
        <el-form-item label="路由：" :label-width="formLabelWidth">
          <el-input v-model="formcomp.url" style="width:65%;"></el-input>
        </el-form-item>
        <el-form-item label="图片：" :label-width="formLabelWidth">
          <div
            style=" width:148px;height:148px;border: 1px dashed #c0ccda;border-radius: 6px;text-align: center;line-height: 148px;">
            <el-upload class="avatar-uploader" v-model="image_url" action="https://sqx.gomyorder.cn/tao/alioss/upload"
              :show-file-list="false" :on-success="handleAvatarSuccess3">
              <img v-if="formcomp.image_url" :src="formcomp.image_url" class="avatar"
                style="border-radius: 6px;width: 86px;height: 86px;" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </div>
        </el-form-item>
        <el-form-item label="背景图：" :label-width="formLabelWidth"  v-if="nav==12">
          <div
            style=" width:148px;height:148px;border: 1px dashed #c0ccda;border-radius: 6px;text-align: center;line-height: 148px;">
            <el-upload class="avatar-uploader" v-model="backgroundImage" action="https://sqx.gomyorder.cn/tao/alioss/upload"
              :show-file-list="false" :on-success="handleAvatarSuccess5">
              <img v-if="formcomp.backgroundImage" :src="formcomp.backgroundImage" class="avatar"
                style="border-radius: 6px;width: 86px;height: 86px;" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </div>
        </el-form-item>

        <el-form-item label="排序：" :label-width="formLabelWidth" v-if="nav == 1||nav == 10">
          <el-input-number size="medium" v-model="formcomp.sort"></el-input-number>
        </el-form-item>
        <div style="margin-bottom: 10px;" v-if="nav == 1||nav == 10">
          <span style="width: 200px;display: inline-block;text-align: right;">{{nav==10?'状态':'小程序是否显示'}} ：</span>
          <el-radio-group v-model="formcomp.type">
            <el-radio :label="1">显示</el-radio>
            <el-radio :label="2">不显示</el-radio>
          </el-radio-group>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="compileNoticeTo()">确 定</el-button>
      </div>
    </el-dialog>
  </el-tabs>
</template>

<script>
  export default {
    data() {
      return {
        openValue: 1,
        closeValue: 2,
        size: 10,
        page: 1,
        state: 1,
        title: '',
        type: '',
        nav: 11,
        keyword: '',
        androidWgtUrl: '',
        iosWgtUrl: '',
        wgtUrl: '',
        version: '',
        iosVersion: '',
        des: '',
        checkBoxData: [], //多选框选择的值
        method: 'false',
        methods: [{
            value: 'false',
            label: '普通升级'
          },
          {
            value: 'true',
            label: '强制升级'
          }
        ],
        formupgrad: {
          id: '',
          androidWgtUrl: '',
          iosWgtUrl: '',
          wgtUrl: '',
          version: '',
          des: '',
          method: '',
          iosVersion: ''
        },
        formLabelWidth: '200px',
        activeName: 'first',
        tableDataLoading: true,
        dialogFormVisible: false,
        dialogFormVisible1: false,
        dialogFormVisible2: false,
        dialogFormVisible3: false,
        dialogFormVisible4: false,
        dialogFormVisible5: false,
        dialogFormVisible6: false,
        dialogFormVisible7: false,
        dialogFormVisible8: false,
        dialogFormVisible9: false,
        tableData: [],
        homeData: {},
        types1: '',
        platforms: [{
          value: '',
          label: '全部'
        }, {
          value: 1,
          label: '小程序显示'
        }],
        choicenData2: [],
        upgradeData: [],
        choicenData: [],
        types: [{
            value: 'word',
            label: '文字'
          },
          {
            value: 'url',
            label: '链接'
          }
        ],
        url: '',
        image_url: '',
        image_url2: '',
        backgroundImage:'',
        id: '',

        bannerData: [],
        form1: {
          id: '',
          url: '',
          image_url: ''
        },
        form: {
          id: '',
          title: '',
          url: '',
          type: '',
          state: '',
          sort: '',
          types: [{
              value: 'word',
              label: '文字'
            },
            {
              value: 'url',
              label: '链接'
            }
          ],
        },
        formcomp: {
          id: '',
          state: '',
          title: '',
          url: '',
          image_url: '',
          type: '',
          sort: 1,
          backgroundImage:'',
        },
        sort: 1,
      }
    },
    methods: {
      // 多选
      changeFun(val) {
        this.checkBoxData = val
      },
      handleAvatarSuccess3(file) {
        this.formcomp.image_url = file.data
      },
      handleAvatarSuccess5(file) {
        this.formcomp.backgroundImage = file.data
      },
      handleAvatarSuccess6(file) {
        this.backgroundImage = file.data
      },
      handleAvatarSuccess4(file) {
        this.image_url = file.data
      },
      handleSizeChange(val) {
        this.size = val
        this.dataSelect()
      },
      handleCurrentChange(val) {
        this.page = val
        this.dataSelect()
      },
      handleSizeChange1(val) {
        this.size = val
        this.homeSelect()
      },
      handleCurrentChange1(val) {
        this.page = val
        this.homeSelect()
      },
      handleSizeChange2(val) {
        this.size = val
        this.upgradeSelect()
      },
      handleCurrentChange2(val) {
        this.page = val
        this.upgradeSelect()
      },
      handleSizeChange3(val) {
        this.size = val
        this.choicenSelect()
      },
      handleCurrentChange3(val) {
        this.page = val
        this.choicenSelect()
      },
      handleClick(tab, event) {
        this.page = 1
        if (tab._props.label == '金刚区分类') {
          this.types1 = ''
          this.nav = 11
          this.homeSelect()
        }
        if (tab._props.label == '合作平台') {
          this.types1 = ''
          this.nav = 10
          this.homeSelect()
        }
        if (tab._props.label == '推广配置') {

         this.types1 = ''
         this.nav = 12
         this.homeSelect()
        }
        if (tab._props.label == '升级配置') {
          this.upgradeSelect()
        }
        if (tab._props.label == '精选商品') {
          this.choicenSelect()
          this.handpick()
        }
        if (tab._props.label == '轮播图配置') {
          this.types1 = ''
          this.nav = 13
          this.homeSelect()
        }
        if (tab._props.label == '背景图') {
          this.type = 2
          this.bannerSelect()
        }
      },
      handleAvatarSuccess(file) {
        this.image_url = file.data
      },
      handleAvatarSuccess2(file2) {
        this.form1.image_url = file2.data
      },
      // 添加金刚区分类弹框
      addNavigation() {
        this.dialogFormVisible9 = true
      },
      // 添加金刚区分类
      NagNoticeTo() {
        if(this.nav!=13){
          if (this.title == '') {
            this.$notify({
              title: '提示',
              duration: 1800,
              message: '请输入标题',
              type: 'warning'
            })
            return
          }
          if (this.type == '') {
            this.$notify({
              title: '提示',
              duration: 1800,
              message: '请选择小程序是否显示',
              type: 'warning'
            })
            return
          }
        }

        if (this.url == '') {
          this.$notify({
            title: '提示',
            duration: 1800,
            message: '请输入路由',
            type: 'warning'
          })
          return
        }
        if (this.image_url == '') {
          this.$notify({
            title: '提示',
            duration: 1800,
            message: '请上传图片',
            type: 'warning'
          })
          return
        }

        this.$http({
          url: this.$http.adornUrl2('/activity/save'),
          method: 'post',
          data: this.$http.adornData({
            'state': this.nav,
            'url': this.url,
            'title': this.title,
            'image_url': this.image_url,
            'type': this.type,
            'sort': this.sort,
            'backgroundImage':this.backgroundImage
          })
        }).then(({
          data
        }) => {
          this.dialogFormVisible9 = false
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.url = ''
              this.title = ''
              this.image_url = ''
              this.homeSelect()
            }
          })
        })
      },
      // 删除导航
      navdeletes(row) {
        this.$confirm(`确定删除此条信息?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl2(`/activity/delete/${row.id}`),
            method: 'post',
            data: this.$http.adornData({})
          }).then(({
            data
          }) => {
            this.$message({
              message: '删除成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.homeSelect()
              }
            })
          })
        }).catch(() => {})
      },
      // 添加
      addNoticelun() {
        this.dialogFormVisible6 = true
      },
      // 添加轮播图
      releaslunNoticeTo() {
        if (this.url == '') {
          this.$notify({
            title: '提示',
            duration: 1800,
            message: '链接不能为空',
            type: 'warning'
          })
          return
        }
        if (this.image_url == '') {
          this.$notify({
            title: '提示',
            duration: 1800,
            message: '图片不能为空',
            type: 'warning'
          })
          return
        }
        this.$http({
          url: this.$http.adornUrl2(`/banner/update/-1?url=${this.url}&image=${this.image_url}&type=${this.type}`),
          method: 'post',
          data: this.$http.adornData({})
        }).then(({
          data
        }) => {
          this.dialogFormVisible6 = false
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.bannerSelect()
              this.url = ''
              this.image_url = ''
            }
          })
        })
      },
      // 编辑弹框
      compilelun(item) {
        this.dialogFormVisible7 = true
        this.form1.url = item.url
        this.form1.image_url = item.image_url
        this.form1.id = item.id
      },
      // 编辑轮播
      upgradbianTo() {

        if (this.form1.url == '') {
          this.$notify({
            title: '提示',
            duration: 1800,
            message: '链接不能为空',
            type: 'warning'
          })
          return
        }
        if (this.form1.image_url == '') {
          this.$notify({
            title: '提示',
            duration: 1800,
            message: '图片不能为空',
            type: 'warning'
          })
          return
        }
        this.$http({
          url: this.$http.adornUrl2(
            `/banner/update/${this.form1.id}?url=${this.form1.url}&image=${this.form1.image_url}&type=${this.type}`
            ),
          method: 'post',
          data: this.$http.adornData({})
        }).then(({
          data
        }) => {
          this.dialogFormVisible7 = false
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.bannerSelect()
            }
          })
        })
      },
      // 编辑背景图弹框
      compilelun2(item) {
        this.dialogFormVisible8 = true
        this.form1.url = item.url
        this.form1.image_url = item.image_url
        this.form1.id = item.id
      },
      // 编辑轮播
      upgradbianTo2() {
        this.$http({
          url: this.$http.adornUrl2(
            `/banner/update/${this.form1.id}?url=${this.form1.url}&image=${this.form1.image_url}`),
          method: 'post',
          data: this.$http.adornData({})
        }).then(({
          data
        }) => {
          this.dialogFormVisible8 = false
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.bannerSelect()
            }
          })
        })
      },
      // 删除轮播
      deleteslun(id) {
        this.id = id
        this.$confirm(`确定删除此条信息?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl2(`/banner/delete/${this.id}`),
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
                this.name = ''
                this.bannerSelect()
              }
            })
          })
        }).catch(() => {})
      },
      //轮播数据
      bannerSelect() {
        this.$http({
          url: this.$http.adornUrl2(`/banner/user/list/${this.type}`),
          method: 'get',
          data: this.$http.adornParams({})
        }).then(({
          data
        }) => {
          let returnData = data.data
          this.bannerData = returnData
        })
      },
      // 添加公告弹框
      addNotice() {
        this.dialogFormVisible = true
      },
      // 添加公告
      releasgongaoTo() {
        if (this.title == '') {
          this.$notify({
            title: '提示',
            duration: 1800,
            message: '请输入公告标题',
            type: 'warning'
          })
          return
        }
        if (this.url == '') {
          this.$notify({
            title: '提示',
            duration: 1800,
            message: '请输入公告链接',
            type: 'warning'
          })
          return
        }
        if (this.type == '') {
          this.$notify({
            title: '提示',
            duration: 1800,
            message: '请选择公告类型',
            type: 'warning'
          })
          return
        }
        this.$http({
          url: this.$http.adornUrl2('/message/add'),
          method: 'post',
          data: this.$http.adornData({
            'state': this.state,
            'url': this.url,
            'title': this.title,
            'type': this.type
          })
        }).then(({
          data
        }) => {
          this.dialogFormVisible = false
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.dataSelect()
            }
          })
        })
      },
      // 修改弹框
      updates(index, rows) {
        this.form.state = rows.state
        this.dialogFormVisible1 = true
        this.form.id = rows.id
        this.form.title = rows.title
        this.form.url = rows.url
        this.form.type = rows.type
      },
      // 修改商品类别
      amendNoticeTo() {
        if (this.form.title == '') {
          this.$notify({
            title: '提示',
            duration: 1800,
            message: '请输入公告标题',
            type: 'warning'
          })
          return
        }
        if (this.form.url == '') {
          this.$notify({
            title: '提示',
            duration: 1800,
            message: '请输入公告链接',
            type: 'warning'
          })
          return
        }
        if (this.form.type == '') {
          this.$notify({
            title: '提示',
            duration: 1800,
            message: '请选择公告类型',
            type: 'warning'
          })
          return
        }
        this.$http({
          url: this.$http.adornUrl2('/message/update'),
          method: 'post',
          data: this.$http.adornData({
            'id': this.form.id,
            'state': this.form.state,
            'title': this.form.title,
            'url': this.form.url,
            'type': this.form.type,
          })
        }).then(({
          data
        }) => {
          this.dialogFormVisible1 = false
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.dataSelect()
            }
          })
        })
      },
      // 删除公告
      deletes(row) {
        this.$confirm(`确定删除此条信息?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl2(`/message/delete/${row.id}`),
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
                this.name = ''
                this.dataSelect()
              }
            })
          })
        }).catch(() => {})
      },
      // 修改弹框
      compile(index, rows) {
        this.dialogFormVisible2 = true
        this.formcomp.id = rows.id
        this.formcomp.state = rows.state
        this.formcomp.title = rows.title
        this.formcomp.url = rows.url
        this.formcomp.image_url = rows.image_url
        this.formcomp.type = rows.type
        this.formcomp.sort = rows.sort
        this.formcomp.backgroundImage = rows.backgroundImage
      },
      // 修改商品类别
      compileNoticeTo() {
        if(this.nav!=13){
          if (this.formcomp.title == '') {
            this.$notify({
              title: '提示',
              duration: 1800,
              message: '请输入标题',
              type: 'warning'
            })
            return
          }
          if (this.formcomp.type == '') {
            this.$notify({
              title: '提示',
              duration: 1800,
              message: '请选择小程序是否显示',
              type: 'warning'
            })
            return
          }

        }

        if (this.formcomp.url == '') {
          this.$notify({
            title: '提示',
            duration: 1800,
            message: '请输入路由',
            type: 'warning'
          })
          return
        }
        if (this.formcomp.image_url == '') {
          this.$notify({
            title: '提示',
            duration: 1800,
            message: '请上传图片',
            type: 'warning'
          })
          return
        }

        this.$http({
          url: this.$http.adornUrl2(`/activity/update/${this.formcomp.id}`),
          method: 'post',
          data: this.$http.adornData({
            'id': this.formcomp.id,
            'state': this.formcomp.state,
            'title': this.formcomp.title,
            'url': this.formcomp.url,
            'image_url': this.formcomp.image_url,
            'type': this.formcomp.type,
            'sort': this.formcomp.sort,
            'backgroundImage':this.formcomp.backgroundImage
          })
        }).then(({
          data
        }) => {
          this.dialogFormVisible2 = false
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.homeSelect()
            }
          })
        })
      },
      // 添加升级弹框
      addUpgrade() {
        this.dialogFormVisible3 = true
      },
      // 添加升级
      upgradaddTo() {
        if (this.wgtUrl == '') {
          this.$notify({
            title: '提示',
            duration: 1800,
            message: '请输入统一地址',
            type: 'warning'
          })
          return
        }
        if (this.androidWgtUrl == '') {
          this.$notify({
            title: '提示',
            duration: 1800,
            message: '请输入安卓地址',
            type: 'warning'
          })
          return
        }
        if (this.iosWgtUrl == '') {
          this.$notify({
            title: '提示',
            duration: 1800,
            message: '请输入苹果地址',
            type: 'warning'
          })
          return
        }

        if (this.version == '') {
          this.$notify({
            title: '提示',
            duration: 1800,
            message: '请输入安卓版本号',
            type: 'warning'
          })
          return
        }
        if (this.iosVersion == '') {
          this.$notify({
            title: '提示',
            duration: 1800,
            message: '请输入ios版本号',
            type: 'warning'
          })
          return
        }
        if (this.method == '') {
          this.$notify({
            title: '提示',
            duration: 1800,
            message: '请选择升级方式',
            type: 'warning'
          })
          return
        }
        if (this.des == '') {
          this.$notify({
            title: '提示',
            duration: 1800,
            message: '请输入升级内容',
            type: 'warning'
          })
          return
        }
        this.$http({
          url: this.$http.adornUrl2('/appinfo/save'),
          method: 'post',
          data: this.$http.adornData({
            'androidWgtUrl': this.androidWgtUrl,
            'iosWgtUrl': this.iosWgtUrl,
            'wgtUrl': this.wgtUrl,
            'version': this.version,
            'iosVersion': this.iosVersion,
            'method': this.method,
            'des': this.des
          })
        }).then(({
          data
        }) => {
          this.dialogFormVisible3 = false
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.wgtUrl = ''
              this.iosWgtUrl = ''
              this.androidWgtUrl = ''
              this.version = ''
              this.iosVersion = ''
              this.des = ''
              this.upgradeSelect()
            }
          })
        })
      },
      // 修改升级弹框
      upgradebj(index, rows) {
        this.dialogFormVisible4 = true
        this.formupgrad.androidWgtUrl = rows.androidWgtUrl
        this.formupgrad.id = rows.id
        this.formupgrad.iosWgtUrl = rows.iosWgtUrl
        this.formupgrad.wgtUrl = rows.wgtUrl
        this.formupgrad.version = rows.version
        this.formupgrad.iosVersion = rows.iosVersion
        this.formupgrad.des = rows.des
        this.formupgrad.method = rows.method
      },
      // 修改升级
      upgradbjTo() {
        if (this.formupgrad.wgtUrl == '') {
          this.$notify({
            title: '提示',
            duration: 1800,
            message: '请输入统一地址',
            type: 'warning'
          })
          return
        }
        if (this.formupgrad.androidWgtUrl == '') {
          this.$notify({
            title: '提示',
            duration: 1800,
            message: '请输入安卓地址',
            type: 'warning'
          })
          return
        }
        if (this.formupgrad.iosWgtUrl == '') {
          this.$notify({
            title: '提示',
            duration: 1800,
            message: '请输入苹果地址',
            type: 'warning'
          })
          return
        }

        if (this.formupgrad.version == '') {
          this.$notify({
            title: '提示',
            duration: 1800,
            message: '请输入安卓版本号',
            type: 'warning'
          })
          return
        }
        if (this.formupgrad.iosVersion == '') {
          this.$notify({
            title: '提示',
            duration: 1800,
            message: '请输入ios版本号',
            type: 'warning'
          })
          return
        }
        if (this.formupgrad.method == '') {
          this.$notify({
            title: '提示',
            duration: 1800,
            message: '请选择升级方式',
            type: 'warning'
          })
          return
        }
        if (this.formupgrad.des == '') {
          this.$notify({
            title: '提示',
            duration: 1800,
            message: '请输入升级内容',
            type: 'warning'
          })
          return
        }
        this.$http({
          url: this.$http.adornUrl2('/appinfo/save'),
          method: 'post',
          data: this.$http.adornData({
            'id': this.formupgrad.id,
            'androidWgtUrl': this.formupgrad.androidWgtUrl,
            'iosWgtUrl': this.formupgrad.iosWgtUrl,
            'wgtUrl': this.formupgrad.wgtUrl,
            'version': this.formupgrad.version,
            'iosVersion': this.formupgrad.iosVersion,
            'des': this.formupgrad.des,
            'method': this.formupgrad.method,
          })
        }).then(({
          data
        }) => {
          this.dialogFormVisible4 = false
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.upgradeSelect()
            }
          })
        })
      },
      // 删除升级
      upgradelete(row) {
        let delid = row.id
        this.id = delid
        this.$confirm(`确定删除此条信息?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl2(`/appinfo/delete/${this.id}`),
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
                this.name = ''
                this.upgradeSelect()
              }
            })
          })
        }).catch(() => {})
      },
      //添加精选商品
      choiaddNotice() {
        this.dialogFormVisible5 = true
      },
      // 添加商品
      releasNoticeTo(row) {
        this.$http({
          url: this.$http.adornUrl2('/commodity/save'),
          method: 'post',
          data: this.$http.adornData({
            'activityid': row.activityid,
            'couponendtime': row.couponendtime,
            'couponmoney': row.couponmoney,
            'couponstarttime': row.couponstarttime,
            'couponurl': row.couponurl,
            'deposit': row.deposit,
            'deposit_deduct': row.deposit_deduct,
            'item_from': row.item_from,
            'itemdesc': row.itemdesc,
            'itemendprice': row.itemendprice,
            'itemid': row.itemid,
            'itempic': row.itempic,
            'itemprice': row.itemprice,
            'itemsale': row.itemsale,
            'itemshorttitle': row.itemshorttitle,
            'itemtitle': row.itemtitle,
            'presale_end_time': row.presale_end_time,
            'presale_start_time': row.presale_start_time,
            'presale_tail_end_time': row.presale_tail_end_time,
            'presale_tail_start_time': row.presale_tail_start_time,
            'sellernick': row.sellernick,
            'shopname': row.shopname,
            'shoptype': row.shoptype,
            'taobao_image': row.taobao_image,
            'tkrates': row.tkrates,
            'videoid': row.videoid,
          })
        }).then(({
          data
        }) => {
          if (data && data.status === 0) {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.choicenSelect()
                this.keyword = ''
              }
            })
          } else {
            this.$message.error(data.msg)
          }
        })
      },
      // 精选淘宝商品
      handpick() {
        this.tableDataLoading = true
        this.keyword = '网红'
        this.$http({
          url: this.$http.adornUrl4(
            `/supersearch/apikey/maxd/back/20/sort/2/keyword/${this.keyword}/is_coupon/1/tb_p/1/min_id/1`),
          method: 'get',
          params: this.$http.adornParams({})
        }).then(({
          data
        }) => {
          if (data && data.code === 1) {
            this.tableDataLoading = false
            this.keyword = ''
            let returnData = data.data
            this.choicenData2 = returnData
          }
        })
      },
      // 搜索
      shousuo() {
        this.tableDataLoading = true
        this.$http({
          url: this.$http.adornUrl4(
            `/supersearch/apikey/maxd/back/100/sort/2/keyword/${this.keyword}/is_coupon/1/tb_p/1/min_id/1`),
          method: 'get',
          params: this.$http.adornParams({})
        }).then(({
          data
        }) => {
          console.log(data)
          if (data && data.code === 1) {
            this.tableDataLoading = false
            let returnData = data.data
            this.choicenData2 = returnData
          }
        })
      },
      // 批量删除商品
      choideletes(id) {
        var ids = id ? [id] : this.checkBoxData.map(item => {
          return item.id
        })
        for (var i in ids) {
          this.$http({
            url: this.$http.adornUrl2(`/commodity/deleteById?id=${ids[i]}`),
            method: 'post',
            data: this.$http.adornData({})
          }).then(({
            data
          }) => {
            this.$message({
              message: '批量删除成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.choicenSelect()
              }
            })
          })
        }
      },
      // 删除商品
      choidelete(row) {
        let delid = row.id
        this.$confirm(`确定删除此条信息?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl2(`/commodity/deleteById/?id=${delid}`),
            method: 'post',
            params: this.$http.adornData({})
          }).then(({
            data
          }) => {
            this.$message({
              message: '删除成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.choicenSelect()
              }
            })
          })
        }).catch(() => {})
      },
      // 获取数据列表
      dataSelect() {
        this.tableDataLoading = true
        this.$http({
          url: this.$http.adornUrl2(`/message/page/${this.state}/${this.page - 1}/${this.size}`),
          method: 'get',
          params: this.$http.adornParams({})
        }).then(({
          data
        }) => {
          this.tableDataLoading = false
          let returnData = data.data
          this.tableData = returnData
        })
      },
      // 获取首页数据列表
      homeSelect() {
        this.tableDataLoading = true
        this.$http({
          url: this.$http.adornUrl2(
            `/activity/state/${this.nav}?page=${this.page-1}&size=${this.size}&type=${this.types1}`),
          method: 'get',
          params: this.$http.adornParams({})
        }).then(({
          data
        }) => {
          this.tableDataLoading = false
          let returnData = data.data
          this.homeData = returnData
        })
      },
      // 升级配置数据列表
      upgradeSelect() {
        this.tableDataLoading = true
        this.$http({
          url: this.$http.adornUrl2('/appinfo/'),
          method: 'get',
          params: this.$http.adornParams({})
        }).then(({
          data
        }) => {
          this.tableDataLoading = false
          let returnData = data.data
          this.upgradeData = returnData
        })
      },
      // 精选商品列表
      choicenSelect() {
        let page = this.page - 1
        this.tableDataLoading = true
        this.$http({
          url: this.$http.adornUrl2('/commodity/selectCommodityList'),
          method: 'get',
          params: this.$http.adornParams({
            'page': page,
            'size': this.size
          })
        }).then(({
          data
        }) => {
          this.tableDataLoading = false
          let returnData = data.data
          this.choicenData = returnData
        })
      },
      // 修改小程序是否显示
      change(val, row) {
        this.$http({
          url: this.$http.adornUrl2(`/activity/update/${row.id}`),
          method: 'post',
          data: this.$http.adornData({
            'id': row.id,
            'state': row.state,
            'title': row.title,
            'url': row.url,
            'image_url': row.image_url,
            'type': row.type
          })
        }).then(({
          data
        }) => {
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.homeSelect()
            }
          })
        })
      },
      selectTrigger(type) {
        this.homeSelect()
      },
      paixu(row) {
        this.$http({
          url: this.$http.adornUrl2(`/activity/update/${row.id}`),
          method: 'post',
          data: this.$http.adornData({
            'id': row.id,
            'state': row.state,
            'title': row.title,
            'url': row.url,
            'image_url': row.image_url,
            'type': row.type,
            'sort': row.sort,
          })
        }).then(({
          data
        }) => {
          this.dialogFormVisible2 = false
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.homeSelect()
            }
          })
        })
      },
    },
    mounted() {
      this.homeSelect()
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
