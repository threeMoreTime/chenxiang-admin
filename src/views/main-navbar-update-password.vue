<template>
  <el-dialog
    title="修改密码"
    :visible.sync="visible"
    :append-to-body="true">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="账号">
        <span>{{ username }}</span>
      </el-form-item>
      <el-form-item label="原密码" prop="password">
        <el-input type="password" v-model="dataForm.password"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <el-input type="password" v-model="dataForm.newPassword"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPassword">
        <el-input type="password" v-model="dataForm.confirmPassword"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { clearLoginInfo } from '@/utils'
  export default {
    data () {
      var validateConfirmPassword = (rule, value, callback) => {
        if (this.dataForm.newPassword !== value) {
          callback(new Error('确认密码与新密码不一致'))
        } else {
          callback()
        }
      }
      return {
        visible: false,
		username:'',
		id:'',
        dataForm: {
          password: '',
          newPassword: '',
          confirmPassword: ''
        },
        dataRule: {
          password: [
            { required: true, message: '原密码不能为空', trigger: 'blur' }
          ],
          newPassword: [
            { required: true, message: '新密码不能为空', trigger: 'blur' }
          ],
          confirmPassword: [
            { required: true, message: '确认密码不能为空', trigger: 'blur' },
            { validator: validateConfirmPassword, trigger: 'blur' }
          ]
        }
      }
    },
    computed: {
      userName: {
        get () { return this.$store.state.user.name }
      },
      mainTabs: {
        get () { return this.$store.state.common.mainTabs },
        set (val) { this.$store.commit('common/updateMainTabs', val) }
      }
    },
    methods: {
      // 初始化
      init () {
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
        })
      },
      // 表单提交
			// admin/password/30/ly123456/ly000000
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl2(`/admin/password/${this.id}/${this.dataForm.password}/${this.dataForm.newPassword}`),
              method: 'post',
              data: this.$http.adornData({
                'password': this.dataForm.password,
                'newPassword': this.dataForm.newPassword
              })
            }).then(({data}) => {
              if (data && data.status === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.visible = false
                    this.$nextTick(() => {
                      this.mainTabs = []
                      clearLoginInfo()
                      this.$router.replace({ name: 'login' })
                    })
                  }
                })
              } else {
                this.$message.error(data.msg)
              }
            })
          }
        })
      },
	  // 获取用户信息
	  userSelect () {
	  	let userId = this.$cookie.get('userId')
	    this.$http({
	  	url: this.$http.adornUrl2(`/admin/${userId}`),
	  	method: 'get',
	  	params: this.$http.adornParams({
	  	})
	    }).then(({data}) => {
	  	let returnData = data.data;
	  	this.username = returnData.phone
		this.id = returnData.id
	    })
	  },
    },
	mounted() {
		this.userSelect()
	}
  }
</script>

