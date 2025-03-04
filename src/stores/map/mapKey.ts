import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMapKeyStore = defineStore('mapKey', () => {
  const currentIndex = ref(0)
  const reinitializeMap = () => {
    console.log(currentIndex)
    currentIndex.value++
  }
  return {
    currentIndex,
    reinitializeMap,
  }
})
