import { computed, toRefs, reactive } from 'vue'

export const useSelection = (api = (params) => Promise, keyName = '') => {
  const state = reactive({
    dataList: [{}],
    selectedList: [],
    isSelectedAll: false,
  })

  const selectedListKeys = computed(() => {
    return state.selectedList.map(({ key }) => key)
  })

  async function requestApi(params) {
    try {
      const { data } = await api(params)
      state.dataList = data
    } catch (error) {
      console.log(error)
    }
  }

  function selectAll() {
    // const find = state.selectedList.find((val) => (val.isSelected))
    // if (state.allList.length !== state.selectedList.length) {
    //   state.selectedList = [...state.allList]
    // }
    // state.selectedList.map((val) => (val.isSelected = true))

    // const find = state.selectedList.find((val) => (val.isSelected))
    // if (state.dataList.length !== state.selectedList.length) {
    //   state.selectedList = [...state.allList]
    // }

    if (state.dataList.length !== state.selectedList.length) {
      state.selectedList = [...state.dataList]
    }

    checkSelectedAll()
  }

  function selectReverse() {
    const newList = state.dataList.filter((data) => state.selectedList.indexOf(data) === -1)
    state.selectedList = newList
    checkSelectedAll()
  }

  function checkSelectedAll() {
    if (state.selectedList.length === 0) {
      state.isSelectedAll = false
      return
    }
    state.isSelectedAll = state.dataList.length === state.selectedList.length
  }

  function selectionChange(keyList) {
    state.selectedList = state.dataList.filter((data) => keyList.find((key) => key === data.key))
    checkSelectedAll()
  }

  function clearSelection() {
    if (state.selectedList.length > 0) {
      state.selectedList = []
    }
    checkSelectedAll()
  }

  return {
    ...toRefs(state),
    requestApi,
    selectAll,
    selectReverse,
    clearSelection,
    selectedListKeys,
    selectionChange,
  }
}
