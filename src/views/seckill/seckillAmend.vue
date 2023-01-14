<template>
  <div class="components-container main-cont">
	  <div style="display: inline-block;font-size:18px;margin-bottom: 15px;">
	    <a href="#" @click="prev" style="text-decoration:none;font-size: 14px;">
	      <icon-svg name="jiantou" style="width: 1.2em;height: 1.2em;position: relative;top: 0.3em;"></icon-svg>
	      返回
	    </a>
	    <span style="display: inline-block;margin: 0 15px;color: #D9D9D9;width: 0px;">|</span>
	    <span>修改秒杀商品</span>
	  </div>
    <div style="position: relative;">
      <!-- <div style="display: flex;align-items: center;margin: 2% 0;">
        <span style="display: inline-block;text-align: right;">选择商品：</span>
        <div style=" width:148px;height:148px;font-size: 28px;background-color: #fbfdff; border: 1px dashed #c0ccda;border-radius: 6px;text-align: center;line-height: 148px;cursor: pointer;" @click="shopClick()">
             <img v-if="coverImg" :src="coverImg" class="avatar" style="width: 140px;height: 140px;"/>
              <i v-else class="el-icon-plus avatar-uploader-icon" style="font-size: 28px;color: #8c939d"></i>
        </div>
      </div> -->
      <el-row>
        <el-col :span="24" >
          <span>秒杀商品名称：</span>
          <el-input style="width: 200px;" class="margin15" placeholder="请输入秒杀商品名称" v-model="title" autosize></el-input>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" >
          <span>秒杀商品价格：</span>
          <el-input style="width: 200px;" class="margin15" placeholder="请输入秒杀商品价格" v-model="price" autosize></el-input>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" >
          <span>秒杀会员价格：</span>
          <el-input style="width: 200px;" class="margin15" placeholder="请输入秒杀会员价格" v-model="memberPrice" autosize></el-input>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" >
          <span>秒杀商品佣金：</span>
          <el-input style="width:200px;" class="margin15" placeholder="例0.1 等于10%" type="number" :min="0" :controls="false" v-model="commissionPrice" autosize></el-input>
        </el-col>
      </el-row>
      <el-row style="margin-top: 20px;">
        <el-col :span="24" >
          <span>秒杀开始时间：</span>
          <el-date-picker
            style="width:200px;"
             v-model="startTime"
             align="right"
             type="datetime"
             format="yyyy-MM-dd"
             value-format="yyyy-MM-dd"
             placeholder="选择开始时间"
             >
           </el-date-picker>
        </el-col>
      </el-row>
      <el-row style="margin-top: 20px;">
        <el-col :span="24" >
          <span>秒杀结束时间：</span>
          <el-date-picker
            style="width:200px;"
             v-model="endTime"
             align="right"
             type="datetime"
             format="yyyy-MM-dd"
             value-format="yyyy-MM-dd"
             placeholder="选择结束时间"
             >
           </el-date-picker>
        </el-col>
      </el-row>
      <el-row style="margin-top: 20px;">
        <el-col :span="24" >
          <span>开始时间：</span>
          <el-select v-model="secKillTimeId" placeholder="请选择类型" style="width:200px;">
            <el-option v-for="item in secKillTimeIds" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-col>
      </el-row>
      <div style="display: flex;align-items: center;margin: 2% 0;">
        <span style="display: inline-block;text-align: right;">活动状态：</span>
        <el-radio-group v-model="status">
            <el-radio :label="1">开启</el-radio>
            <el-radio :label="2">关闭</el-radio>
        </el-radio-group>
      </div>
      <el-row>
        <el-col :span="24" >
          <span>限购：</span>
          <el-input style="width: 200px;" type="number" class="margin15" :min="1"  v-model="number" autosize></el-input>
        </el-col>
      </el-row>
      <div style="display: flex;align-items: center;margin: 2% 0;">
        <span style="display: inline-block;text-align: right;">商品封面图：</span>
        <div style=" width:148px;height:148px;background-color: #fbfdff; border: 1px dashed #c0ccda;border-radius: 6px;text-align: center;line-height: 148px;">
          <el-upload
            class="avatar-uploader"
            v-model="coverImg"
            action="https://sqx.gomyorder.cn/tao/alioss/upload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess1"
            >
            <img v-if="coverImg" :src="coverImg" class="avatar" style="width: 140px;height: 140px;"/>
            <i v-else class="el-icon-plus avatar-uploader-icon" style="font-size: 28px;color: #8c939d"></i>
          </el-upload>
        </div>
      </div>
      <div style="display: flex;align-items: center;margin: 2% 0;flex-flow: wrap;">
      	<span style="display: inline-block;text-align: right;">商品轮播图：</span>
      	<div v-for="(item,index) of imgs">
      		 <div style="position: relative;margin: 5px;" >
      			<img  :src="item" class="avatar" style="width:140px;height: 140px;"/>
      			<div @click="clear(index)" class="divhove" >
      				<i class="el-icon-delete" style="margin: 0;font-size: 18px;color: #fff;"></i>
      			</div>
      		 </div>
      	 </div>
      	<div>
      		<el-upload
      		  action="https://sqx.gomyorder.cn/tao/alioss/upload"
      		  list-type="picture-card"
      		  :on-success="handleUploadSuccess"
      		  :on-change="handleChange"
      		  :on-remove="handleRemove">
      		  <i class="el-icon-plus"></i>
      		</el-upload>
      	</div>
      </div>
      <div style="display: flex;margin-top: 20px;" v-if="propshow">
        <span>商品属性：</span>
        <div class="property_table">
          <table style="width: 100%;">
            <tr style="display:flex;">
              <th style="width:82px;text-align: left;" v-for="item in headerData">{{item}}</th>
            </tr>
          </table>
          <el-table
            :data="valueData">
            <el-table-column
            v-if="detailJson.length == 1"
             prop="value0"
             width="80">
            </el-table-column>
            <el-table-column
            v-if="detailJson.length == 2"
             prop="value0"
             width="80">
            </el-table-column>
            <el-table-column
            v-if="detailJson.length == 2"
             prop="value1"
             width="80">
            </el-table-column>
            <el-table-column
            v-if="detailJson.length == 3"
             prop="value0"
             width="80">
            </el-table-column>
            <el-table-column
            v-if="detailJson.length == 3"
             prop="value1"
             width="80">
            </el-table-column>
            <el-table-column
            v-if="detailJson.length == 3"
             prop="value2"
             width="80">
            </el-table-column>
            <el-table-column
            v-if="detailJson.length == 4"
             prop="value0"
             width="80">
            </el-table-column>
            <el-table-column
            v-if="detailJson.length == 4"
             prop="value1"
             width="80">
            </el-table-column>
            <el-table-column
            v-if="detailJson.length == 4"
             prop="value2"
             width="80">
            </el-table-column>
            <el-table-column
            v-if="detailJson.length == 4"
             prop="value3"
             width="80">
            </el-table-column>
            <el-table-column
            v-if="detailJson.length == 5"
             prop="value0"
             width="80">
            </el-table-column>
            <el-table-column
            v-if="detailJson.length == 5"
             prop="value1"
             width="80">
            </el-table-column>
            <el-table-column
            v-if="detailJson.length == 5"
             prop="value2"
             width="80">
            </el-table-column>
            <el-table-column
            v-if="detailJson.length == 5"
             prop="value3"
             width="80">
            </el-table-column>
            <el-table-column
            v-if="detailJson.length == 5"
             prop="value4"
             width="80">
            </el-table-column>
            <el-table-column
            prop="skuImg"
            width="80">
            <template slot-scope="scope">
              <div class="imgWrap" style=" width:60px;height:60px;background-color: #fbfdff; border: 1px dashed #c0ccda;border-radius: 6px;text-align: center;line-height: 60px;">
                <el-upload
                  style="width: 60px;height: 60px;"
                  class="avatar-uploader"
                  v-model="scope.row.skuImg"
                  action="https://sqx.gomyorder.cn/tao/alioss/upload"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  >
                  <img v-if="scope.row.skuImg" :src="scope.row.skuImg" @click="curRowIndex=scope.$index" class="avatar" style="border-radius: 6px;width:60px;height: 60px;"/>
                  <i v-else class="el-icon-plus avatar-uploader-icon" @click="curRowIndex=scope.$index"></i>
                </el-upload>
              </div>
            </template>
            </el-table-column>
            <el-table-column
            prop="skuOriginalPrice"
            width="80">
            <template slot-scope="scope">
              <div>
                <el-input type="text" disabled v-model="scope.row.skuOriginalPrice"  style="width:60px;font-size:14px;">
                </el-input>
              </div>
            </template>
            </el-table-column>
            <el-table-column
            prop="skuPrice"
            width="80">
            <template slot-scope="scope">
              <div>
                <el-input type="text" disabled v-model="scope.row.skuPrice"  style="width:60px;font-size:14px;">
                </el-input>
              </div>
            </template>
            </el-table-column>
            <el-table-column
            prop="memberPrice"
            width="80">
            <template slot-scope="scope">
              <div>
                <el-input type="text" disabled v-model="scope.row.memberPrice"  style="width:60px;font-size:14px;">
                </el-input>
              </div>
            </template>
            </el-table-column>
            <el-table-column
            prop="stock"
            width="80">
            <template slot-scope="scope">
              <div>
                <el-input type="text" disabled v-model="scope.row.stock"  style="width:60px;font-size:14px;">
                </el-input>
              </div>
            </template>
            </el-table-column>
            <el-table-column
            prop="sales"
            width="80">
            <template slot-scope="scope">
              <div>
                <el-input type="text" disabled v-model="scope.row.sales"  style="width:60px;font-size:14px;">
                </el-input>
              </div>
            </template>
            </el-table-column>
            <el-table-column
            width="100">
            <template slot-scope="scope">
              <div>
                <el-input type="number" v-model="scope.row.secKillPrice" :min="0"  style="width:80px;font-size:14px;">
                </el-input>
              </div>
            </template>
            </el-table-column>
            <el-table-column
            width="100">
            <template slot-scope="scope">
              <div>
                <el-input type="number" v-model="scope.row.secKillStock" :min="1" :max="scope.row.stock" style="width:80px;font-size:14px;">
                </el-input>
              </div>
            </template>
            </el-table-column>
           <el-table-column
            width="80">
            <template slot-scope="scope">
              <div>
                <el-input type="text" v-model="scope.row.id" hidden style="width:60px;font-size:14px;">
                </el-input>
              </div>
            </template>
            </el-table-column>
            <el-table-column
             width="80">
             <template slot-scope="scope">
               <div>
                 <el-input type="text" v-model="scope.row.goodsId" hidden style="width:60px;font-size:14px;">
                 </el-input>
               </div>
             </template>
            </el-table-column>
            <el-table-column
              width="80">
              <template slot-scope="scope">
                <div>
                  <el-input type="text" v-model="scope.row.groupId" hidden style="width:60px;font-size:14px;">
                  </el-input>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              width="80">
              <template slot-scope="scope">
                <div>
                  <el-input type="text" v-model="scope.row.secKillId" hidden style="width:60px;font-size:14px;">
                  </el-input>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <div class="tinymce-content" style="display: flex;margin-top: 15px;">
      <div style="width:133px;text-align: right;">商品详情：</div>
      <textarea id="tinymceId" :value="descrition" class="tinymce-textarea"/>
    </div>
    <div style="text-align: center;margin-top:30px;">
      <el-button style='margin:0 20px 0 0;' size="mini" type="primary" icon="document" @click="prev">返回上一页
      </el-button>
      <el-button size="mini" type="primary" icon="document" @click="artiReleass">保存
      </el-button>
    </div>
    <!-- 选择商品弹框 -->
    <el-dialog title="商品列表" customClass="customWidth"  :visible.sync="dialogFormVisible" center>
      <div>
        <div style="margin:2% 0;display: inline-block;">
          <span>商品标题：</span>
          <el-input style="width: 150px;" @keydown.enter.native="select" clearable placeholder="请输入商品标题" v-model="title"></el-input>&nbsp;&nbsp;&nbsp;&nbsp;
        </div>
        <div style="display: inline-block;">
          <el-button style='margin-left:15px;' size="mini" type="primary" icon="document" @click="select">查询</el-button>
          <el-button style='margin-left:15px;' size="mini" type="primary" icon="document" @click="cleans">重置</el-button>
        </div>
        	<el-table
        	v-loading="tableDataLoading"
        	  :data="tableData.content">
        	<el-table-column
        	 prop="id"
        	 label="编号"
        	 width="80">
        	 </el-table-column>
        	 <el-table-column
        		prop="coverImg"
        		label="商品图片">
        		<template slot-scope="scope">
        			<img :src="scope.row.coverImg" alt="" width="60" height="60">
        		</template>
        	  </el-table-column>
        	  <el-table-column
        		 prop="title"
        		 label="商品标题"
      		 width="200">
        	   </el-table-column>
      		  <el-table-column
      		   prop="originalPrice"
      		   label="商品原价">
      		   </el-table-column>
        		  <el-table-column
        		   prop="price"
        		   label="商品价格">
        		   </el-table-column>
        		 <el-table-column
        		  prop="memberPrice"
        		  label="会员价格">
        		  </el-table-column>
        		  <el-table-column
        		    label="操作"
        			width="100">
        		    <template slot-scope="scope">
        		      <el-button
        		        size="mini"
        		        type="primary"
        		        @click="shopdeletes(scope.row)">选择
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
      </div>
    </el-dialog>
  </div>
