<script setup lang="ts">
import useStore from '@/store'
import { reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()
const menu = reactive([
  {
    title: '首页',
    path: '/home'
  },
  {
    title: '浏览书籍',
    path: '/commodity'
  }
])
const { shop } = useStore()
function search() {}
</script>

<template>
  <div class="front-bar" v-show="!route.path.includes('workbench')">
    <img src="@/assets/img/logo.png" alt="" />
    <div class="menu-wrap">
      <div class="menu" v-for="(item, index) of menu" :key="index">
        <h3 :class="{ active: item.path === route.path }" @click="router.push(item.path)">{{ item.title }}</h3>
        <span class="divison">|</span>
      </div>
      <div class="category menu">
        <el-badge :value="shop().shopCartList.length" :hidden="!Boolean(shop().shopCartList.length)">
          <h3 :class="{ active: '/payment' === route.path }"  @click="router.push('/payment')">立即下单</h3>
        </el-badge>
      </div>
    </div>
    <div class="search">
      <el-input placeholder="商品搜索" size="large"></el-input>
      <el-button type="primary" size="large" @click="search">搜索</el-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.front-bar {
  max-width: $max-width;
  margin: 10px auto;
  display: flex;
  align-items: center;
  justify-content: space-around;
  img {
    width: 50px;
    height: 50px;
  }
  .menu-wrap {
    display: flex;
    &.divison:nth-last-child(1) {
      display: none;
    }
    .menu {
      display: flex;
      justify-content: center;
      align-items: center;
      h3 {
        color: #333;
        cursor: pointer;
        margin: 0;
        &.active {
          color: $main-color;
          pointer-events: none;
        }
        &:hover {
          color: $main-color;
          text-decoration: underline;
        }
      }
      .divison {
        margin: 0 15px;
      }
    }
  }
  .search {
    display: flex;
    align-items: center;
    button {
      margin-left: 15px;
    }
  }
}
</style>
