import { MapType } from '@/enums/mapEnum'
import { defineStore } from 'pinia'
import { ref } from 'vue'

interface Tree {
  id: number
  label: string
  children?: Tree[]
}
export interface CheckedLayer {
  id: number
  lid: string
  layer: string
  key: string
  type: boolean
  LegendURL?: string
  layerType?: string
  zIndex?: number
}
interface State {
  layers: Tree[]
  checkedLayer: CheckedLayer[]
}
type Key = MapType.ANALYSIS | MapType.MONITORING | MapType.OPERATION
export const useLayerStore = defineStore('useLayerStore', () => {
  const state = ref<Record<Key, State[]>>({
    [MapType.ANALYSIS]: [
      {
        layers: [],
        checkedLayer: [],
      },
      {
        layers: [],
        checkedLayer: [],
      },
    ],
    [MapType.OPERATION]: [
      {
        layers: [],
        checkedLayer: [],
      },
      {
        layers: [],
        checkedLayer: [],
      },
    ],
    [MapType.MONITORING]: [
      {
        layers: [],
        checkedLayer: [],
      },
      {
        layers: [],
        checkedLayer: [],
      },
    ],
  })
  const setLayers = (layer: Tree[], isFirst: boolean, stateType: MapType) => {
    if (isFirst) {
      state.value[stateType][0].layers = layer
    } else {
      state.value[stateType][1].layers = layer
    }
  }
  const addLayers = (layer: Tree[], isFirst: boolean, stateType: MapType) => {
    if (isFirst) {
      state.value[stateType][0].layers.push(...layer)
    } else {
      state.value[stateType][1].layers.push(...layer)
    }
  }
  const setCheckedLayer = (
    checkedLayer: CheckedLayer[] | undefined,
    isFirst: boolean,
    stateType: MapType,
  ) => {
    if (checkedLayer === undefined) return false
    if (isFirst) {
      state.value[stateType][0].checkedLayer = checkedLayer.filter((item) => item.type === true)
    } else {
      state.value[stateType][1].checkedLayer = checkedLayer.filter((item) => item.type === true)
    }
  }

  return {
    state,
    setLayers,
    addLayers,
    setCheckedLayer,
  }
})
