<template>
  <keep-alive>
    <component :is="currentTabComponent" />
  </keep-alive>
</template>

<script setup lang="ts">
  import { computed, DefineComponent, onActivated, onBeforeMount, onMounted } from 'vue'
  import { useMenu1Sub1Tab1Store } from '@/stores/app/menu-1/sub-1/tab-A'

  import { useGlobalStore } from '@/stores/app'

  import Page1Comp from '@/views/app/menu-1/sub-1/panel/tab-A/page-1'
  import Page2Comp from '@/views/app/menu-1/sub-1/panel/tab-A/page-2'

  const globalStore = useGlobalStore()
  const menu1Sub1Page1Store = useMenu1Sub1Tab1Store()

  const components: Record<string, DefineComponent> = {
    '999': Page1Comp,
  }

  const currentTabComponent = computed(
    () => components[menu1Sub1Page1Store.selectedMenu.id] || Page2Comp,
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
