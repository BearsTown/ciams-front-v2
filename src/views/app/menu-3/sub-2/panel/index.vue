<template>
  <div class="panel">
    <keep-alive>
      <component :is="currentTabComponent" />
    </keep-alive>
  </div>
</template>

<script setup lang="ts">
  import { computed, DefineComponent, onBeforeMount } from 'vue'

  import TabAComp from '@/views/app/menu-3/sub-2/panel/page-1'
  import TabBComp from '@/views/app/menu-3/sub-2/panel/page-2'
  import TabCComp from '@/views/app/menu-3/sub-2/panel/page-3'

  import { useGlobalStore } from '@/stores/app'
  import { useCmmConfigStore } from '@/stores/config/cmmConfig'
  import { Menu3Sub2TabIdType, useMenu3Sub2Store } from '@/stores/app/menu-3/sub-2'

  const globalStore = useGlobalStore()
  const cmmConfigStore = useCmmConfigStore()
  const menu3sub2store = useMenu3Sub2Store()

  const components: Record<Menu3Sub2TabIdType, DefineComponent> = {
    TabA: TabAComp,
    TabB: TabBComp,
    TabC: TabCComp,
  }

  const currentTabComponent = computed(() => components[menu3sub2store.selectedTabId] || TabAComp)

  async function init() {}

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
