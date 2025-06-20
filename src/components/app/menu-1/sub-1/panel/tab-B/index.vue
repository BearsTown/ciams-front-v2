<template>
  <keep-alive>
    <component :is="currentTabComponent" />
  </keep-alive>
</template>

<script setup lang="ts">
  import { computed, DefineComponent, onActivated, onBeforeMount, onMounted } from 'vue'

  import { useMenu1Sub1store } from '@/stores/app/menu-1/sub-1'
  import { useMenu1Sub1Tab2Store } from '@/stores/app/menu-1/sub-1/tab-B'

  import { useGlobalStore } from '@/stores/app'
  import Page1Comp from '@/components/app/menu-1/sub-1/panel/tab-B/page-1'
  import Page2Comp from '@/components/app/menu-1/sub-1/panel/tab-B/page-2'
  // import Page3Comp from '@/components/app/menu-1/sub-1/panel/tab-B/page-3'
  import Page3Comp from '@/views/app/menu-1/sub-1/panel/tab-B/page-3'
  import Page4Comp from '@/views/app/menu-1/sub-1/panel/tab-B/page-4'
  import Page5Comp from '@/views/app/menu-1/sub-1/panel/tab-B/page-5'
  import Page6Comp from '@/views/app/menu-1/sub-1/panel/tab-B/page-6'

  const globalStore = useGlobalStore()
  const menu1store = useMenu1Sub1store()
  const menu1Sub1Page2Store = useMenu1Sub1Tab2Store()

  const components: Record<string, DefineComponent> = {
    Page1: Page1Comp,
    Page2: Page2Comp,
    Page3: Page3Comp,
    Page4: Page4Comp,
    Page5: Page5Comp,
    Page6: Page6Comp,
  }

  const currentTabComponent = computed(
    () => components[menu1Sub1Page2Store.selectedTabId] || Page1Comp,
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
