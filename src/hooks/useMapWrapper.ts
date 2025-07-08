import { markRaw, ref } from 'vue'

import { useMapInfo } from '@/hooks/useMapInfo'
import { MapWrapper } from '@/js/mapWrapper'
import { ControlManager } from '@/js/map/control/ControlManager'
import { InteractionManager } from '@/js/map/interaction/InteractionManager'
import { MapType, MapWrapperConfig } from '@/enums/mapEnum'

export type MapObject = {
  mapInfo: useMapInfo
  initializeMap: (mapConfig: MapWrapperConfig) => Promise<MapWrapper>
  getMapInstance: () => Promise<MapWrapper>
  controlManager: ControlManager
  interactionManager: InteractionManager
}

export function useMapWrapper(mapType: MapType): MapObject {
  let mapInstance: MapWrapper
  const mapInfoRef = ref<useMapInfo>()
  const onPromise = _createItemPromise()
  const controlManager = markRaw(new ControlManager({}))
  const interactionManager = markRaw(new InteractionManager({}))

  async function initializeMap(mapConfig: MapWrapperConfig): Promise<MapWrapper> {
    if (mapInstance) return mapInstance

    mapInstance = await new Promise((resolve, reject) => {
      try {
        const mapWrap = MapWrapper.create({
          mapType,
          config: mapConfig,
        })
        resolve(mapWrap)
      } catch (error) {
        console.error('Map initialization failed:', error)
        reject(error)
      }
    })

    mapInfoRef.value = useMapInfo({
      zoom: mapConfig.zoom,
      center: mapConfig.center,
      baseMapKey: mapConfig.baseMapKey,
      baseMapOption: mapConfig.baseMapOption,
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
    get mapInfo() {
      return mapInfoRef.value!
    },
    initializeMap,
    getMapInstance,
    controlManager,
    interactionManager,
  }
}
