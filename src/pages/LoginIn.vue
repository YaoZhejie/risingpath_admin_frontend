<template>
<div class="login-in">
  <login-logo/>
  <div class="login">
    <div class="login-head">
      <span>帐号登录</span>
    </div>
    <el-form :model="loginForm" status-icon :rules="rules" ref="loginForm" class="demo-ruleForm" >
      <el-form-item prop="userAccount">
        <el-input placeholder="用户名" v-model="loginForm.userAccount"></el-input>
      </el-form-item>
      <el-form-item prop="userPassword">
        <el-input type="password" placeholder="密码" v-model="loginForm.userPassword" @keyup.enter.native="loginIn"></el-input>
      </el-form-item>
      <div class="login-btn">
        <el-button type="primary" @click="handleleLoginIn" >登录</el-button>
      </div>
    </el-form>
  </div>
</div>
</template>

<script>
import { mixin } from '../mixins'
import LoginLogo from '../components/LoginLogo'
import axios from 'axios'
export default {
  name: 'login-in',
  components: {
    LoginLogo
  },
  mixins: [mixin],
  data: function () {
    let validateName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('用户名不能为空'))
      } else {
        callback()
      }
    }
    let validatePassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        callback()
      }
    }
    return {
      loginForm: { // 登录用户名密码
        userAccount: '',
        userPassword: ''
      },
      rules: {
        username: [
          { validator: validateName, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { validator: validatePassword, message: '请输入密码', trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    this.changeIndex('登录')
  },
  methods: {
    changeIndex (value) {
      this.$store.commit('setActiveName', value)
    },
    handleleLoginIn () {
      let _this = this
      let params = {
        userAccount: this.loginForm.userAccount,
        userPassword: this.loginForm.userPassword,

        }
    axios.post('/user/login', params, {
              headers: { 'Content-Type': 'application/json' }
          },{ withCredentials: true }).then(response => {
              // 根据 code 判断是否登录成功
              if (response.data.code === 1) {
                _this.notify('登录成功', 'success')
                //组件间相互传值
                _this.$store.commit('setLoginIn',true);
                _this.$store.commit('setUserId',response.data.data.userId);
                _this.$store.commit('setUsername',response.data.data.userName);
                _this.$store.commit('setAvator',response.data.data.avatarUrl);
                setTimeout(function () {
              _this.$router.push({path: '/Info'})
            }, 1000)
              } else {
                // 登录失败，显示相应内容
                _this.notify('用户名或密码错误', 'error')
              }
            }).catch(error => {
              console.log(error)
            })
    },
    setUserMsg (item) {
      this.$store.commit('setUserId', item.id)
      this.$store.commit('setUsername', item.username)
      this.$store.commit('setAvator', item.avator)
    },
    changeIndex(value){
      this.$store.commit('setActiveName',value);
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/css/login-in.scss';
</style>
