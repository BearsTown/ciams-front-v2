import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'

import { useGlobalStore } from '@/stores/app/index.js'
import { useAuthStore } from '@/stores/auth.js'
import tokenUtil from '@/utils/tokenUtil'
import commonUtil from '@/utils/commonUtil'
import { MapType } from '@/enums/mapEnum'
import { storeToRefs } from 'pinia'

export type MenuType = 'Menu-1' | 'Menu-2' | 'Menu-3' | 'Menu-4'

export const RouteName = {
  // 'Menu-1': 'Menu-1',
  'Menu-1-Sub-1': 'Menu-1-Sub-1',
  'Menu-1-Sub-2': 'Menu-1-Sub-2',
  'Menu-1-Sub-3': 'Menu-1-Sub-3',
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
        redirect: '/menu-1/sub-1',
        meta: {
          title: '기초현황',
          icon: '/assets/svg/menu/menu-1.svg',
        },
        children: [
          {
            path: 'sub-1',
            name: 'Menu-1-Sub-1',
            meta: {
              title: '김천시 현황',
              layout: {
                left: {
                  visible: true,
                  collapse: true,
                },
                right: {
                  visible: false,
                  collapse: false,
                },
                center: {
                  visible: false,
                },
                panel: {
                  visible: true,
                },
              },
            },
            components: {
              left: () => import('@/views/app/menu-1/sub-1/left'),
              panel: () => import('@/views/app/menu-1/sub-1/panel'),
            },
          },
          {
            path: 'sub-2',
            name: 'Menu-1-Sub-2',
            meta: {
              title: '도시공업 지역현황',
              layout: {
                left: {
                  visible: true,
                  collapse: true,
                },
                right: {
                  visible: false,
                  collapse: false,
                },
                center: {
                  visible: false,
                },
                panel: {
                  visible: true,
                },
              },
            },
            components: {
              left: () => import('@/views/app/menu-1/sub-2/left'),
              panel: () => import('@/views/app/menu-1/sub-2/panel'),
            },
          },
        ],
      },
      {
        path: '/menu-2',
        name: 'Menu-2',
        redirect: '/menu-2/sub-1',
        meta: {
          mapType: MapType.MAP_2,
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
              left: () => import('@/views/app/menu-2/sub-1/left'),
              center: () => import('@/views/app/menu-2/center'),
              right: () => import('@/views/app/menu-2/sub-1/right'),
              locationInfo: () => import('@/views/app/menu-2/locInfo'),
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
              left: () => import('@/views/app/menu-2/sub-2/left'),
              center: () => import('@/views/app/menu-2/center'),
              right: () => import('@/views/app/menu-2/sub-2/right'),
              locationInfo: () => import('@/views/app/menu-2/locInfo'),
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
              left: () => import('@/views/app/menu-2/sub-3/left'),
              center: () => import('@/views/app/menu-2/center'),
              right: () => import('@/views/app/menu-2/sub-3/right'),
              locationInfo: () => import('@/views/app/menu-2/locInfo'),
            },
          },
        ],
      },
      {
        path: '/menu-3',
        name: 'Menu-3',
        redirect: '/menu-3/sub-1',
        meta: {
          mapType: MapType.MAP_2,
          title: '도시공업지역기본계획',
          icon: '/assets/svg/menu/menu-3.svg',
        },
        children: [
          {
            path: 'sub-1',
            name: 'Menu-3-Sub-1',
            meta: {
              title: '기본구상',
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
              left: () => import('@/views/app/menu-3/sub-1/left'),
              center: () => import('@/views/app/menu-3/center'),
              right: () => import('@/views/app/menu-3/sub-1/right'),
              locationInfo: () => import('@/views/app/menu-3/locInfo'),
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
      },
      {
        path: '',
        name: 'archiveMain',
        components: {
          center: () => import('@/views/app/archive/center'),
        },
      },
      {
        path: '/archive/:archiveId',
        name: 'archiveDetail',
        components: {
          center: () => import('@/views/app/archive/center'),
        },
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

  if (to.meta.mapType) {
    const globalStore = useGlobalStore()
    const { currentMapType } = storeToRefs(globalStore)
    currentMapType.value = to.meta.mapType
  }

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
