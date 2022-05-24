<script setup lang="ts">
import { onMounted } from 'vue'
import { AccountApiRes } from './components/top-bar/components/types/account'
import TopBar from './components/top-bar/TopBar.vue'
import FrontBar from './components/front-bar/FrontBar.vue'
import ShopCart from './components/shop-cart/ShopCart.vue'
import FooterBar from './components/footer-bar/FooterBar.vue'
import useStore from './store'
import api from './utils/api'
onMounted(async () => {
  try {
    if (!localStorage.getItem('token')) return
    const { data } = await api.post<null, AccountApiRes>('user/token')
    useStore().user().userInfo = data
  } catch {
    localStorage.removeItem('token')
  }
})
</script>

<template>
  <TopBar></TopBar>
  <FrontBar></FrontBar>
  <ShopCart></ShopCart>
  <router-view></router-view>
  <FooterBar></FooterBar>
</template>

<style lang="scss">
@import './assets/styles/index.scss';
</style>
