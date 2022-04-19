<script setup lang="ts">
import { ref } from 'vue'
import type { TabsPaneContext } from 'element-plus'
import { useRoute, useRouter } from 'vue-router';

const router = useRouter()
const route = useRoute()
const activeName = ref(route.path?.replace('/workbench/', ''))
const tabClick = (tab: TabsPaneContext) => {
  router.push(`/workbench/${tab.paneName}`)
}
</script>

<template>
  <div class="workbench-tabs">
    <el-tabs v-model="activeName" @tab-click="tabClick">
      <el-tab-pane label="分类管理" name="category"></el-tab-pane>
      <el-tab-pane label="商品管理" name="commodity"></el-tab-pane>
      <el-tab-pane label="订单管理" name="order"></el-tab-pane>
      <router-view></router-view>
    </el-tabs>
  </div>
</template>

<style lang="scss" scoped>
.workbench-tabs {
  width: $max-width;
  margin: 0 auto;
  margin-top: 40px;
}

</style>
