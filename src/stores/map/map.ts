import { defineStore } from 'pinia'
import { MapLayerGroupType, MapType, MapWrapperConfig } from '@/enums/mapEnum'
import { reactive, toRefs } from 'vue'
import { MapWrapper } from '@/js/mapWrapper'
import { useMapInfo } from '@/hooks/useMapInfo'
import { ControlManager } from '@/js/map/control/ControlManager'
import { InteractionManager } from '@/js/map/interaction/InteractionManager'
import { Feature } from 'ol'

interface IAddress {
  id: string
  address: {
    zipcode: string
    category: string
    road: string
    parcel: string
    bldnm: string
    bldnmdc: string
  }
  point: {
    x: string
    y: string
  }
}

interface ILocInfo {
  pnu: number
  point: {
    x: number
    y: number
  }
}

export const useMapStore = (mapType: MapType) => {
  return defineStore(`mapStore-${mapType}`, () => {
    let mapInstance: MapWrapper
    const onPromise = _createWaitPromise()
    const controlManager = new ControlManager({})
    const interactionManager = new InteractionManager({})

    // const searchAddress = markRaw({} as IAddress)

    const state = reactive({
      currentMapGroup: {} as MapLayerGroupType,
      mapInfo: {} as useMapInfo,
      locInfo: {} as ILocInfo,
      locParams: {} as ILocInfo,
      locationInfoVisible: false,
      searchAddress: {} as IAddress,
      searchAddressFeature: {} as Feature,
      map3d: { isUse: false, feature: null },
    })

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

      state.mapInfo = useMapInfo({
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

    function _createWaitPromise() {
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

    function setAddress(newAddress) {
      Object.assign(state.searchAddress, newAddress)
    }

    function setSearchAddressFeature(feature) {
      state.searchAddressFeature = feature
    }

    function setLocInfo(locInfo: ILocInfo) {
      state.locInfo = locInfo
    }

    function setLocParams(locParams: any) {
      state.locParams = locParams
    }

    return {
      ...toRefs(state),
      initializeMap,
      getMapInstance,
      controlManager,
      interactionManager,
      setLocInfo,
      setLocParams,
      setAddress,
      setSearchAddressFeature,
    }
  })()
}
