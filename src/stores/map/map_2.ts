import { defineStore } from 'pinia'
import { MapType, MapWrapperConfig } from '@/enums/mapEnum'
import { reactive, toRefs } from 'vue'
import { MapWrapper } from '@/js/mapWrapper'
import { useMapInfo } from '@/hooks/useMapInfo'
import { ControlManager } from '@/js/map/control/ControlManager'
import { InteractionManager } from '@/js/map/interaction/InteractionManager'

export const useMapStore = (mapType: MapType) => {
  return defineStore(`mapStore-${mapType}`, () => {
    let mapInstance: MapWrapper
    const onPromise = _createItemPromise()
    const controlManager = new ControlManager({})
    const interactionManager = new InteractionManager({})

    const state = reactive({
      mapInfo: {} as useMapInfo,
    })

    async function initializeMap(mapConfig: MapWrapperConfig): Promise<MapWrapper> {
      if (mapInstance) return mapInstance

      mapInstance = await new Promise((resolve, reject) => {
        try {
          const mapWrap = new MapWrapper({
            name: mapType,
            config: mapConfig,
          })
          resolve(mapWrap)
        } catch (error) {
          console.error('Map initialization failed:', error)
          reject(error)
        }
      })

      state.mapInfo = useMapInfo({
        zoom: mapConfig.zoom,
        center: mapConfig.center,
      })

      onPromise.resolve(mapInstance)

      return mapInstance
    }

    async function getMapInstance() {
      if (mapInstance) return mapInstance

      try {
        return await onPromise.promise
      } catch (error) {
        console.error('Failed to get map instance:', error)
        throw error
      }
    }

    function _createItemPromise() {
      let resolveFn: (value: MapWrapper) => void
      let rejectFn: (reason: any) => void

      const promise = new Promise<MapWrapper>((resolve, reject) => {
        resolveFn = resolve
        rejectFn = reject
      })

      const timeoutId = setTimeout(() => {
        rejectFn(new Error('Error: Timeout while waiting for map instance'))
      }, 4000)

      return {
        promise,
        resolve: (item: MapWrapper) => {
          clearTimeout(timeoutId)
          resolveFn(item)
        },
        reject: (error: any) => {
          clearTimeout(timeoutId)
          rejectFn(error)
        },
      }
    }

    return {
      ...toRefs(state),
      initializeMap,
      getMapInstance,
      controlManager,
      interactionManager,
      // controlManager: computed(() => controlManager),
      // interactionManager: computed(() => interactionManager),
    }
  })()
}
