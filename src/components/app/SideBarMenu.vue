<template>
  <aside class="map-sideBar">
    <!-- 로고 -->
    <a class="siderBar-logo" href="/"
      >CIAMS
      <br />
      <p class="logo-sub">도시공업지역<br />관리시스템</p>
    </a>

    <!-- 사이드바 메뉴 -->
    <div class="customScroll scrollY">
      <template v-for="item in menus[0].children" :key="item">
        <button
          v-if="isMenuCheck(item.name as MenuType)"
          class="btn-sideBarMenu"
          @click="onChangeMenu(item.name!)"
          :class="{ active: routePath.includes(item.path) }"
        >
          <inline-svg :src="item.meta?.icon" width="24" height="24" style="padding-bottom: 8px" />
          <span class="title" v-html="toLabel(item.meta?.title!)"></span>
        </button>

        <ul class="menu-list" :class="{ active: routePath.includes(item.path) }">
          <template v-for="sub in item.children" :key="sub">
            <template v-if="!sub.meta?.hidden">
              <li
                :class="{ active: routePath.includes(sub.path) }"
                @click="onChangeSubMenu(sub.name!)"
                v-html="toLabel(sub.meta?.title!)"
              ></li>
            </template>
          </template>
        </ul>
      </template>
    </div>

    <!-- 하단 메뉴 -->
    <div class="sideBar-bottom">
      <button v-if="alarmVisible" class="btn-sideBarUser">
        <svg
          width="22"
          height="22"
          viewBox="0 0 22 22"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M10.999 3.75C8.2402 3.75 5.85092 6.2311 5.85092 9.48902V9.50019L5.85086 9.50019L5.82854 11.4981C5.82738 12.7893 5.4415 13.8973 4.97166 14.75H17.0371C16.5856 13.8954 16.2153 12.785 16.2153 11.4922V11.4805L16.2154 11.4805L16.2377 9.58258C16.2349 6.27264 13.8063 3.75 10.999 3.75ZM3.85092 9.48326C3.85378 5.29997 6.9687 1.75 10.999 1.75C15.0812 1.75 18.2377 5.34767 18.2377 9.58829V9.60004L18.2376 9.60004L18.2153 11.4979C18.2167 12.6435 18.6342 13.606 19.0741 14.2681L18.2413 14.8216L19.0741 14.2681C19.4106 14.7744 19.3735 15.3644 19.2142 15.7746C19.0607 16.1698 18.6349 16.75 17.8679 16.75H4.13104C3.35153 16.75 2.92741 16.1525 2.77834 15.7567C2.623 15.3443 2.58827 14.7442 2.94057 14.2359C3.40029 13.5725 3.82854 12.6197 3.82854 11.4922V11.4811L3.82861 11.4811L3.85092 9.48326ZM7.77329 17.7925C8.118 17.361 8.74725 17.2906 9.17875 17.6354C9.64778 18.0101 10.2836 18.25 10.999 18.25C11.7145 18.25 12.3503 18.0101 12.8193 17.6354C13.2508 17.2906 13.8801 17.361 14.2248 17.7925C14.5695 18.224 14.4991 18.8533 14.0676 19.198C13.2393 19.8597 12.1618 20.25 10.999 20.25C9.83625 20.25 8.75881 19.8597 7.93044 19.198C7.49894 18.8533 7.42858 18.224 7.77329 17.7925Z"
            fill="#7AAAD1"
          />
        </svg>
      </button>
      <button @click="userMenuToggle" class="btn-sideBarUser">
        <svg
          width="16"
          height="17"
          viewBox="0 0 16 17"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M7.82282 2.44922C6.43965 2.44922 5.31836 3.57051 5.31836 4.95368C5.31836 6.33686 6.43965 7.45815 7.82282 7.45815C9.206 7.45815 10.3273 6.33686 10.3273 4.95368C10.3273 3.57051 9.206 2.44922 7.82282 2.44922ZM4.25586 4.95368C4.25586 2.9837 5.85284 1.38672 7.82282 1.38672C9.7928 1.38672 11.3898 2.9837 11.3898 4.95368C11.3898 6.92366 9.7928 8.52065 7.82282 8.52065C5.85284 8.52065 4.25586 6.92366 4.25586 4.95368Z"
            fill="#7AAAD1"
          />
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M3.75586 4.95368C3.75586 2.70756 5.5767 0.886719 7.82282 0.886719C10.0689 0.886719 11.8898 2.70756 11.8898 4.95368C11.8898 7.19981 10.0689 9.02065 7.82282 9.02065C5.5767 9.02065 3.75586 7.19981 3.75586 4.95368ZM7.82282 1.88672C6.12899 1.88672 4.75586 3.25985 4.75586 4.95368C4.75586 6.64752 6.12899 8.02065 7.82282 8.02065C9.51666 8.02065 10.8898 6.64752 10.8898 4.95368C10.8898 3.25985 9.51666 1.88672 7.82282 1.88672ZM7.82282 2.94922C6.71579 2.94922 5.81836 3.84665 5.81836 4.95368C5.81836 6.06072 6.71579 6.95815 7.82282 6.95815C8.92986 6.95815 9.82729 6.06072 9.82729 4.95368C9.82729 3.84665 8.92986 2.94922 7.82282 2.94922ZM4.81836 4.95368C4.81836 3.29436 6.1635 1.94922 7.82282 1.94922C9.48214 1.94922 10.8273 3.29436 10.8273 4.95368C10.8273 6.613 9.48214 7.95815 7.82282 7.95815C6.1635 7.95815 4.81836 6.613 4.81836 4.95368Z"
            fill="#7AAAD1"
          />
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M2.37489 11.9523C3.47793 10.7738 5.27187 9.88672 8.02465 9.88672C10.7774 9.88672 12.5714 10.7738 13.6744 11.9523C14.7636 13.1159 15.1333 14.5155 15.1333 15.4775C15.1333 15.7709 14.8954 16.0087 14.602 16.0087H1.44727C1.15386 16.0087 0.916016 15.7709 0.916016 15.4775C0.916016 14.5155 1.28573 13.1159 2.37489 11.9523ZM2.02369 14.9462H14.0256C13.915 14.2643 13.5881 13.4149 12.8987 12.6783C12.0285 11.7487 10.5338 10.9492 8.02465 10.9492C5.51552 10.9492 4.02077 11.7487 3.1506 12.6783C2.46119 13.4149 2.13425 14.2643 2.02369 14.9462Z"
            fill="#7AAAD1"
          />
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M2.00984 11.6106C3.22254 10.315 5.15732 9.38672 8.02465 9.38672C10.892 9.38672 12.8267 10.315 14.0395 11.6106C15.2252 12.8774 15.6333 14.4038 15.6333 15.4775C15.6333 16.047 15.1716 16.5087 14.602 16.5087H1.44727C0.877722 16.5087 0.416016 16.047 0.416016 15.4775C0.416016 14.4038 0.824129 12.8774 2.00984 11.6106ZM8.02465 10.3867C5.38642 10.3867 3.73332 11.2326 2.73993 12.2939C1.74734 13.3544 1.41602 14.6272 1.41602 15.4775C1.41602 15.4948 1.43001 15.5087 1.44727 15.5087H14.602C14.6193 15.5087 14.6333 15.4948 14.6333 15.4775C14.6333 14.6272 14.302 13.3544 13.3094 12.2939C12.316 11.2326 10.6629 10.3867 8.02465 10.3867ZM8.02465 11.4492C5.63031 11.4492 4.2763 12.2073 3.51564 13.02C3.08905 13.4758 2.8193 13.98 2.66214 14.4462H13.3872C13.23 13.98 12.9602 13.4758 12.5337 13.02C11.773 12.2073 10.419 11.4492 8.02465 11.4492ZM2.78556 12.3366C3.76524 11.29 5.40073 10.4492 8.02465 10.4492C10.6486 10.4492 12.2841 11.29 13.2637 12.3366C14.0303 13.1556 14.395 14.1006 14.5192 14.8662C14.5426 15.0109 14.5014 15.1586 14.4064 15.2703C14.3114 15.3819 14.1722 15.4462 14.0256 15.4462H2.02369C1.8771 15.4462 1.7379 15.3819 1.6429 15.2703C1.5479 15.1586 1.50668 15.0109 1.53014 14.8662C1.65426 14.1006 2.01899 13.1556 2.78556 12.3366Z"
            fill="#7AAAD1"
          />
        </svg>
      </button>

      <!-- 사용자버튼 하위메뉴 -->
      <ul class="menu-list user" :class="{ active: userMenuActive }">
        <li class="user-name">{{ userInfo?.userName }}</li>
        <li @click="handleCommand('pwdChange')">비밀번호<br />변경</li>
        <li @click="handleCommand('admin')" v-if="isAdmin">관리자<br />바로가기</li>
        <li @click="handleCommand('logout')">로그아웃</li>
      </ul>
    </div>
  </aside>
