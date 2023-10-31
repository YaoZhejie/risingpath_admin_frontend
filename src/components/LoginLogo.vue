<template>
  <div class="login-logo">
    <img :src="logo">
  </div>
</template>

<script>
export default {
  name: 'login-logo',
  data(){
    return{
      logo: require("../assets/img/loginAndRegister.jpg")
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/css/login-logo.scss';
</style>
