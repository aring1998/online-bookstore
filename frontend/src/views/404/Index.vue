<script setup lang="ts">
  
</script>

<template>
  <div class="not-found base-wrap">
    <h2>404</h2>
    <span>不好意思，页面找不到啦~</span>
  </div>
</template>

<style lang="scss" scoped>
  .not-found {
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
    width: $max-width;
    height: 500px;
    h2 {
      font-size: 50px;
      margin-bottom: 30px;
    }
    span {
      font-size: 20px;
    }
  }
</style>
