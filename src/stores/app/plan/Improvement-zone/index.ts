import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import { ContentMenu } from '@/models/services/app/content-menu'

export const usePlanImprovementZoneStore = defineStore('planImprovementZoneStore', () => {
  const groups = ref<ContentMenu[]>([])

  function setGroupList(list: ContentMenu[]) {
    groups.value = list
  }

  function selectGroup(group: ContentMenu) {
    groups.value.forEach((item) => {
      item.isActive = item.id === group.id
    })
  }

  function selectItem(item: ContentMenu) {
    selectedGroup.value?.children?.forEach((child) => {
      child.isActive = child.id === item.id
    })
  }

  const selectedGroup = computed<ContentMenu | undefined>(() =>
    groups.value.find((item) => item.isActive),
  )
  const selectedItem = computed<ContentMenu | undefined>(() =>
    selectedGroup.value?.children?.find((item) => item.isActive),
  )

  return {
    groups,
    selectedGroup,
    selectedItem,
    setGroupList,
    selectGroup,
    selectItem,
  }
})
