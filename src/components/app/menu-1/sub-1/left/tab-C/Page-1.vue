<template>
  <div>
    <template v-for="(tab, index) in menu1Sub1Tab3Page1Store.tabList" :key="tab">
      <ActiveButton
        ref="childRefs"
        :title="tab.name"
        :is-active="menu1Sub1Tab3Page1Store.selectedTabId === tab.id"
        @change:active="(isActive: boolean) => handleCustomEvent(isActive, tab.id, index)"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
  import { onActivated, onBeforeMount, onMounted, ref } from 'vue'

  import ActiveButton from '@/components/common/ActiveButton.vue'

  import {
    Menu1Sub1Tab3Page1TabIdType,
    useMenu1Sub1Tab3Page1Store,
  } from '@/stores/app/menu-1/sub-1/tab-C/page-1'

  const menu1Sub1Tab3Page1Store = useMenu1Sub1Tab3Page1Store()

  const childRefs = ref<ActiveButton[]>([])

  function handleCustomEvent(isActive: boolean, id: Menu1Sub1Tab3Page1TabIdType, index: number) {
    if (!isActive) return

    childRefs.value.forEach((child, i) => {
      if (i !== index && child?.setActive) {
        child.setActive(false)
      }
    })

    menu1Sub1Tab3Page1Store.selectTab(id)
  }

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
