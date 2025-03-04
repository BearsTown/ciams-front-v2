import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'

import { useAuthStore } from '@/stores/auth.js'
import tokenUtil from '@/utils/tokenUtil'
import commonUtil from '@/utils/commonUtil'

export type MenuType = 'Menu-1' | 'Menu-2' | 'Menu-3' | 'Menu-4'

// export const MenuName = {
//   'Menu-1': 'Menu-1',
//   'Menu-2': 'Menu-2',
//   'Menu-3': 'Menu-3',
//   'Menu-4': 'Menu-4',
// } as const

// export type MenuNameType = (typeof MenuName)[keyof typeof MenuName]

export const RouteName = {
  'Menu-1': 'Menu-1',
  'Menu-2-Sub-1': 'Menu-2-Sub-1',
  'Menu-2-Sub-2': 'Menu-2-Sub-2',
  'Menu-2-Sub-3': 'Menu-2-Sub-3',
  'Menu-3': 'Menu-3',
  'Menu-4': 'userArchive',
} as const

export type RouteNameType = (typeof RouteName)[keyof typeof RouteName]

const routes: RouteRecordRaw[] = [
  {
    path: '/:pathMatch(.*)*',
    component: () => import('@/views/ErrorPage.vue'),
  },
  {
    //sampleMap
    path: '/sampleMap',
    component: () => import('@/views/sample/SampleMap2.vue'),
  },
  {
    //메인화면
    path: '/',
    component: () => import('@/views/Main.vue'),
  },
  {
    //회원가입
    path: '/signUp',
    component: () => import('@/views/SignUp.vue'),
  },
  {
    path: '/',
    name: 'app',
    redirect: '/menu-1',
    meta: {
      group: 'MAIN_MENU',
    },
    component: () => import('@/views/app'),
    children: [
      {
        path: '/menu-1',
        name: 'Menu-1',
        meta: {
          title: '기초현황',
          icon: '/assets/svg/menu/menu-1.svg',
          layout: {
            left: {
              visible: true,
              collapse: true,
            },
            right: {
              visible: true,
              collapse: false,
            },
            center: {
              visible: true,
            },
            panel: {
              visible: false,
            },
          },
        },
        components: {
          left: () => import('@/views/app/zoneEstablish/left'),
          center: () => import('@/views/app/zoneEstablish/center'),
          right: () => import('@/views/app/zoneEstablish/right'),
        },
      },
      {
        path: '/menu-2',
        name: 'Menu-2',
        redirect: '/menu-2/sub-1',
        meta: {
          title: '유형화 분석',
          icon: '/assets/svg/menu/menu-2.svg',
        },
        children: [
          {
            path: 'sub-1',
            name: 'Menu-2-Sub-1',
            meta: {
              title: '산업기반 분석',
              layout: {
                left: {
                  visible: true,
                  collapse: true,
                },
                right: {
                  visible: true,
                  collapse: true,
                },
                center: {
                  visible: true,
                },
                panel: {
                  visible: false,
                },
              },
            },
            components: {
              left: () => import('@/views/app/operation/left/planning'),
              center: () => import('@/views/app/operation/center'),
              right: () => import('@/views/app/operation/right/planning'),
            },
          },
          {
            path: 'sub-2',
            name: 'Menu-2-Sub-2',
            meta: {
              title: '지역여건 분석',
              layout: {
                left: {
                  visible: true,
                  collapse: true,
                },
                right: {
                  visible: true,
                  collapse: true,
                },
                center: {
                  visible: true,
                },
                panel: {
                  visible: false,
                },
              },
            },
            components: {
              left: () => import('@/views/app/operation/left/planning'),
              center: () => import('@/views/app/operation/center'),
              right: () => import('@/views/app/operation/right/planning'),
            },
          },
          {
            path: 'sub-3',
            name: 'Menu-2-Sub-3',
            meta: {
              title: '유형화 종합 분석',
              layout: {
                left: {
                  visible: true,
                  collapse: true,
                },
                right: {
                  visible: true,
                  collapse: true,
                },
                center: {
                  visible: true,
                },
                panel: {
                  visible: false,
                },
              },
            },
            components: {
              left: () => import('@/views/app/operation/left/planning'),
              center: () => import('@/views/app/operation/center'),
              right: () => import('@/views/app/operation/right/planning'),
            },
          },
        ],
      },
      {
        path: '/menu-3',
        name: 'Menu-3',
        redirect: '/menu-3/sub-1',
        meta: {
          title: '계획운영 모니터링',
          icon: '/assets/svg/menu/menu-3.svg',
        },
        children: [
          {
            path: 'sub-1',
            name: 'Menu-3-Sub-1',
            meta: {
              title: '산업기반 분석',
              layout: {
                left: {
                  visible: true,
                  collapse: true,
                },
                right: {
                  visible: true,
                  collapse: true,
                },
                center: {
                  visible: true,
                },
                panel: {
                  visible: false,
                },
              },
            },
            components: {
              left: () => import('@/views/app/monitoring/left'),
              center: () => import('@/views/app/monitoring/center'),
              right: () => import('@/views/app/monitoring/right'),
            },
          },
        ],
      },
      // 자료실
      {
        path: 'archive',
        name: 'Menu-4',
        meta: {
          title: '자료실',
          icon: '/assets/svg/menu/menu-4.svg',
          layout: {
            center: {
              visible: true,
            },
          },
        },
        components: {
          center: () => import('@/views/app/archive/center'),
        },
        children: [
          {
            path: '',
            name: 'archiveMain',
            components: {
              userArchive: () => import('@/components/app/archive/ArchiveMain.vue'),
            },
          },
          {
            path: ':archiveId',
            name: 'archiveDetail',
            components: {
              userArchive: () => import('@/components/app/archive/Detail.vue'),
            },
          },
          {
            path: '',
            name: 'archiveGeonuris',
            components: {
              userArchive: () => import('@/components/app/archive/ArchiveGeonuris.vue'),
            },
          },
          {
            path: '',
            name: 'archiveLayerDL',
            components: {
              userArchive: () => import('@/components/app/archive/ArchiveLayerDownLoad.vue'),
            },
          },
        ],
      },
    ],
  },
  {
    //관리자
    path: '/admin',
    component: () => import('@/views/admin/Main.vue'),
    children: [
      {
        path: 'users',
        component: () => import('@/views/admin/UsersMain.vue'),
      },
      {
        path: 'code',
        component: () => import('@/views/admin/CodeMain.vue'),
      },
      {
        path: 'content',
        component: () => import('@/views/admin/ContentMain.vue'),
      },
      // {
      //   path: 'contentArea',
      //   component: () => import('@/views/admin/ContentAreaMain.vue'),
      // },
      {
        path: 'loginLog',
        component: () => import('@/components/admin/user/LoginLog.vue'),
      },
      {
        path: 'config',
        component: () => import('@/views/admin/ConfigMain.vue'),
      },
      {
        path: 'archive',
        component: () => import('@/views/admin/ArchiveMain.vue'),
        children: [
          {
            path: '',
            name: 'adminArchiveMain',
            components: {
              adminArchive: () => import('@/components/admin/archive/index.vue'),
            },
          },
          {
            path: 'write',
            name: 'archiveWrite',
            components: {
              adminArchive: () => import('@/components/admin/archive/writeArchive.vue'),
            },
          },
          {
            path: 'write/:archiveId',
            components: {
              adminArchive: () => import('@/components/admin/archive/writeArchive.vue'),
            },
          },
          {
            path: ':archiveId',
            components: {
              adminArchive: () => import('@/components/admin/archive/detailArchive.vue'),
            },
          },
        ],
      },
    ],
  },
]

const router = createRouter({
  routes,
  history: createWebHistory(`/${import.meta.env.VITE_APP_CONTEXT}`),
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const whiteList = ['/', '/signUp']
  const token = tokenUtil.getAccessToken()

  if (token) {
    next()
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      authStore.logInErrorStatus('notLoggedIn')
      commonUtil.errorMessage('사용자 로그인이 필요합니다.')
    }
  }
})

export default router
