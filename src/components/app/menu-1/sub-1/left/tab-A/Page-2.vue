<template>
  <div>
    <template v-for="(tab, index) in menu1Sub1Tab2Page3Store.tabList" :key="tab">
      <ActiveButton
        ref="childRefs"
        :title="tab.name"
        :is-active="menu1Sub1Tab2Page3Store.selectedTabId === tab.id"
        @change:active="(isActive: boolean) => handleCustomEvent(isActive, tab.id, index)"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
  import { onActivated, onBeforeMount, onMounted, ref } from 'vue'

  import ActiveButton from '@/components/common/ActiveButton.vue'

  import {
    Menu1Sub1Tab2Page3TabIdType,
    useMenu1Sub1Tab2Page3Store,
  } from '@/stores/app/menu-1/sub-1/tab-B/page-3'

  const menu1Sub1Tab2Page3Store = useMenu1Sub1Tab2Page3Store()

  const childRefs = ref<ActiveButton[]>([])

  function handleCustomEvent(isActive: boolean, id: Menu1Sub1Tab2Page3TabIdType, index: number) {
    if (!isActive) return

    childRefs.value.forEach((child, i) => {
      if (i !== index && child?.setActive) {
        child.setActive(false)
      }
    })

    menu1Sub1Tab2Page3Store.selectTab(id)
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
