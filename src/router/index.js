import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: 'Dashboard', icon: 'dashboard' }
    }]
  },

  {
    path: '/blog',
    component: Layout,
    redirect: '/blog/article/list',
    name: '文章管理',
    meta: { title: '文章管理', icon: '文章管理' },
    children: [{
      path: 'article/list',
      name: '文章列表',
      component: () => import('@/views/blog/article/list'),
      meta: { title: '文章列表', icon: 'table' }
    },
    {
      path: 'article/form',
      name: '文章表单',
      component: () => import('@/views/blog/article/form'),
      meta: { title: '文章表单', icon: 'form' }
    }
  ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
