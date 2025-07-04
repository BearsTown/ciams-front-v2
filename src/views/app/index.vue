<template>
  <div id="map">
    <div class="map-container">
      <SideBarMenu />
      <MainContainer />
    </div>

    <PwdChangeDialog :is-visible="isPwdChangeVisible" @close-dialog="isPwdChangeVisible = false" />

    <el-dialog
      v-model="globalStore.printDialog"
      align-center
      :show-close="false"
      :append-to-body="true"
      :destroy-on-close="true"
      :close-on-click-modal="false"
      class="dialog-map-print"
      width="80%"
      height="100%"
      top="28vh"
      :fullscreen="false"
    >
      <MapPrint style="width: 100%; height: 600px" :map-type="currentMapType" />
    </el-dialog>
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
  import MapPrint from '@/components/map/control/MapPrint.vue'
  import { useMapStore } from '@/stores/map/map'

  // const printDialog = ref<boolean>(false)
  function dialogChangeListener(state: boolean) {
    globalStore.printDialog = state
  }

  const route = useRoute()
  const router = useRouter()

  const authStore = useAuthStore()
  // const mapStore = useMapStore()
  const globalStore = useGlobalStore()

  const { currentMapType } = storeToRefs(globalStore)

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

  .dialog-map-print {
    //width: 960px;

    .el-dialog__header {
      display: none !important;
    }

    .el-dialog__body {
      padding: 0;
      height: 80%;
    }

    :deep .el-dialog__body {
      height: 80%;
    }
  }

  :deep .el-dialog__body {
    height: 80%;
  }
</style>

<style scoped lang="scss"></style>
