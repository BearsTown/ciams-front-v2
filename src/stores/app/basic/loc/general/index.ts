import { reactive, toRefs } from 'vue'
import { defineStore } from 'pinia'

export const useBasicLocGeneralStore = defineStore('basicLocGeneralStore', () => {
  const state = reactive<{
    selectedMenu: object
    selectedItem: object
  }>({
    selectedMenu: {},
    selectedItem: {},
  })

  function setStatusGroup(menu: object, item: object) {
    state.selectedMenu = menu
    state.selectedItem = item
  }

  return {
    ...toRefs(state),

    setStatusGroup,
  }
})
