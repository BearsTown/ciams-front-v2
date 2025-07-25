<template>
  <div>
    <template v-for="(tab, index) in basicLocIndStatusTechLQStore.tabList" :key="tab">
      <ActiveButton
        ref="childRefs"
        :title="tab.name"
        :is-active="basicLocIndStatusTechLQStore.selectedTabId === tab.id"
        @change:active="(isActive: boolean) => handleCustomEvent(isActive, tab.id, index)"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'

  import ActiveButton from '@/components/common/ActiveButton.vue'

  import {
    BasicLocIndStatusTechLQTabIdType,
    useBasicLocIndStatusTechLQStore,
  } from '@/stores/app/basic/loc/ind-status/tech-lq'

  const basicLocIndStatusTechLQStore = useBasicLocIndStatusTechLQStore()

  const childRefs = ref<ActiveButton[]>([])

  function handleCustomEvent(
    isActive: boolean,
    id: BasicLocIndStatusTechLQTabIdType,
    index: number,
  ) {
    if (!isActive) return

    childRefs.value.forEach((child, i) => {
      if (i !== index && child?.setActive) {
        child.setActive(false)
      }
    })

    basicLocIndStatusTechLQStore.selectTab(id)
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
