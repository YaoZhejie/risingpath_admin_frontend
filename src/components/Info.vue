<template>
  <div class="info">
    <p class="title">编辑个人资料</p>
    <hr/>
    <div class="personal">
      <el-form :model="registerForm" class="demo-ruleForm" label-width="80px">
        <el-form-item prop="userName" label="姓名">
          <el-input v-model="registerForm.userName" placeholder="姓名"></el-input>
        </el-form-item>
        <el-form-item prop="userAccount" label="用户名">
          <el-input v-model="registerForm.userAccount" :readonly="true" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item prop="professInfo" label="所学专业">
          <el-input v-model="registerForm.professInfo" placeholder="所学专业"></el-input>
        </el-form-item>
        <el-form-item prop="phone" label="手机">
          <el-input  placeholder="手机" v-model="registerForm.phone" ></el-input>
        </el-form-item>

      </el-form>
    <div class="btn">
      <div @click="saveMsg()">保存</div>
      <div @click="goback">取消</div>
    </div>
    </div>
</div>
</template>

<script>
import { mapGetters } from 'vuex'
import { updateUserMsg, getUserOfId } from '../api/index'
import { mixin } from '../mixins'
export default {
  name: 'info',
  mixins: [mixin],
  data: function () {
    return {
      registerForm: { // 注册
        userName: '',
        userAccount: '',
        professInfo: '',
        phone: ''
      },
    }
  },
  computed: {
    ...mapGetters([
      'userId'
    ])
  },
  created () {
    
  },
  mounted () {
    this.getMsg(this.userId)
    console.log(this.$router) // 打印 $router 对象
  },
  methods: {
    getMsg (id) {
      getUserOfId(id)
        .then(res => {
          this.registerForm.userName = res.userName
          this.registerForm.userAccount = res.userAccount
          this.registerForm.professInfo = res.professInfo
          this.registerForm.phone = res.phone
        })
        .catch(err => {
          console.log(err)
        })
    },
    goback () {
      this.$router.go(-1)
    },
    saveMsg () {
      let _this = this
      let params = {
        userId :this.userId,
        userName:this.registerForm.userName,
        userAccount: this.registerForm.userAccount,
        professInfo: this.registerForm.professInfo,
        // password: this.registerForm.password,
        phone:this.registerForm.phone
      }

      
      updateUserMsg(params)
        .then(res => {
          if (res.code === 1) {
            this.showError = false
            this.showSuccess = true
            // this.$store.commit('setuserName', this.registerForm.userName)
            this.$notify.success({
              title: '编辑成功',
              showClose: true
            })
            setTimeout(function () {
              _this.$router.go(-1)
            }, 2000)
          } else {
            this.showSuccess = false
            this.showError = true
            this.$notify.error({
              title: '编辑失败',
              showClose: true
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/css/info.scss';
</style>
