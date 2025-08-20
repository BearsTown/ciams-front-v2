<template>
  <div style="display: flex; width: 100%; height: 100%; flex-direction: column">
    <template v-for="(item, index) in itemList" :key="item">
      <MenuCollapse
        class="menuButton"
        ref="childRefs"
        :title="`${index + 1}. ${item.title}`"
        type=""
        align="left"
        :is-open="item.isActive"
        :is-child="item.children?.length > 0"
        @open-change="(isOpen: boolean) => handleItemClick(isOpen, item, index)"
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

  import CommonUtil from '@/utils/commonUtil'
  import { ContentMenu } from '@/models/services/app/content-menu'

  import { usePlanImprovementZoneStore } from '@/stores/app/plan/Improvement-zone'

  const planImprovementZoneStore = usePlanImprovementZoneStore()

  const props = withDefaults(
    defineProps<{
      parentId: number
    }>(),
    {},
  )

  const childRefs = ref<MenuCollapse[]>([])
  const itemList = ref<ContentMenu[]>([])

  function handleItemClick(isOpen: boolean, item: ContentMenu, index: number) {
    if (!isOpen) return

    childRefs.value.forEach((child, i) => {
      if (i !== index && child?.setOpen) {
        child.setOpen(false)
      }
    })

    planImprovementZoneStore.selectItem(item)
  }

  onMounted(async () => {
    itemList.value = planImprovementZoneStore.selectedGroup
      ? planImprovementZoneStore.selectedGroup?.children
      : []

    if (!CommonUtil.isEmpty(itemList.value)) planImprovementZoneStore.selectItem(itemList.value![0])
  })
</script>

<style scoped lang="scss"></style>
