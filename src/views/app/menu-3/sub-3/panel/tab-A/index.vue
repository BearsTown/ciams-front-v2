<template>
  <keep-alive>
    <component :is="currentTabComponent" v-bind="componentProps" />
  </keep-alive>
</template>

<script setup lang="ts">
  import { computed, DefineComponent, onActivated, onBeforeMount, onMounted } from 'vue'

  import Temp from '@/components/app/menu-3/sub-3/panel/tab-A/temp.vue'
  // import Page1Comp from '@/components/app/menu-3/sub-3/panel/tab-A/page-1'
  // import Page2Comp from '@/components/app/menu-3/sub-3/panel/tab-A/page-2'
  // import Page3Comp from '@/components/app/menu-3/sub-3/panel/tab-A/page-3'
  // import Page4Comp from '@/components/app/menu-3/sub-3/panel/tab-A/page-4'
  // import Page5Comp from '@/components/app/menu-3/sub-3/panel/tab-A/page-5'
  // import Page6Comp from '@/components/app/menu-3/sub-3/panel/tab-A/page-6'
  // import Page7Comp from '@/components/app/menu-3/sub-3/panel/tab-A/page-7'
  // import Page8Comp from '@/components/app/menu-3/sub-3/panel/tab-A/page-8'
  // import Page9Comp from '@/components/app/menu-3/sub-3/panel/tab-A/page-9'
  import { useGlobalStore } from '@/stores/app'
  import { Menu3Sub3TabATabIdType, useMenu3Sub3TabAStore } from '@/stores/app/menu-3/sub-3/tab-A'

  const globalStore = useGlobalStore()
  const menu3Sub3TabAStore = useMenu3Sub3TabAStore()

  const titleMap: Record<Menu3Sub3TabATabIdType, string[]> = {
    Page1: ['산업혁신구역계획', '계획의 개요'],
    Page2: ['산업혁신구역계획', '토지이용계획'],
    Page3: ['산업혁신구역계획', '유치업종계획'],
    Page4: ['산업혁신구역계획', '건축물에 관한 계획'],
    Page5: ['산업혁신구역계획', '지원기반시설에 관한 계획'],
    Page6: ['산업혁신구역계획', '환경관리계획'],
    Page7: ['산업혁신구역계획', '기업지원시설 등에 관한 계획'],
    Page8: ['산업혁신구역계획', '재원조달계획'],
    Page9: ['산업혁신구역계획', '기타계획'],
  }

  const components: Record<Menu3Sub3TabATabIdType, DefineComponent> = {
    Page1: Temp,
    Page2: Temp,
    Page3: Temp,
    Page4: Temp,
    Page5: Temp,
    Page6: Temp,
    Page7: Temp,
    Page8: Temp,
    Page9: Temp,
  }

  const componentProps = computed(() => {
    const selectedTabId = menu3Sub3TabAStore.selectedTabId
    return {
      title: titleMap[selectedTabId] || [],
    }
  })

  const currentTabComponent = computed(() => components[menu3Sub3TabAStore.selectedTabId] || Temp)

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
