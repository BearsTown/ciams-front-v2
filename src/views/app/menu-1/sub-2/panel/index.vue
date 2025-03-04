<template>
  <div class="panel">
    <keep-alive>
      <component :is="currentTabComponent" />
    </keep-alive>
  </div>
</template>

<script setup lang="ts">
  import { computed, DefineComponent, onBeforeMount } from 'vue'

  import { useGlobalStore } from '@/stores/app'
  import { Menu1Sub2TabIdType, useMenu1Sub2store } from '@/stores/app/menu-1/sub-2'
  import { useCmmConfigStore } from '@/stores/config/cmmConfig'

  import CommonUtil from '@/utils/commonUtil'

  import TabAComp from '@/components/app/menu-1/sub-2/panel/Tab-A.vue'
  import TabBComp from '@/components/app/menu-1/sub-2/panel/Tab-B.vue'
  import TabCComp from '@/components/app/menu-1/sub-2/panel/Tab-C.vue'

  const globalStore = useGlobalStore()
  const menu1sub2store = useMenu1Sub2store()
  const cmmConfigStore = useCmmConfigStore()

  const components: Record<Menu1Sub2TabIdType, DefineComponent> = {
    TabA: TabAComp,
    TabB: TabBComp,
    TabC: TabCComp,
    TabD: TabCComp,
  }

  const currentTabComponent = computed(() => components[menu1sub2store.selectedTabId] || TabAComp)

  async function loadConfig() {
    try {
      await cmmConfigStore.loadMapConfig()
    } catch (err) {
      CommonUtil.errorMessage(err)
    }
  }

  async function init() {
    await loadConfig()
  }

  onBeforeMount(() => {
    init()
  })
</script>

<style scoped lang="scss">
  .panel {
    height: 100%;
    padding: 15px 12px;
    background-color: #f4f4f4;
  }
</style>
