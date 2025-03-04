import { defineStore } from 'pinia'
import { Ref, ref, toRefs } from 'vue'

export const useAbortStore = defineStore('abort', () => {
  const state: Ref<{ abortControllerList: Array<AbortController> }> = ref({
    abortControllerList: [],
  })
  const addAbortList = (abortController: AbortController) => {
    state.value.abortControllerList.push(abortController)
  }

  const setAborted = () => {
    state.value.abortControllerList.forEach((ac) => {
      if (ac.signal.aborted === false) {
        ac.abort()
      }
    })
  }

  return {
    state,
    addAbortList,
    setAborted,
  }
})
