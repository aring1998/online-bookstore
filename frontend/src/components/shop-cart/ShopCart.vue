<script setup lang="ts">
import useStore from '@/store'
import { ShoppingCart } from '@element-plus/icons-vue'
import { ref, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const useShopStore = useStore().shop
const badgeHide = ref(true)
watch(
  useStore().shop().shopCartList,
  () => {
    badgeHide.value = false
  },
  { deep: true }
)
</script>

<template>
  <div class="shop-cart" v-show="!route.path.includes('workbench') && !route.path.includes('payment')" @mouseover="badgeHide = true">
    <el-badge value="新" :hidden="badgeHide">
      <el-popover placement="top" :width="300" trigger="hover">
        <template #reference>
          <el-icon><shopping-cart /></el-icon>
        </template>
        <div class="shop-list" v-show="useShopStore().shopCartList.length">
          <div class="item" v-for="item of useShopStore().shopCartList" :key="item.id">
            <div class="intro">
              <div class="img-wrap">
                <img :src="item.imgUrl" alt="" height="40" />
              </div>
              <div>
                <p>{{ item.name }}</p>
                <p>￥{{ (item.price! * item.num).toFixed(2) }}</p>
              </div>
            </div>
            <div class="num">
              <el-input-number v-model="item.num" :min="1" :max="99" :precision="0" size="small" @change="nextTick(() => (badgeHide = true))" />
            </div>
          </div>
          <div class="act-btn">
            <el-button type="primary">下单</el-button>
          </div>
        </div>
        <div class="no-shop" v-show="!useShopStore().shopCartList.length">
          <span>暂时没有商品哦，快去购买吧~</span>
        </div>
      </el-popover>
    </el-badge>
  </div>
</template>

<style lang="scss" scoped>
.shop-cart {
  position: fixed;
  background-color: rgba(221, 221, 221, 0.5);
  border-radius: 50%;
  padding: 10px;
  right: 20vw;
  bottom: 10vh;
  z-index: 2000;
  cursor: pointer;
  &:hover {
    background-color: rgba(221, 221, 221, 0.8);
  }
  i {
    font-size: 40px;
    color: #555;
  }
}
.shop-list {
  display: flex;
  flex-flow: column nowrap;
  .item {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 4px;
    .intro {
      display: flex;
      align-items: center;
      .img-wrap {
        width: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-right: 4px;
      }
      p {
        margin: 4px 0;
      }
    }
    .num {
      display: flex;
      align-items: center;
      .el-input-number--small {
        width: 90px;
      }
    }
  }
  .act-btn {
    margin-top: 5px;
    text-align: center;
  }
}
</style>
