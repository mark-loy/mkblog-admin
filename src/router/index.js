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
    redirect: '/blog/article',
    name: '博客管理',
    meta: {
      title: '博客管理'
    },
    children: [
      {
        path: 'article',
        component: () => import('@/views/blog/article/index'), // Parent router-view
        redirect: '/blog/article/list',
        name: '文章管理',
        meta: { title: '文章管理', icon: '文章管理' },
        children: [
          {
            path: 'list',
            name: '文章列表',
            component: () => import('@/views/blog/article/list'),
            meta: { title: '文章列表', icon: 'table' }
          },
          {
            path: 'form',
            name: '文章表单',
            component: () => import('@/views/blog/article/form'),
            meta: { title: '文章表单', icon: 'form' }
          },
          {
            path: 'form/:id',
            name: '文章表单',
            component: () => import('@/views/blog/article/form'),
            meta: { title: '文章表单', icon: 'form' },
            hidden: true
          },
        ]
      },
      {
        path: 'category',
        component: () => import('@/views/blog/category/index'),
        redirect: '/blog/category/list',
        name: '分类管理',
        meta: { title: '分类管理' },
        children: [
          {
            path: 'list',
            name: '分类列表',
            component: () => import('@/views/blog/category/list'),
            meta: { title: '分类列表', icon: 'table' }
          }
        ]
      },
      {
        path: 'tag',
        component: () => import('@/views/blog/tag/index'),
        redirect: '/blog/tag/list',
        name: '标签管理',
        meta: { title: '标签管理' },
        children: [
          {
            path: 'list',
            name: '标签列表',
            component: () => import('@/views/blog/tag/list'),
            meta: { title: '标签列表', icon: 'table' }
          }
        ]
      }
    ]
  },

  {
    path: '/site',
    component: Layout,
    redirect: '/site/info',
    name: '站点管理',
    meta: {
      title: '站点管理'
    },
    children: [
      {
        path: 'info',
        component: () => import('@/views/site/info'),
        name: '站点信息',
        meta: { title: '站点信息', icon: '文章管理' },
      },
      {
        path: 'social/list',
        component: () => import('@/views/site/social/list'),
        name: '社交管理',
        meta: { title: '社交管理', icon: '文章管理' }
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
