<template>
  <el-tabs v-model = "activeName" @tab-click = "handleClick">
    <el-tab-pane label = "派单管理" name = "first">
		<div style = "display: inline-block;float: right;">
			<el-select v-model = "state" style = "width:150px;margin-left: 10px;" @change = "animeDat(state)">
			  <el-option v-for = "item in states" :key = "item.value" :label = "item.label" :value = "item.value">
			  </el-option>
			</el-select>&nbsp;&nbsp;&nbsp;
      <!-- <div style="position: relative;display: inline-block;">
        <el-input style="width: 200px;" @keydown.enter.native="phoneSelect" placeholder="请输入手机号查询" v-model="phone"></el-input>&nbsp;&nbsp;
        <span style="position: absolute;right: 18px;top:8px;" @click="phoneSelect">
          <icon-svg name="shousuo"class="site-sidebar__menu-icon"></icon-svg>
        </span>
      </div> -->
			<el-button style = "margin-left:15px;" size = "mini" type = "primary" icon = "document" @click = "refresh">刷新</el-button>
			<el-button style = "margin-left:15px;" size = "mini" type = "primary" icon = "document" @click = "cleans">重置</el-button>
			<el-button :disabled = "checkBoxData.length <= 0 || !isAuth('taskList:pass')" style = "margin:0 0 20px 20px;" size = "mini"
                 type = "primary" icon = "document" @click = "passClick()">通过</el-button>
		</div>
		<el-table @selection-change = "changeFun" v-loading = "tableDataLoading" :data = "tableData.content">
			<el-table-column type = "selection" fixed>
			</el-table-column>
			<el-table-column fixed prop = "label" label = "图标">
			 <template slot-scope = "scope">
				 <img v-if = "scope.row.label==''" src = "~@/assets/img/avatar.png" alt = "" width = "40" height = "40">
				 <img v-else :src = "scope.row.label" alt = "" width = "40" height = "40">
			 </template>
			 </el-table-column>
			 <el-table-column fixed prop = "title" label = "名称">
				</el-table-column>
			<el-table-column prop = "content" label = "任务要求" width = "150">
			</el-table-column>
			<el-table-column prop = "verifyContent" label = "验证信息" width = "160">
			</el-table-column>
			<el-table-column prop = "openContent" label = "打开方式" width = "160">
			</el-table-column>
			<el-table-column prop = "taskOriginalPrice" label = "价格(原价)" width = "160">
			</el-table-column>
			<el-table-column prop = "taskPrice" label = "平台扣除费用后价格" width = "160">
			</el-table-column>
			<el-table-column prop = "taskNum" label = "数量" width = "160">
			</el-table-column>
			<el-table-column prop = "endNum" label = "接单数量" width = "160">
			</el-table-column>
			<el-table-column prop = "createTime" label = "发布时间" width = "160">
			</el-table-column>
			<el-table-column prop = "endTime" label = "截止时间" width = "160">
			</el-table-column>
			<el-table-column prop = "auditTime" label = "审核时间（分钟）" width = "160">
			</el-table-column>
			<el-table-column prop = "restrictTime" label = "任务限时（分钟）" width = "160">
			</el-table-column>
			<el-table-column fixed = "right" prop = "state" label = "状态" width = "100">
			<template slot-scope = "scope">
				<span style = "color: #4f9dec;" v-if = "scope.row.state === 0 ">待审核</span>
				<span style = "color: #4f9dec;" v-if = "scope.row.state === 1 ">审核成功</span>
				<span style = "color: #4f9dec;" v-if = "scope.row.state === 2 ">已拒绝</span>
				<span style = "color: #4f9dec;" v-if = "scope.row.state === 3 ">已结算</span>
			</template>
			</el-table-column>
			<el-table-column fixed = "right" label = "操作" width = "100">
				<template slot-scope = "scope">
					<el-button size = "mini" type = "primary" @click = "taskDetails(scope.row)">详情
					</el-button>
					<el-button size = "mini" type = "primary" @click = "check(scope.$index, scope.row)">查看
					</el-button>
					<el-button size = "mini" type = "primary" v-if = "scope.row.state == 0" :disabled = "!isAuth('taskList:refuse')"
                     @click = "refuseClick(scope.row)">拒绝
					</el-button>
					<el-button v-if = "scope.row.state == 0" size = "mini" type = "primary" :disabled = "!isAuth('taskList:pass')"
                     @click = "passClick2(scope.row)">通过
					</el-button>
				</template>
			</el-table-column>
		</el-table>
		<div style = "text-align: center;margin-top: 10px;">
			<el-pagination @size-change = "handleSizeChange" @current-change = "handleCurrentChange" :page-sizes = "[10, 20, 30, 40]"
                     :page-size = "size" :current-page = "page" layout = "total,sizes, prev, pager, next,jumper"
                     :total = "tableData.totalElements">
			</el-pagination>
		</div>
	</el-tab-pane>
	<el-tab-pane label = "接单管理" name = "fourthly">
		<div style = "display: inline-block;float: right;">
			<el-select v-model = "state" style = "width:150px;margin-left: 10px;" @change = "animeDat2(state)">
			  <el-option v-for = "item in taskstates" :key = "item.value" :label = "item.label" :value = "item.value">
			  </el-option>
			</el-select>&nbsp;&nbsp;&nbsp;
			<!-- <div style = "position: relative;display: inline-block;">
			  <el-input style = "width: 200px;" @keydown.enter.native = "phoneSelect2" placeholder = "请输入手机号查询" v-model = "phone"></el-input>&nbsp;&nbsp;
			  <span style = "position: absolute;right: 18px;top:8px;" @click = "phoneSelect2">
					<icon-svg name = "shousuo" class = "site-sidebar__menu-icon"></icon-svg>
				</span>
			</div> -->
			 <el-button style = "margin-left:15px;" size = "mini" type = "primary" icon = "document" @click = "cleans2">重置</el-button>
		</div>
		<el-table v-loading = "tableDataLoading" :data = "tableData2.content">
			 <el-table-column fixed prop = "nickName" label = "用户姓名" width = "150">
			 <template slot-scope = "scope">
			   <span style = "color: #4f9dec;cursor: pointer;"
               @click = "updates(scope.row)">{{ scope.row.nickName ? scope.row.nickName : '未绑定' }}</span>
			 </template>
			 </el-table-column>
			 <el-table-column
			 <el-table-column prop = "title" label = "标题">
			</el-table-column>
			<el-table-column prop = "content" label = "提交内容" width = "160">
			</el-table-column>
			<el-table-column prop = "taskOriginalPrice" label = "原价" width = "160">
			</el-table-column>
			<el-table-column prop = "money" label = "接单价格">
			</el-table-column>
			<el-table-column prop = "auditContent" label = "审核内容" width = "160">
			</el-table-column>
			<el-table-column label = "审核分类" width = "120">
			<template slot-scope = "scope">
				<span style = "color: #4f9dec;" v-if = "scope.row.category === 1 ">错误截图</span>
				<span style = "color: #4f9dec;" v-if = "scope.row.category === 2 ">伪造截图</span>
				<span v-else style = "color: #4f9dec;">正常</span>
			</template>
			</el-table-column>
			<el-table-column prop = "createTime" label = "创建时间" width = "160">
			</el-table-column>
			<el-table-column prop = "auditTime" label = "审核时间" width = "160">
			</el-table-column>
			<el-table-column fixed = "right" prop = "state" label = "状态" width = "100">
			<template slot-scope = "scope">
				<span style = "color: #4f9dec;" v-if = "scope.row.state === 0 ">接单成功</span>
				<span style = "color: #4f9dec;" v-if = "scope.row.state === 1 ">提交待审核</span>
				<span style = "color: #4f9dec;" v-if = "scope.row.state === 2 ">审核成功</span>
				<span style = "color: #4f9dec;" v-if = "scope.row.state === 3 ">已拒绝</span>
				<span style = "color: #4f9dec;" v-if = "scope.row.state === 4 ">已维权</span>
				<span style = "color: #4f9dec;" v-if = "scope.row.state === 5 ">已放弃</span>
			</template>
			</el-table-column>
			<el-table-column fixed = "right" label = "操作">
				<template slot-scope = "scope">
					<el-button size = "mini" type = "primary" @click = "taskDetails2(scope.$index, scope.row)">查看
					</el-button>
				</template>
			</el-table-column>
		</el-table>
		<div style = "text-align: center;margin-top: 10px;">
			<el-pagination @size-change = "handleSizeChange3" @current-change = "handleCurrentChange3" :page-sizes = "[10, 20, 30, 40]"
                     :page-size = "size" :current-page = "page" layout = "total,sizes, prev, pager, next,jumper"
                     :total = "tableData2.totalElements">
			</el-pagination>
		</div>
    <!-- 任务查看弹框 -->
		<el-dialog title = "查看" :visible.sync = "dialogFormVisible8" center>
		  <div v-for = "(item,index) in helpTaskData" :key = "index" style = "text-align: center;">
			  <span>步骤 {{ index + 1 }}</span>
        <!-- <p>接单id：{{item.helpSendOrderId}}</p> -->
			  <p class = "red">验证图</p>
			  <img :src = "item.picture" alt = "" width = "260" height = "460">
		  </div>
		  <div v-if = "helpTaskData == '' " style = "text-align: center;">暂无内容</div>
		  <div slot = "footer" class = "dialog-footer">
			<el-button @click = "dialogFormVisible8 = false">取 消</el-button>
			<el-button type = "primary" @click = "dialogFormVisible8 = false">确 定</el-button>
		  </div>
		</el-dialog>
	</el-tab-pane>
    <el-tab-pane label = "维权管理" name = "second">
		<div style = "display: inline-block;float: right;">
			<el-button :disabled = "checkBoxData2.length <= 0 || !isAuth('taskList:jiedan')" style = "margin:0 0 20px 20px;" size = "mini"
                 type = "primary" icon = "document" @click = "receivOrder()">接单人获胜</el-button>
			<el-button :disabled = "checkBoxData2.length <= 0 || !isAuth('taskList:paidan')" style = "margin:0 0 20px 20px;" size = "mini"
                 type = "primary" icon = "document" @click = "sendOrder()">派单人获胜</el-button>
		</div>
		<el-table @selection-change = "changeFun2" v-loading = "tableDataLoading" :data = "safeguardData.content">
			<el-table-column type = "selection" fixed>
			</el-table-column>
			<el-table-column fixed prop = "label" label = "图标">
			 <template slot-scope = "scope">
			 	<img :src = "scope.row.label" alt = "" width = "40" height = "40">
			 </template>
			 </el-table-column>
			 <el-table-column fixed prop = "title" label = "名称">
				</el-table-column>
			<el-table-column label = "派单人">
			<template slot-scope = "scope">
				<span style = "color: #4f9dec;cursor:pointer;" @click = "personClick(scope.row.helpMaintainDetailsList[0].userId)">派单人</span>
			</template>
			</el-table-column>
			<el-table-column label = "派单人拒绝原因" width = "160">
			<template slot-scope = "scope">
				<span>{{ scope.row.helpMaintainDetailsList[0].content }}</span>
			</template>
			</el-table-column>
			<el-table-column label = "接单人" width = "160">
			<template slot-scope = "scope">
				<span style = "color: #4f9dec;cursor:pointer;" @click = "personClick(scope.row.helpMaintainDetailsList[1].userId)">接单人</span>
			</template>
			</el-table-column>
			<el-table-column label = "接单人提交信息" width = "160">
			<template slot-scope = "scope">
				<span>{{ scope.row.helpMaintainDetailsList[1].content }}</span>
			</template>
			</el-table-column>
			<el-table-column prop = "taskPrice" label = "平台扣除费用后价格" width = "160">
			</el-table-column>
			<el-table-column prop = "content" label = "审核内容" width = "160">
			</el-table-column>
			<el-table-column prop = "createTime" label = "发布时间" width = "160">
			</el-table-column>
			<el-table-column fixed = "right" prop = "state" label = "状态" width = "160">
			<template slot-scope = "scope">
				<span style = "color: #4f9dec;" v-if = "scope.row.state === 0 ">待审核</span>
				<span style = "color: #4f9dec;" v-if = "scope.row.state === 1 ">接单人获胜</span>
				<span style = "color: #4f9dec;" v-if = "scope.row.state === 2 ">派单人获胜</span>
			</template>
			</el-table-column>
			<el-table-column fixed = "right" label = "操作">
				<template slot-scope = "scope">
					<el-button size = "mini" type = "primary" @click = "protect(scope.$index, scope.row)">查看
					</el-button>
				</template>
			</el-table-column>
		</el-table>
		<div style = "text-align: center;margin-top: 10px;">
			<el-pagination @size-change = "handleSizeChange1" @current-change = "handleCurrentChange1" :page-sizes = "[10, 20, 30, 40]"
                     :page-size = "size" :current-page = "page" layout = "total,sizes, prev, pager, next,jumper"
                     :total = "safeguardData.totalElements">
			</el-pagination>
		</div>
	</el-tab-pane>
    <el-tab-pane label = "分类管理" name = "third">
		<div style = "display: inline-block;float: right;">
			<el-button style = "margin:0 0 20px 20px;" :disabled = "!isAuth('taskList:add')" size = "mini" type = "primary" icon = "document"
                 @click = "classifyStair()">添加分类</el-button>
		</div>
		<el-table v-loading = "tableDataLoading" :data = "classifyData">
		  <el-table-column fixed type = "index" label = "编号" width = "100">
		    <template slot-scope = "scope">
		  	<span>{{ (page - 1) * size + scope.$index + 1 }}</span>
		    </template>
		  </el-table-column>
		  <el-table-column prop = "classifyIcon" label = "图标" width = "80">
			<template slot-scope = "scope">
				<img :src = "scope.row.classifyIcon" width = "40" height = "40"/>
			</template>
		   </el-table-column>
		   <el-table-column prop = "classifyName" label = "名称">
		    </el-table-column>
			<el-table-column label = "二级菜单">
			  <template slot-scope = "scope">
			  	<div v-for = "(item,index) in scope.row.list" :key = "index">
			  		<div style = "width: 350px; border: 2px solid rgb(248, 248, 248);padding: 16px;cursor: pointer;margin-bottom: 8px;">
			  			<span style = "margin-right: 20px;">{{ item.classifyDeatilsName }}</span>
			  			<span style = "margin-right:15px;" @click = "deleteSecond(item)" v-if = "isAuth('taskList:delete')">删除</span>
						<span @click = "compileLevel(item)" v-if = "isAuth('taskList:update')">编辑</span>
			  		</div>
			  	</div>
			  	<div v-if = "scope.row.list == ''" :disabled = "!isAuth('taskList:add')">未添加二级菜单</div>
			  </template>
			</el-table-column>
			<el-table-column label = "操作" width = "300">
		    <template slot-scope = "scope">
				<el-button size = "mini" type = "danger" :disabled = "!isAuth('taskList:delete')" @click = "deleteStair(scope.row)">删除
				</el-button>
				<el-button size = "mini" type = "primary" :disabled = "!isAuth('taskList:update')" @click = "compile(scope.$index, scope.row)">编辑
				</el-button>
		      <el-button size = "mini" type = "primary" :disabled = "!isAuth('taskList:add')" @click = "classifySecond(scope.row)">添加二级菜单
		      </el-button>
		    </template>
		  </el-table-column>
		</el-table>
		<div style = "text-align: center;margin-top: 10px;">
		  <el-pagination @size-change = "handleSizeChange2" @current-change = "handleCurrentChange2" :page-sizes = "[10, 20, 30, 40]"
                     :page-size = "size" :current-page = "page" layout = "total,sizes, prev, pager, next,jumper"
                     :total = "classifyData.length">
		  </el-pagination>
		</div>
      <!-- 添加一级分类 -->
		<el-dialog title = "添加一级分类" :visible.sync = "dialogFormVisible" center>
			<div style = "margin-bottom: 10px;">
				<span style = "width: 200px;display: inline-block;text-align: right;">分类名称：</span>
				<el-input style = "width:50%;" v-model = "classifyName" type = "text" placeholder = "请输入分类名称"></el-input>
			</div>
			<div style = "margin-bottom: 10px;display:flex;">
				<span style = "width: 200px;display: inline-block;text-align: right;">分类图标：</span>
				<div style = " width:148px;height:148px;border: 1px dashed #c0ccda;border-radius: 6px;text-align: center;line-height: 148px;">
					<el-upload class = "avatar-uploader" v-model = "classifyIcon" action = "https://sqx.gomyorder.cn/tao/alioss/upload"
                     :show-file-list = "false" :on-success = "handleAvatarSuccess">
						<img v-if = "classifyIcon" :src = "classifyIcon" class = "avatar" style = "border-radius: 6px;width: 148px;height: 148px;"/>
						<i v-else class = "el-icon-plus avatar-uploader-icon"></i>
					</el-upload>
				</div>
			</div>
			<div slot = "footer" class = "dialog-footer">
				<el-button @click = "dialogFormVisible = false">取 消</el-button>
				<el-button type = "primary" @click = "StairNoticeTo()">确 定</el-button>
			</div>
		</el-dialog>
      <!-- 添加二级分类 -->
		<el-dialog title = "添加二级分类" :visible.sync = "dialogFormVisible1" center>
			<div style = "margin-bottom: 10px;">
				<span style = "width: 200px;display: inline-block;text-align: right;">分类名称：</span>
				<el-input style = "width:50%;" v-model = "classifyDeatilsName" placeholder = "请输入分类名称"></el-input>
			</div>
		  <div slot = "footer" class = "dialog-footer">
		    <el-button @click = "dialogFormVisible1 = false">取 消</el-button>
		    <el-button type = "primary" @click = "SecondNoticeTo()">确 定</el-button>
		  </div>
		</el-dialog>
      <!-- 修改一级分类 -->
		<el-dialog title = "编辑" :visible.sync = "dialogFormVisible2" center>
			<el-form :model = "form">
			  <el-form-item label = "分类名称：" :label-width = "formLabelWidth">
			    <el-input v-model = "form.classifyName" style = "width:65%;"></el-input>
			  </el-form-item>
			  <el-form-item label = "图标：" :label-width = "formLabelWidth">
			  	<div style = " width:148px;height:148px;border: 1px dashed #c0ccda;border-radius: 6px;text-align: center;line-height: 148px;">
			  		<el-upload class = "avatar-uploader" v-model = "form.classifyIcon" action = "https://sqx.gomyorder.cn/tao/alioss/upload"
                       :show-file-list = "false" :on-success = "handleAvatarSuccess2">
			  			<img v-if = "form.classifyIcon" :src = "form.classifyIcon" class = "avatar"
                   style = "border-radius: 6px;width: 148px;height: 148px;"/>
			  			<i v-else class = "el-icon-plus avatar-uploader-icon"></i>
			  		</el-upload>
			  	</div>
			  </el-form-item>
			</el-form>
			<div slot = "footer" class = "dialog-footer">
				<el-button @click = "dialogFormVisible2 = false">取 消</el-button>
				<el-button type = "primary" @click = "CompileNoticeTo()">确 定</el-button>
			</div>
		</el-dialog>
      <!-- 修改二级分类 -->
		<el-dialog title = "编辑" :visible.sync = "dialogFormVisible3" center>
			<el-form :model = "form2">
			  <el-form-item label = "标题：" :label-width = "formLabelWidth">
			    <el-input v-model = "form2.classifyDeatilsName" style = "width:65%;"></el-input>
			  </el-form-item>
			</el-form>
		  <div slot = "footer" class = "dialog-footer">
		    <el-button @click = "dialogFormVisible3 = false">取 消</el-button>
		    <el-button type = "primary" @click = "CompilelevelTo()">确 定</el-button>
		  </div>
		</el-dialog>
	</el-tab-pane>
    <!-- 任务查看弹框 -->
	<el-dialog title = "任务详情" :visible.sync = "dialogFormVisible4" center>
	  <div v-for = "(item,index) in helpTaskData" :key = "index" style = "text-align: center;">
		  <span>步骤 {{ index + 1 }}</span>
		  <p>操作指南：{{ item.content }}</p>
		  <p class = "red">验证图</p>
		  <img :src = "item.picture" alt = "" width = "260" height = "460">
	  </div>
	  <div v-if = "helpTaskData == '' " style = "text-align: center;">暂无内容</div>
	  <div slot = "footer" class = "dialog-footer">
	    <el-button @click = "dialogFormVisible4 = false">取 消</el-button>
	    <el-button type = "primary" @click = "dialogFormVisible4 = false">确 定</el-button>
	  </div>
	</el-dialog>
    <!-- 维权查看弹框-->
	<el-dialog title = "维权详情" :visible.sync = "dialogFormVisible5" center>
		<div style = "display: flex;justify-content: center;text-align: center;">
			<div class = "wqitem" style = "flex: 1;">
				<h4>派单人验证信息</h4>
				<div v-for = "(item,index) in protectjieData" :key = "index" style = "text-align: center;">
					  <span>步骤 {{ index + 1 }}</span>
					  <p>操作指南：{{ item.content }}</p>
					  <p class = "red">验证图</p>
					  <img :src = "item.picture" alt = "" width = "260" height = "460">
				</div>
			</div>
			<div class = "wqitem" style = "flex: 1;">
				<h4>接单人验证信息</h4>
				<div v-for = "(item,index) in protectpaiData" :key = "index" style = "text-align: center;">
					  <p class = "red">验证图</p>
					  <img :src = "item.picture" alt = "" width = "260" height = "460">
				</div>
			</div>
		</div>
	  <div slot = "footer" class = "dialog-footer">
	    <el-button @click = "dialogFormVisible5 = false">取 消</el-button>
	    <el-button type = "primary" @click = "dialogFormVisible5 = false">确 定</el-button>
	  </div>
	</el-dialog>
    <!-- 判决理由弹框 -->
	<el-dialog title = "判决理由" :visible.sync = "dialogFormVisible6" center>
		<div style = "margin-bottom: 10px;">
			<span style = "width: 200px;display: inline-block;text-align: right;">判决理由：</span>
			<el-input style = "width:50%;" v-model = "content" type = "text" placeholder = "请输入判决理由"></el-input>
		</div>
	  <div slot = "footer" class = "dialog-footer">
	    <el-button @click = "dialogFormVisible6 = false">取 消</el-button>
	    <el-button type = "primary" @click = "triumph()">确 定</el-button>
	  </div>
	</el-dialog>
    <!-- 任务拒绝弹框 -->
	<el-dialog title = "任务拒绝" :visible.sync = "dialogFormVisible7" center>
		<div style = "margin-bottom: 10px;">
			<span style = "width: 200px;display: inline-block;text-align: right;position: relative;top: -65px;">拒绝理由：</span>
			<el-input style = "width:50%;" v-model = "content" type = "textarea" rows = "4" placeholder = "请输入拒绝理由"></el-input>
		</div>
	  <div slot = "footer" class = "dialog-footer">
	    <el-button @click = "dialogFormVisible7 = false">取 消</el-button>
	    <el-button type = "primary" @click = "refuseto()">确 定</el-button>
	  </div>
	</el-dialog>
  </el-tabs>
