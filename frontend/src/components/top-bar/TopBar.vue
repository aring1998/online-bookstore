<script setup lang="ts">
import useStore from '@/store';
import { ElMessage } from 'element-plus';
import { ref } from 'vue'
import AccountModal from './components/AccountModal.vue'
const accountShow = ref(false)
const { user } = useStore()
function logout() {
  user().userInfo = null
  ElMessage.success('退出成功')
}
</script>

<template>
  <div class="nav-wrap">
    <div class="nav">
      <div class="left">
        <router-link to="/">欢迎光临网上书店</router-link>
      </div>
      <div class="right">
        <div v-show="!user().userInfo?.id">
          <a @click="accountShow = true">登录</a>
        </div>
        <div v-show="user().userInfo?.id">
          <a>欢迎，{{ user().userInfo?.username }}</a>
          <span>|</span>
          <router-link to="/workbench">进入后台</router-link>
          <span>|</span>
          <a @click="logout">登出</a>
        </div>
      </div>
    </div>
  </div>
  <AccountModal :visiable="accountShow" :before-close="() => accountShow = false" @show="accountShow = false"></AccountModal>
</template>

<style lang="scss" scoped>
.nav-wrap {
  background-color: #e8eaed;
  .nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    max-width: 1010px;
    margin: 0 auto;
    color: #666;
    height: 40px;
    .right {
      span {
        margin: 0 10px;
      }
    }
  }
  a {
    color: #666;
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
