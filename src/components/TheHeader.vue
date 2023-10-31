<template>
  <div class="the-header">
    <div class="collapse-btn" v-show="loginIn" @click="collapseChange">
      <el-tooltip effect="dark" :content="collapse?`打开菜单`:`收缩菜单`" placement="bottom">
        <i class="el-icon-set-up"></i>
          </el-tooltip>
    </div>
    <!--图标-->
    <img :src="logo" class="header-logo">
    <div class="header-logo"> 
      <span>{{Name}}</span>
    </div>

    <!--设置-->
    <div class="header-right" v-show="loginIn">
      <div class="textClass"  v-show="loginIn">
      {{ "欢迎您："+this.username }}
   </div>
      <div id="user">
        <img :src="imageData" alt="Image" v-if="imageData">
      </div>
      <ul class="menu">
        <li v-for="(item, index) in menuList" :key="index" @click="goMenuList(item.path)">{{item.name}}</li>
      </ul>
    </div>

        <!-- 全屏显示 -->
        <div class="btn-fullscreen" v-show="loginIn" @click="handleFullScreen">
          <el-tooltip effect="dark" :content="fullscreen?`取消全屏`:`全屏`" placement="bottom">
            <i class="el-icon-rank"></i>
          </el-tooltip>
        </div>
  </div>
</template>

<script>
import { mixin } from '../mixins'
import { mapGetters } from 'vuex'
import {loginMsg, menuList} from '../assets/data/header'
import bus from '../assets/js/bus'
import axios from 'axios'
export default {
  name: 'the-header',
  mixins: [mixin],
  data () {
    return {
      logo: require("../assets/logo.jpg"),
      imageData: '',
      Name: '浙江专升本信息查询系统',
      // loginMsg: [], // 右侧导航栏
      menuList: [], // 用户下拉菜单项
      keywords: '',
      collapse:true,
      fullscreen:false,
      // avatarUrl: '',
    }
  },
  computed: {
    ...mapGetters([
      'userId',
      'activeName',
      'avator',
      'username',
      'loginIn'
    ])
  },
  created () {
    this.loginMsg = loginMsg
    this.menuList = menuList
    this.fetchImage();
    // this.goPage
  },
  mounted () {
    document.querySelector('#user').addEventListener('click', function (e) {
      document.querySelector('.menu').classList.add('show')
      e.stopPropagation()// 关键在于阻止冒泡
    }, false)
    // 点击“菜单”内部时，阻止事件冒泡。(这样点击内部时，菜单不会关闭)
    document.querySelector('.menu').addEventListener('click', function (e) {
      e.stopPropagation()
    }, false)
    document.addEventListener('click', function () {
      document.querySelector('.menu').classList.remove('show')
    }, false)

  },
  methods: {
    fetchImage() {
      // 发送请求到后端接口获取图片数据
      // 假设后端接口返回的数据是图片文件的字节数组
      // 可以使用axios或fetch等工具发送请求
      const imageURL = this.avator; // 数据库中的图片地址

      if (imageURL!=null) {
        // 发送请求到后端接口获取图片数据
        // 假设后端接口返回的数据是图片文件的字节数组
        // 可以使用axios或fetch等工具发送请求
       axios.get(`/avatorImages/${this.avator}`, { responseType: 'arraybuffer' })
        .then(response => {
          const imageBuffer = Buffer.from(response.data, 'binary');
          const imageBase64 = 'data:image/jpeg;base64,' + imageBuffer.toString('base64');
          this.imageData = imageBase64;
        })
        .catch(error => {
          console.error(error);
        });
      } else {
        // 使用默认的头像URL
        this.imageData = 'https://bpic.51yuansu.com/pic2/cover/00/30/60/581089402dbcb_610.jpg';
      }
    },
    async logout() {
      try {
        const response = await axios.post('/user/logout');
        if (response.data.code === 1) {
            console.log("退出成功！")
        } else {
          // 退出登录失败，弹出提示框
          this.$message.error('退出登录失败！');
        }
      } catch (error) {
        // API 调用错误，弹出提示框
        this.$message.error('网络异常，请稍后再试！');
      }
    },
    // goHome () {
    //   this.$router.push({path: '/'})
    // },
    goPage (path, value) {
      document.querySelector('.menu').classList.remove('show')
      this.changeIndex(value)
      if (!this.loginIn && path === '/') {
        this.notify('请先登录', 'warning')
      } else {
        this.$router.push({path: path})
      }
    },
    changeIndex (value) {
      this.$store.commit('setActiveName', value)
    },
    goMenuList (path) {
      if (path === 0) {
        this.$store.commit('setIsActive', false)
        this.logout();
        localStorage.removeItem('token')
        localStorage.removeItem('userId')
        localStorage.removeItem('avator')
        localStorage.removeItem('username')
        this.$store.commit('setLoginIn', false)
        this.$router.push({path: '/'})
        window.location.reload();
      }
      document.querySelector('.menu').classList.remove('show')
      if (path) {
        this.$router.push({path: path})
      } 
    },
    collapseChange(){
      //侧边栏折叠
      this.collapse = !this.collapse;
      bus.$emit('collapse',this.collapse);
    },
    // 全屏事件
    handleFullScreen () {
      let element = document.documentElement
      if (this.fullscreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen()
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen()
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen()
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen()
        }
      } else {
        if (element.requestFullscreen) {
          element.requestFullscreen()
        } else if (element.webkitRequestFullScreen) {
          element.webkitRequestFullScreen()
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen()
        } else if (element.msRequestFullscreen) {
          element.msRequestFullscreen()
        }
      }
      this.fullscreen = !this.fullscreen
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/css/the-header.scss';
.textClass {
  font-size: 22px;
  // font-weight: bold;
  font-style: italic;
  font-family: sans-serif、serif、monospace;
  color: rgb(33, 192, 254);
}
</style>
