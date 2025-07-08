<template>
  <keep-alive>
    <component :is="currentTabComponent" />
  </keep-alive>
</template>

<script setup lang="ts">
  import { computed, DefineComponent, onActivated, onBeforeMount, onMounted } from 'vue'

  import Page1Comp from '@/views/app/menu-1/sub-1/panel/tab-C/page-1'
  import Page2Comp from '@/views/app/menu-1/sub-1/panel/tab-C/page-2'

  import { useGlobalStore } from '@/stores/app'
  import { useMenu1Sub1Tab3Store } from '@/stores/app/menu-1/sub-1/tab-C'

  const globalStore = useGlobalStore()
  const menu1Sub1Page3Store = useMenu1Sub1Tab3Store()

  const components: Record<string, DefineComponent> = {
    Page1: Page1Comp,
    Page2: Page2Comp,
  }

  const currentTabComponent = computed(
    () => components[menu1Sub1Page3Store.selectedTabId] || Page1Comp,
  )

  onMounted(async () => {})

  onBeforeMount(async () => {})

  onActivated(() => {})
</script>

<style scoped lang="scss">
  .border-box-round {
    background: #fff;
    border-radius: 8px;
  }

  :deep(.inside-collapse) {
    > div {
      .title {
        font-size: 13px;
        font-weight: normal;
      }
    }
  }
</style>
