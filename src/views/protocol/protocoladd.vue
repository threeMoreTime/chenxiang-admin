<template>
  <div class="components-container main-cont">
    <div style="position: relative;">
      <div style="display: inline-block;font-size:18px;margin-bottom: 15px;">
        <a href="#" @click="prev" style="text-decoration:none;font-size: 14px;">
          <icon-svg name="jiantou" style="width: 1.2em;height: 1.2em;position: relative;top: 0.3em;"></icon-svg>
          返回
        </a>
        <span style="display: inline-block;margin: 0 15px;color: #D9D9D9;">|</span>
        <span>添加协议</span>
      </div>
      <el-row>
        <el-col :span="24">
          <span style="width:90px;display: inline-block;">协议标题：</span>
          <el-input style="width: 45%;" class="margin15" placeholder="请输入商品标题" v-model="title" autosize></el-input>
        </el-col>
      </el-row>
      <!-- <el-row>
			<el-col :span="6" >
				<div style="display: flex;align-items: center;margin: 2% 0;">
					<span style="display: inline-block;text-align: right;">简介图片：</span>
					<div style=" width:148px;height:148px;background-color: #fbfdff; border: 1px dashed #c0ccda;border-radius: 6px;text-align: center;line-height: 148px;">
						<el-upload
							class="avatar-uploader"
							v-model="picture"
							action="https://sqx.gomyorder.cn/tao/alioss/upload"
							:show-file-list="false"
							:on-success="handleAvatarSuccess"
							>
							<img v-if="picture" :src="picture" class="avatar" style="width: 140px;height: 140px;"/>
							<i v-else class="el-icon-plus avatar-uploader-icon" style="font-size: 28px;color: #8c939d"></i>
						</el-upload>
					</div>
				</div>
			</el-col>
		</el-row> -->
    </div>
    <div class="tinymce-content" style="display: flex;margin-top: 20px;">
      <div style="width:90px;">协议内容：</div>
      <!-- <textarea id="tinymceId" :value="content" class="tinymce-textarea"/> -->
      <quill-editor ref="myTextEditor" v-model="content" :options="quillOption"
        style="padding-bottom: 50px;height: 300px;width: 72%;display: inline-table;margin-bottom: 60px;">
      </quill-editor>
    </div>
    <div style="text-align: center;margin-top:30px;">
      <el-button style='margin:0 20px 0 0;' size="mini" type="primary" icon="document" @click="prev">返回上一页
      </el-button>
      <el-button size="mini" type="primary" icon="document" @click="artiReleass">添加简介
      </el-button>
    </div>
  </div>
</template>

