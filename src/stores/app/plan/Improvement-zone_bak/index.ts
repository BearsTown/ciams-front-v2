import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

interface Group {
  // items: {}[]
  // extends...
  isActive: boolean
}

export const usePlanImprovementZoneStore = defineStore('planImprovementZoneStore', () => {
  const groups = ref<Group[]>([])

  function setGroupList(list) {
    groups.value = list.map((group: {}) => ({
      ...group,
      // items: [],
      isActive: false,
    }))
  }

  function selectGroup(group: {}) {
    groups.value.forEach((item) => {
      item.isActive = item.id === group.id
    })
  }

  function setGroupItemList(list) {
    selectedGroup.value!.children = list.map((item) => ({
      ...item,
      isActive: false,
    }))
  }

  function selectItem(item: any) {
    selectedGroup.value?.children?.forEach((child) => {
      child.isActive = child.id === item.id
    })
  }

  const selectedGroup = computed(() => groups.value.find((item) => item.isActive))
  const selectedItem = computed(() => selectedGroup.value?.children?.find((item) => item.isActive))

  return {
    groups,
    selectedGroup,
    selectedItem,
    setGroupList,
    selectGroup,
    selectItem,
    setGroupItemList,
  }
})
