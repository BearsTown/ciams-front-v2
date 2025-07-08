<template>
  <div>
    <template v-for="(tab, index) in menu1Sub1Tab3Page2Store.tabList" :key="tab">
      <ActiveButton
        ref="childRefs"
        :title="tab.name"
        :is-active="menu1Sub1Tab3Page2Store.selectedTab?.id === tab.id"
        @change:active="(isActive: boolean) => handleCustomEvent(isActive, tab, index)"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
  import { onActivated, onBeforeMount, onMounted, ref } from 'vue'

  import ActiveButton from '@/components/common/ActiveButton.vue'

  import { getIndustryAreas } from '@/api/app/menu-1/sub-1/tab-c'

  import { useMenu1Sub1Tab3Page2Store } from '@/stores/app/menu-1/sub-1/tab-C/page-2'

  const menu1Sub1Tab3Page2Store = useMenu1Sub1Tab3Page2Store()

  const childRefs = ref<ActiveButton[]>([])

  function handleCustomEvent(isActive: boolean, tab: any, index: number) {
    if (!isActive) return

    childRefs.value.forEach((child, i) => {
      if (i !== index && child?.setActive) {
        child.setActive(false)
      }
    })

    menu1Sub1Tab3Page2Store.selectTab(tab)
  }

  onMounted(async () => {
    const { data } = await getIndustryAreas()

    const newItems = data.map((item) => ({
      name: item.sgg_nm,
      id: item.sgg_cd,
      isActive: false,
      type: 'etcSGG',
    }))

    // menu1Sub1Tab3Page2Store.tabList = [...menu1Sub1Tab3Page2Store.tabList, ...newItems]
    menu1Sub1Tab3Page2Store.addTabList(newItems)
  })

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
