<template>
  <div id="app">
    <the-header/>
    <router-view />
    <!-- <scroll-top/> -->
    <the-footer/>
  </div>
</template>

<script>
import ScrollTop from './components/ScrollTop'
import TheHeader from './components/TheHeader'
import TheFooter from './components/TheFooter'


export default {
  name: 'App',
  components: {
    ScrollTop,
    TheHeader,
    TheFooter,
  }
}
</script>

<style  lang="scss" scoped>
@import './assets/css/app.scss';
</style>
