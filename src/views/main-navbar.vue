<template>
  <nav class="site-navbar" :class="'site-navbar--' + navbarLayoutType">
    <div class="site-navbar__header">
      <h1 class="site-navbar__brand">
        <a class="site-navbar__brand-lg" href="javascript:;">智创联盟管理系统</a>
        <a class="site-navbar__brand-mini" href="javascript:;">
          <img src="~@/assets/img/avatar.png" style="width:30px;height:30px; border-radius: 50%;">
        </a>
      </h1>
    </div>
    <div class="site-navbar__body clearfix">
      <el-menu class="site-navbar__menu" mode="horizontal">
        <el-menu-item class="site-navbar__switch" index="0" @click="sidebarFold = !sidebarFold">
          <icon-svg name="zhedie"></icon-svg>
        </el-menu-item>
      </el-menu>
      <el-menu class="site-navbar__menu site-navbar__menu--right" mode="horizontal">
        <el-menu-item index="1" style="position: relative;" @click="$router.push({ name: 'vueMchat' })">
          <template slot="title">
            <span class="left-number" v-if="chatNumMessage">{{ chatNumMessage }}</span>
            <icon-svg name="xiaoxi" class="el-icon-setting" style="font-size: 28px;"></icon-svg>
            <!-- 消息提示 -->
            <audio id="audio" controls preload hidden="hidden" autoplay="autoplay" v-if="chatNumMessage > 0">
              <source src="https://pw.xianmxkj.com/file/uploadPath/2022/01/19/0753211f78d718d44ee6372e33eae9ee.mp3"
                type="audio/mpeg">
            </audio>
            <!-- 订单提示 -->
            <audio id="audio1" preload hidden="hidden" autoplay="autoplay" v-if="chatNumMessage2 > 0">
              <source src="https://pw.xianmxkj.com/file/uploadPath/2022/01/12/01beb0bc15549b9aa4d18027a7751bae.mp3"
                type="audio/mpeg">
            </audio>
          </template>
        </el-menu-item>
        <el-menu-item class="site-navbar__avatar" index="3">
          <el-dropdown :show-timeout="0" placement="bottom">
            <span class="el-dropdown-link">
              <span style="margin-right: 10px;">{{ username ? username : '' }} <span
                  v-if="username">,欢迎您登录</span></span>
              <img src="~@/assets/img/avatar.png" :alt="userName">
            </span>
            <el-dropdown-menu slot="dropdown">
              <!-- <el-dropdown-item @click.native="updatePasswordHandle()">修改密码</el-dropdown-item> -->
              <el-dropdown-item @click.native="logoutHandle()">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-menu-item>
      </el-menu>
    </div>
    <!-- 弹窗, 修改密码 -->
    <update-password v-if="updatePassowrdVisible" ref="updatePassowrd"></update-password>
  </nav>
</template>

