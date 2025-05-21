import { reactive, toRefs } from 'vue'
import { defineStore } from 'pinia'

import { useBoolean, UseBoolean } from '@/hooks/useBoolean'

// export interface StatusGroup {
//   selectedMenu: object
//   selectedItem: object
// }

interface Menu1Sub1Tab1 {
  showInfo: UseBoolean
  selectedMenu: any
  selectedItem: any
}

export const useMenu1Sub1Tab1Store = defineStore('menu1-Sub1-Tab1-Store', () => {
  const state = reactive<Menu1Sub1Tab1>({
    showInfo: useBoolean(false),
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