</template>

<script setup lang="ts">
  import { computed, onMounted, ref, watch, watchEffect } from 'vue'
  import { RouteRecordName, useRoute, useRouter } from 'vue-router'
  import { storeToRefs } from 'pinia'

  import { MenuType } from '@/router'
  import CommonUtil from '@/utils/commonUtil'
  import { useBoolean } from '@/hooks/useBoolean'

  import { getConfig } from '@/api/app/config'

  import { useAuthStore } from '@/stores/auth'

  const route = useRoute()
  const router = useRouter()

  const authStore = useAuthStore()

  const { isAdmin, userInfo, menuInfo } = storeToRefs(authStore)

  const isPwdChangeVisible = ref<boolean>(false)
  const { status: userMenuActive, toggle: userMenuToggle } = useBoolean(false)
  const alarmVisible = ref(false)

  const routePath = computed(() => route.path)

  const menus = computed(() => {
    return router.getRoutes().filter((node) => node.meta?.group === 'MAIN_MENU') ?? []
  })

  watch(routePath, () => {
    authStore.checkToken()
  })

  watchEffect(() => {})

  onMounted(() => {
    authStore.checkToken()
    //알림버튼 사용여부 체크
    getConfig('SYSTEM_ALARM').then((res) => (alarmVisible.value = res.data.used))
  })

  function onChangeMenu(name: RouteRecordName) {
    router.push({
      name,
    })
  }

  function onChangeSubMenu(name: RouteRecordName | undefined) {
    router.push({
      name,
    })
  }

  function handleCommand(cmd) {
    if (cmd == 'logout') {
      CommonUtil.confirm('로그아웃 하시겠습니까?', '로그아웃').then(() =>
        authStore.logOut('loginOutAction'),
      )
    } else if (cmd == 'pwdChange') {
      isPwdChangeVisible.value = true
    } else if (cmd == 'info') {
      // alert('내정보')
    } else if (cmd == 'admin') {
      window.open(`/${import.meta.env.VITE_APP_CONTEXT}/admin`, '_blank')
    }
  }

  function toLabel(title: string) {
    return title?.replaceAll(' ', '<br />')
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

<style scoped lang="scss">
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