<script>
import UpdatePassword from './main-navbar-update-password'
import {
  clearLoginInfo
} from '@/utils'
export default {
  data() {
    return {
      updatePassowrdVisible: false,
      username: '',
      intervalId: 0,
      chatNumMessage: 0,
      chatNumMessage2: 0,
      errCount: 0
    }
  },
  components: {
    UpdatePassword
  },
  computed: {
    navbarLayoutType: {
      get() {
        return this.$store.state.common.navbarLayoutType
      }
    },
    sidebarFold: {
      get() {
        return this.$store.state.common.sidebarFold
      },
      set(val) {
        this.$store.commit('common/updateSidebarFold', val)
      }
    },
    mainTabs: {
      get() {
        return this.$store.state.common.mainTabs
      },
      set(val) {
        this.$store.commit('common/updateMainTabs', val)
      }
    },
    userName: {
      get() {
        return this.$store.state.user.name
      }
    }
  },
  methods: {
    // 修改密码
    updatePasswordHandle() {
      this.updatePassowrdVisible = true
      this.$nextTick(() => {
        this.$refs.updatePassowrd.init()
      })
    },
    // 退出
    logoutHandle() {
      this.$confirm(`确定进行[退出]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$cookie.set('token', '')
        this.$cookie.set('userId', '')
        sessionStorage.clear()
        clearInterval(this.chatNumMessage2)
        clearInterval(this.chatNumMessage)
        this.$router.push({
          name: 'login'
        })
      }).catch(() => { })
    },
    // 获取用户信息
    userSelect() {
      let userId = this.$cookie.get('userId')
      this.$http({
        url: this.$http.adornUrl2(`/admin/${userId}`),
        method: 'get',
        params: this.$http.adornParams({})
      }).then(({
        data
      }) => {
        let returnData = data.data;
        if (returnData == null) {
          this.$notify({
            title: '提示',
            duration: 1800,
            message: '用户信息失效，退出登录',
            type: 'warning'
          });
          this.$cookie.set('token', '')
          this.$cookie.set('userId', '')
          // sessionStorage.clear()
          this.$router.push({
            path: '/login'
          });
        } else {
          this.username = returnData.phone
        }
      })
    },
    // 消息提醒
    newsSelect() {
      var _this = this
      this.$http({
        url: this.$http.adornUrl2(`/orders/remindOrder`),
        method: 'get',
        params: this.$http.adornParams({})
      }).then(({
        data
      }) => {
        console.log("++++++++++++++++++++++", data.data)
        if (data.data > 0) {
          this.$notify.info({
            title: '消息',
            dangerouslyUseHTMLString: true,
            message: '有' + data.data + '件商品提醒发货，请前往自营商城待处理订单页面处理。',
            offset: 80,
            duration: 0,
            type: "warning",
            onClose() {
              _this.defineCallBack();
            }
          });
          this.chatNumMessage2 = data.data
          this.startPlay()
        } else {
          this.chatNumMessage2 = 0
        }
      })
    },
    defineCallBack() {
      this.$router.replace({
        name: 'disposeOrder'
      })
    },
    // 获取聊天消息
    chatSelect() {
      this.$http({
        url: this.$http.adornUrl2('/chat/count'),
        method: 'get',
        params: this.$http.adornParams({
          'storeId': 0
        })
      }).then(({
        data
      }) => {
        let returnData = data.data;
        this.chatNumMessage = returnData
        if (this.chatNumMessage == 0) {
          this.isshow = false
        } else {
          this.isshow = true
        }
      })
    },
    // const audio_url = 'http://data.huiyi8.com/2017/gha/03/17/1702.mp3'
    // this.$refs.audio.src = audio_url
    // 获取聊天消息
    chatSelect2() {
      this.$http({
        url: this.$http.adornUrl2('/chat/count'),
        method: 'get',
        params: this.$http.adornParams({
          'storeId': 0
        })
      }).then(({
        data
      }) => {
        let returnData = data.data;
        if (data.data > 0) {
          if (this.errCount != data.data) {
            this.$notify.info({
              title: '消息',
              dangerouslyUseHTMLString: true,
              message: '您有' + data.data + '条未读消息。',
              offset: 80,
              duration: 2500,
              type: "warning"
            });
            this.chatNumMessage = data.data
            this.errCount = data.data
            this.aplayAudio()
          }
        } else {
          this.chatNumMessage = 0
          this.errCount = 0
        }
      })
    },
    aplayAudio() {
      document.getElementById('audio').play()
    },
    startPlay() {
      document.getElementById('audio1').play()
    },
  },
  mounted() {
    this.userSelect()
    this.chatSelect()
    this.chatSelect2()
  },
  // created() {
  //   this.newsSelect()
  //   this.intervalId = setInterval(() => {
  //     this.newsSelect()
  //   }, 300000)
  // },
  // beforeDestroy() {
  //   clearInterval(this.intervalId)
  // },
  created() {
    // this.chatNumMessage2 = setInterval(() => {
    //   var token = this.$cookie.get('token')
    //   if (token !== '') {
    //     this.newsSelect()
    //   } else {
    //     clearInterval(this.chatNumMessage2)
    //   }
    // }, 10000)
    // this.chatNumMessage = setInterval(() => {
    //   var token = this.$cookie.get('token')
    //   if (token !== '') {
    //     this.chatSelect2()
    //   } else {
    //     clearInterval(this.chatNumMessage)
    //   }
    // }, 5000)
  },
  beforeDestroy() {
    clearInterval(this.intervalId)
    clearInterval(this.chatNumMessage)
  }

}
</script>
<style scoped="scoped">
.site-navbar__avatar .el-dropdown-link>img {
  height: 36px;
}

.left-number {
  position: absolute;
  top: 0;
  right: 20px;
  width: 18px;
  height: 18px;
  line-height: 18px;
  border-radius: 50%;
  background: #ff4949;
  color: #ffffff;
  text-align: center;
  font-size: 10px;
  font-family: PingFang SC, PingFang SC-Regular;
  font-weight: 400;
  margin-top: 5px;
}
</style>
