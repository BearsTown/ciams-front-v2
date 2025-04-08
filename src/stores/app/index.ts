import { defineStore } from 'pinia'
import { reactive, Ref, toRefs } from 'vue'
import { RouteMeta, RouteRecordName, useRouter } from 'vue-router'

import { RouteNameType } from '@/router'
import { UseBoolean, useBoolean } from '@/hooks/useBoolean'
import { MapType } from '@/enums/mapEnum'
import { useCmmConfigStore } from '@/stores/config/cmmConfig'

type LayoutPart = {
  visible: UseBoolean
  collapse?: UseBoolean
}

export type LayoutState = {
  left?: LayoutPart
  right?: LayoutPart
  center: LayoutPart
  panel?: LayoutPart
  locationInfo?: UseBoolean
}

type Layouts = Map<RouteRecordName, Partial<LayoutState>>

export const useGlobalStore = defineStore('globalStore', () => {
  const cmmConfigStore = useCmmConfigStore()

  const router = useRouter()
  const menus = router.getRoutes().filter((node) => node.meta?.group === 'MAIN_MENU') ?? []

  const state = reactive({
    loading: false,
    // currentMapType: MapType.MAP_1,
    currentMapType: '' as MapType,
    layouts: new Map() as Layouts,
    layoutSelected: {} as Ref<Partial<LayoutState> | undefined>,
  })

  menus[0].children.forEach((item) => {
    if (item.meta && item.meta!.layout) {
      addLayoutState(item.name!, item.meta.layout)
    }

    if (item.children) {
      item.children.forEach((citem) => {
        if (citem.meta && citem.meta!.layout) {
          addLayoutState(citem.name!, citem.meta.layout)
        }
      })
    }
  })

  function loadingOn() {
    state.loading = true
  }

  function loadingOff() {
    state.loading = false
  }

  function addLayoutState(name: RouteRecordName, layout: RouteMeta['layout']) {
    state.layouts.set(name, {
      left: layout?.left
        ? {
            visible: useBoolean(layout.left.visible),
            collapse: useBoolean(layout.left.collapse),
          }
        : undefined,
      right: layout?.right
        ? {
            visible: useBoolean(layout.right.visible),
            collapse: useBoolean(layout.right.collapse),
          }
        : undefined,
      panel: layout?.panel
        ? {
            visible: useBoolean(layout.panel.visible),
          }
        : undefined,
      center: {
        visible: useBoolean(layout?.center.visible),
      },
    })
  }

  function setLayout(name: RouteNameType) {
    state.layoutSelected = state.layouts.get(name)
  }

  return {
    ...toRefs(state),
    loadingOn,
    loadingOff,
    setLayout,
  }
})
