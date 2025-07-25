<template>
  <div>
    <template v-for="(tab, index) in basicLocIndStatusMfgStore.tabList" :key="tab">
      <ActiveButton
        ref="childRefs"
        :title="tab.name"
        :is-active="basicLocIndStatusMfgStore.selectedTabId === tab.id"
        @change:active="(isActive: boolean) => handleCustomEvent(isActive, tab.id, index)"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'

  import ActiveButton from '@/components/common/ActiveButton.vue'

  import {
    BasicLocIndStatusMfgTabIdType,
    useBasicLocIndStatusMfgStore,
  } from '@/stores/app/basic/loc/ind-status/manufacturing'

  const basicLocIndStatusMfgStore = useBasicLocIndStatusMfgStore()

  const childRefs = ref<ActiveButton[]>([])

  function handleCustomEvent(isActive: boolean, id: BasicLocIndStatusMfgTabIdType, index: number) {
    if (!isActive) return

    childRefs.value.forEach((child, i) => {
      if (i !== index && child?.setActive) {
        child.setActive(false)
      }
    })

    basicLocIndStatusMfgStore.selectTab(id)
  }
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
