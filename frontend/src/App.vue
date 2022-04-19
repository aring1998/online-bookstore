<script setup lang="ts">
import { onMounted } from 'vue'
import { AccountApiRes } from './components/top-bar/components/types/account'
import TopBar from './components/top-bar/TopBar.vue'
import FooterBar from './components/footer-bar/FooterBar.vue';
import useStore from './store'
import api from './utils/api'
onMounted(async () => {
  const { data } = await api.post<null, AccountApiRes>('user/token')
  useStore().user().userInfo = data
})
</script>

<template>
  <TopBar></TopBar>
  <router-view></router-view>
  <FooterBar></FooterBar>
</template>

<style lang="scss">
@import './assets/styles/index.scss';
</style>
