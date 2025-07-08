import { reactive } from 'vue'

import { Coordinate } from 'ol/coordinate'

import { BaseMapOption, MapInfo } from '@/enums/mapEnum'

export type useMapInfoState = {
  zoom: number
  center: Coordinate
  baseMapKey: string
  baseMapOption: BaseMapOption
}

export type useMapInfo = {
  state: useMapInfoState
  updateState: <K extends keyof MapInfo>(key: K, value: MapInfo[K]) => void
}

export function useMapInfo(info: MapInfo): useMapInfo {
  const state: useMapInfoState = reactive(info)

  function updateState<K extends keyof MapInfo>(key: K, value: MapInfo[K]): void {
    state[key] = value
  }

  return {
    state,
    updateState,
  }
}
