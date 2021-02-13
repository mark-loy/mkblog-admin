import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/views/layout/Layout'

export const constantRoutes = [{
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  // 首页
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: {
        title: '小码客后台首页',
        icon: 'dashboard'
      }
    }]
  }
]

export const constantRoutes1 = [{
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
      meta: {
        title: '首页',
        icon: 'dashboard'
      }
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
    children: [{
        path: 'article',
        component: () => import('@/views/blog/article/index'), // Parent router-view
        redirect: '/blog/article/list',
        name: '文章管理',
        meta: {
          title: '文章管理',
          icon: '文章管理'
        },
        children: [{
            path: 'list',
            name: '文章列表',
            component: () => import('@/views/blog/article/list'),
            meta: {
              title: '文章列表',
              icon: 'table'
            }
          },
          {
            path: 'form',
            name: '文章表单',
            component: () => import('@/views/blog/article/form'),
            meta: {
              title: '文章表单',
              icon: 'form'
            }
          },
          {
            path: 'form/:id',
            name: '文章表单',
            component: () => import('@/views/blog/article/form'),
            meta: {
              title: '文章表单',
              icon: 'form'
            },
            hidden: true
          },
        ]
      },
      {
        path: 'category',
        component: () => import('@/views/blog/category/index'),
        redirect: '/blog/category/list',
        name: '分类管理',
        meta: {
          title: '分类管理'
        },
        children: [{
          path: 'list',
          name: '分类列表',
          component: () => import('@/views/blog/category/list'),
          meta: {
            title: '分类列表',
            icon: 'table'
          }
        }]
      },
      {
        path: 'tag',
        component: () => import('@/views/blog/tag/index'),
        redirect: '/blog/tag/list',
        name: '标签管理',
        meta: {
          title: '标签管理'
        },
        children: [{
          path: 'list',
          name: '标签列表',
          component: () => import('@/views/blog/tag/list'),
          meta: {
            title: '标签列表',
            icon: 'table'
          }
        }]
      },
      {
        path: 'comment/:id',
        component: () => import('@/views/blog/comment/list'),
        name: '评论列表',
        meta: {
          title: '评论列表'
        },
        hidden: true
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
    children: [{
        path: 'info',
        component: () => import('@/views/site/info'),
        name: '站点信息',
        meta: {
          title: '站点信息',
          icon: '文章管理'
        },
      },
      {
        path: 'social/list',
        component: () => import('@/views/site/social/list'),
        name: '社交管理',
        meta: {
          title: '社交管理',
          icon: '文章管理'
        }
      },
      {
        path: 'friend/list',
        component: () => import('@/views/site/friend/list'),
        name: '友站管理',
        meta: {
          title: '友站管理',
          icon: '文章管理'
        }
      },
      {
        path: 'guestbook/list',
        component: () => import('@/views/site/guestbook/list'),
        name: '留言管理',
        meta: {
          title: '留言管理',
          icon: '文章管理'
        }
      }
    ]
  },

  {
    path: '/mail',
    component: Layout,
    redirect: '/mail/list',
    name: '邮件管理',
    meta: {
      title: '邮件管理'
    },
    children: [{
        path: 'list',
        component: () => import('@/views/mail/list'),
        name: '邮件列表',
        meta: {
          title: '邮件列表',
          icon: '文章管理'
        },
      },
      {
        path: 'send',
        component: () => import('@/views/mail/send'),
        name: '发送邮件',
        meta: {
          title: '发送邮件',
          icon: '文章管理'
        },
      }
    ]
  },

  {
    path: '/visitor',
    component: Layout,
    redirect: '/visitor/list',
    name: '访客管理',
    meta: {
      title: '访客管理'
    },
    children: [{
      path: 'list',
      component: () => import('@/views/visitor/list'),
      name: '访客列表',
      meta: {
        title: '访客列表',
        icon: '文章管理'
      },
    }]
  },

  // 404 page must be placed at the end !!!
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

const createRouter = () => new Router({
  mode: 'history', // require service support
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
