<template>
  <div id="map">
    <div class="map-container">
      <!-- //////////////////// 사이드바 -->
      <aside class="map-sideBar">
        <!-- 로고 -->
        <a class="siderBar-logo" href="/">
          CIAMS <br />
          <p class="logo-sub">도시공업지역<br />관리시스템</p></a
        >

        <!-- 사이드바 메뉴 -->
        <div class="customScroll scrollY">
          <div v-for="item in menus" :key="item.key">
            <button
              class="btn-sideBarMenu"
              @click="onChange(item.key, item.path)"
              :class="{ active: selectedMenu === item.key }"
            >
              <span class="icon">
                <el-icon class="iconStyle">
                  <component :is="item.icon" />
                </el-icon>
              </span>
              <!-- eslint-disable vue/no-v-html -->
              <span class="title" v-html="item.name"></span>
            </button>
            <ul class="menu-list" :class="{ active: selectedMenu === item.key }">
              <li
                v-for="child in item.children"
                :key="child.key"
                :class="{ active: selectedSubMenu === child.key }"
                @click="onChangeSubMenu(child.key, child.path)"
              >
                {{ child.name }}
              </li>
            </ul>
          </div>
          <!-- 사용자버튼 하위메뉴 -->
          <ul class="menu-list user" :class="{ active: userMenuActive }">
            <li class="user-name">admin</li>
            <li @click="handleCommand('pwdChange')">비밀번호<br />변경</li>
            <li @click="handleCommand('logout')">로그아웃</li>
          </ul>
        </div>
      </aside>

      <div class="map-content" style="position: inherit">
        <router-view />
      </div>
    </div>

    <PwdChangeDialog :is-visible="isPwdChangeVisible" @close-dialog="isPwdChangeVisible = false" />
  </div>
</template>
<script setup lang="ts">
  import { useBoolean } from '@/hooks/useBoolean'
  import { useAuthStore } from '@/stores/auth'
  import { storeToRefs } from 'pinia'
  import { onMounted, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import PwdChangeDialog from '@/components/login/PwdChangeDialog.vue'

  const authStore = useAuthStore()
  const { userInfo } = storeToRefs(authStore)

  const router = useRouter()
  const route = useRoute()

  const store = useAuthStore()
  const username = store.userName
  const activeMenu = ref('')
  const isPwdChangeVisible = ref(false)
  const { status: userMenuActive, toggle: userMenuToggle } = useBoolean(false)
  const selectedMenu = ref('')
  const selectedSubMenu = ref('')

  const menus = ref<any[]>([
    {
      key: '1',
      name: '사용자',
      path: '/admin/users',
      icon: 'User',
      usePanel: false,
    },
    {
      key: '2',
      name: '코드',
      path: '/admin/code',
      icon: 'Cpu',
      usePanel: false,
    },
    // {
    //   key: '3',
    //   name: '구역계획</br>관리',
    //   path: '/admin/content',
    //   usePanel: true,
    //   icon: 'DataLine',
    //   // children: [
    //   //   {
    //   //     key: '3-1',
    //   //     name: '계획관리',
    //   //     path: '/admin/content',
    //   //   },
    //   //   {
    //   //     key: '3-2',
    //   //     name: '구역별 계획지정',
    //   //     path: '/admin/contentArea',
    //   //   },
    //   // ],
    // },
    {
      key: '4',
      name: '자료실',
      path: '/admin/archive',
      usePanel: true,
      icon: 'MessageBox',
    },
  ])

  function onChangeSubMenu(key: string, path: string) {
    selectedSubMenu.value = key

    router.push(path)
  }

  function handleCommand(cmd) {
    if (cmd == 'logout') {
      commonUtil
        .confirm('로그아웃 하시겠습니까?', '로그아웃')
        .then(() => authStore.logOut('loginOutAction'))
    } else if (cmd == 'pwdChange') {
      isPwdChangeVisible.value = true
    } else if (cmd == 'info') {
      // alert('내정보')
    } else if (cmd == 'admin') {
      window.open(`/${import.meta.env.VITE_APP_CONTEXT}/admin`, '_blank')
    }
  }

  function onChange(key, path) {
    selectedMenu.value = key

    router.push(path)
  }

  onMounted(async () => {
    await useAuthStore().checkToken()

    if (!store.isAdmin) {
      await router.push({ path: '/' })
    } else {
      if (route.path == '/admin') onChange(menus.value[0].key, menus.value[0].path)

      selectedMenu.value = menus.value.find((a) => a.path == route.path).key
    }
  })
</script>
<style lang="scss">
  @import '@/assets/css/mapPage.css';
  @import '@/assets/css/planningMonitoring.css';
  @import '@/assets/css/planningDetail.css';

  .iconStyle {
    color: white;
    font-size: 20px;
  }

  #reference .admin-container {
    width: calc(100vw - 425px);
    min-width: 950px;
    position: relative;
    background-color: #f4f4f4;
  }

  #reference .admin-content-wrap {
    height: calc(100vh - 80px);
    padding: 24px 30px 77px;
  }

  .map-sideBar {
    .siderBar-logo {
      flex-direction: column;

      .logo-sub {
        margin-top: 2px;
        font-size: 9px;
        text-align: center;
        line-height: normal;
      }
    }
  }
</style>
