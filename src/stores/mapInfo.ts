// import { mapCenter, mapZoom } from '@/js/map/properties'

import { defineStore } from 'pinia'
import { Ref, computed, ref } from 'vue'
import { useCmmConfigStore } from './config/cmmConfig'

export const moveType = {
  PREV: 'prev',
  NEXT: 'next',
  CURRENT: 'current',
}
const cmmConfig = useCmmConfigStore()
const mapCenter = computed(() => cmmConfig.state.MAP_INIT_CENTER?.confValue)
const mapZoom = computed(() => cmmConfig.state.MAP_INIT_ZOOM?.confValue)
export const useMapInfoStore = defineStore('mapInfo', () => {
  const mapInfoArr: Ref<Array<{ zoomLevel: number; position: number[] }>> = ref([])

  const currentIndex = ref(0)
  //default값은 current
  const type = ref(moveType.CURRENT)

  const addMapInfo = ({ zoomLevel, position }) => {
    //이전페이지로 간 후에 이동 및 줌 레벨 변경 case
    if (mapInfoArr.value.length > currentIndex.value) {
      //이후 페이지 제거
      mapInfoArr.value = mapInfoArr.value.slice(0, currentIndex.value + 1)
    }
    mapInfoArr.value.push({ zoomLevel, position })
    currentIndex.value = mapInfoArr.value.length - 1
  }

  const getCurrentMapInfo = () => {
    return mapInfoArr.value[currentIndex.value]
  }
  const resetMapInfo = (option?: { zoom: number; center: number[] }) => {
    mapInfoArr.value = [
      {
        zoomLevel: option?.zoom || +mapZoom.value,
        position: option?.center || JSON.parse(mapCenter.value),
      },
    ]
    currentIndex.value = 0
  }

  return {
    addMapInfo,
    mapInfoArr,
    currentIndex,
    getCurrentMapInfo,
    type,
    resetMapInfo,
  }
})
