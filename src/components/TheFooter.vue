<template>
  <div class="the-footer">
    <p v-for="(item, index) in list" :key="index">
      {{ item }}
    </p>
  </div>
</template>

<script>
export default {
  name: 'the-footer',
  data() {
    return {
      list: [
        `©2024 Designed by yzj `
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/css/the-footer.scss';
</style>
