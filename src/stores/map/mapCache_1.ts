import { defineStore } from 'pinia'
import { MapType } from '@/enums/mapEnum'
import { reactive, toRefs } from 'vue'
import { MapObject, useMapWrapper } from '@/hooks/useMapWrapper'

export const useMapCacheStore = (mapType: MapType) => {
  return defineStore('mapStore', () => {
    const state = {
      mapObjects: new Map() as Map<MapType, MapObject>,
    }

    if (!state.mapObjects.get(mapType)) {
      state.mapObjects.set(mapType, useMapWrapper(mapType))
    }

    function getMapObject(mapType: MapType): MapObject {
      const mapWrap = state.mapObjects.get(mapType)
      if (!mapWrap) {
        throw new Error(`Map instance for type ${mapType} not found.`)
      }
      return mapWrap
    }

    return {
      // ...toRefs(state),
      getMapObject,
    }
  })()
}
