<template>
  <div id="main">
    <header>
      <h1 class="logo">
        <a href="/" v-show="isShowLogo"><img :src="sgg_image_main" @load="loadedLogoImg" /></a>
      </h1>
      <div class="user">
        <!-- 비밀번호변경 modal -->
        <PwdChangeDialog
          :is-visible="isPwdChangeVisible"
          @close-dialog="isPwdChangeVisible = false"
        />
        <!-- 로그인 modal -->
        <LoginMainDialog :is-visible="isLoginVisible" @close-dialog="isLoginVisible = false" />

        <!-- 알림 modal-->
        <NotifyDialog :is-visible="isNotifyVisible" @close-dialog="isNotifyVisible = false" />
        <!--//////////////////////// 로그인 전 -->
        <template v-if="!isLoggedIn">
          <button type="button" class="btn-user" @click="isLoginVisible = true">로그인</button>
          <button type="button" class="btn-user" @click="router.push('/signUp')">회원가입</button>
        </template>

        <!--//////////////////////// 로그인 후 -->
        <template v-else>
          <button
            v-if="alarmVisible"
            type="button"
            class="btn-user notice"
            @click="isNotifyVisible = true"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="bell-02">
                <path
                  id="Icon"
                  d="M9.33333 20.0909C10.041 20.6562 10.9755 21 12 21C13.0245 21 13.959 20.6562 14.6667 20.0909M4.50763 17.1818C4.08602 17.1818 3.85054 16.5194 4.10557 16.1514C4.69736 15.2975 5.26855 14.0451 5.26855 12.537L5.29296 10.3517C5.29296 6.29145 8.29581 3 12 3C15.7588 3 18.8058 6.33993 18.8058 10.4599L18.7814 12.537C18.7814 14.0555 19.3329 15.3147 19.9006 16.169C20.1458 16.5379 19.9097 17.1818 19.4933 17.1818H4.50763Z"
                  stroke="white"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </g>
            </svg>
          </button>

          <button type="button" class="btn-user logout" @click="userActive = !userActive">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM10 3C11.66 3 13 4.34 13 6C13 7.66 11.66 9 10 9C8.34 9 7 7.66 7 6C7 4.34 8.34 3 10 3ZM10 17.2C7.5 17.2 5.29 15.92 4 13.98C4.03 11.99 8 10.9 10 10.9C11.99 10.9 15.97 11.99 16 13.98C14.71 15.92 12.5 17.2 10 17.2Z"
                fill="white"
              />
            </svg>
            {{ userInfo.userName }}
          </button>

          <!-- 사용자 메뉴 -->
          <div class="userDropdown" :class="{ active: userActive }">
            <button type="button" class="btn-userMenu" @click="isPwdChangeVisible = true">
              비밀번호 변경
            </button>
            <button type="button" class="btn-userMenu" @click="adminOpen" v-if="isAdmin == true">
              관리자 바로가기
            </button>
            <button type="button" class="btn-userMenu" @click="logOutConfirmActive = true">
              로그아웃
            </button>
          </div>
        </template>
      </div>
    </header>

    <div class="main-box">
      <h2 class="main-title">
        <b>{{ systemInfo.title_kor }}</b> {{ systemInfo.version }}<br />({{ systemInfo.title_eng }})
      </h2>

      <!--검색바-->
      <SearchBar ref="mapSearchBarRef" :is-main="true" />

      <div class="menu" :style="menus?.length > 0 ? 'height: 160px' : ''">
        <template v-for="item in menus[0].children" :key="item">
          <button
            v-if="isMenuCheck(item.name as MenuType)"
            type="button"
            class="btn-menu"
            @click="toPage(item.name)"
          >
            <span class="icon">
              <inline-svg :src="item.meta?.icon" width="48" height="48" />
            </span>
            <span class="text" v-html="toLabel(item.meta?.title!)"></span>
          </button>
        </template>
      </div>

      <CustomConfirm @close="logOutFn" :isVisible="logOutConfirmActive">
        <template #title>로그아웃</template>
        <template #content>로그아웃 하시겠습니까?</template>
      </CustomConfirm>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, onBeforeMount, onMounted, onUnmounted, reactive, ref } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useRouter } from 'vue-router'
  import { ElMessage } from 'element-plus'

  import CustomConfirm from '@/components/CustomConfirm.vue'
  import NotifyDialog from '@/components/login/NotifyDialog.vue'
  import SearchBar from '@/components/login/SearchBar.vue'
  import LoginMainDialog from '@/components/login/LoginMainDialog.vue'
  import PwdChangeDialog from '@/components/login/PwdChangeDialog.vue'

  import { MenuType } from '@/router'
  import tokenUtil from '@/utils/tokenUtil'
  import CommonUtil from '@/utils/commonUtil'
  import { API_INFO_CIAMS } from '@/config/config'

  import { getConfig } from '@/api/app/config'

  import { useGlobalStore } from '@/stores/app'
  import { useAuthStore } from '@/stores/auth'

  const systemInfo = reactive({
    title_kor: '',
    title_eng: '',
    version: '',
  })
  const router = useRouter()
  const store = useAuthStore()
  const { userName, isLoggedIn, isAdmin, userInfo, menuInfo } = storeToRefs(store)
  const isLoginVisible = ref<boolean>(false)
  const isPwdChangeVisible = ref<boolean>(false)
  const mapSearchBarRef = ref()
  const isShowLogo = ref(false)
  const sgg_image_main = ref('')

  const pwChangeModal = ref(false)
  const searchActive = ref(false)
  const loginActive = ref(false)
  const userActive = ref(false)
  const noticeActive = ref(false)
  const isNotifyVisible = ref(false)
  const currentTab = ref(0)
  const tabList = ref([{ name: '지번 (0)' }, { name: '도로명 (0)' }, { name: '장소 (0)' }])
  const logOutConfirmActive = ref(false)
  const globalStore = useGlobalStore()
  const { loading } = storeToRefs(globalStore)
  const alarmVisible = ref(false)

  /** ============================= */

  const menus = computed(() => {
    return router.getRoutes().filter((node) => node.meta?.group === 'MAIN_MENU') ?? []
  })

  function toLabel(title: string) {
    return title.replaceAll(' ', '')
  }

  function logOutFn(status: boolean) {
    logOutConfirmActive.value = false
    if (status) {
      store.logOut('loginOutAction')
      //메뉴 정보 초기화
      menuInfo.value = []
    }
    userActive.value = false
  }

  async function toPage(link) {
    await useAuthStore().checkToken()

    if (!tokenUtil.getAccessToken()) {
      CommonUtil.errorMessage('사용자 로그인이 필요합니다.')
      await router.push('/')
    } else {
      await router.push({
        name: link,
      })
    }
  }

  function handleCommand(cmd) {
    if (cmd == 'logout') {
      logOutFn()
    } else if (cmd == 'pwdChange') {
      isPwdChangeVisible.value = true
    } else if (cmd == 'info') {
      // alert('내정보')
    } else if (cmd == 'admin') {
      window.open(`/${import.meta.env.VITE_APP_CONTEXT}/admin`, '_blank')
    }
  }

  function onMainClick(e) {
    if (e.target.parentNode !== mapSearchBarRef.value) {
      // mapSearchBarRef.value.exclusionVisible(false)
    }
  }

  function adminOpen() {
    window.open(`/${import.meta.env.VITE_APP_CONTEXT}/admin`, '_blank')
  }

  async function loadInfo() {
    const { data } = await getConfig('SGG_IMAGE_MAIN')

    if (data && data.attachFile) {
      const prefixPath = API_INFO_CIAMS.PREFIX + '/api/v1/file/image'
      sgg_image_main.value = `${prefixPath}/${data.attachFile.id}`
    }

    const { data: kor } = await getConfig('SYSTEM_NAME_KOR')
    const { data: eng } = await getConfig('SYSTEM_NAME_ENG')
    const { data: version } = await getConfig('SYSTEM_VERSION')

    if (kor) systemInfo.title_kor = `${kor.confValue}`
    if (eng) systemInfo.title_eng = `${eng.confValue}`
    if (version) systemInfo.version = `${version.confValue}`
  }

  onBeforeMount(async () => {
    await loadInfo()
    await useAuthStore().checkToken()
    console.log('Main-check')
  })

  onMounted(async () => {
    let isLogOutAction = window.localStorage.getItem('isLogOutAction')

    let _message = ''
    if (isLogOutAction == 'sessionExpired') {
      _message = '로그인 세션이 만료되었습니다. 다시 로그인하십시오.'
      ElMessage({
        message: _message,
        type: 'error',
      })
      //로딩바 안보이도록
      loading.value = false
    } else if (isLogOutAction == 'loginOutAction') {
      //로그아웃시 메뉴 초기화
      menuInfo.value = []
    }
    window.localStorage.removeItem('isLogOutAction')

    window.addEventListener('click', onMainClick)

    //알림버튼 사용여부 체크
    getConfig('SYSTEM_ALARM').then((res) => (alarmVisible.value = res.data.used))
  })

  onUnmounted(() => {
    window.removeEventListener('click', onMainClick)
  })

  //이미지 경로에 없으면 태그 삭제
  function loadedLogoImg(e) {
    console.log('logo image error!')
    isShowLogo.value = true
  }

  function isMenuCheck(key: MenuType) {
    const idx = menuInfo.value.findIndex((a) => a.codeVal === key)
    if (idx == -1) {
      return false
    } else {
      return true
    }
  }
</script>

<style lang="scss">
  @import '@/assets/css/mainPage.css';
</style>

<style scoped lang="scss">
  .btn-menu {
    &:hover {
      > span {
        cursor: pointer;
        transition: all 0.2s;
        box-shadow: var(--el-box-shadow-dark);
      }
    }
  }
</style>
