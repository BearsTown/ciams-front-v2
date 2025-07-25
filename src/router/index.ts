import { storeToRefs } from 'pinia'
import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'

import TokenUtil from '@/utils/tokenUtil'
import CommonUtil from '@/utils/commonUtil'

import { useAuthStore } from '@/stores/auth.js'
import { useGlobalStore } from '@/stores/app/index.js'

import menu1Icon from '@/assets/svg/menu/menu-1.svg'
import menu2Icon from '@/assets/svg/menu/menu-2.svg'
import menu3Icon from '@/assets/svg/menu/menu-3.svg'
import menu4Icon from '@/assets/svg/menu/menu-4.svg'

export type MenuType = 'Menu-1' | 'Menu-2' | 'Menu-3' | 'Menu-4'

export const RouteName = {
  'basic/loc': 'basic/loc',
  'basic/urban': 'basic/urban',
  'classify/ita': 'classify/ita',
  'classify/regional': 'classify/regional',
  'classify/management': 'classify/management',
  'classify/comprehensive': 'classify/comprehensive',
  'plan/concept': 'plan/concept',
  'plan/sector': 'plan/sector',
  'plan/improvement': 'plan/improvement',
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
    redirect: '/basic',
    meta: {
      group: 'MAIN_MENU',
    },
    component: () => import('@/views/app'),
    children: [
      {
        path: '/basic',
        name: 'Menu-1',
        redirect: '/basic/loc',
        meta: {
          title: '도시공업지역<br/>기초현황',
          icon: menu1Icon,
        },
        children: [
          {
            path: 'loc',
            name: 'basic/loc',
            meta: {
              title: '김천시<br/>현황',
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
              left: () => import('@/views/app/basic/loc/left'),
              panel: () => import('@/views/app/basic/loc/panel'),
            },
          },
          {
            path: 'urban',
            name: 'basic/urban',
            meta: {
              title: '도시공업<br/>지역현황',
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
              left: () => import('@/views/app/basic/urban/left'),
              panel: () => import('@/views/app/basic/urban/panel'),
            },
          },
        ],
      },
      {
        path: '/classify',
        name: 'Menu-2',
        redirect: '/classify/ita',
        meta: {
          mapType: 'Map-Classify',
          title: '도시공업지역<br/>유형화분석',
          icon: menu2Icon,
        },
        children: [
          {
            path: 'ita',
            name: 'classify/ita',
            meta: {
              title: '산업기반<br/>분석',
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
                bottom: {
                  visible: true,
                  collapse: false,
                },
                panel: {
                  visible: false,
                },
              },
            },
            components: {
              left: () => import('@/views/app/classify-analysis/ita/left'),
              center: () => import('@/views/app/classify-analysis/center'),
              right: () => import('@/views/app/classify-analysis/ita/right'),
              bottom: () => import('@/views/app/classify-analysis/ita/bottom'),
              locationInfo: () => import('@/views/app/classify-analysis/locInfo'),
            },
          },
          {
            path: 'regional',
            name: 'classify/regional',
            meta: {
              title: '지역여건<br/>분석',
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
              left: () => import('@/views/app/classify-analysis/regional/left'),
              center: () => import('@/views/app/classify-analysis/center'),
              right: () => import('@/views/app/classify-analysis/regional/right'),
              locationInfo: () => import('@/views/app/classify-analysis/locInfo'),
            },
          },
          {
            path: 'management',
            name: 'classify/management',
            meta: {
              title: '관리유형<br/>구분',
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
              left: () => import('@/views/app/classify-analysis/management/left'),
              center: () => import('@/views/app/classify-analysis/center'),
              right: () => import('@/views/app/classify-analysis/management/right'),
              locationInfo: () => import('@/views/app/classify-analysis/locInfo'),
            },
          },
          {
            path: 'comprehensive',
            name: 'classify/comprehensive',
            meta: {
              title: '유형화<br/>종합분석',
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
              left: () => import('@/views/app/classify-analysis/comprehensive/left'),
              center: () => import('@/views/app/classify-analysis/center'),
              right: () => import('@/views/app/classify-analysis/comprehensive/right'),
              locationInfo: () => import('@/views/app/classify-analysis/locInfo'),
            },
          },
        ],
      },
      {
        path: '/plan',
        name: 'Menu-3',
        redirect: '/plan/concept',
        meta: {
          mapType: 'Map-Concept',
          title: '도시공업지역<br/>기본계획',
          icon: menu3Icon,
        },
        children: [
          {
            path: 'concept',
            name: 'plan/concept',
            meta: {
              title: '기본구상',
              mapType: 'Map-Concept',
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
              left: () => import('@/views/app/plan/concept/left'),
              center: () => import('@/views/app/plan/concept/center'),
              right: () => import('@/views/app/plan/concept/right'),
              locationInfo: () => import('@/views/app/plan/locInfo'),
            },
          },
          {
            path: 'sector',
            name: 'plan/sector',
            meta: {
              title: '부문별<br/>계획',
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
              left: () => import('@/views/app/plan/sector/left'),
              panel: () => import('@/views/app/plan/sector/panel'),
            },
          },
          {
            path: 'improvement',
            name: 'plan/improvement',
            meta: {
              title: '정비구역<br/>계획',
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
              left: () => import('@/views/app/plan/Improvement-zone/left'),
              panel: () => import('@/views/app/plan/Improvement-zone/panel'),
              // center: () => import('@/views/app/plan/sub-3/center'),
              // right: () => import('@/views/app/plan/sub-3/right'),
              // locationInfo: () => import('@/views/app/plan/sub-3/locInfo'),
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
          icon: menu4Icon,
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
        path: 'archive',
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
  const token = TokenUtil.getAccessToken()

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
      CommonUtil.errorMessage('사용자 로그인이 필요합니다.')
    }
  }
})

export default router
