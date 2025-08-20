<template>
  <div style="display: flex; width: 100%; height: 100%; flex-direction: column">
    <template v-for="(tab, index) in itemList" :key="tab">
      <MenuCollapse
        class="menuButton"
        ref="childRefs"
        :title="`${index + 1}. ${tab.title}`"
        type=""
        align="left"
        :is-open="tab.isActive"
        :is-child="tab.children?.length > 0"
        @open-change="(isOpen: boolean) => handleCustomEvent(isOpen, tab, index)"
      >
        <template #content></template>
      </MenuCollapse>

      <el-divider v-if="index < itemList.length - 1" style="margin: 10px 0" border-style="dashed" />
    </template>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue'

  import MenuCollapse from '@/components/common/collapse/MenuCollapse.vue'

  import { getContentMenuList } from '@/api/app/content'

  import { usePlanImprovementZoneStore } from '@/stores/app/plan/Improvement-zone'

  const planImprovementZoneStore = usePlanImprovementZoneStore()

  const props = withDefaults(
    defineProps<{
      parentId: number
    }>(),
    {},
  )

  const itemList = ref<{}[]>([])
  const childRefs = ref<MenuCollapse[]>([])

  function handleCustomEvent(isOpen: boolean, id: number, index: number) {
    if (!isOpen) return

    childRefs.value.forEach((child, i) => {
      if (i !== index && child?.setOpen) {
        child.setOpen(false)
      }
    })

    planImprovementZoneStore.selectItem(id)
  }

  onMounted(async () => {
    const { data } = await getContentMenuList(props.parentId)

    planImprovementZoneStore.setGroupItemList(data)

    planImprovementZoneStore.selectItem(data[0])

    itemList.value = planImprovementZoneStore.selectedGroup?.children
  })
</script>

<style lang="scss">
  .zoningSetting .zoningSetting-top .customSelect {
    border: 0;
  }

  .zoningSetting-top.customCard .customSelect-value {
    font-size: 14px;
    border: 0;
    padding: 0;
  }

  .zoningSetting .customTab-item:not(.disabled).active {
    background: #7aaad1;
    color: #fff;
  }
</style>

<style scoped lang="scss">
  .zoningSetting-tab {
    margin: 0;
  }

  .customTab {
    display: flex;
    padding: 10px 0 10px 0;
    justify-content: space-between;

    .customTab-item {
      flex: 1;
      padding: 0;
      margin-left: 10px;
      background-color: white;
    }

    .customTab-item:first-child {
      margin-left: 0;
      margin-right: 0;
    }
  }

  .menuButton {
    overflow-y: hidden;

    &:not(:first-child) {
      //margin-top: 8px;
    }
  }
</style>