</template>

<script>
    import load from './tinymce-components/dynamicLoadScript'
    import toolbar from './tinymce-components/toolbar'
    import plugins from './tinymce-components/plugins'

    const tinymceCDN = 'https://cdn.jsdelivr.net/npm/tinymce-all-in-one@4.9.3/tinymce.min.js'

    export default {
        name: 'Tinymce',
        data() {
            return {
                size:5,
                page:1,
                specif:'',
                typeId: '',
                title: '',
                price:'',
                hours:0,
                number:1,
                goodsId:'',
                memberPrice:'',
                createTime:'',
                secKillTimeId:'',
                secKillTimeIds:[],
                tableData:[],
                tableDataLoading:true,
                dialogFormVisible:false,
                positage:0,
                guige:0,
                skuImg:'',
                ruleId:'',
                postagePrice:0,
                priceshow:false,
                isshow:true,
                commissionPrice:'',
                buyReason:'',
                ruleshow:false,
                propshow:false,
                guigeshow:true,
                propshow1:false,
                ruleValue:[],
                attr:[],
                attrs:[],
                imgs:[],
                headerData:[],
                valueData:[],
                detailJson:[],
                inputValues:{
                  inputValue0:'',
                  inputValue1:'',
                  inputValue2:'',
                  inputValue3:'',
                  inputValue4:'',
                  inputValue5:''
                },
                sku:[],
                img:'',
                sales:'',
                status:0,
                photos:'',
                value:[],
                isSelect:1,
                homeGoods:1,
                isRecommend:1,
                isExpress:'',
                coverImg:'',
                valueData2:[],
                headerData2:[],
                startTime:'',
                endTime:'',
                attrName:'',
                ruleName:'',
                attrValue:[],
                releobject:{
                  value:'',
                  detail:''
                },
                dialogVisible: false,
                isShow: false,
                hideUpload: false,
                limit:1,
                id:'',
                hasChange: false,
                hasInit: false,
                tinymceId: 'tinymceId',
                height: 435,
                toolbar: [],
                menubar: 'file edit insert view format table',
                languageTypeList: {
                    'en': 'en',
                    'zh': 'zh_CN'
                },
                artiCletypes: [],
                // 富文本内容
                descrition: ''
            }
        },
        watch: {
            descrition(val) {
                if (!this.hasChange && this.hasInit) {
                    this.$nextTick(() => window.tinymce.get(this.tinymceId).setContent(val || ''))
                }
            }
        },
        methods: {
          // 图标上传
          handleAvatarSuccess(file) {
            if(this.curRowIndex == 0){
              this.skuImg = file.data;
              this.valueData[0].skuImg = this.skuImg
              return
            }else{
              this.skuImg = file.data;
              this.valueData[this.curRowIndex].skuImg = this.skuImg
            }
          },
          // 图标上传
          handleAvatarSuccess3(file) {
              this.skuImg = file.data;
              this.valueData2[0].skuImg = this.skuImg
          },
          handleSizeChange(val) {
          	this.size = val;
          	this.shopSelect()
          },
          handleCurrentChange(val) {
          	this.page = val;
          	this.shopSelect()
          },
           // 获取商品数据
           shopSelect () {
             let page = this.page-1
             this.title = ''
             this.tableDataLoading = true
             this.$http({
           	url: this.$http.adornUrl2('/goods/list'),
           	method: 'get',
           	params: this.$http.adornParams({
           		'page':page,
           		'size':this.size,
           		'title':this.title,
           		'type':this.typeId,
           		'status':this.status
           	})
             }).then(({data}) => {
           		this.tableDataLoading = false
           		let returnData = data.data;
           		this.tableData = returnData
           		this.totalnum = returnData.totalElements
             })
           },
          // 选择商品
          shopClick(){
            this.dialogFormVisible = true
            this.shopSelect()
          },
          //搜索
          select(){
             this.shopSelect()
          },
          // 重置
          cleans(){
          	this.title = ''
          	this.status = 0
          	this.typeId = ''
          	this.value = []
          	this.shopSelect()
          },
         // 选择商品
          shopdeletes(row){
            this.$http({
            	url: this.$http.adornUrl2('/goods/find'),
            	method: 'get',
            	params: this.$http.adornParams({
            		'id':row.id
            	})
            }).then(({data}) => {
              if(data.status == 0){
                this.dialogFormVisible = false
                let returnData = data.data;
                let imgs = returnData.img.split(',')
                this.title = returnData.title
                this.status = returnData.status
                this.originalPrice = returnData.originalPrice
                this.price = returnData.price
                this.memberPrice = returnData.memberPrice
                this.commissionPrice = returnData.commissionPrice
                this.descrition = returnData.descrition
                this.coverImg = returnData.coverImg
                this.imgs = imgs
                this.img = returnData.img
                this.goodsId = returnData.id
                this.attr = returnData.attr
                this.sku = returnData.sku
                if(this.attr.length>0){
                  this.duoguigeclect(returnData.id)
                }else{
                  this.guigeclect(returnData.id)
                }
              }

            })
          },
          // 删除
          clear(index) {
          	this.imgs.splice(index, 1);
           },
          // 回显规格
          guigeclect(id){
            this.$http({
              url: this.$http.adornUrl2('/selfSecKill/showSku'),
              method: 'get',
              params: this.$http.adornParams({
                'secKillId':id
              })
            }).then(({data}) => {
              let returnData = data.data;
              this.headerData = returnData.header
              this.valueData = returnData.value
              this.propshow = true
              this.sku = returnData.value
              this.detailJson = returnData.value[0].detailJson.split(',')
            })
          },
          // 时段
          timeSeclect(){
            this.$http({
              url: this.$http.adornUrl2('/selfSecKillTime/result'),
              method: 'get',
              params: this.$http.adornParams({})
            }).then(({data}) => {
              let returnData = data.data;
              this.secKillTimeIds = returnData
            })
          },
          handleChange1(value) {
            this.value.forEach(element => {
              this.typeId = element;
            });
          },
          handleChange(file, fileList){
            this.hideUpload = fileList.length >= this.limit;
          },
          handleRemove(file, fileList) {
            this.hideUpload = fileList.length >= this.limit;
          },
          handleAvatarSuccess1(file,fileList) {
            this.coverImg = file.data
          },
          //上传成功
          handleUploadSuccess(file,fileList) {
            this.photos+=file.data+','
          },
          // 返回上一级
          prev(){
            this.$router.back()
          },
            // 发布商品
            artiReleass(){
              let photost=this.photos+this.img;
              // photost = photost.substr(0,photost.length-1)
              if (this.title == '') {
                  this.$notify({
                      title: '提示',
                      duration: 1800,
                      message: '请输入活动标题',
                      type: 'warning'
                  });
                  return
              }
              if (this.startTime == '') {
                  this.$notify({
                      title: '提示',
                      duration: 1800,
                      message: '请选择秒杀开始时间',
                      type: 'warning'
                  });
                  return
              }
              if (this.endTime == '') {
                  this.$notify({
                      title: '提示',
                      duration: 1800,
                      message: '请选择拼秒杀团结束时间',
                      type: 'warning'
                  });
                  return
              }
              if (this.secKillTimeId == '') {
                  this.$notify({
                      title: '提示',
                      duration: 1800,
                      message: '请选择时间段',
                      type: 'warning'
                  });
                  return
              }
              this.$http({
                url: this.$http.adornUrl2('/selfSecKill/update'),
                method: 'post',
                data: this.$http.adornData({
                'img':photost,
                'title':this.title,
                'typeId':this.typeId,
                'merchants':this.merchants,
                'originalPrice':this.originalPrice,
                'price':this.price,
                'memberPrice':this.memberPrice,
                'sales':this.sales,
                'status':this.status,
                'secKillId':this.id,
                'startTime':this.startTime,
                'endTime':this.endTime,
                'secKillTimeId':this.secKillTimeId,
                'goodsId':this.goodsId,
                'number':this.number,
                'coverImg':this.coverImg,
                'descrition':this.descrition,
                'commissionPrice':this.commissionPrice,
                'isSelect':this.isSelect,
                'homeGoods':this.homeGoods,
                'buyReason':this.buyReason,
                'isRecommend':this.isRecommend,
                'isExpress':this.isExpress,
                'postagePrice':this.postagePrice,
                'sku':this.sku,
                'createTime':this.createTime
                })
              }).then(({data}) => {
                if(data.status==0){
                  this.$message({
                    message: '操作成功',
                    type: 'success',
                    duration: 1500,
                    onClose: () => {
                      this.$router.push({path: '/seckill'})
                    }
                  })
                }

              })
            },
            init() {
                load(tinymceCDN, (err) => {
                    if (err) {
                        this.$message.error(err.message)
                        return
                    }
                    this.initTinymce()
                })
                let id = this.$route.query.id
                  this.$http({
                    url: this.$http.adornUrl2('/selfSecKill/find'),
                    method: 'get',
                    params: this.$http.adornParams({
                      'id':id
                    })
                  }).then(({data}) => {
                    let returnData = data.data;
                    let imgs = returnData.img.split(',')
                    this.title = returnData.title
                    this.startTime = returnData.startTime
                    this.endTime = returnData.endTime
                    this.secKillTimeId = returnData.secKillTimeId
                    this.originalPrice = returnData.originalPrice
                    this.price = returnData.price
                    this.number = returnData.number
                    this.memberPrice = returnData.memberPrice
                    this.commissionPrice = returnData.commissionPrice
                    this.descrition = returnData.descrition
                    this.coverImg = returnData.coverImg
                    this.goodsId = returnData.goodsId
                    this.id = returnData.secKillId
                    this.imgs = imgs;
                    this.img = returnData.img
                    this.status = returnData.status;
                    this.createTime = returnData.createTime
                    console.log(returnData)
                    console.log(this.createTime)
                    this.sku = returnData.sku
                    this.guigeclect(returnData.secKillId)
                  })
            },

            initTinymce() {
                const _this = this
                window.tinymce.init({
                    selector: `#${this.tinymceId}`,
                    images_upload_handler: function (blobInfo, success, failure) {
                        var xhr, formData;

                        xhr = new XMLHttpRequest();
                        xhr.withCredentials = false;
                        xhr.open('POST', "https://sqx.gomyorder.cn/tao/alioss/upload");
                        xhr.onload = function () {
                            var json;

                            if (xhr.status != 200) {
                                failure('HTTP Error: ' + xhr.status);
                                return;
                            }
                            json =JSON.parse(xhr.responseText);
                            if (json == "" || json == null) {
                                failure('Invalid JSON: ' + xhr.responseText);
                                return;
                            }
                            success(json.data);
                        };
                        formData = new FormData();
                        formData.append('file', blobInfo.blob(), blobInfo.filename());
                        xhr.send(formData);
                    },
                    language: this.languageTypeList['zh'],
                    height: this.height,
                    body_class: 'panel-body ',
                    object_resizing: false,
                    toolbar: this.toolbar.length > 0 ? this.toolbar : toolbar,
                    plugins,
                    menubar: this.menubar,
                    end_container_on_empty_block: true,
                    powerpaste_word_import: 'clean',
                    code_dialog_height: 450,
                    code_dialog_width: 1000,
                    advlist_bullet_styles: 'square',
                    advlist_number_styles: 'default',
                    imagetools_cors_hosts: ['www.tinymce.com', 'codepen.io'],
                    default_link_target: '_blank',
                    link_title: false,
                    // Image
                    imagetools_toolbar: 'rotateleft rotateright | flipv fliph | editimage imageoptions',
                    nonbreaking_force_tab: true, // inserting nonbreaking space &nbsp; need Nonbreaking Space Plugin
                    init_instance_callback: editor => {
                        if (_this.descrition) {
                            editor.setContent(_this.descrition)
                        }
                        _this.hasInit = true
                        editor.on('NodeChange Change KeyUp SetContent', () => {
                            this.hasChange = true
                            this.descrition = editor.getContent()
                        })
                    },
                    setup(editor) {
                        editor.on('FullscreenStateChanged', (e) => {
                            _this.fullscreen = e.state
                        })
                    }
                })
            },
            destroyTinymce() {
                const tinymce = window.tinymce.get(this.tinymceId)
                if (this.fullscreen) {
                    tinymce.execCommand('mceFullScreen')
                }
                if (tinymce) {
                    tinymce.destroy()
                }
            },
            // 删除商品属性
            deleter(index){
              let length = this.sku.length
              if(length == 1){
                this.$message({
                    title: '提示',
                	type: 'error',
                    duration: 1800,
                    message: '属性至少要有一个',
                    type: 'warning'
                });
                return
              }else{
                this.sku.splice(index, 1);
              }
            }
        },
        mounted() {
            this.init()
            this.timeSeclect()
        },
        beforeDestroy() {
            this.destroyTinymce()
        },
        activated() {
            if (window.tinymce) {
                this.initTinymce()
            }
			this.init()
			this.timeSeclect()
        },
        deactivated() {
            this.destroyTinymce()
        }
    }
