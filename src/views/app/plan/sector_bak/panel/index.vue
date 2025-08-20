<template>
  <div class="panel">
    <keep-alive>
      <component :is="currentTabComponent" />
    </keep-alive>
  </div>
</template>

<script setup lang="ts">
  import { computed, DefineComponent } from 'vue'

  import TabAComp from '@/views/app/plan/sector/panel/page-1'
  import TabBComp from '@/views/app/plan/sector/panel/page-2'
  import TabCComp from '@/views/app/plan/sector/panel/page-3'
  import { Menu3Sub2TabIdType, useMenu3Sub2Store } from '@/stores/app/plan/sector'

  const menu3sub2store = useMenu3Sub2Store()

  const components: Record<Menu3Sub2TabIdType, DefineComponent> = {
    TabA: TabAComp,
    TabB: TabBComp,
    TabC: TabCComp,
  }

  const currentTabComponent = computed(() => components[menu3sub2store.selectedTabId] || TabAComp)
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
