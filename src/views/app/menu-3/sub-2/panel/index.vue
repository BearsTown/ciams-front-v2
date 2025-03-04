<template>
  <div class="panel">
    <keep-alive>
      <component :is="currentTabComponent" />
    </keep-alive>
  </div>
</template>

<script setup lang="ts">
  import { computed, DefineComponent, onBeforeMount } from 'vue'

  import TabAComp from 'src/views/app/menu-3/sub-2/panel/page-1'
  import TabBComp from 'src/views/app/menu-3/sub-2/panel/page-2'
  import TabCComp from 'src/views/app/menu-3/sub-2/panel/page-3'

  import CommonUtil from '@/utils/commonUtil'
  import { useGlobalStore } from '@/stores/app'
  import { Menu3Sub2TabIdType, useMenu3Sub2Store } from '@/stores/app/menu-3/sub-2'
  import { useCmmConfigStore } from '@/stores/config/cmmConfig'

  const globalStore = useGlobalStore()
  const menu3sub2store = useMenu3Sub2Store()
  const cmmConfigStore = useCmmConfigStore()

  const components: Record<Menu3Sub2TabIdType, DefineComponent> = {
    TabA: TabAComp,
    TabB: TabBComp,
    TabC: TabCComp,
  }

  const currentTabComponent = computed(() => components[menu3sub2store.selectedTabId] || TabAComp)

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
    width: 100%;
    height: 100%;
    padding: 10px;
    //padding: 15px 12px;
    background-color: #f4f4f4;
  }
</style>