</script>

<style scoped="scoped">
  .main-cont {
    max-width: 100%;
    min-width: 80%;
	padding-bottom:5%;
	background-color: #fff;
  }
  .tinymce-container {
    position: relative;
    line-height: normal;
  }

  .tinymce-container >>> .mce-fullscreen {
    z-index: 10000;
  }

  .tinymce-textarea {
    visibility: hidden;
    z-index: -1;
  }
 .hide .el-upload--picture-card {
     display: none;
 }
 .main-cont span{
   display: inline-block;
   width: 120px;
   text-align: right;
 }
 .margin15{margin-right: 15px;margin-top: 10px;}
 .ruleitem {padding-left:10px;margin-top: 15px;}
 .ruleitem .ruleicon{position: relative;top: 3px; left:2px;width:1.2em;height:1.2em;}
 .el-tag + .el-tag {
     margin-left: 10px;
   }
   .button-new-tag{
     height: 32px;
     line-height: 31px;
     padding-top: 0;
     padding-bottom: 0;
 	border-radius: 4px;
 	border-top-left-radius: 0;
 	border-bottom-left-radius: 0;
 	background-color: #f5f7fa;
 	position: relative;
 	left: -5px;
 	border-color: #dcdfe6;
 	border: 1px solid #dcdfe6;
   }
   .input-new-tag {
     width: 90px;
     margin-left: 10px;
     vertical-align: bottom;
   }
   .el-input--small .el-input__inner{
 	  border-top-right-radius: 0;
 	  border-bottom-right-radius: 0;
    }
	.el-table--enable-row-transition .el-table__body td{
		text-align: center;
	}
	.imgWrap .avatar-uploader .el-upload{
		width: 60px;
	}
	.el-table .cell{
		text-align: center!important;
	}
	.el-tag--medium{margin-right: 10px;}
  .customWidth{
    width: 80%!important;
  }
  .divhove {
  	position: absolute;
  	width: 100%;
  	height: 100%;
  	left:0;
  	top: 0;
  	opacity: 0;
  	cursor: default;
  	text-align:center;
  	padding-top: 50%;
  border-radius: 6px;
  	background-color: rgba(0,0,0,.5);
  	-webkit-transition: opacity .3s;
  	transition: opacity .3s;
  }
  .el-tag--medium{margin-right: 10px;}
  .divhove:hover{opacity:0.8;}
</style>
