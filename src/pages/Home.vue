<template>
  <div class="home">
   <login-in/>
</div>
</template>

<script>
import LoginIn from '../pages/LoginIn'

export default {
  name: 'home',
  components: {
    LoginIn

  },
  data () {
    return {

    }
  },
  created () {
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
@import '../assets/css/home.scss';
</style>
