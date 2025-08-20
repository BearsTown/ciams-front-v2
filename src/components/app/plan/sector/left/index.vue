<template>
  <template v-for="(group, index) in groups" :key="group">
    <MenuCollapse
      class="menuButton"
      ref="childRefs"
      :title="`${index + 1}. ${group.title}`"
      type=""
      align="left"
      :is-open="selectedGroupId === group.id"
      @open-change="(isOpen: boolean) => handleGroupClick(isOpen, group, index)"
    >
      <template #content>
        <template v-for="tab in group.children" :key="tab">
          <ActiveButton
            :title="tab.title"
            :is-active="selectedItemId === tab.id"
            @change:active="(isActive: boolean) => handleItemClick(isActive, tab)"
          />
        </template>
      </template>
    </MenuCollapse>
    <el-divider v-if="index < groups.length - 1" style="margin: 10px 0" border-style="dashed" />
  </template>
</template>

<script setup lang="ts">
  import { computed, onMounted, ref } from 'vue'

  import ActiveButton from '@/components/common/ActiveButton.vue'
  import MenuCollapse from '@/components/common/collapse/MenuCollapse.vue'

  import { usePlanSectorStore } from '@/stores/app/plan/sector'

  import { ContentMenu } from '@/models/services/app/content-menu'
  import { getContentMenuList } from '@/services/app/content-menu'

  const planSectorStore = usePlanSectorStore()

  const childRefs = ref<MenuCollapse[]>([])

  const groups = computed<ContentMenu[]>(() => planSectorStore.groups)
  const selectedGroupId = computed<number | undefined>(() => planSectorStore?.selectedGroup?.id)
  const selectedItemId = computed<number | undefined>(() => planSectorStore?.selectedItem?.id)

  function handleGroupClick(isOpen: boolean, group: ContentMenu, index: number) {
    if (!isOpen) return

    childRefs.value.forEach((child, i) => {
      if (i !== index && child?.setOpen) {
        child.setOpen(false)
      }
    })

    planSectorStore.selectGroup(group)
  }

  function handleItemClick(isOpen: boolean, item: ContentMenu) {
    if (!isOpen) return

    planSectorStore.selectItem(item)
  }

  onMounted(async () => {
    const data = await getContentMenuList(1)
    planSectorStore.setGroupList(data)
    planSectorStore.selectGroup(data[0])
  })
</script>

<style scoped lang="scss"></style>
