<template>
  <router-view />
  <CustomLoading v-if="loading" />
</template>

<script setup lang="ts">
  import { onBeforeMount, watch } from 'vue'
  import { useRouter } from 'vue-router'
  import { storeToRefs } from 'pinia'
  import '@vuepic/vue-datepicker/dist/main.css'

  import CustomLoading from '@/components/CustomLoading.vue'

  import { useAuthStore } from '@/stores/auth'
  import { useGlobalStore } from '@/stores/app'
  import { PROJ } from '@/enums/mapEnum'
  import proj4 from 'proj4'
  import { register } from 'ol/proj/proj4'
  import CommonUtil from '@/utils/commonUtil'
  import { useCmmConfigStore } from '@/stores/config/cmmConfig'

  const router = useRouter()
  const authStore = useAuthStore()
  const globalStore = useGlobalStore()
  const cmmConfigStore = useCmmConfigStore()
  const { loading } = storeToRefs(globalStore)
  const { logInStatus, path } = storeToRefs(authStore)

  watch(logInStatus, (changeStatus) => {
    if (changeStatus === 'success') {
      // router.push(path.value)
    } else if (changeStatus === 'notLoggedIn') {
      router.push('/')
    } else if (changeStatus === 'accessTokenExpired') {
      authStore.refreshToken()
    }
  })

  Object.keys(PROJ).forEach((key) => {
    proj4.defs(key, PROJ[key])
  })

  register(proj4)

  async function loadConfig() {
    try {
      await cmmConfigStore.loadCmmConfig()
      await cmmConfigStore.loadMapConfig()
    } catch (err) {
      CommonUtil.errorMessage(err)
    }
  }

  onBeforeMount(async () => {
    await loadConfig()
  })
</script>

<style>
  /* reset */
  @import '@/assets/css/reset.css';

  /* CKEditor */
  @import '@/assets/css/ckeditor-fix.css';

  /* font */
  @import '@/assets/css/typhography.css';

  /* style components */
  @import '@/assets/css/components/button.css';
  @import '@/assets/css/components/card.css';
  @import '@/assets/css/components/checkbox.css';
  @import '@/assets/css/components/datePicker.css';
  @import '@/assets/css/components/input.css';
  @import '@/assets/css/components/pagination.css';
  @import '@/assets/css/components/popover.css';
  @import '@/assets/css/components/radio.css';
  @import '@/assets/css/components/scroll.css';
  @import '@/assets/css/components/select.css';
  @import '@/assets/css/components/switch.css';
  @import '@/assets/css/components/tab.css';
  @import '@/assets/css/components/table.css';
  @import '@/assets/css/components/textarea.css';
  @import '@/assets/css/components/tooltip.css';

  #app {
    width: 100%;
    height: 100vh;
    font-size: 14px;
    font-family: 'Pretendard', sans-serif;
    font-variant-numeric: tabular-nums;
    color: #000;
  }

  #app * {
    font-family: 'Pretendard', sans-serif;
  }

  #app button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    text-align: center;
  }

  #app button:disabled {
    cursor: not-allowed;
  }
</style>