<script>
  import {
    quillEditor
  } from 'vue-quill-editor'
  import 'quill/dist/quill.core.css'
  import 'quill/dist/quill.snow.css'
  import 'quill/dist/quill.bubble.css'
  import quillConfig from './quill-config.js'
  export default {
    name: 'news',
    components: {
      quillEditor
    },
    data() {
      return {
        title: '',
        articleUrl: '',
        picture: '',
        classifyId: '',
        createTime: '',
        state: 1,
        formwz: {
          id: '',
          picture: '',
          articleUrl: '',
          content: '',
          title: '',
          classifyId: '',
          createTime: ''
        },
        quillOption: quillConfig,
        info: {
          stockDate: this.getNowTime(), //日期
        },
        hasChange: false,
        hasInit: false,
        tinymceId: 'tinymceId',
        height: 435,
        toolbar: [],
        state: 1,
        menubar: 'file edit insert view format table',
        languageTypeList: {
          'en': 'en',
          'zh': 'zh_CN'
        },
        artiCletypes: [],
        // 富文本内容
        content: ''
      }
    },
    watch: {
        // content(val) {
        //     if (!this.hasChange && this.hasInit) {
        //         this.$nextTick(() => window.tinymce.get(this.tinymceId).setContent(val || ''))
        //     }
        // }
    },
    methods: {
      // 图标上传
      handleAvatarSuccess(file) {
        this.picture = file.data;
      },
      //处理默认选中当前日期
      getNowTime() {
        var now = new Date();
        var year = now.getFullYear(); //得到年份
        var month = now.getMonth(); //得到月份
        var date = now.getDate(); //得到日期
        var hh = now.getHours() < 10 ? "0" + now.getHours() : now.getHours();
        var mm = now.getMinutes() < 10 ? "0" + now.getMinutes() : now.getMinutes();
        var ss = now.getSeconds() < 10 ? "0" + now.getSeconds() : now.getSeconds();
        month = month + 1;
        month = month.toString().padStart(2, "0");
        date = date.toString().padStart(2, "0");
        var defaultDate = `${year}-${month}-${date} ${hh}:${mm}:${ss}`;
        return defaultDate;
        this.$set(this.info, "stockDate", defaultDate);
      },
      // 返回上一级
      prev() {
        this.$router.back()
      },
      // 添加简介
      artiReleass() {
        if (this.title == '') {
          this.$notify({
            title: '提示',
            duration: 1800,
            message: '请输入协议标题',
            type: 'warning'
          });
          return
        }
        if (this.content == '') {
          this.$notify({
            title: '提示',
            duration: 1800,
            message: '请输入协议内容',
            type: 'warning'
          });
          return
        }
        this.$http({
          url: this.$http.adornUrl2('/agreement/save'),
          method: 'post',
          data: this.$http.adornData({
            'content': this.content,
            'title': this.title
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
              this.title = ''
              this.content = ''
              // this.$router.push({
              //   path: '/protocol'
              // })
              this.$router.back()
            }
          })
        })
      },
      // init() {
      //     load(tinymceCDN, (err) => {
      //         if (err) {
      //             this.$message.error(err.message)
      //             return
      //         }
      //         this.initTinymce()
      //     })
      // },

      // initTinymce() {
      //     const _this = this
      //     window.tinymce.init({
      //         selector: `#${this.tinymceId}`,
      //         images_upload_handler: function (blobInfo, success, failure) {
      //             var xhr, formData;

      //             xhr = new XMLHttpRequest();
      //             xhr.withCredentials = false;
      //             xhr.open('POST', "https://sqx.gomyorder.cn/tao/alioss/upload");
      //             xhr.onload = function () {
      //                 var json;

      //                 if (xhr.status != 200) {
      //                     failure('HTTP Error: ' + xhr.status);
      //                     return;
      //                 }
      //                 json =JSON.parse(xhr.responseText);
      //                 if (json == "" || json == null) {
      //                     failure('Invalid JSON: ' + xhr.responseText);
      //                     return;
      //                 }
      //                 success(json.data);
      //             };
      //             formData = new FormData();
      //             formData.append('file', blobInfo.blob(), blobInfo.filename());
      //             xhr.send(formData);
      //         },
      //         language: this.languageTypeList['zh'],
      //         height: this.height,
      //         body_class: 'panel-body ',
      //         object_resizing: false,
      //         toolbar: this.toolbar.length > 0 ? this.toolbar : toolbar,
      //         plugins,
      //         menubar: this.menubar,
      //         end_container_on_empty_block: true,
      //         powerpaste_word_import: 'clean',
      //         code_dialog_height: 450,
      //         code_dialog_width: 1000,
      //         advlist_bullet_styles: 'square',
      //         advlist_number_styles: 'default',
      //         imagetools_cors_hosts: ['www.tinymce.com', 'codepen.io'],
      //         default_link_target: '_blank',
      //         link_title: false,
      //         // Image
      //         imagetools_toolbar: 'rotateleft rotateright | flipv fliph | editimage imageoptions',
      //         nonbreaking_force_tab: true, // inserting nonbreaking space &nbsp; need Nonbreaking Space Plugin
      //         init_instance_callback: editor => {
      //             if (_this.content) {
      //                 editor.setContent(_this.content)
      //             }
      //             _this.hasInit = true
      //             editor.on('NodeChange Change KeyUp SetContent', () => {
      //                 this.hasChange = true
      //                 this.content = editor.getContent()
      //             })
      //         },
      //         setup(editor) {
      //             editor.on('FullscreenStateChanged', (e) => {
      //                 _this.fullscreen = e.state
      //             })
      //         }
      //     })
      // },
      // destroyTinymce() {
      //     const tinymce = window.tinymce.get(this.tinymceId)
      //     if (this.fullscreen) {
      //         tinymce.execCommand('mceFullScreen')
      //     }
      //     if (tinymce) {
      //         tinymce.destroy()
      //     }
      // }
    },
    mounted() {
      // this.init()
    },
    // beforeDestroy() {
    //     this.destroyTinymce()
    // },
    // activated() {
    //     if (window.tinymce) {
    //         this.initTinymce()
    //     }
    // },
    // deactivated() {
    //     this.destroyTinymce()
    // }
  }
</script>

<style scoped="scoped">
  .main-cont {
    max-width: 100%;
    min-width: 80%;
    padding-bottom: 5%;
    background-color: #fff;
  }

  .tinymce-container {
    position: relative;
    line-height: normal;
  }

  .tinymce-container>>>.mce-fullscreen {
    z-index: 10000;
  }

  .tinymce-textarea {
    visibility: hidden;
    z-index: -1;
  }

  .hide .el-upload--picture-card {
    display: none;
  }

  .margin15 {
    margin-right: 15px;
    margin-top: 10px;
  }

  .ruleitem {
    padding-left: 10px;
    margin-top: 15px;
  }

  .ruleitem .ruleicon {
    position: relative;
    top: 3px;
    left: 2px;
    width: 1.2em;
    height: 1.2em;
  }

  .el-tag+.el-tag {
    margin-left: 10px;
  }

  .button-new-tag {
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

  .el-input--small .el-input__inner {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }

  .el-table--enable-row-transition .el-table__body td {
    text-align: center;
  }

  .imgWrap .avatar-uploader .el-upload {
    width: 60px;
  }

  .el-table .cell {
    text-align: center !important;
  }

  .el-tag--medium {
    margin-right: 10px;
  }
</style>
