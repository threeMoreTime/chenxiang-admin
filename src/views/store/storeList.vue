<template>
  <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="首页公告" name="first">
      <div style="float: right;margin-right:2%;">
        <el-button style="margin: 10px 0;" :disabled="!isAuth('storeList:add')" size="mini" type="primary"
          icon="document" @click="addNotice">添加公告</el-button>
      </div>
      <el-table v-loading="tableDataLoading" :data="tableData.content">
        <el-table-column fixed prop="id" label="编号" width="80">
        </el-table-column>
        <el-table-column prop="title" label="标题">
        </el-table-column>
        <el-table-column prop="type" label="类型">
          <template slot-scope="scope">
            <span style="color: #4f9dec;cursor: pointer;" v-if="scope.row.type === 'url'">链接</span>
            <span style="color: #4f9dec;cursor: pointer;" v-if="scope.row.type === 'word'">文本</span>
          </template>
        </el-table-column>
        <el-table-column prop="content" label="文本" width="350">
        </el-table-column>
        <!-- <el-table-column prop="url" label="链接">
        </el-table-column> -->
        <el-table-column prop="createAt" label="创建时间">
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" :disabled="!isAuth('storeList:update')"
              @click="updates(scope.$index, scope.row)">修改
            </el-button>
            <el-button size="mini" type="danger" :disabled="!isAuth('storeList:delete')" @click="deletes(scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align: center;margin-top: 10px;">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
          :page-sizes="[10, 20, 30, 40]" :page-size="size" :current-page="page"
          layout="total,sizes, prev, pager, next,jumper" :total="tableData.totalElements">
        </el-pagination>
      </div>
      <!-- 添加弹框 -->
      <el-dialog title="添加公告" :visible.sync="dialogFormVisible" center>
        <div style="margin-bottom: 10px;">
          <span style="width: 200px;display: inline-block;text-align: right;">标题：</span>
          <el-input style="width:50%;" v-model="title" placeholder="请输入公告标题"></el-input>
        </div>
        <div style="margin-bottom: 10px;">
          <span style="width: 200px;display: inline-block;text-align: right;">内容：</span>
          <el-input style="width: 50%;" v-model="content" placeholder="请输入内容"></el-input>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="releasgongaoTo()">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 修改弹框 -->
      <el-dialog title="修改" :visible.sync="dialogFormVisible1" center>
        <el-form :model="form">
          <el-form-item label="标题：" :label-width="formLabelWidth">
            <el-input v-model="form.title" style="width:65%;"></el-input>
          </el-form-item>
          <el-form-item label="内容：" :label-width="formLabelWidth">
            <el-input v-model="form.content" style="width:65%;"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible1 = false">取 消</el-button>
          <el-button type="primary" @click="amendNoticeTo()">确 定</el-button>
        </div>
      </el-dialog>
    </el-tab-pane>
    <el-tab-pane label="首页导航" name="second">
      <div style="float: left;margin-right:2%;">
        <span>小程序是否显示：</span>
        <el-select v-model="types1" placeholder="请选择类型" style="width:150px;" @change="selectTrigger(types1)">
          <el-option v-for="item in platforms" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>&nbsp;&nbsp;&nbsp;&nbsp;
      </div>
      <div style="float: right;margin-right:2%;">
        <el-button style="margin: 10px 0;" :disabled="!isAuth('storeList:add')" size="mini" type="primary"
          icon="document" @click="addNavigation">添加导航</el-button>
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
            <el-switch v-model="scope.row.type" @change="change(scope.row.type, scope.row)" :active-value="openValue"
              :inactive-value="closeValue" active-color="#13ce66" inactive-color="#ff4949">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="createAt" label="创建时间" width="160">
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" :disabled="!isAuth('storeList:update')"
              @click="compile(scope.$index, scope.row)">编辑
            </el-button>
            <el-button size="mini" type="danger" :disabled="!isAuth('storeList:delete')" @click="navdeletes(scope.row)">
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
      <!-- 添加导航弹框 -->
      <!-- <el-dialog title="添加导航" :visible.sync="dialogFormVisible9" center>
        <div style="margin-bottom: 10px;">
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
        <div style="margin-bottom: 10px;margin-top: 10px;">
          <span style="width: 200px;display: inline-block;text-align: right;">排序：</span>
          <el-input-number size="medium" v-model="sort"></el-input-number>
        </div>
        <div style="margin-bottom: 10px;">
          <span style="width: 200px;display: inline-block;text-align: right;">小程序是否显示：</span>
          <el-radio-group v-model="type">
            <el-radio :label="1">显示</el-radio>
            <el-radio :label="2">不显示</el-radio>
          </el-radio-group>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible9 = false">取 消</el-button>
          <el-button type="primary" @click="NagNoticeTo()">确 定</el-button>
        </div>
      </el-dialog> -->
    </el-tab-pane>
    <el-tab-pane label="首页推广" name="third">
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
        <el-table-column prop="createAt" label="创建时间" width="160">
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" :disabled="!isAuth('storeList:update')"
              @click="compile(scope.$index, scope.row)">编辑
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
    <el-tab-pane label="升级配置" name="fourth">
      <div style="float: right;margin-right:2%;">
        <el-button style="margin: 10px 0;" :disabled="!isAuth('storeList:add')" size="mini" type="primary"
          icon="document" @click="addUpgrade">添加升级</el-button>
      </div>
      <el-table v-loading="tableDataLoading" :data="upgradeData">
        <el-table-column fixed prop="id" label="编号" width="80">
        </el-table-column>
        <el-table-column prop="wgtUrl" label="统一地址">
        </el-table-column>
        <el-table-column prop="androidWgtUrl" label="安卓">
        </el-table-column>
        <el-table-column prop="iosWgtUrl" label="苹果">
        </el-table-column>
        <el-table-column prop="version" label="安卓版本">
        </el-table-column>
        <el-table-column prop="iosVersion" label="ios版本">
        </el-table-column>
        <el-table-column prop="content" label="升级方式">
          <template slot-scope="scope">
            <span>{{ scope.row.method == 'true' ? '强制升级' : '普通升级' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createAt" label="创建时间">
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" :disabled="!isAuth('storeList:update')"
              @click="upgradebj(scope.$index, scope.row)">编辑
            </el-button>
            <el-button size="mini" type="danger" :disabled="!isAuth('storeList:delete')"
              @click="upgradelete(scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align: center;margin-top: 10px;">
        <el-pagination @size-change="handleSizeChange2" @current-change="handleCurrentChange2"
          :page-sizes="[10, 20, 30, 40]" :page-size="size" :current-page="page"
          layout="total,sizes, prev, pager, next,jumper" :total="upgradeData.length">
        </el-pagination>
      </div>
      <!-- 添加升级弹框 -->
      <el-dialog title="添加升级" :visible.sync="dialogFormVisible3" center>
        <div style="margin-bottom: 10px;">
          <span style="width: 200px;display: inline-block;text-align: right;"><i
              style="color: #f56c6c;margin-right: 2px;">*</i>统一地址：</span>
          <el-input style="width: 50%;" v-model="wgtUrl" placeholder="请输入统一地址"></el-input>
        </div>
        <div style="margin-bottom: 10px;">
          <span style="width: 200px;display: inline-block;text-align: right;"><i
              style="color: #f56c6c;margin-right: 2px;">*</i>安卓地址：</span>
          <el-input style="width:50%;" v-model="androidWgtUrl" placeholder="请输入安卓地址"></el-input>
        </div>
        <div style="margin-bottom: 10px;">
          <span style="width: 200px;display: inline-block;text-align: right;"><i
              style="color: #f56c6c;margin-right: 2px;">*</i>苹果地址：</span>
          <el-input style="width: 50%;" v-model="iosWgtUrl" placeholder="请输入苹果地址"></el-input>
        </div>
        <div style="margin-bottom: 10px;">
          <span style="width: 200px;display: inline-block;text-align: right;"><i
              style="color: #f56c6c;margin-right: 2px;">*</i>安卓版本号：</span>
          <el-input style="width: 50%;" v-model="version" placeholder="请输入安卓版本号"></el-input>
        </div>
        <div style="margin-bottom: 10px;">
          <span style="width: 200px;display: inline-block;text-align: right;"><i
              style="color: #f56c6c;margin-right: 2px;">*</i>ios版本号：</span>
          <el-input style="width: 50%;" v-model="iosVersion" placeholder="请输入ios版本号"></el-input>
        </div>
        <div style="margin-bottom: 10px;">
          <span style="width: 200px;display: inline-block;text-align: right;"><i
              style="color: #f56c6c;margin-right: 2px;">*</i>升级方式：</span>
          <el-select v-model="method" placeholder="请选择升级方式" style="width:50%;">
            <el-option v-for="item in methods" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div style="margin-bottom: 10px;">
          <span style="width: 200px;display: inline-block;text-align: right;"><i
              style="color: #f56c6c;margin-right: 2px;">*</i>升级内容：</span>
          <el-input style="width: 50%;" v-model="des" placeholder="请输入升级内容"></el-input>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible3 = false">取 消</el-button>
          <el-button type="primary" @click="upgradaddTo()">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 修改升级弹框 -->
      <el-dialog title="修改" :visible.sync="dialogFormVisible4" center>
        <el-form :model="formupgrad">
          <el-form-item label="统一地址：" :label-width="formLabelWidth">
            <el-input v-model="formupgrad.wgtUrl" style="width:65%;"></el-input>
          </el-form-item>
          <el-form-item label="安卓地址：" :label-width="formLabelWidth">
            <el-input v-model="formupgrad.androidWgtUrl" style="width:65%;"></el-input>
          </el-form-item>
          <el-form-item label="苹果地址：" :label-width="formLabelWidth">
            <el-input v-model="formupgrad.iosWgtUrl" style="width:65%;"></el-input>
          </el-form-item>
          <el-form-item label="安卓版本号：" :label-width="formLabelWidth">
            <el-input v-model="formupgrad.version" style="width:65%;"></el-input>
          </el-form-item>
          <el-form-item label="ios版本号：" :label-width="formLabelWidth">
            <el-input v-model="formupgrad.iosVersion" style="width:65%;"></el-input>
          </el-form-item>
          <el-form-item label="升级方式：" :label-width="formLabelWidth">
            <el-select v-model="formupgrad.method" placeholder="请选择升级方式" style="width:65%;">
              <el-option v-for="item in methods" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="升级内容：" :label-width="formLabelWidth">
            <el-input v-model="formupgrad.des" style="width:65%;"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible4 = false">取 消</el-button>
          <el-button type="primary" @click="upgradbjTo()">确 定</el-button>
        </div>
      </el-dialog>
    </el-tab-pane>
    <el-tab-pane label="精选商品" name="fifth">
      <div style="float: right;margin-right:2%;">
        <el-button style="margin: 10px 0;" :disabled="!isAuth('storeList:add')" size="mini" type="primary"
          icon="document" @click="choiaddNotice()">添加商品</el-button>
        <el-button style="margin: 10px 0;" :disabled="!isAuth('storeList:delete') || checkBoxData.length <= 0"
          size="mini" type="danger" icon="document" @click="choideletes()">批量删除</el-button>
      </div>
      <el-table v-loading="tableDataLoading" @selection-change="changeFun" :data="choicenData.content">
        <el-table-column type="selection" fixed>
        </el-table-column>
        <el-table-column fixed prop="id" label="编号" width="80">
        </el-table-column>
        <el-table-column fixed prop="itempic" label="商品图片">
          <template slot-scope="scope">
            　　<img :src="scope.row.itempic" width="40" height="40" />
          </template>
        </el-table-column>
        <el-table-column fixed prop="itemtitle" label="商品名称" width="200">
        </el-table-column>
        <el-table-column fixed prop="couponmoney" label="优惠券(元)">
        </el-table-column>
        <el-table-column fixed prop="itemendprice" label="券后价(元)">
        </el-table-column>
        <el-table-column fixed prop="itemsale" label="销量">
        </el-table-column>
        <el-table-column fixed prop="shopname" label="店铺名称">
        </el-table-column>
        <el-table-column label="操作" prop="id" width="120">
          <template slot-scope="scope">
            <el-button size="mini" type="danger" :disabled="!isAuth('storeList:delete')" @click="choidelete(scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align: center;margin-top: 10px;float:right">
        <el-pagination @size-change="handleSizeChange3" @current-change="handleCurrentChange3"
          :page-sizes="[10, 20, 30, 40]" :page-size="size" :current-page="page"
          layout="total,sizes, prev, pager, next,jumper" :total="choicenData.totalElements">
        </el-pagination>
      </div>
      <!-- 添加弹框 -->
      <el-dialog title="添加" customClass="customWidth" :visible.sync="dialogFormVisible5" center>
        <div style="position: relative;display: inline-block;float: right;">
          <el-input style="width: 220px;" clearable @keydown.enter.native="shousuo" placeholder="搜索商品"
            v-model="keyword"></el-input>
          <el-button style="margin: 10px 0;" type="primary" icon="document" @click="shousuo()">搜索</el-button>
        </div>
        <el-table v-loading="tableDataLoading" height="450" :data="choicenData2">
          <el-table-column fixed type="index" label="编号" align="center" width="50">
            <template slot-scope="scope">
              <span>{{ (page - 1) * size + scope.$index + 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column fixed prop="itempic" label="商品图片">
            <template slot-scope="scope">
              　　<img :src="scope.row.itempic" width="40" height="40" style="border-radius: 50%;" />
            </template>
          </el-table-column>
          <el-table-column fixed prop="itemtitle" label="商品名称" width="200">
          </el-table-column>
          <el-table-column fixed prop="couponmoney" label="优惠券(元)">
          </el-table-column>
          <el-table-column fixed prop="itemendprice" label="券后价(元)">
          </el-table-column>
          <el-table-column fixed prop="itemsale" label="销量">
          </el-table-column>
          <el-table-column fixed prop="shopname" label="店铺名称">
          </el-table-column>
          <el-table-column label="操作" prop="id">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="releasNoticeTo(scope.row)">添加
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </el-tab-pane>
    <el-tab-pane label="首页轮播" name="sixth">
      <div>
        <el-row>
          <el-col :span="6" class="cards" v-if="isAuth('storeList:add')">
            <div class="adver_main box">
              <a href="javascript:;" @click="addNoticelun">
                + 新增轮播图
              </a>
            </div>
          </el-col>
          <el-col :span="6" class="cards" v-for="(item, index) in bannerData" :key="index">
            <div class="adver_main bannerManin">
              <img :src="item.image_url" alt="">
              <span>{{ item.url }}</span>
            </div>
            <div class="bannerbtn">
              <a href="javascript:;" v-if="isAuth('storeList:update')" @click="compilelun(item)">编辑</a>
              <a href="javascript:;" v-if="isAuth('storeList:delete')" @click="deleteslun(item.id)">删除</a>
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
    <el-tab-pane label="背景图" name="backdrop">
      <el-table v-loading="tableDataLoading" :data="bannerData">
        <el-table-column prop="id" label="编号" width="80">
        </el-table-column>
        <el-table-column prop="state" label="文字">
        </el-table-column>
        <el-table-column prop="url" label="链接">
        </el-table-column>
        <el-table-column prop="content" label="图片">
          <template slot-scope="scope">
            <img :src="scope.row.image_url" alt="" width="40" height="40">
          </template>
        </el-table-column>
        <el-table-column prop="createAt" label="创建时间">
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" :disabled="!isAuth('storeList:update')"
              @click="compilelun2(scope.row)">编辑
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 编辑弹框 -->
      <el-dialog title="修改背景图" :visible.sync="dialogFormVisible8" center>
        <el-form :model="form1">
          <el-form-item label="链接：" :label-width="formLabelWidth">
            <el-input v-model="form1.url" style="width:65%;"></el-input>
          </el-form-item>
          <el-form-item label="文字：" :label-width="formLabelWidth">
            <el-input v-model="form1.state" style="width:65%;"></el-input>
          </el-form-item>
          <el-form-item label="背景图：" :label-width="formLabelWidth">
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
          <el-button @click="dialogFormVisible8 = false">取 消</el-button>
          <el-button type="primary" @click="upgradbianTo2()">确 定</el-button>
        </div>
      </el-dialog>
    </el-tab-pane>
    <el-tab-pane label="合作平台" name="hezuo">
      <!-- <div style="float: left;margin-right:2%;">
        <span>小程序是否显示：</span>
        <el-select v-model="types1" placeholder="请选择类型" style="width:150px;" @change="selectTrigger(types1)">
          <el-option v-for="item in platforms" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>&nbsp;&nbsp;&nbsp;&nbsp;
      </div> -->
      <div style="float: right;margin-right:2%;">
        <el-button style="margin: 10px 0;" :disabled="!isAuth('storeList:add')" size="mini" type="primary"
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
        <el-table-column prop="type " label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.type" @change="change(scope.row.type, scope.row)" :active-value="openValue"
              :inactive-value="closeValue" active-color="#13ce66" inactive-color="#ff4949">
            </el-switch>
            <!-- <span v-if="scope.row.type==1">显示</span>
            <span v-if="scope.row.type==2">不显示</span> -->
          </template>
        </el-table-column>
        <el-table-column prop="createAt" label="创建时间" width="160">
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" :disabled="!isAuth('storeList:update')"
              @click="compile(scope.$index, scope.row)">编辑
            </el-button>
            <el-button size="mini" type="danger" :disabled="!isAuth('storeList:delete')" @click="navdeletes(scope.row)">
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
    <!-- 分红配置 -->
    <el-tab-pane label="套餐1分红配置" name="bonus">
      <el-table v-loading="tableDataLoading" :data="configData">
        <el-table-column fixed prop="id" label="编号" align="center" width="80">
        </el-table-column>
        <el-table-column prop="rankCode" label="等级编码">
        </el-table-column>
        <el-table-column prop="rankName" label="等级名称">
        </el-table-column>
        <el-table-column prop="bonusPercent" label="分红比例">
          <template slot-scope="scope">{{ scope.row.bonusPercent || 0 }}%</template>
        </el-table-column>
        <el-table-column prop="updateRankTeam" label="升级团队结构">
        </el-table-column>
        <el-table-column prop="updateRankNum" label="升级销量">
        </el-table-column>
        <el-table-column prop="award" label="升级奖励">
        </el-table-column>
        <el-table-column prop="remark" label="说明">
        </el-table-column>
        <el-table-column label="操作" prop="id" width="120">
          <template slot-scope="scope">
            <!-- :disabled="!isAuth('allocationList:update')" -->
            <el-button size="mini" type="primary" disabled @click="findConfigById(scope.row.id)">编辑
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分红配置修改弹框 -->
      <el-dialog title="修改" :visible.sync="bonusFormVisible" center>
        <el-form :model="bonusFrom">
          <el-form-item label="编号：" :label-width="formLabelWidth">
            <el-input disabled :value="bonusFrom.id" style="width:65%;" readonly></el-input>
          </el-form-item>
          <el-form-item label="等级编码：" :label-width="formLabelWidth">
            <el-input disabled :value="bonusFrom.rankCode" style="width:65%;"></el-input>
          </el-form-item>
          <el-form-item label="名称：" :label-width="formLabelWidth">
            <el-input v-model="bonusFrom.rankName" style="width:65%;"></el-input>
          </el-form-item>
          <el-form-item label="升级标准：" :label-width="formLabelWidth">
            <el-input v-model="bonusFrom.updateRankNum" style="width:65%;"></el-input>
          </el-form-item>
          <el-form-item label="升级奖励：" :label-width="formLabelWidth">
            <el-input v-model="bonusFrom.award" style="width:65%;"></el-input>
          </el-form-item>
          <el-form-item label="说明：" :label-width="formLabelWidth">
            <el-input v-model="bonusFrom.remark" style="width:65%;"></el-input>
          </el-form-item>
          <el-form-item label="是否有全网分红资格：" :label-width="formLabelWidth">
            <el-switch v-model="bonusFrom.isAllBonus" active-value="1" inactive-value="0" active-color="#13ce66"
              inactive-color="#ff4949">
            </el-switch>
          </el-form-item>
          <el-form-item label="当前可分红奖金池：" :label-width="formLabelWidth">
            <el-input v-model="bonusFrom.allBonusMoney" style="width:65%;"></el-input>
          </el-form-item>
          <el-form-item label="分红金额：" :label-width="formLabelWidth">
            <el-input v-model="bonusFrom.bonusMoney" style="width:65%;"></el-input>
          </el-form-item>
          <el-form-item label="是否有额外收益：" :label-width="formLabelWidth">
            <el-switch v-model="bonusFrom.isExtraBonus" active-value="1" inactive-value="0" active-color="#13ce66"
              inactive-color="#ff4949">
            </el-switch>
          </el-form-item>
          <el-form-item label="手机额外收益：" :label-width="formLabelWidth">
            <el-input v-model="bonusFrom.extraBonusPhone" style="width:65%;"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="bonusFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="updateConfig()">确 定</el-button>
        </div>
      </el-dialog>
    </el-tab-pane>
    <el-tab-pane label="套餐2分红配置" name="gradeBonus">
      <el-table v-loading="tableDataLoading" :data="gradeConfigData">
        <el-table-column fixed prop="id" label="编号" align="center" width="80">
        </el-table-column>
        <el-table-column prop="gradeCode" label="等级编码">
        </el-table-column>
        <el-table-column prop="gradeName" label="等级名称">
        </el-table-column>
        <el-table-column prop="updateGradeTeam" label="升级团队结构（部门数x编码)">
        </el-table-column>
        <el-table-column prop="updateGradeNum" label="升级销量">
        </el-table-column>
        <el-table-column prop="bonusDay" label="每日分红">
        </el-table-column>
        <el-table-column prop="bonusWeek" label="每周分红">
        </el-table-column>
        <el-table-column prop="maxBonusDay" label="日分红上限">
        </el-table-column>
        <el-table-column prop="bonusDayPool" label="日分红奖金池">
        </el-table-column>
        <el-table-column prop="bonusTeam" label="伞下分红金额">
        </el-table-column>
        <el-table-column prop="maxBonusTeam" label="每单伞下分红上限">
        </el-table-column>
        <el-table-column prop="bonusTeamPool" label="伞下分红池子">
        </el-table-column>
        <el-table-column prop="isGradeDiff" label="是否取级差">
        </el-table-column>
        <el-table-column prop="checkMonthAward" label="月考核奖励">
        </el-table-column>
        <el-table-column prop="checkMonthNum" label="月考核业绩">
        </el-table-column>
        <el-table-column prop="monthAward" label="月奖励">
        </el-table-column>
        <el-table-column prop="remark" label="说明">
        </el-table-column>
        <el-table-column label="操作" prop="id" width="120">
          <template slot-scope="scope">
            <!-- :disabled="!isAuth('allocationList:update')" -->
            <el-button size="mini" type="primary" disabled @click="findConfigById(scope.row.id)">编辑
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-tab-pane>
    <!-- 添加导航弹框 -->
    <el-dialog title="添加" :visible.sync="dialogFormVisible9" center>
      <div style="margin-bottom: 10px;">
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
      <div style="margin-bottom: 10px;margin-top: 10px;">
        <span style="width: 200px;display: inline-block;text-align: right;">排序：</span>
        <el-input-number size="medium" v-model="sort"></el-input-number>
      </div>
      <div style="margin-bottom: 10px;">
        <span style="width: 200px;display: inline-block;text-align: right;"> {{ nav == 10 ? '状态' : '小程序是否显示' }} ：</span>
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
        <el-form-item label="标题：" :label-width="formLabelWidth">
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
        <el-form-item label="排序：" :label-width="formLabelWidth" v-if="nav == 1 || nav == 10 || nav == 2">
          <el-input-number size="medium" v-model="formcomp.sort"></el-input-number>
        </el-form-item>
        <div style="margin-bottom: 10px;" v-if="nav == 1 || nav == 10">
          <span style="width: 200px;display: inline-block;text-align: right;">{{ nav == 10 ? '状态' : '小程序是否显示' }}
            ：</span>
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
      nav: '',
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
      content: '',
      image_url: '',
      image_url2: '',
      id: '',

      bannerData: [],
      form1: {
        id: '',
        url: '',
        image_url: '',
        type: '',
        state: '',
      },
      form: {
        id: '',
        title: '',
        url: '',
        content: '',
        type: 'word',
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
        sort: 1
      },
      sort: 1,
      configData: [],
      bonusFormVisible: false,
      bonusFrom: {
        id: null,
        rankCode: null,
        award: null,
        rankName: null,
        isAllBonus: null,
        allBonusMoney: null,
        bonusMoney: null,
        isExtraBonus: null,
        extraBonusPhone: null,
        remark: null,
        updateRankNum: null
      },
      gradeConfigData:[],

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
      if (tab._props.label == '首页公告') {
        this.state = 1
        this.dataSelect()
      }
      if (tab._props.label == '首页导航') {
        this.types1 = ''
        this.nav = 1
        this.homeSelect()
      }
      if (tab._props.label == '合作平台') {
        this.types1 = ''
        this.nav = 10
        this.homeSelect()
      }
      if (tab._props.label == '首页推广') {

        this.types1 = ''
        this.nav = 2
        this.homeSelect()
      }
      if (tab._props.label == '升级配置') {
        this.upgradeSelect()
      }
      if (tab._props.label == '精选商品') {
        this.choicenSelect()
        this.handpick()
      }
      if (tab._props.label == '首页轮播') {
        this.type = 1
        this.bannerSelect()
      }
      if (tab._props.label == '背景图') {
        this.type = 2
        this.bannerSelect()
      }
      if (tab._props.label == '套餐1分红配置') {
        // this.deployname = 'bonus';
        this.findConfigList();
      };
      if (tab._props.label == '套餐2分红配置') {
        // this.deployname = 'bonus';
        this.findGradeConfigList();
      };
    },
    handleAvatarSuccess(file) {
      this.image_url = file.data
    },
    handleAvatarSuccess2(file2) {
      this.form1.image_url = file2.data
    },
    // 添加首页导航弹框
    addNavigation() {
      this.dialogFormVisible9 = true
    },
    // 添加首页导航
    NagNoticeTo() {
      if (this.title == '') {
        this.$notify({
          title: '提示',
          duration: 1800,
          message: '请输入标题',
          type: 'warning'
        })
        return
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
      if (this.type == '') {
        this.$notify({
          title: '提示',
          duration: 1800,
          message: '请选择小程序是否显示',
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
      }).catch(() => { })
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
      this.form1.type = item.type
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
      this.form1.type = item.type
      this.form1.state = item.state

    },
    // 编辑轮播
    upgradbianTo2() {
      this.$http({
        url: this.$http.adornUrl2(
          `/banner/update/${this.form1.id}`
        ),
        method: 'post',
        // data: this.$http.adornData({
        params: this.$http.adornParams({
          'url': this.form1.url,
          'image': this.form1.image_url,
          'type': this.form1.type,
          'state': this.form1.state
        })
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
      }).catch(() => { })
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
      if (this.content == '') {
        this.$notify({
          title: '提示',
          duration: 1800,
          message: '请输入公告内容',
          type: 'warning'
        })
        return
      }
      this.$http({
        url: this.$http.adornUrl2('/message/add'),
        method: 'post',
        data: this.$http.adornData({
          'state': this.state,
          'content': this.content,
          'title': this.title,
          'type': 'word'
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
            this.content = "";
          }
        })
      })
    },
    // 修改公告弹框
    updates(index, rows) {
      this.form.state = rows.state
      this.dialogFormVisible1 = true
      this.form.id = rows.id
      this.form.title = rows.title
      rows.content && (this.form.content = rows.content)
      // this.form.url = rows.url
      // this.form.type = rows.type
    },
    // 修改公告
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
          'url': '',
          'content': this.form.content,
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
      }).catch(() => { })
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
    },
    // 修改商品类别
    compileNoticeTo() {
      if (this.formcomp.title == '') {
        this.$notify({
          title: '提示',
          duration: 1800,
          message: '请输入标题',
          type: 'warning'
        })
        return
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
      if (this.formcomp.type == '') {
        this.$notify({
          title: '提示',
          duration: 1800,
          message: '请选择小程序是否显示',
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
      }).catch(() => { })
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
      }).catch(() => { })
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
          `/activity/state/${this.nav}?page=${this.page - 1}&size=${this.size}&type=${this.types1}`),
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
    /* 获取分红配置 */
    findConfigList() {
      this.tableDataLoading = true;
      this.$http({
        url: this.$http.adornUrl2('/rank/findConfigList'),
        method: 'get'
      }).then(({ data }) => {
        if (data && data.status === 0) {
          this.tableDataLoading = false;
          this.configData = data.data;
        }
      })
    },
    /* 获取指定分红配置详情 */
    findConfigById(id) {
      this.bonusFormVisible = true;
      this.$http({
        url: this.$http.adornUrl2(`/rank/findConfigById/${id}`),
        method: 'get'
      }).then(({ data }) => {
        if (data && data.status === 0) {
          const {
            id,
            rankCode,
            award,
            rankName,
            isAllBonus,
            allBonusMoney,
            bonusMoney,
            isExtraBonus,
            extraBonusPhone,
            remark,
            updateRankNum } = data.data;
          this.bonusFrom = {
            id,
            rankCode,
            award,
            rankName,
            isAllBonus,
            allBonusMoney,
            bonusMoney,
            isExtraBonus,
            extraBonusPhone,
            remark,
            updateRankNum
          }
        }
      })
    },
    /* 修改分红配置 */
    updateConfig() {
      this.tableDataLoading = true;
      if (!this.bonusFrom.id) { return this.$message.error('未选择分红配置'); };
      this.$http({
        url: this.$http.adornUrl2('/rank/updateConfig'),
        method: 'post',
        data: this.bonusFrom
      }).then(({ data }) => {
        if (data && data.status === 0) {
          this.tableDataLoading = false;
          this.findConfigList();
          this.bonusFormVisible = false;
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    /* 获取套餐2分红配置 */
    findGradeConfigList() {
      this.tableDataLoading = true;
      this.$http({
        url: this.$http.adornUrl2('/grade/findGradeConfigList'),
        method: 'get'
      }).then(({ data }) => {
        if (data && data.status === 0) {
          this.tableDataLoading = false;
          this.gradeConfigData = data.data;
        }
      })
    },
  },
  mounted() {
    this.dataSelect()
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
