<template>
  <div class="info">
    <p class="title">修改密码</p>
    <hr />
    <div class="personal">
      <el-form :model="registerForm" class="demo-ruleForm" label-width="80px">
        <el-form-item prop="password" label="新密码">
          <el-input type="password" placeholder="输入新密码" v-model="registerForm.password"></el-input>
        </el-form-item>
        <el-form-item prop="checkPassword" label="确认密码">
          <el-input type="password" placeholder="确认新密码" v-model="registerForm.checkPassword"></el-input>
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
import { updatePassword } from '../api/index'
import { mixin } from '../mixins'
export default {
  name: 'info',
  mixins: [mixin],
  data: function () {
    return {
      registerForm: { // 修改密码表单
        password: '',
        checkPassword: '',
      },
    }
  },
  computed: {
    ...mapGetters([
      'userId'
    ])
  },
  created() {

  },
  mounted() {

  },
  methods: {
    goback() {
      this.$router.go(-1)
    },
    saveMsg() {
      let _this = this
      if (this.registerForm.password != this.registerForm.checkPassword) {
        this.notify('两次输入的密码不一致', 'error')
      }
      let params = {
        userId: this.userId,
        userPassword: this.registerForm.password,
        checkPassword: this.registerForm.checkPassword
      }

      updatePassword(params)
        .then(res => {
          if (res.code === 1) {
            this.showError = false
            this.showSuccess = true
            this.$notify.success({
              title: '修改密码成功',
              showClose: true
            })
            setTimeout(function () {
              _this.$router.go(-1)
            }, 2000)
          } else {
            this.showSuccess = false
            this.showError = true
            this.$notify.error({
              title: '修改密码失败',
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