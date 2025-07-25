<template>
  <div>
    <template v-for="(tab, index) in basicLocIndCharITAStore.tabList" :key="tab">
      <ActiveButton
        ref="childRefs"
        :title="tab.name"
        :is-active="basicLocIndCharITAStore.selectedTabId === tab.id"
        @change:active="(isActive: boolean) => handleCustomEvent(isActive, tab.id, index)"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'

  import ActiveButton from '@/components/common/ActiveButton.vue'

  import {
    BasicLocIndCharITATabIdType,
    useBasicLocIndCharITAStore,
  } from '@/stores/app/basic/loc/ind-char/ITA'

  const basicLocIndCharITAStore = useBasicLocIndCharITAStore()

  const childRefs = ref<ActiveButton[]>([])

  function handleCustomEvent(isActive: boolean, id: BasicLocIndCharITATabIdType, index: number) {
    if (!isActive) return

    childRefs.value.forEach((child, i) => {
      if (i !== index && child?.setActive) {
        child.setActive(false)
      }
    })

    basicLocIndCharITAStore.selectTab(id)
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
