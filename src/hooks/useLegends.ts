import { computed, ref } from 'vue'

export type LegendType = 'tab' | 'group' | 'item'

interface Legend {
  id: string
  title: string
  visible: boolean
  type: LegendType
  text?: Array<string>
  used?: boolean
}

export interface LegendItem extends Legend {
  type: 'item'
  img?: string
  color?: string
}

export interface LegendGroup extends Legend {
  type: 'group'
  children: LegendItem[]
}

export interface LegendTab extends Legend {
  type: 'tab'
  children: LegendGroup[]
}

export const useLegends = (lTabs: LegendTab[] = []) => {
  const tabs = ref<LegendTab[]>(lTabs)

  const tabsRef = computed({
    get: () => {
      return tabs.value
    },
    set: (state: LegendTab[] = []) => {
      tabs.value = state
    },
  })

  function addTab(lTab: LegendTab) {
    tabs.value.push(lTab)
  }

  function addTabs(lTabs: LegendTab[]) {
    tabs.value = [...tabs.value, ...lTabs]
  }

  function addGroup(tabId: string, group: LegendGroup) {
    const fTab = _find(tabId, tabs.value) as LegendTab
    if (fTab) fTab.children.push(group)
  }

  function addGroups(tabId: string, groups: LegendGroup[]) {
    groups.forEach((group) => addGroup(tabId, group))
  }

  function addItem(groupId: string, item: LegendItem) {
    const fGroup = _find(groupId, tabs.value) as LegendGroup
    if (fGroup) fGroup.children.push(item)
  }

  function addItems(groupId: string, items: LegendItem[]) {
    items.forEach((item) => addItem(groupId, item))
  }

  function setVisible(id: string, visible: boolean) {
    const find = _find(id, tabs.value)
    if (find) find.visible = visible
    _refresh()
  }

  function _find(
    id: string,
    child: LegendTab[] | LegendGroup[] | LegendItem[],
  ): LegendTab | LegendGroup | LegendItem | undefined {
    for (let i = 0; i < child.length; i++) {
      const data = child[i]
      if (data.id === id) {
        return data
      }

      if (data.type !== 'item') {
        const findData = _find(id, data.children)
        if (findData) {
          return findData
        }
      }
    }
  }

  function _refresh() {}

  return {
    tabsRef,

    addTab,
    addTabs,
    addGroup,
    addGroups,
    addItem,
    addItems,
    setVisible,
  }
}
