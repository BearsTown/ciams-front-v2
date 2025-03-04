<template>
  <div id="map">
    <div class="map-container">
      <SideBarMenu />
      <MainContainer />
    </div>

    <PwdChangeDialog :is-visible="isPwdChangeVisible" @close-dialog="isPwdChangeVisible = false" />
  </div>
</template>

<script setup lang="ts">
  import { computed, onBeforeMount, onMounted, ref, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { storeToRefs } from 'pinia'

  import SideBarMenu from '@/components/app/SideBarMenu.vue'
  import MainContainer from '@/components/common/MainContainer.vue'
  import PwdChangeDialog from '@/components/login/PwdChangeDialog.vue'

  import { RouteName, RouteNameType } from '@/router'
  import { useGlobalStore } from '@/stores/app'
  import { useAuthStore } from '@/stores/auth'

  // import { useMapStore } from '@/stores/map/map'
  import { useBoolean } from '@/hooks/useBoolean'
  import { getConfig } from '@/api/app/config'
  import CommonUtil from '@/utils/commonUtil'
  import { useCmmConfigStore } from '@/stores/config/cmmConfig'

  const route = useRoute()
  const router = useRouter()

  const authStore = useAuthStore()
  // const mapStore = useMapStore()
  const globalStore = useGlobalStore()

  const { isAdmin, userInfo, menuInfo } = storeToRefs(authStore)

  const isSyncView = ref(false)
  const isPwdChangeVisible = ref<boolean>(false)
  const { status: userMenuActive, toggle: userMenuToggle } = useBoolean(false)
  const alarmVisible = ref(false)

  const routeName = computed(() => route.name)

  const cmmConfigStore = useCmmConfigStore()

  async function loadConfig() {
    try {
      await cmmConfigStore.loadCmmConfig()
      await cmmConfigStore.loadMapConfig()
    } catch (err) {
      CommonUtil.errorMessage(err)
    }
  }

  globalStore.setLayout(RouteName[routeName.value as string])

  onBeforeMount(async () => {
    await loadConfig()
  })

  watch(routeName, () => {
    authStore.checkToken()
    routerChange(RouteName[routeName.value!])
  })

  onMounted(() => {
    authStore.getUserInfo()
    authStore.getMenuInfo()

    // globalStore.setLayout(RouteName[routeName.value as string])

    //알림버튼 사용여부 체크
    getConfig('SYSTEM_ALARM').then((res) => (alarmVisible.value = res.data.used))
  })

  function routerChange(ro: RouteNameType) {
    if (!ro) return

    switch (ro) {
      case 'userArchive':
        router.push({ name: 'archiveMain', path: '' })
        break
    }

    globalStore.setLayout(ro)
  }
</script>

<style>
  @import '@/assets/css/mapPage.css';
  @import '@/assets/css/urbanInfo.css';
  @import '@/assets/css/typeDivision.css';
  @import '@/assets/css/planningDetail.css';
  @import '@/assets/css/targetEdit.css';
  @import '@/assets/css/planningMonitoring.css';
  @import '@/assets/css/zoningSetting.css';
</style>

<style scoped lang="scss"></style>
