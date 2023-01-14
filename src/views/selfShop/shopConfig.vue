<template>
  <el-tabs v-model = "activeName" @tab-click = "handleClick">
    <el-tab-pane label = "首页轮播" name = "first">
		<div style = "float: right;margin-right:2%;">
		  <el-button style = "margin: 10px 0;" :disabled = "!isAuth('shopConfig:add')" size = "mini" type = "primary" icon = "document"
                 @click = "advertNotice">添加轮播</el-button>
		</div>
		<el-table v-loading = "tableDataLoading" :data = "advertData">
		<el-table-column fixed prop = "id" label = "编号" width = "80">
		 </el-table-column>
		 <el-table-column prop = "imgUrl" label = "图片">
			<template slot-scope = "scope">
				<img :src = "scope.row.imgUrl" alt = "" width = "170px" height = "60">
			</template>
		  </el-table-column>
		  <el-table-column prop = "linkUrl" label = "跳转链接">
		   </el-table-column>
		  <el-table-column prop = "createAt" label = "创建时间">
		  </el-table-column>
		  <el-table-column fixed = "right" label = "操作" width = "150">
		    <template slot-scope = "scope">
		      <el-button size = "mini" type = "primary" :disabled = "!isAuth('shopConfig:update')"
                     @click = "advertUpdates(scope.$index, scope.row)">修改
		      </el-button>
		      <el-button size = "mini" type = "danger" :disabled = "!isAuth('shopConfig:delete')" @click = "advertdeletes(scope.row)">删除
		      </el-button>
		    </template>
		  </el-table-column>
		</el-table>
      <!-- 添加广告 -->
		<el-dialog title = "添加轮播" :visible.sync = "dialogFormVisible2" center>
			<div style = "margin-bottom: 10px;display: flex;">
				<span style = "width: 200px;display: inline-block;text-align: right;">图片地址：</span>
				<div style = " width:148px;height:148px;border: 1px dashed #c0ccda;border-radius: 6px;text-align: center;line-height: 148px;">
					<el-upload class = "avatar-uploader" v-model = "imgUrl" action = "https://sqx.gomyorder.cn/tao/alioss/upload"
                     :show-file-list = "false" :on-success = "handleAvatarSuccess1">
						<img v-if = "imgUrl" :src = "imgUrl" class = "avatar" style = "border-radius: 6px;width:148px;height: 148px;"/>
						<i v-else class = "el-icon-plus avatar-uploader-icon"></i>
					</el-upload>
				</div>
			</div>
			<div style = "margin-bottom: 10px;">
				<span style = "width: 200px;display: inline-block;text-align: right;">跳转地址：</span>
				<el-input style = "width:50%;" v-model = "linkUrl" placeholder = "请输入跳转地址"></el-input>
			</div>
		  <div slot = "footer" class = "dialog-footer">
		    <el-button @click = "dialogFormVisible2 = false">取 消</el-button>
		    <el-button type = "primary" @click = "advertNoticeTo()">确 定</el-button>
		  </div>
		</el-dialog>
      <!-- 修改广告 -->
		<el-dialog title = "修改轮播" :visible.sync = "dialogFormVisible" center>
			<el-form :model = "form2">
				<el-form-item label = "图片地址：" :label-width = "formLabelWidth">
				 <div style = " width:148px;height:148px;border: 1px dashed #c0ccda;border-radius: 6px;text-align: center;line-height:148px;">
					<el-upload class = "avatar-uploader" v-model = "imgUrl" action = "https://sqx.gomyorder.cn/tao/alioss/upload"
                     :show-file-list = "false" :on-success = "handleAvatarSuccess3">
						<img v-if = "form2.imgUrl" :src = "form2.imgUrl" class = "avatar" style = "border-radius: 6px;width:148px;height: 148px;"/>
						<i v-else class = "el-icon-plus avatar-uploader-icon"></i>
					</el-upload>
				 </div>
				</el-form-item>
			  <el-form-item label = "跳转地址：" :label-width = "formLabelWidth">
			    <el-input v-model = "form2.linkUrl" style = "width:65%;"></el-input>
			  </el-form-item>
			</el-form>
		  <div slot = "footer" class = "dialog-footer">
		    <el-button @click = "dialogFormVisible = false">取 消</el-button>
		    <el-button type = "primary" @click = "amendadvertTo()">确 定</el-button>
		  </div>
		</el-dialog>
	</el-tab-pane>
	<el-tab-pane label = "首页导航" name = "second">
		<div style = "float: right;margin-right:2%;">
			<el-button style = "margin: 10px 0;" :disabled = "!isAuth('shopConfig:add')" size = "mini" type = "primary" icon = "document"
                 @click = "addNavigation">添加导航</el-button>
		</div>
		<el-table v-loading = "tableDataLoading" :data = "homeData">
			<el-table-column fixed prop = "id" label = "编号" width = "80">
			 </el-table-column>
		 <el-table-column prop = "title" label = "名称">
		  </el-table-column>
		  <el-table-column prop = "url" label = "路由">
		   </el-table-column>
		   <el-table-column prop = "content" label = "图片">
			 <template slot-scope = "scope">
				<img :src = "scope.row.image_url" alt = "" width = "40" height = "40">
			 </template>
			</el-table-column>
		  <el-table-column prop = "createAt" label = "创建时间" width = "160">
		  </el-table-column>
		  <el-table-column label = "操作" width = "150">
			<template slot-scope = "scope">
			  <el-button size = "mini" type = "primary" :disabled = "!isAuth('shopConfig:update')" @click = "compile(scope.$index, scope.row)">编辑
			  </el-button>
			 <el-button size = "mini" type = "danger" :disabled = "!isAuth('shopConfig:delete')" @click = "navdeletes(scope.row)">删除
			  </el-button>
			</template>
		  </el-table-column>
		</el-table>
    </div>
    <!-- 添加导航弹框 -->
		<el-dialog title = "添加导航" :visible.sync = "dialogFormVisible7" center>
			<div style = "margin-bottom: 10px;">
				<span style = "width: 200px;display: inline-block;text-align: right;">标题：</span>
				<el-input style = "width:50%;" v-model = "title" placeholder = "请输入导航标题"></el-input>
			</div>
			<div style = "margin-bottom: 10px;">
				<span style = "width: 200px;display: inline-block;text-align: right;">路由：</span>
				<el-input style = "width: 50%;" v-model = "url" placeholder = "请输入导航路由"></el-input>
			</div>
			<div style = "margin-bottom: 10px;">
				<span style = "width: 200px;display: inline-block;text-align: right;">分类：</span>
				<el-select v-model = "state" placeholder = "请选择类型" style = "width:50%;">
				  <el-option v-for = "item in states" :key = "item.value" :label = "item.label" :value = "item.value">
				  </el-option>
				</el-select>
			</div>
			<div style = "display: flex;">
				<span style = "width: 200px;display: inline-block;text-align: right;">图片：</span>
				<div style = " width:148px;height:148px;border: 1px dashed #c0ccda;border-radius: 6px;text-align: center;line-height: 148px;">
					<el-upload class = "avatar-uploader" v-model = "image_url" action = "https://sqx.gomyorder.cn/tao/alioss/upload"
                     :show-file-list = "false" :on-success = "handleAvatarSuccess4">
						<img v-if = "image_url" :src = "image_url" class = "avatar" style = "border-radius: 6px;width: 86px;height: 86px;"/>
						<i v-else class = "el-icon-plus avatar-uploader-icon"></i>
					</el-upload>
				</div>
			</div>
			<div slot = "footer" class = "dialog-footer">
				<el-button @click = "dialogFormVisible7 = false">取 消</el-button>
				<el-button type = "primary" @click = "NagNoticeTo()">确 定</el-button>
			</div>
		</el-dialog>
    <!-- 首页编辑 -->
		<el-dialog title = "修改" :visible.sync = "dialogFormVisible1" center>
			<el-form :model = "form1">
			  <el-form-item label = "标题：" :label-width = "formLabelWidth">
				<el-input v-model = "form1.title" style = "width:65%;"></el-input>
			  </el-form-item>
			  <el-form-item label = "路由：" :label-width = "formLabelWidth">
				<el-input v-model = "form1.url" style = "width:65%;"></el-input>
			  </el-form-item>
			  <el-form-item label = "分类：" :label-width = "formLabelWidth">
			  	<el-select v-model = "form1.state" placeholder = "请选择类型" style = "width:65%;">
			  	  <el-option v-for = "item in states" :key = "item.value" :label = "item.label" :value = "item.value">
			  	  </el-option>
			  	</el-select>
			  </el-form-item>
			  <el-form-item label = "图片：" :label-width = "formLabelWidth">
			   <div style = " width:148px;height:148px;border: 1px dashed #c0ccda;border-radius: 6px;text-align: center;line-height: 148px;">
			   	<el-upload class = "avatar-uploader" v-model = "image_url" action = "https://sqx.gomyorder.cn/tao/alioss/upload"
                     :show-file-list = "false" :on-success = "handleAvatarSuccess2">
			   		<img v-if = "form1.image_url" :src = "form1.image_url" class = "avatar" style = "border-radius: 6px;width: 86px;height: 86px;"/>
			   		<i v-else class = "el-icon-plus avatar-uploader-icon"></i>
			   	</el-upload>
			   </div>
			  </el-form-item>
			</el-form>
		  <div slot = "footer" class = "dialog-footer">
			<el-button @click = "dialogFormVisible1 = false">取 消</el-button>
			<el-button type = "primary" @click = "compileNoticeTo()">确 定</el-button>
		  </div>
		</el-dialog>
	</el-tab-pane>
	<el-tab-pane label = "精选商品" name = "fifth">
		<div style = "float: right;margin-right:2%;">
			<el-button style = "margin: 10px 0;" :disabled = "!isAuth('shopConfig:add')" size = "mini" type = "primary" icon = "document"
                 @click = "choiaddNotice()">添加商品</el-button>
			<el-button style = "margin: 10px 0;" :disabled = "!isAuth('shopConfig:delete') || checkBoxData.length <= 0 " size = "mini"
                 type = "danger" icon = "document" @click = "choideletes()">批量删除</el-button>
		</div>
		<el-table v-loading = "tableDataLoading" @selection-change = "changeFun" :data = "choicenData.content">
		   <el-table-column type = "selection" fixed>
		   </el-table-column>
		<el-table-column fixed prop = "id" label = "编号" width = "80">
		 </el-table-column>
		<el-table-column fixed prop = "coverImg" label = "商品图片">
		<template slot-scope = "scope">
			<img :src = "scope.row.coverImg" alt = "" width = "60" height = "60">
		</template>
		 </el-table-column>

		 <el-table-column prop = "title" label = "商品标题" width = "200">
		  </el-table-column>
		  <el-table-column prop = "originalPrice" label = "商品原价">
		   <template slot-scope = "scope">
				<span style = "color: #f56c6c;">{{ scope.row.originalPrice | numFilter }}</span>
		   </template>
		   </el-table-column>
		  <el-table-column prop = "price" label = "商品价格">
		   <template slot-scope = "scope">
				<span style = "color: #f56c6c;">{{ scope.row.price | numFilter }}</span>
		   </template>
		   </el-table-column>
		 <el-table-column prop = "memberPrice" label = "会员价格">
		  <template slot-scope = "scope">
				<span style = "color: #f56c6c;">{{ scope.row.memberPrice | numFilter }}</span>
		  </template>
		  </el-table-column>
		  <el-table-column prop = "commissionPrice" label = "佣金">
		   </el-table-column>
		  <el-table-column prop = "sales" label = "商品销量">
		   </el-table-column>
		  <el-table-column prop = "createAt" label = "创建时间" width = "160">
		  </el-table-column>
		   <el-table-column fixed = "right" label = "操作" prop = "id" width = "120">
		     <template slot-scope = "scope">
				<el-button size = "mini" type = "danger" :disabled = "!isAuth('shopConfig:delete')" @click = "choidelete(scope.row)">删除
				</el-button>
		     </template>
		   </el-table-column>
		 </el-table>
		 <div style = "text-align: center;margin-top: 10px;float:right">
		   <el-pagination @size-change = "handleSizeChange3" @current-change = "handleCurrentChange3" :page-sizes = "[5, 10, 15, 20]"
                      :page-size = "size" :current-page = "page" layout = "total,sizes, prev, pager, next,jumper"
                      :total = "choicenData.totalElements">
		   </el-pagination>
		 </div>
    <!-- 添加弹框 -->
		 <el-dialog title = "添加商品" customClass = "customWidth" :visible.sync = "dialogFormVisible5" center>
		   <div style = "position: relative;display: inline-block;float: right;">
		 	  <el-input style = "width: 200px;" @keydown.enter.native = "shousuo" placeholder = "根据标题搜索商品" v-model = "title"></el-input>
		 	  <span @click = "shousuo" style = "position: absolute;right: 0;top:8px;">
          <icon-svg name = "shousuo" class = "site-sidebar__menu-icon"></icon-svg></span>
		   </div>
		 	<el-table v-loading = "tableDataLoading" height = "450" :data = "choicenData2.content">
			<el-table-column fixed prop = "id" label = "编号" width = "80">
			 </el-table-column>
			 <el-table-column fixed prop = "coverImg" label = "商品图片">
				<template slot-scope = "scope">
					<img :src = "scope.row.coverImg" alt = "" width = "60" height = "60">
				</template>
			  </el-table-column>
			  <el-table-column prop = "type.name" label = "商品类型">
			   </el-table-column>
			  <el-table-column prop = "title" label = "商品标题" width = "200">
			   </el-table-column>
				  <el-table-column prop = "originalPrice" label = "商品原价">
				   <template slot-scope = "scope">
						<span style = "color: #f56c6c;">{{ scope.row.originalPrice | numFilter }}</span>
				   </template>
				   </el-table-column>
				  <el-table-column prop = "price" label = "商品价格">
				   <template slot-scope = "scope">
						<span style = "color: #f56c6c;">{{ scope.row.price | numFilter }}</span>
				   </template>
				   </el-table-column>
				 <el-table-column prop = "memberPrice" label = "会员价格">
				  <template slot-scope = "scope">
						<span style = "color: #f56c6c;">{{ scope.row.memberPrice | numFilter }}</span>
				  </template>
				  </el-table-column>
				  <el-table-column prop = "commissionPrice" label = "佣金">
				   </el-table-column>
				  <el-table-column prop = "sales" label = "商品销量">
				   </el-table-column>
				  <el-table-column prop = "createAt" label = "创建时间" width = "160">
				  </el-table-column>
		 	  <el-table-column fixed = "right" label = "操作" prop = "id">
		 	    <template slot-scope = "scope">
		 			<el-button size = "mini" type = "primary" @click = "releasNoticeTo(scope.row)">添加
		 			</el-button>
		 	    </template>
		 	  </el-table-column>
		 	</el-table>
			<div style = "text-align: center;margin-top: 10px;">
			  <el-pagination @size-change = "handleSizeChange4" @current-change = "handleCurrentChange4" :page-sizes = "[5, 10, 15, 20]"
                       :page-size = "size" :current-page = "page" layout = "total,sizes, prev, pager, next,jumper"
                       :total = "choicenData2.totalElements">
			  </el-pagination>
			</div>
		 </el-dialog>
	</el-tab-pane>
	<el-tab-pane label = "每日推荐" name = "sixth">
		<div style = "float: right;margin-right:2%;">
			<el-button style = "margin: 10px 0;" :disabled = "!isAuth('shopConfig:add')" size = "mini" type = "primary" icon = "document"
                 @click = "recomNotice()">添加商品</el-button>
			<el-button style = "margin: 10px 0;" :disabled = "!isAuth('shopConfig:delete') || checkBoxData.length <= 0 " size = "mini"
                 type = "danger" icon = "document" @click = "recomdeletes()">批量删除</el-button>
		</div>
		<el-table v-loading = "tableDataLoading" @selection-change = "changeFun" :data = "recomData.content">
		   <el-table-column type = "selection" fixed>
		   </el-table-column>
		<el-table-column fixed prop = "id" label = "编号" width = "80">
		 </el-table-column>
		<el-table-column fixed prop = "coverImg" label = "商品图片">
		<template slot-scope = "scope">
			<img :src = "scope.row.coverImg" alt = "" width = "60" height = "60">
		</template>
		 </el-table-column>

		 <el-table-column prop = "title" label = "商品标题" width = "200">
		  </el-table-column>
		  <el-table-column prop = "originalPrice" label = "商品原价">
		   <template slot-scope = "scope">
				<span style = "color: #f56c6c;">{{ scope.row.originalPrice | numFilter }}</span>
		   </template>
		   </el-table-column>
		  <el-table-column prop = "price" label = "商品价格">
		   <template slot-scope = "scope">
				<span style = "color: #f56c6c;">{{ scope.row.price | numFilter }}</span>
		   </template>
		   </el-table-column>
		 <el-table-column prop = "memberPrice" label = "会员价格">
		  <template slot-scope = "scope">
				<span style = "color: #f56c6c;">{{ scope.row.memberPrice | numFilter }}</span>
		  </template>
		  </el-table-column>
		  <el-table-column prop = "commissionPrice" label = "佣金">
		   </el-table-column>
		  <el-table-column prop = "sales" label = "商品销量">
		   </el-table-column>
		  <el-table-column prop = "createAt" label = "创建时间" width = "160">
		  </el-table-column>
		   <el-table-column fixed = "right" label = "操作" prop = "id" width = "120">
		     <template slot-scope = "scope">
				<el-button size = "mini" type = "danger" :disabled = "!isAuth('shopConfig:delete')" @click = "recomdelete(scope.row)">删除
				</el-button>
		     </template>
		   </el-table-column>
		 </el-table>
		 <div style = "text-align: center;margin-top: 10px;float:right">
		   <el-pagination @size-change = "handleSizeChange5" @current-change = "handleCurrentChange5" :page-sizes = "[5, 10, 15, 20]"
                      :page-size = "size" :current-page = "page" layout = "total,sizes, prev, pager, next,jumper"
                      :total = "recomData.totalElements">
		   </el-pagination>
		 </div>
    <!-- 添加弹框 -->
		 <el-dialog title = "添加" customClass = "customWidth" :visible.sync = "dialogFormVisible6" center>
		   <div style = "position: relative;display: inline-block;float: right;">
		 	  <el-input style = "width: 200px;" @keydown.enter.native = "shousuo" placeholder = "根据标题搜索商品" v-model = "title"></el-input>
		 	  <span @click = "shousuo" style = "position: absolute;right: 0;top:8px;"><icon-svg name = "shousuo"
                                                                                          class = "site-sidebar__menu-icon"></icon-svg></span>
		   </div>
		 	<el-table v-loading = "tableDataLoading" height = "450" :data = "choicenData2.content">
			<el-table-column fixed prop = "id" label = "编号" width = "80">
			 </el-table-column>
			 <el-table-column fixed prop = "coverImg" label = "商品图片">
				<template slot-scope = "scope">
					<img :src = "scope.row.coverImg" alt = "" width = "60" height = "60">
				</template>
			  </el-table-column>
			  <el-table-column prop = "type.name" label = "商品类型">
			   </el-table-column>
			  <el-table-column prop = "title" label = "商品标题" width = "200">
			   </el-table-column>
				  <el-table-column prop = "originalPrice" label = "商品原价">
				   <template slot-scope = "scope">
						<span style = "color: #f56c6c;">{{ scope.row.originalPrice | numFilter }}</span>
				   </template>
				   </el-table-column>
				  <el-table-column prop = "price" label = "商品价格">
				   <template slot-scope = "scope">
						<span style = "color: #f56c6c;">{{ scope.row.price | numFilter }}</span>
				   </template>
				   </el-table-column>
				 <el-table-column prop = "memberPrice" label = "会员价格">
				  <template slot-scope = "scope">
						<span style = "color: #f56c6c;">{{ scope.row.memberPrice | numFilter }}</span>
				  </template>
				  </el-table-column>
				  <el-table-column prop = "commissionPrice" label = "佣金">
				   </el-table-column>
				  <el-table-column prop = "sales" label = "商品销量">
				   </el-table-column>
				  <el-table-column prop = "createAt" label = "创建时间" width = "160">
				  </el-table-column>
		 	  <el-table-column fixed = "right" label = "操作" prop = "id">
		 	    <template slot-scope = "scope">
		 			<el-button size = "mini" type = "primary" @click = "recomNoticeTo(scope.row)">添加
		 			</el-button>
		 	    </template>
		 	  </el-table-column>
		 	</el-table>
			<div style = "text-align: center;margin-top: 10px;">
			  <el-pagination @size-change = "handleSizeChange4" @current-change = "handleCurrentChange4" :page-sizes = "[5, 10, 15, 20]"
                       :page-size = "size" :current-page = "page" layout = "total,sizes, prev, pager, next,jumper"
                       :total = "choicenData2.totalElements">
			  </el-pagination>
			</div>
		 </el-dialog>
	</el-tab-pane>
  </el-tabs>
