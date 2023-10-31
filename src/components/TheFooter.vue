<template>
  <div class="the-footer">
    <p v-for="(item, index) in list" :key="index">
      {{item}}
    </p>
  </div>
</template>

<script>
export default {
  name: 'the-footer',
  data () {
    return {
      list: [
      `浙ICP备2023018293号-1`,
        `Designed by Yzj`
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/css/the-footer.scss';
</style>
