import {
  createRouter,
  createWebHashHistory,
  type RouteRecordRaw,
} from 'vue-router'
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/home'
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
  routes,
})

export default router