</template>

<script>
	export default {
    data () {
      return {
        size: 10,
        page: 1,
        phone: '',
        state: -1,
        states: [
          {
            label: '全部',
            value: -1
          },
          {
            label: '待审核',
            value: 0
          },
          {
            label: '进行中',
            value: 1
          },
          {
            label: '已拒绝',
            value: 2
          },
          {
            label: '已结束',
            value: 3
          },
          {
            label: '已结算',
            value: 4
          }
        ],
        taskstates: [
          {
            label: '全部',
            value: -1
          },
          {
            label: '接单成功',
            value: 0
          },
          {
            label: '提交待审核',
            value: 1
          },
          {
            label: '审核成功',
            value: 2
          },
          {
            label: '已拒绝',
            value: 3
          },
          {
            label: '已维权',
            value: 4
          },
          {
            label: '已放弃',
            value: 5
          }
        ],
        sort: 10,
        id: '',
        helpTakeId: '',
        helpMaintainId: '',
        content: '同意',
        classifyIcon: '',
        classifyId: '',
        classifyUrl: '',
        classifyName: '',
        classifyDeatilsName: '',
        formLabelWidth: '200px',
        activeName: 'first',
        tableDataLoading: false,
        dialogFormVisible: false,
        dialogFormVisible1: false,
        dialogFormVisible2: false,
        dialogFormVisible3: false,
        dialogFormVisible4: false,
        dialogFormVisible5: false,
        dialogFormVisible6: false,
        dialogFormVisible7: false,
        dialogFormVisible8: false,
        tableData: [],
        tableData2: [],
        form: {
          id: '',
          classifyName: '',
          classifyType: '',
          classifyIcon: ''
        },
        form2: {
          id: '',
          classifyDeatilsName: '',
          classifyId: '',
          sort: '',
          state: ''
        },
        classifyType: 2,
        protectjieData: [],
        protectpaiData: [],
        helpTaskData: [],
        safeguardData: [],
        classifyData: [],
        checkBoxData: [],//多选框选择的值
        checkBoxData2: []   //多选框选择的值
      }
    },
    methods: {
      refresh () {
        this.phone = ''
        this.state = -1
        this.dataSelect()
      },
      // 重置
      cleans2 () {
        this.phone = ''
        this.state = -1
        this.taskdataSelect()
      },
      animeDat2 (state) {
        this.taskdataSelect()
      },
      // 手机号搜索
      phoneSelect2 () {
        this.taskdataSelect()
      },
      cleans () {
        this.phone = ''
        this.state = -1
        this.dataSelect()
      },
      animeDat (state) {
        this.page = 1
        this.dataSelect()
      },
      // 手机号搜索
      phoneSelect () {
        this.dataSelect()
      },
      // 图标上传
      handleAvatarSuccess (file) {
        this.classifyIcon = file.data
      },
      // 图标上传
      handleAvatarSuccess2 (file) {
        this.form.classifyIcon = file.data
      },
      // 多选
      changeFun (val) {
        this.checkBoxData = val
      },
      // 多选
      changeFun2 (val) {
        this.checkBoxData2 = val
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
        this.safeguardSelect()
      },
      handleCurrentChange1 (val) {
        this.page = val
        this.safeguardSelect()
      },
      handleSizeChange2 (val) {
        this.size = val
        this.classifySelect()
      },
      handleCurrentChange2 (val) {
        this.page = val
        this.classifySelect()
      },
      handleSizeChange3 (val) {
        this.size = val
        this.taskdataSelect()
      },
      handleCurrentChange3 (val) {
        this.page = val
        this.taskdataSelect()
      },
      // tabs切换
      handleClick (tab, event) {
        if (tab._props.label == '派单管理') {
          this.page = 1
          this.size = 10
          this.dataSelect()
        }
        if (tab._props.label == '接单管理') {
          this.page = 1
          this.size = 10
          this.taskdataSelect()
        }
        if (tab._props.label == '维权管理') {
          this.page = 1
          this.size = 10
          this.safeguardSelect()
        }
        if (tab._props.label == '分类管理') {
          this.page = 1
          this.size = 10
          this.classifySelect()
        }
      },
      //批量任务通过
      passClick (id) {
        this.state = 1
        var helpTakeIds = id ? [id] : this.checkBoxData.map(item => {
          return item.id
        })
        var helpTakeId = ''
        for (let i = 0; i < helpTakeIds.length; i++) {
          if (i < helpTakeIds.length - 1) {
            helpTakeId += helpTakeIds[i] + ','
          } else {
            helpTakeId += helpTakeIds[i]
          }
        }
        this.$http({
          url: this.$http.adornUrl2(`/helpTask/updateHelpTask?helpTakeId=${helpTakeId}&state=${this.state}&content=${this.content}`),
          method: 'post',
          data: this.$http.adornData({})
        }).then(({data}) => {
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.state = -1
              this.dataSelect()
            }
          })
        })
      },
      //任务通过
      passClick2 (row) {
        this.state = 1
        this.$http({
          url: this.$http.adornUrl2(`/helpTask/updateHelpTask?helpTakeId=${row.id}&state=${this.state}&content=${this.content}`),
          method: 'post',
          data: this.$http.adornData({})
        }).then(({data}) => {
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.state = -1
              this.dataSelect()
            }
          })
        })
      },
      //任务拒绝
      refuseClick (rows) {
        if (rows.state == 0) {
          this.state = 2
          this.helpTakeId = rows.id
          this.content = ''
          this.dialogFormVisible7 = true
        } else {
          this.$message({
            message: '任务已经审核，请不要重复操作',
            type: 'error',
            duration: 2500,
          })
        }

      },
      refuseto () {
        if (this.content == '') {
          this.$notify({
            title: '提示',
            duration: 1800,
            message: '请输入拒绝理由',
            type: 'warning'
          })
          return
        }
        this.$http({
          url: this.$http.adornUrl2(`/helpTask/updateHelpTask?helpTakeId=${this.helpTakeId}&state=${this.state}&content=${this.content}`),
          method: 'post',
          data: this.$http.adornData({})
        }).then(({data}) => {
          this.dialogFormVisible7 = false
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.content = ''
              this.dataSelect()
            }
          })
        })
      },
      // 接单人/派单人跳转详情
      personClick (id) {
        this.$router.push({path: '/userDetail', query: {userId: id}})
      },
      // 接单人获胜
      receivOrder () {
        this.state = 2
        this.dialogFormVisible6 = true
      },
      // 派单人获胜
      sendOrder () {
        this.state = 3
        this.dialogFormVisible6 = true
      },
      triumph (id) {
        if (this.content == '') {
          this.$notify({
            title: '提示',
            duration: 1800,
            message: '请输入判决理由',
            type: 'warning'
          })
          return
        }
        var helpMaintainIds = id ? [id] : this.checkBoxData2.map(item => {
          return item.id
        })
        this.$http({
          url: this.$http.adornUrl2(`/helpTask/auditHelpMaintain?helpMaintainId=${helpMaintainIds}&state=${this.state}&content=${this.content}`),
          method: 'post',
          data: this.$http.adornData({})
        }).then(({data}) => {
          this.dialogFormVisible6 = false
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.content = ''
              this.safeguardSelect()
            }
          })
        })
      },
      // 任务查看弹框
      check (index, rows) {
        this.dialogFormVisible4 = true
        this.helpTaskData = rows.helpTaskDetailsList
      },
      // 维权查看弹框
      protect (index, rows) {
        this.dialogFormVisible5 = true
        this.protectjieData = rows.helpMaintainDetailsList[0].helpTaskDetailsList
        this.protectpaiData = rows.helpMaintainDetailsList[1].helpSendOrderDetailsList
      },
      // 添加一级分类弹框
      classifyStair () {
        this.dialogFormVisible = true
      },
      // 添加一级分类确定
      StairNoticeTo () {
        if (this.classifyName == '') {
          this.$notify({
            title: '提示',
            duration: 1800,
            message: '请输入分类名称',
            type: 'warning'
          })
          return
        }
        if (this.classifyIcon == '') {
          this.$notify({
            title: '提示',
            duration: 1800,
            message: '请上传图标',
            type: 'warning'
          })
          return
        }
        this.$http({
          url: this.$http.adornUrl2('/helpClassify/saveHelpClassify'),
          method: 'post',
          data: this.$http.adornData({
            'classifyName': this.classifyName,
            'state': this.state,
            'sort': this.sort,
            'classifyIcon': this.classifyIcon,
            'classifyType': this.classifyType
          })
        }).then(({data}) => {
          this.dialogFormVisible = false
          this.$message({
            message: '一级分类添加成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.classifyName = ''
              this.classifyIcon = ''
              this.classifySelect()
            }
          })
        })
      },
      // 修改一级分类
      compile (index, rows) {
        this.dialogFormVisible2 = true
        this.form.id = rows.id
        this.form.classifyName = rows.classifyName
        this.form.classifyIcon = rows.classifyIcon
      },
      // 修改一级分类确定
      CompileNoticeTo () {
        if (this.form.classifyName == '') {
          this.$notify({
            title: '提示',
            duration: 1800,
            message: '请输入分类名称',
            type: 'warning'
          })
          return
        }
        if (this.form.classifyIcon == '') {
          this.$notify({
            title: '提示',
            duration: 1800,
            message: '请上传图标',
            type: 'warning'
          })
          return
        }
        this.$http({
          url: this.$http.adornUrl2('/helpClassify/updateHelpClassify'),
          method: 'post',
          data: this.$http.adornData({
            'id': this.form.id,
            'classifyName': this.form.classifyName,
            'classifyType': this.classifyType,
            'classifyIcon': this.form.classifyIcon
          })
        }).then(({data}) => {
          this.dialogFormVisible2 = false
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.classifySelect()
            }
          })
        })
      },
      //删除一级
      deleteStair (row) {
        let delid = row.id
        this.$confirm(`确定删除此条信息?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl2(`/helpClassify/deleteClassifyById/?id=${delid}`),
            method: 'post',
            data: this.$http.adornData({})
          }).then(({data}) => {
            this.$message({
              message: '删除成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.name = ''
                this.classifySelect()
              }
            })
          })
        }).catch(() => {
        })
      },
      // 添加二级分类弹框
      classifySecond (rows) {
        this.classifyId = rows.id
        this.dialogFormVisible1 = true
      },
      // 添加二级分类确定
      SecondNoticeTo () {
        if (this.classifyDeatilsName == '') {
          this.$notify({
            title: '提示',
            duration: 1800,
            message: '请输入分类名称',
            type: 'warning'
          })
          return
        }
        this.$http({
          url: this.$http.adornUrl2('/helpClassify/saveHelpClassifyDetails'),
          method: 'post',
          data: this.$http.adornData({
            'classifyDeatilsName': this.classifyDeatilsName,
            'classifyId': this.classifyId,
            'state': this.state,
            'sort': this.sort,
          })
        }).then(({data}) => {
          this.dialogFormVisible1 = false
          this.$message({
            message: '二级分类添加成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.classifyDeatilsName = ''
              this.classifySelect()
            }
          })
        })
      },
      // 修改二级分类
      compileLevel (item) {
        this.dialogFormVisible3 = true
        this.form2.id = item.id
        this.form2.classifyId = item.classifyId
        this.form2.sort = item.sort
        this.form2.state = item.state
        this.form2.classifyDeatilsName = item.classifyDeatilsName
      },
      // 修改二级分类确定
      CompilelevelTo () {
        if (this.form2.classifyDeatilsName == '') {
          this.$notify({
            title: '提示',
            duration: 1800,
            message: '请输入分类名称',
            type: 'warning'
          })
          return
        }
        this.$http({
          url: this.$http.adornUrl2('/helpClassify/updateClassifyDetails'),
          method: 'post',
          data: this.$http.adornData({
            'id': this.form2.id,
            'classifyDeatilsName': this.form2.classifyDeatilsName,
            'classifyId': this.form2.classifyId,
            'state': this.form2.state,
            'sort': this.form2.sort,
          })
        }).then(({data}) => {
          this.dialogFormVisible3 = false
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.classifySelect()
            }
          })
        })
      },
      //删除二级分类
      deleteSecond (item) {
        let delid = item.id
        this.$confirm(`确定删除二级分类?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl2(`/helpClassify/deleteClassifyDetailsById/?id=${delid}`),
            method: 'post',
            data: this.$http.adornData({})
          }).then(({data}) => {
            this.$message({
              message: '删除成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.name = ''
                this.classifySelect()
              }
            })
          })
        }).catch(() => {
        })
      },
      // 获取任务数据列表
      dataSelect () {
        this.tableDataLoading = true
        let page = this.page - 1
        this.$http({
          url: this.$http.adornUrl2('/helpTask/selectTakeOrderAuditHelpTask'),
          method: 'get',
          params: this.$http.adornParams({
            'page': page,
            'size': this.size,
            'phone': this.phone,
            'state': this.state
          })
        }).then(({data}) => {
          this.tableDataLoading = false
          let returnData = data.data
          this.tableData = returnData
        })
      },
      // 获取接单数据列表
      taskdataSelect () {
        let page = this.page - 1
        this.tableDataLoading = true
        this.$http({
          url: this.$http.adornUrl2('/helpTask/selectSendOrderList'),
          method: 'get',
          params: this.$http.adornParams({
            'page': page,
            'size': this.size,
            'phone': this.phone,
            'state': this.state
          })
        }).then(({data}) => {
          this.tableDataLoading = false
          let returnData = data.data
          this.tableData2 = returnData
        })
      },
      // 派单人详情
      taskDetails (row) {
        this.$router.push({path: '/taskDetails', query: {id: row.id}})
      },
      // 接单人查看
      taskDetails2 (index, rows) {
        this.$http({
          url: this.$http.adornUrl2('/helpTask/selectSendOrderDetailsById'),
          method: 'get',
          params: this.$http.adornParams({
            'id': rows.id
          })
        }).then(({data}) => {
          if (data.status === 0) {
            let returnData = data.data
            this.dialogFormVisible8 = true
            this.helpTaskData = returnData
          }
        })

      },
      // 维权管理
      safeguardSelect () {
        this.tableDataLoading = true
        let page = this.page - 1
        this.$http({
          url: this.$http.adornUrl2('/helpTask/selectAuditHelpMaintainList'),
          method: 'get',
          params: this.$http.adornParams({
            'page': page,
            'size': this.size
          })
        }).then(({data}) => {
          this.tableDataLoading = false
          let returnData = data.data
          console.log(data.data)
          this.safeguardData = returnData
        })
      },
      // 分类管理
      classifySelect () {
        this.tableDataLoading = true
        this.$http({
          url: this.$http.adornUrl2('/helpClassify/select'),
          method: 'get',
          params: this.$http.adornParams({})
        }).then(({data}) => {
          this.tableDataLoading = false
          let returnData = data.data
          this.classifyData = returnData
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
