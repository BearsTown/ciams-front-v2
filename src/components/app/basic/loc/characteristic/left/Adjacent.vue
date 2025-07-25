<template>
  <div>
    <template v-for="(tab, index) in basicLocIndCharAdjacentStore.tabList" :key="tab">
      <ActiveButton
        ref="childRefs"
        :title="tab.name"
        :is-active="basicLocIndCharAdjacentStore.selectedTab?.id === tab.id"
        @change:active="(isActive: boolean) => handleCustomEvent(isActive, tab, index)"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue'

  import ActiveButton from '@/components/common/ActiveButton.vue'

  import { getAdjacent } from '@/api/app/basic/loc/characteristic'

  import { useBasicLocIndCharAdjacentStore } from '@/stores/app/basic/loc/ind-char/adjacent'

  const basicLocIndCharAdjacentStore = useBasicLocIndCharAdjacentStore()

  const childRefs = ref<ActiveButton[]>([])

  function handleCustomEvent(
    isActive: boolean,
    tab: {
      id: string
      name: string
    },
    index: number,
  ) {
    if (!isActive) return

    childRefs.value.forEach((child, i) => {
      if (i !== index && child?.setActive) {
        child.setActive(false)
      }
    })

    basicLocIndCharAdjacentStore.selectTab(tab)
  }

  onMounted(async () => {
    const { data } = await getAdjacent()

    const newItems = data.map((item) => ({
      id: item.sggCd,
      name: item.sggNm,
    }))

    basicLocIndCharAdjacentStore.addTabList(newItems)
  })
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
