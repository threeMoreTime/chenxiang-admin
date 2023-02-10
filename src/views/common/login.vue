<template>
  <div class="site-wrapper site-page--login">
    <div class="site-content__wrapper">
      <div class="site-content">
        <div class="login-main">
          <h3 class="login-title">智创联盟管理系统</h3>
          <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
            status-icon>
            <el-form-item prop="userName">
              <el-input v-model="dataForm.userName" placeholder="帐号"></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input v-model="dataForm.password" type="password" placeholder="密码"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button class="login-btn-submit" type="primary" @click="dataFormSubmit()">登录</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getUUID } from '@/utils'
export default {
  data() {
    return {
      dataForm: {
        userName: '',
        password: '',
        uuid: '',
        captcha: ''
      },
      dataRule: {
        userName: [
          { required: true, message: '帐号不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ],
        captcha: [
          { required: true, message: '验证码不能为空', trigger: 'blur' }
        ]
      },
      captchaPath: ''
    }
  },
  created() {
  },
  methods: {
    // 提交表单
    dataFormSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl2(`/admin/login/${this.dataForm.userName}/${this.dataForm.password}`),
            method: 'post',
            data: this.$http.adornData({
              // 'username': this.dataForm.userName,
              // 'password': this.dataForm.password,
            })
          }).then(({ data }) => {
            if (data.status === 0) {
              this.$cookie.set('token', data.data.uuid)
              this.$cookie.set('userId', data.data.adminId)
              this.getRouter(data.data.adminId)
              // this.$router.replace({ name: 'home'})
            } else {
              this.$message.error(data.msg)
            }
          })
        }
      })
    },
    getRouter(userId) {
      this.$http({
        url: this.$http.adornUrl2(`/sys/menu/nav?userId=${userId}`),
        method: 'get',
        params: this.$http.adornData()
      }).then(({ data }) => {
        if (data && data.status === 0) {
          // fnAddDynamicMenuRoutes(data.data.menuList)
          // router.options.isAddDynamicMenuRoutes = true
          sessionStorage.setItem('menuList', JSON.stringify(data.data.menuList || '[]'))
          sessionStorage.setItem('permissions', JSON.stringify(data.data.permissions || '[]'))
          // next({ ...to, replace: true })
          this.$router.replace({ name: 'home' })
        } else {
          sessionStorage.setItem('menuList', '[]')
          sessionStorage.setItem('permissions', '[]')
          // next()
        }
      })
    },
  }
}
</script>

<style lang="scss">
.site-wrapper.site-page--login {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(38, 50, 56, .2);
  overflow: hidden;

  &:before {
    position: fixed;
    top: 0;
    left: 0;
    z-index: -1;
    width: 100%;
    height: 100%;
    content: "";
    background-image: url(~@/assets/img/login_bg.jpg);
    background-size: cover;
  }

  .site-content__wrapper {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    padding: 0;
    margin: 0;
    overflow-x: hidden;
    overflow-y: auto;
    background-color: transparent;
  }

  .site-content {
    min-height: 100%;
    // padding: 30px 500px 30px 30px;
  }

  .brand-info {
    margin: 220px 100px 0 90px;
    color: #fff;
  }

  .brand-info__text {
    margin: 0 0 22px 0;
    font-size: 48px;
    font-weight: 400;
    text-transform: uppercase;
  }

  .brand-info__intro {
    margin: 10px 0;
    font-size: 16px;
    line-height: 1.58;
    opacity: .6;
  }

  .login-main {
    position: absolute;
    top: 50%;
    left: 50%;
    margin-left: -200px;
    margin-top: -150px;
    padding: 20px 30px;
    width: 400px;
    border-radius: 8px;
    background-color: #fff;
  }

  .login-title {
    font-size: 20px;
    text-align: center;
    margin-top: 10px;
  }

  .login-captcha {
    overflow: hidden;

    >img {
      width: 100%;
      cursor: pointer;
    }
  }

  .login-btn-submit {
    width: 100%;
    margin-top: 38px;
  }
}
</style>
