import useStore from '@/store'
import { ElMessage } from 'element-plus'
import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/:pathMatch(.*)',
    redirect: '/404'
  },
  {
    path: '/404',
    component: () => import('@/views/404/Index.vue')
  },
  {
    path: '/home',
    component: () => import('@/views/home/Index.vue')
  },
  {
    path: '/workbench',
    component: () => import('@/views/workbench/Index.vue'),
    redirect: '/workbench/category',
    children: [
      {
        path: '/workbench/category',
        component: () => import('@/views/workbench/pages/category/Index.vue')
      },
      {
        path: '/workbench/commodity',
        component: () => import('@/views/workbench/pages/commodity/Index.vue')
      },
      {
        path: '/workbench/order',
        component: () => import('@/views/workbench/pages/order/Index.vue')
      }
    ]
  }
]
const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