</template>

<script>
	export default {
    data () {
      return {
        size: 10,
        page: 1,
        id: '',
        img: '',
        title: '',
        type: '',
        sort: 'createAt',
        readonly: true,
        merchants: '',
        price: '',
        memberPrice: '',
        sales: 0,
        status: 0,
        status2: '',
        descrition: '',
        totalnum: 0,
        nav: '',
        imgUrl: '',
        linkUrl: '',
        image_url: '',
        url: '',
        checkBoxData: [],//多选框选择的值
        choicenData: [],
        choicenData2: [],
        recomData: [],
        recomData2: [],
        state: 1,
        states: [
          {
            value: '1',
            label: '首页导航'
          },
          {
            value: '2',
            label: '精选好物'
          },
          {
            value: '3',
            label: '热卖榜单'
          },
          {
            value: '4',
            label: '每日上新'
          },
          {
            value: '5',
            label: '拼团购'
          },
          {
            value: '6',
            label: '邀请图'
          },
          {
            value: '7',
            label: '首页邀请图'
          }
        ],
        form1: {
          id: '',
          image_url: '',
          title: '',
          url: '',
          state: '',
          createAt: ''
        },
        form2: {
          id: '',
          imgUrl: '',
          linkUrl: '',
          createAt: ''
        },
        statusmain: [
          {
            value: 0,
            label: '全部'
          },
          {
            value: 1,
            label: '上架'
          },
          {
            value: 2,
            label: '下架'
          }
        ],
        statusmain2: [
          {
            value: 1,
            label: '上架'
          },
          {
            value: 2,
            label: '下架'
          }
        ],
        formLabelWidth: '200px',
        activeName: 'first',
        tableDataLoading: false,
        dialogFormVisible1: false,
        dialogFormVisible: false,
        dialogFormVisible2: false,
        dialogFormVisible5: false,
        dialogFormVisible6: false,
        dialogFormVisible7: false,
        typeDatas: [],
        advertData: [],
        tableData: [],
        homeData: []
      }
    },
    filters: {
      numFilter (value) {
        let realVal = ''
        if (!isNaN(value) && value !== '') {
          // 截取当前数据到小数点后三位
          let tempVal = parseFloat(value).toFixed(3)
          realVal = tempVal.substring(0, tempVal.length - 1)
        } else {
          realVal = '--'
        }
        return realVal
      }
    },
    methods: {
      // 多选
      changeFun (val) {
        this.checkBoxData = val
      },
      handleAvatarSuccess (file) {
        this.img = file.data
      },
      handleAvatarSuccess2 (file) {
        this.form1.image_url = file.data
      },
      handleAvatarSuccess1 (file) {
        this.imgUrl = file.data
      },
      handleAvatarSuccess3 (file) {
        this.form2.imgUrl = file.data
      },
      handleAvatarSuccess4 (file) {
        this.image_url = file.data
      },
      handleSizeChange (val) {
        this.size = val
        this.dataSelect()
      },
      handleCurrentChange (val) {
        this.page = val
        this.dataSelect()
      },
      handleSizeChange1 (val) {
        this.size = val
        this.homeSelect()
      },
      handleCurrentChange1 (val) {
        this.page = val
        this.homeSelect()
      },
      handleSizeChange3 (val) {
        this.size = val
        this.choicenSelect()
      },
      handleCurrentChange3 (val) {
        this.page = val
        this.choicenSelect()
      },
      handleSizeChange4 (val) {
        this.size = val
        this.handpick()
      },
      handleCurrentChange4 (val) {
        this.page = val
        this.handpick()
      },
      handleSizeChange5 (val) {
        this.size = val
        this.recomSelect()
      },
      handleCurrentChange5 (val) {
        this.page = val
        this.recomSelect()
      },
      handleClick (tab, event) {
        if (tab._props.label == '首页轮播') {
          this.advertSelect()
        }
        if (tab._props.label == '首页导航') {
          this.state = ''
          this.homeSelect()
        }
        if (tab._props.label == '精选商品') {
          this.page = 1
          this.size = 10
          this.choicenSelect()
          this.handpick()
        }
        if (tab._props.label == '每日推荐') {
          this.page = 1
          this.size = 10
          this.recomSelect()
          this.handpick()
        }
      },
      // 添加首页导航弹框
      addNavigation () {
        this.dialogFormVisible7 = true
      },
      // 添加首页导航
      NagNoticeTo () {
        if (this.title == '') {
          this.$notify({
            title: '提示',
            duration: 1800,
            message: '请选择导航标题',
            type: 'warning'
          })
          return
        }
        if (this.url == '') {
          this.$notify({
            title: '提示',
            duration: 1800,
            message: '请选择导航路由',
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
          url: this.$http.adornUrl2('/selfActivity/save'),
          method: 'post',
          data: this.$http.adornData({
            'state': this.state,
            'url': this.url,
            'title': this.title,
            'image_url': this.image_url
          })
        }).then(({data}) => {
          this.dialogFormVisible7 = false
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
      // 添加广告弹框
      advertNotice () {
        this.dialogFormVisible2 = true
      },
      // 添加广告
      advertNoticeTo () {
        if (this.linkUrl == '') {
          this.$notify({
            title: '提示',
            duration: 1800,
            message: '请输入跳转链接',
            type: 'warning'
          })
          return
        }
        if (this.imgUrl == '') {
          this.$notify({
            title: '提示',
            duration: 1800,
            message: '请上传图片',
            type: 'warning'
          })
          return
        }
        this.$http({
          url: this.$http.adornUrl2('/advert/save'),
          method: 'post',
          data: this.$http.adornData({
            'imgUrl': this.imgUrl,
            'linkUrl': this.linkUrl
          })
        }).then(({data}) => {
          this.dialogFormVisible2 = false
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.advertSelect()
            }
          })
        })
      },
      // 修改广告
      advertUpdates (index, rows) {
        this.dialogFormVisible = true
        this.form2.id = rows.id
        this.form2.imgUrl = rows.imgUrl
        this.form2.linkUrl = rows.linkUrl
        this.form2.createAt = rows.createAt
      },
      // 修改广告
      amendadvertTo () {
        this.$http({
          url: this.$http.adornUrl2('/advert/save'),
          method: 'post',
          data: this.$http.adornData({
            'id': this.form2.id,
            'imgUrl': this.form2.imgUrl,
            'linkUrl': this.form2.linkUrl,
            'createAt': this.form2.createAt
          })
        }).then(({data}) => {
          this.dialogFormVisible = false
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.advertSelect()
            }
          })
        })
      },
      // 删除广告
      advertdeletes (row) {
        this.$confirm(`确定删除此条信息?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl2('/advert/delete'),
            method: 'get',
            params: this.$http.adornParams({
              'id': row.id
            })
          }).then(({data}) => {
            this.$message({
              message: '删除成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.advertSelect()
              }
            })
          })
        }).catch(() => {
        })
      },
      // 删除导航
      navdeletes (row) {
        this.$confirm(`确定删除此条信息?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl2('/selfActivity/delete'),
            method: 'get',
            params: this.$http.adornParams({
              'id': row.id
            })
          }).then(({data}) => {
            this.$message({
              message: '删除成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.homeSelect()
              }
            })
          })
        }).catch(() => {
        })
      },
      // 编辑弹框
      compile (index, rows) {
        this.dialogFormVisible1 = true
        this.form1.url = rows.url
        this.form1.image_url = rows.image_url
        this.form1.id = rows.id
        this.form1.state = rows.state
        this.form1.createAt = rows.createAt
        this.form1.title = rows.title
      },
      // 修改商品类别
      compileNoticeTo () {
        this.$http({
          url: this.$http.adornUrl2('/selfActivity/update'),
          method: 'post',
          data: this.$http.adornData({
            'id': this.form1.id,
            'state': this.form1.state,
            'title': this.form1.title,
            'url': this.form1.url,
            'image_url': this.form1.image_url,
          })
        }).then(({data}) => {
          this.dialogFormVisible1 = false
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

      //添加精选商品
      choiaddNotice () {
        this.dialogFormVisible5 = true
      },
      // 添加商品
      releasNoticeTo (row) {
        this.$http({
          url: this.$http.adornUrl2('/goods/addSelectGoods'),
          method: 'get',
          params: this.$http.adornParams({
            'id': row.id,
          })
        }).then(({data}) => {
          if (data && data.status === 0) {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.choicenSelect()
              }
            })
          } else {
            this.$message.error(data.msg)
          }
        })
      },
      // 精选淘宝商品
      handpick () {
        let page = this.page - 1
        this.tableDataLoading = true
        this.$http({
          url: this.$http.adornUrl2('/goods/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': page,
            'size': this.size,
            'title': this.title,
            'type': this.type,
            'status': this.status
          })
        }).then(({data}) => {
          if (data && data.status === 0) {
            this.tableDataLoading = false
            let returnData = data.data
            this.choicenData2 = returnData
          }
        })
      },
      // 搜索
      shousuo () {
        let page = this.page - 1
        this.tableDataLoading = true
        this.$http({
          url: this.$http.adornUrl2('/goods/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': page,
            'size': this.size,
            'title': this.title,
            'type': this.type,
            'status': this.status
          })
        }).then(({data}) => {
          if (data && data.status === 0) {
            this.tableDataLoading = false
            let returnData = data.data
            this.choicenData2 = returnData
          }
        })
      },
      // 批量删除商品
      choideletes (id) {
        var ids = id ? [id] : this.checkBoxData.map(item => {
          return item.id
        })
        for (var i in ids) {
          this.$http({
            url: this.$http.adornUrl2('/goods/deleteSelectGoods'),
            method: 'get',
            params: this.$http.adornParams({
              'ids': ids[i]
            })
          }).then(({data}) => {

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
      choidelete (row) {
        let delid = row.id
        this.$confirm(`确定删除此条信息?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl2('/goods/deleteSelectGoods'),
            method: 'get',
            params: this.$http.adornParams({
              'ids': delid
            })
          }).then(({data}) => {
            this.$message({
              message: '删除成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.choicenSelect()
              }
            })
          })
        }).catch(() => {
        })
      },
      // 精选商品列表
      choicenSelect () {
        let page = this.page - 1
        this.tableDataLoading = true
        this.$http({
          url: this.$http.adornUrl2('/goods/selectGoods'),
          method: 'get',
          params: this.$http.adornParams({
            'page': page,
            'size': this.size,
            'sort': this.sort
          })
        }).then(({data}) => {
          this.tableDataLoading = false
          let returnData = data.data
          this.choicenData = returnData
        })
      },
      // 每日推荐列表
      recomSelect () {
        let page = this.page - 1
        this.tableDataLoading = true
        this.$http({
          url: this.$http.adornUrl2('/goods/recommend'),
          method: 'get',
          params: this.$http.adornParams({
            'page': page,
            'size': this.size,
            'sort': this.sort
          })
        }).then(({data}) => {
          this.tableDataLoading = false
          let returnData = data.data
          this.recomData = returnData
        })
      },
      //添加每日推荐
      recomNotice () {
        this.dialogFormVisible6 = true
      },
      // 添加每日推荐
      recomNoticeTo (row) {
        this.$http({
          url: this.$http.adornUrl2('/goods/addRecommend'),
          method: 'get',
          params: this.$http.adornParams({
            'id': row.id,
          })
        }).then(({data}) => {
          if (data && data.status === 0) {
            this.recomSelect()
            this.handpick()
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.choicenSelect()
              }
            })
          } else {
            this.$message.error(data.msg)
          }
        })
      },
      // 批量删除每日推荐商品
      recomdeletes (id) {
        var ids = id ? [id] : this.checkBoxData.map(item => {
          return item.id
        })
        for (var i in ids) {
          this.$http({
            url: this.$http.adornUrl2('/goods/deleteRecommend'),
            method: 'get',
            params: this.$http.adornParams({
              'ids': ids[i]
            })
          }).then(({data}) => {
            this.recomSelect()
            this.handpick()
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
      // 删除每日推荐商品
      recomdelete (row) {
        let delid = row.id
        this.$confirm(`确定删除此条信息?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl2('/goods/deleteRecommend'),
            method: 'get',
            params: this.$http.adornParams({
              'ids': delid
            })
          }).then(({data}) => {
            this.recomSelect()
            this.handpick()
            this.$message({
              message: '删除成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.choicenSelect()
              }
            })
          })
        }).catch(() => {
        })
      },
      // 获取首页导航列表
      homeSelect () {
        this.tableDataLoading = true
        this.$http({
          url: this.$http.adornUrl2(`/selfActivity/list?state=${this.state}`),
          method: 'get',
          params: this.$http.adornParams({})
        }).then(({data}) => {
          this.tableDataLoading = false
          let returnData = data.data
          this.homeData = returnData
        })
      },
      // 获取广告位数据
      advertSelect () {
        this.tableDataLoading = true
        this.$http({
          url: this.$http.adornUrl2('/advert/list'),
          method: 'get',
          params: this.$http.adornParams({})
        }).then(({data}) => {
          this.tableDataLoading = false
          let returnData = data.data
          this.advertData = returnData
        })
      },
    },
    mounted () {
      this.advertSelect()
    }
  }
</script>

<style>
	.customWidth {
    width: 80% !important;
  }
  .el-input--medium .el-input__inner{
    padding: 0 24px 0 15px;
  }
</style>
