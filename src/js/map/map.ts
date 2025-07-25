import { ImageWMS, Source, TileWMS, Vector as VectorSource } from 'ol/source'
import { Feature, Map, Overlay } from 'ol'
import {
  createImageWMSSource,
  createWMSSource,
  createWMTSSource,
  mapApi,
} from '@/api/map/mapService'
// import MapControl from './mapControl'
// import { getAllLayersByPropertyName, getBaseLayerState } from '../layers'
import BaseLayer from 'ol/layer/Base'
import type { MapType } from '@/enums/mapEnum'
import { LayerType } from '@/enums/mapEnum'
import { FeatureOption, MapStudioParam, MapStudioParamWithZ } from '@/types/map'
import { moveType, useMapInfoStore } from '@/stores/mapInfo'
// import useKeyLayerStore from '@/stores/map/keyLayer'
import { Geometry, MultiPoint, MultiPolygon, Point, Polygon } from 'ol/geom'
import { equalTo, intersects } from 'ol/format/filter'
import { transform } from 'ol/proj'
// import MapWalker from './mapWalker'
import { Listener } from 'ol/events'
import {
  bufferLineStyle,
  dyanamicStyleSetColor,
  setFillColor,
  setStrokeColorWithColor,
} from './mapStyle'
import BaseEvent from 'ol/events/Event'
import { Coordinate } from 'ol/coordinate'
import { useGlobalStore } from '@/stores/app'
import { useOpenApiStore } from '@/stores/app/openapi'
import TileLayer from 'ol/layer/Tile'
import { Layer } from 'ol/layer'
import ImageLayer from 'ol/layer/Image'
import Filter from 'ol/format/filter/Filter'
import { Extent } from 'ol/extent'
import { Interaction } from 'ol/interaction'
import { useMapStore } from '@/stores/map/map'
import CommonUtil from '@/utils/commonUtil'
// import { useMapConfig } from '@/stores/map/mapConfig'
import { vWorldAxiosInstance } from '@/api/vWorld'
import { AxiosResponse } from 'axios'
import mittBus from '@/utils/mittBus'
import { Fill, Stroke } from 'ol/style'
import { getKrasData } from '@/api/app/land/kras'
// import { usePlanAreaStore } from '@/stores/app/operation/planArea'
import { DrawEvent } from 'ol/interaction/Draw'
import { getKgeoUnionData } from '@/api/app/land/kgeo'

import { useCmmConfigStore } from '@/stores/config/cmmConfig'

const cmmConfigStore = useCmmConfigStore()

const url = import.meta.env.VITE_API_MAPSTUDIO_URL
const color_main = '#4D7D99'
const overlay = (container: HTMLElement, id: string) =>
  new Overlay({
    id,
    element: container,
    autoPan: {
      animation: {
        duration: 250,
      },
    },
  })

interface FOption {
  isStyled?: boolean
  isClear?: boolean
  color?: string
  isExtent?: boolean
  type?: string
}
type MergeFunction<T extends Record<string, any>> = (a: T, b: T) => T

const mapUtil = {
  removeClickOverlay: (map: Map) => {
    map.getListeners('click')?.forEach((event: Listener & { name: string }) => {
      if (event.name === 'clickEvt') {
        map.un('click', event as (e: BaseEvent) => void)
      }
    })
  },
  setZoom: (level?: number) => {
    if (!level) return false
    const meta = document.querySelector('#base-map .map-util  [data-name=current-zoom]')
    if (meta) {
      const tag = meta.querySelector('button span') as HTMLDivElement
      tag.textContent = level + ''
    }
  },
  setPosition: (pos: number[]) => {
    const position = document.querySelector('#mapLocation')

    // 위치 보드 태그가 유효할 경우
    if (position) {
      const tag1 = position.querySelector('span[name=x]') as HTMLDivElement
      const tag2 = position.querySelector('span[name=y]') as HTMLDivElement

      const [x, y] = pos.map((coord) => coord.toFixed(0))

      tag1.textContent = 'X : ' + x.toString()
      tag2.textContent = 'Y : ' + y.toString()
    }
  },
  getScaleToResolution(map: Map, dpi = 96) {
    const inchToMeter = 0.0254
    const millimeterPerMeter = 1000
    const resolution = map.getView().getResolution()
    if (!resolution) return 0
    return (resolution * millimeterPerMeter * dpi * inchToMeter).toFixed(0)
  },
  setScaleLabel: (scale: number) => {
    const position = document.querySelector('#mapLocation')

    // 위치 보드 태그가 유효할 경우
    if (position) {
      const tag1 = position.querySelector('span[name=scale]') as HTMLDivElement

      tag1.textContent = '1 : ' + scale.toString()
    }
  },
  scaleToResolution: (scale: number, dpi = 96) => {
    const inchToMeter = 0.0254
    const resolution = scale / (dpi * inchToMeter) / 1000
    return resolution
  },

  async getLandVworld(type: 'KRAS' | 'KGEO' | 'PUBLIC', mapType: MapType) {
    const globalStore = useGlobalStore()
    const openApiStore = useOpenApiStore()
    globalStore.loadingOn()

    const mapStore = useMapStore(mapType)

    const { pnu, point } = mapStore.locInfo

    this.getVwordInfo({ point }, pnu).then((res) => {
      mapStore.setAddress({
        id: pnu,
        point: { x: point.x, y: point.y },
        address: {
          parcel: res.text,
          zipcode: res.zipcode,
          type: res.type,
        },
      })
    })
    switch (type) {
      case 'KRAS': {
        this.getLandKrasInfo(pnu, { point, id: '' })
          .then((json) => {
            openApiStore.setKrasInfoItem(json)
          })
          .catch((error) => {
            console.log(error)
            // CommonUtil.errorMessage('error' + error)
          })
          .finally(() => {
            globalStore.loadingOff()
          })
        break
      }
      case 'KGEO': {
        const { data } = await getKgeoUnionData(pnu + '')
        openApiStore.setKgeoInfoItem(data)
        globalStore.loadingOff()
        break
      }
      case 'PUBLIC': {
        this.getLandPublicInfo(pnu, { point, id: '' })
          .then((json) => {
            openApiStore.setPublicDataInfotem(json)
          })
          .catch((error) => {
            console.log(error)
            // CommonUtil.errorMessage('error' + error)
          })
          .finally(() => {
            globalStore.loadingOff()
          })
        break
      }
    }
  },

  async getLandKrasInfo(pnu: number, coord: { id: string; point: { x: number; y: number } }) {
    const res = await getKrasData(pnu + '')
    return res.data
  },
  async getLandPublicInfo(pnu: number, coord: { id: string; point: { x: number; y: number } }) {
    const landData = await mapApi.getLandData(pnu + '')
    return landData
  },
  async getVwordInfo(coord: { point: { x: any; y: any } }, pnu: any) {
    try {
      await cmmConfigStore.loadMapConfig()
    } catch (err) {
      CommonUtil.errorMessage(err)
    }

    // const gmpStore = useGmpssStore()
    return vWorldAxiosInstance
      .get(
        `/req/address?service=address&request=getAddress&version=2.0&point=${coord.point.x},${coord.point.y}&format=json&type=parcel&zipcode=true&simple=false&crs=EPSG:3857&key=${cmmConfigStore.mapConfigState['VWORLD_KEY'].confValue}`,
      )
      .then((res: AxiosResponse) => {
        if (res.data.response.status === 'NOT_FOUND') {
          throw new Error()
        }
        const result = res.data.response.result[0]
        // gmpStore.setRightDataDetail(true, {
        //   id: pnu,
        //   point: { x: coord.point.x, y: coord.point.y },
        //   address: {
        //     parcel: result.text,
        //     zipcode: result.zipcode,
        //     type: result.type,
        //   },
        // })
        return result
      })
      .catch((error) => {
        CommonUtil.errorMessage('데이터를 조회해올 수 없습니다.')
      })
  },
  /**
   *
   * 해당 obj 에서 key가 있는지 체크
   * @param key Object형태
   * @param val
   */
  async delayGet(obj: Object, key: string, delay: number) {
    let count = 0
    await new Promise((resolve) => {
      const checkState = () => {
        const _val = obj[key]
        if (count > 10) throw new Error('다시 검색해주세요.')
        if (_val) {
          resolve(_val)
        } else {
          count++
          setTimeout(() => checkState(), delay) // 일정 시간마다 재시도
        }
      }
      checkState()
    })
  },

  async fly(
    map: Map,
    coord: { id: string; point: { x: number; y: number } },
    layerType: LayerType,
  ) {
    console.log(layerType)
    if (!map) return
    const keyLayerStore = useKeyLayerStore()
    let keyLayer = keyLayerStore.get('LDREG')
    if (!keyLayer) {
      await keyLayerStore.initState()
      keyLayer = keyLayerStore.get('LDREG')
      console.log(keyLayer)
    }
    try {
      await this.delayGet(keyLayer, 'layer', 300)
    } catch (error) {
      console.log(error)
      // CommonUtil.errorMessage(error)
      return
    }
    const currentLayer = keyLayer.layer
      .split(',')
      .filter((l) => /^GMPSS.*LSMD_CONT_LDREG$/.test(l))[0]
    const options = {
      KEY: keyLayer.key,
      LAYERS: currentLayer,
      filterdOptions:
        coord.id != ''
          ? equalTo('PNU', coord.id)
          : intersects('SHAPE', new Point([coord.point.x, coord.point.y]), 'EPSG:3857'),
    }
    const features = await mapApi.getWFS(options)
    const newFeatures = new Array<Feature<Geometry>>()
    features.forEach((feature, idx) => {
      newFeatures.push(feature.clone() as Feature)
      newFeatures[idx].setProperties({ gmpssLabel: feature.getProperties().JIBUN })
    })
    try {
      const gmpStore = useGmpssStore()
      gmpStore.setSearchAddressFeature(newFeatures[0])
      mapUtil.searchHighLightLayer(newFeatures[0], map, layerType, { isClear: true })
      const highlightLayer = mapUtil.getSpecificLayer(map, layerType)[0]
      const highlightSource = highlightLayer?.getSource() as VectorSource
      map.getView().fit(highlightSource.getExtent(), { size: map.getSize() })
      // gmpStore.setIsLoadingKrasDetailItem(true)
      const pnu = newFeatures[0].get('PNU')
      gmpStore.setLocInfo({ ...coord, pnu })
      // gmpStore.setCurrentRightDetail('KRAS')
      // gmpStore.setRightKrasDetailItem({})
      // gmpStore.setRightPublicDataDetailItem({})
      // this.getLandKrasInfo(pnu, coord)
      //   .then((json) => {
      //     gmpStore.setRightKrasDetailItem(json)
      //   })
      //   .catch((error) => {
      //     // CommonUtil.errorMessage('error' + error)
      //   })
      //   .finally(() => {
      //     gmpStore.setIsLoadingKrasDetailItem(false)
      //   })
      this.getVwordInfo(coord, pnu)
      gmpStore.setRightDataDetail(true, coord)
      return map.getView().getCenter()
    } catch (error) {
      CommonUtil.errorMessage('해당 구역에 필지정보가 존재하지 않습니다.')
    }
  },
  async drawHighlight(
    drawType: 'Point' | 'Polygon2',
    isUse: boolean,
    color = '#9699f8',
  ): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const mapStore = useMapStore()
      const mapControl = mapStore.state[mapStore.getCurrentMapKey() as MapType].mapControl
      if (!mapControl) {
        return resolve(false)
      }
      mapControl.setEventHandler({ useDraw: false, useOverlay: false })
      mittBus.emit('clear-current-focusedButton')
      const keyLayerStore = useKeyLayerStore()
      let keyLayer = keyLayerStore.get('LDREG')
      if (!keyLayer) {
        await keyLayerStore.initState()
        keyLayer = keyLayer.get('LDREG')
      }
      const currentLayer = keyLayer.layer
        .split(',')
        .filter((l) => /^GMPSS.*LSMD_CONT_LDREG$/.test(l))[0]

      const currentMap = mapControl.getMap()
      if (!currentMap) {
        return resolve(false)
      }
      const options = (geom: Geometry) => ({
        KEY: keyLayer.key,
        LAYERS: currentLayer,
        filterdOptions: intersects('SHAPE', geom, 'EPSG:3857'),
      })
      if (isUse === false) {
        mapControl.setEventHandler({ useDraw: false, useOverlay: false })
        return resolve(false)
      }
      mapControl.setActive(true, drawType)
      const draw = mapControl.getActive()
      const drawEndListeners = draw?.getListeners('drawend')
      if (drawEndListeners) {
        drawEndListeners.forEach((l: any) => {
          draw?.un('drawend', l)
        })
      }
      // const { r, g, b } = CommonUtil.hex2rgb(color)
      // const fillColor = CommonUtil.rgbaToHex(r, g, b, 1)
      const drawEndEvt = (e: DrawEvent) => {
        if (!e.feature.getGeometry()) return
        mapApi
          .getWFS(options(e.feature.getGeometry()!))
          .then((features) => {
            const newFeatures = new Array<Feature<Geometry>>()
            const drawSource = this.getLayerById(
              currentMap,
              LayerType.DRAWINFO,
            )?.getSource() as VectorSource
            if (features.length > 7) {
              CommonUtil.errorMessage(`7필지 이하로 선택해주세요`)
              drawSource.clear()
              return
            }

            features.forEach((feature, idx) => {
              newFeatures.push(feature.clone() as Feature)
              newFeatures[idx].setProperties({ gmpssLabel: feature.getProperties()['JIBUN'] })
            })
            mapUtil.addHighLightLayerByFeatures(
              newFeatures,
              currentMap,
              { fill: new Fill({ color }), stroke: new Stroke({ color: color_main, width: 1 }) },
              {
                isExtent: true,
              },
            )
            drawSource.clear()
            mittBus.emit('register-incentive-list', features)
            if (features.length === 0) {
              throw Error()
            }
          })
          .catch(() => {
            CommonUtil.errorMessage('필지생성중에 오류가 발생했습니다.')
          })
      }
      CommonUtil.successMessage('esc를 누르면 종료됩니다.')
      draw?.on('drawend', drawEndEvt)
      const evtHandler = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          mapControl.setActive(false, drawType)
          // this.drawHighlight(drawType, isUse)
        }
        document.removeEventListener('keydown', evtHandler)
      }
      document.addEventListener('keydown', evtHandler, false)
    })
  },
  setFit(map, feature) {
    const extent = feature.getGeometry()?.getExtent()
    if (!extent) return
    map.getView().fit(extent, { size: map.getSize() })
  },

  addFeatureWithProperty(
    features: Array<Feature>,
    isClear?: boolean,
    isExtent?: boolean,
    map: Map,
  ) {
    // const currentMap = this.getCurrentMapFromMapStore()

    // if (map === undefined) return
    const vectorSource = mapUtil.getSource(map!, LayerType.WFSVECTOR) as unknown as VectorSource
    if (isClear) vectorSource.clear()
    features.forEach((feature) => {
      setFillColor(feature)
    })
    vectorSource.addFeatures(features)
    if (isExtent) map.getView().fit(vectorSource.getExtent(), { size: map.getSize() })
  },
  async getFeaturesFromPNUList(
    list: Array<{ rep: string; key: string; val: string }>,
    layerType: LayerType,
    repColor: string,
    color: string,
  ) {
    const mapStore = useMapStore()
    const mapControl = mapStore.state[mapStore.getCurrentMapKey() as MapType].mapControl
    if (!mapControl) {
      return false
    }
    const keyLayerStore = useKeyLayerStore()
    let keyLayer = keyLayerStore.get('LDREG')
    if (!keyLayer) {
      await keyLayerStore.initState()
      keyLayer = keyLayer.get('LDREG')
    }
    const currentLayer = keyLayer.layer
      .split(',')
      .filter((l: string) => /^GMPSS.*LSMD_CONT_LDREG$/.test(l))[0]

    const currentMap = mapControl.getMap()
    if (!currentMap) {
      return false
    }
    const createOptions = (key: string, val: string) => ({
      KEY: keyLayer.key,
      LAYERS: currentLayer,
      filterdOptions: equalTo(key, val),
    })
    mapUtil.clearFeatures(currentMap, layerType)
    // const { r: _r, g: _g, b: _b } = CommonUtil.hex2rgb(color)
    // const { r, g, b } = CommonUtil.hex2rgb(repColor)
    // const repFillColor = CommonUtil.rgbaToHex(r, g, b, 0.3)
    // const fillColor = CommonUtil.rgbaToHex(_r, _g, _b, 0.3)
    list.forEach(async ({ key, val, rep }) => {
      const features = await mapApi.getWFS(createOptions(key, val))
      /**
       * to fix
       */
      const newFeatures = new Array<Feature>()
      features.forEach((f, idx) => {
        newFeatures.push(f.clone() as Feature)
        newFeatures[idx].setProperties({
          gmpssLabel: (rep === 'Y' ? '대표* ' : '') + f.getProperties()['JIBUN'],
        })
      })
      mapUtil.addHighLightLayerByFeatures(
        newFeatures,
        currentMap,
        {
          fill: new Fill({ color: rep === 'Y' ? repColor : color }),
          stroke: new Stroke({
            color: color_main,
            width: 1,
          }),
        },
        {
          isExtent: true,
          color: rep === 'Y' ? repColor : color,
        },
      )
    })
  },
  setFeature(
    feature: Feature,
    option: { color: string; strokeWidth?: number },
    isExtent?: boolean,
  ) {
    setStrokeColorWithColor(feature, option)
    if (!isExtent) return
    const currentMap = this.getCurrentMapFromMapStore()
    if (currentMap === false) return
    this.setFit(currentMap, feature)
  },
  setHighlitFeatureByKey(
    key: string,
    val: string,
    option: { color: string; strokeWidth?: number },
    layerType: LayerType,
    isExtent?: boolean,
  ) {
    const currentMap = this.getCurrentMapFromMapStore()
    if (currentMap === false) return
    const vectorSource = mapUtil.getSource(currentMap, layerType) as unknown as VectorSource
    vectorSource.getFeatures().forEach((f) => {
      if (f.getProperties()[key] === val) {
        this.setFeature(f, option)
        if (!isExtent) return
        this.setFit(currentMap, f)
      }
    })
  },
  getCurrentMapFromMapStore(mapType?: MapType) {
    const mapStore = useMapStore()
    const mapControl = mapStore.state[mapStore.getCurrentMapKey() as MapType].mapControl
    if (!mapControl) {
      return false
    }
    const currentMap = mapControl.getMap()

    if (!currentMap) {
      return false
    }
    return currentMap
  },
  removeFeatureByKey(layerType: LayerType, key: string, val: string) {
    const currentMap = this.getCurrentMapFromMapStore()
    if (currentMap === false) return
    const vectorSource = mapUtil.getSource(currentMap, layerType) as unknown as VectorSource
    vectorSource.getFeatures().forEach((feature) => {
      if (feature.getProperties()[key] === val) {
        this.removeFeature(currentMap, feature, LayerType.HIGHLIGHT)
      }
    })
  },
  clearFeaturesFromHighLight() {
    const mapStore = useMapStore()
    const mapControl = mapStore.state[mapStore.getCurrentMapKey() as MapType].mapControl
    const currentMap = this.getCurrentMapFromMapStore()
    if (currentMap === false) return
    mapControl?.setEventHandler({ useDraw: false, useOverlay: false })

    this.clearSource(currentMap, LayerType.HIGHLIGHT)
  },

  clickHighLight(
    mapControl: MapControl,
    isActive: boolean,
    layerType: LayerType,
    mapType?: MapType,
  ) {
    const currentMap = mapControl.getMap()
    if (!currentMap) {
      return false
    }
    if (isActive) {
      mapControl.setActive(true, 'Point2')
    } else {
      return
    }
    mapControl.getActive()?.on('drawend', () => {
      const vectorSource = this.getLayerById(
        currentMap,
        LayerType.DRAW,
      )?.getSource() as VectorSource
      vectorSource.clear()
    })
    const currentView = currentMap.getView()
    async function clickEvt(e) {
      if (!currentView) return
      if (mapType !== MapType.ANALYSIS && (currentView.getZoom() as number) < 16) {
        const features = await mapUtil.selectHighLight(
          'S1',
          'PLAN',
          'GMPSS_PLAN',
          intersects('SHAPE', new Point([e.coordinate[0], e.coordinate[1]]), 'EPSG:3857'),
          {
            isExtent: false,
          },
        )
        if (!features) return
        const feature = features[0] as Feature
        const {
          AREA_AREA,
          AREA_CAUSE,
          AREA_ID,
          AREA_LENG,
          AREA_LOC,
          AREA_NAME,
          AREA_TYPE,
          PLAN_ID,
        } = feature.getProperties()
        const newItem = {
          planAreaArea: AREA_AREA,
          planAreaId: AREA_ID,
          planAreaLeng: AREA_LENG,
          planAreaLoc: AREA_LOC,
          planAreaName: AREA_NAME,
          planAreaType: AREA_TYPE,
          planAreaTypeReason: AREA_CAUSE,
          planId: PLAN_ID,
          mapType,
        }
        // useGmpssStore().openRightDetailView()
        usePlanAreaStore().setPlanArea(newItem)
        mittBus.emit('gmpssPlan-area-item-select', newItem)
      } else {
        mapUtil.fly(
          currentMap!,
          { id: '', point: { x: e.coordinate[0], y: e.coordinate[1] } },
          layerType,
        )
      }
    }
    currentMap.on('click', clickEvt)
  },
  selectHighLight(planId: string, planGroup: string, layerName: string, filter: any, option?: any) {
    const mapControl = useMapStore()
    const currentMap = mapControl.getCurrentMap()
    if (!currentMap) {
      CommonUtil.errorMessage('지도가 존재하지않습니다.')
      return
    }
    const keyLayerStore = useKeyLayerStore()
    const { key, zIndex } = keyLayerStore.state[planId][planGroup]
    return mapUtil.addFeaturesWithFilterAndStyle(
      currentMap,
      LayerType.HIGHLIGHT,
      { KEY: key, LAYERS: layerName, zIndex },
      filter,
      {
        labelKey: 'AREA_NAME',
        style: bufferLineStyle,
        restStyleOptions: {
          color: color_main,
        },
      },
      option,
    )
  },
  getSpecificLayer(map: Map, propertyName: string) {
    const specificLayer = getAllLayersByPropertyName(map, propertyName)
    return specificLayer
  },
  removeFeature(map: Map, feature: any, layerType: LayerType) {
    const specificVectorSource = this.getSpecificLayer(
      map,
      layerType,
    )[0].getSource() as VectorSource
    if (feature[Symbol.iterator]) {
      feature.forEach((f) => {
        specificVectorSource.removeFeature(f)
      })
    } else {
      specificVectorSource.removeFeature(feature)
    }
  },
  clearSource(map: Map, layerType: LayerType) {
    const highLightVectorSource = this.getSpecificLayer(
      map,
      layerType,
    )[0].getSource() as VectorSource
    highLightVectorSource.clear()
  },

  searchHighLightLayer(
    feature: Feature<Geometry>,
    map: Map,
    layerType: LayerType,
    fOption?: FOption,
  ) {
    if (!map) return false
    const defaultOption = {
      isStyled: false,
      isClear: true,
      color: color_main,
      isExtent: true,
      type: '',
    }
    const option = mapUtil.mergeNotUndefined(defaultOption, fOption) as typeof fOption
    const highLightVectorSource = this.getSpecificLayer(
      map,
      layerType,
    )[0].getSource() as VectorSource
    if (option?.type) {
      feature.setProperties({ type: option.type })
    }
    if (!option?.isStyled) {
      bufferLineStyle([feature], { color: option?.color })
    }
    if (option?.isClear === true) highLightVectorSource.clear()
    highLightVectorSource.addFeature(feature)
  },

  /**
   *
   * @param a defaultObj
   * @param b mergedObj
   * @returns
   */

  mergeNotUndefined<T extends Record<string, any>>(a: T, b?: Partial<T>): T {
    const result: Partial<T> = {}
    const keys = Object.keys(a) as (keyof T)[]
    if (b === undefined) return a
    keys.forEach((key) => {
      if (a[key] !== undefined && b[key] !== undefined) {
        result[key] = b[key]
        return
      }
      if (a[key] !== undefined) {
        result[key] = a[key]
      }
    })
    return result as T
  },

  addHighLightLayer(feature: Feature<Geometry>, map: Map, fOption?: FOption) {
    if (!map) return false
    const defaultOption = {
      isStyled: false,
      isClear: true,
      color: color_main,
      isExtent: true,
      type: '',
    }
    const option = mapUtil.mergeNotUndefined(defaultOption, fOption) as typeof fOption
    const highLightVectorSource = this.getSpecificLayer(
      map,
      LayerType.HIGHLIGHT,
    )[0].getSource() as VectorSource
    if (option?.type) {
      feature.setProperties({ type: option.type })
    }
    if (option?.isClear === true) highLightVectorSource.clear()
    if (!option?.isStyled) {
      dyanamicStyleSetColor([feature])
    }
    highLightVectorSource.addFeature(feature)
  },
  /**
   option, fOption 혼동될 가능성 있음
   fOption의 color를 받지만, option의 color를 쓰고있음
   일단 색상을 하드코딩해놓고 나중에 반영하는 형식으로 변경
   */
  addHighLightLayerByFeatures(
    features: Array<Feature<Geometry>>,
    map: Map,
    option?: any,
    fOption?: FOption,
  ) {
    if (!map) return false
    const defaultOption = {
      isStyled: false,
      isClear: false,
      color: color_main,
      isExtent: false,
      type: '',
    }
    const featureOption = mapUtil.mergeNotUndefined(defaultOption, fOption) as typeof fOption
    const highLightVectorSource = this.getSpecificLayer(
      map,
      LayerType.HIGHLIGHT,
    )[0].getSource() as VectorSource
    if (featureOption && featureOption.type) {
      features.forEach((feature) => {
        feature.setProperties({ type: featureOption.type })
      })
    }
    if (featureOption?.isClear === true) highLightVectorSource.clear()
    if (!featureOption?.isStyled) {
      dyanamicStyleSetColor(features, option)
    }
    highLightVectorSource.addFeatures(features)
    if (featureOption?.isExtent && features.length != 0) {
      map.getView().fit(highLightVectorSource.getExtent(), { size: map.getSize() })
    }
  },

  addLayer(mapControl: MapControl, layers: MapStudioParam[]) {
    const thisTilesKey: Set<string> = new Set()
    const curUsedTiles = mapControl.getUsedLayers()

    for (const layer of layers) {
      const layerKeys = layer.LAYERS

      const _KEY = layer.KEY + layerKeys
      thisTilesKey.add(_KEY)
      if (!mapControl.getWmsLayer(_KEY)) {
        let tiles: BaseLayer
        if (_KEY.startsWith('base')) {
          const baseKey = _KEY.split(',')
          tiles = getBaseLayerState(baseKey[baseKey.length - 1])
        } else if (_KEY.startsWith('wmts')) {
          tiles = mapApi.getWMTS({ KEY: layer.KEY.split('wmts')[1], LAYERS: layerKeys })
        } else if (_KEY.startsWith('wms')) {
          tiles = mapApi.getWMS({ KEY: layer.KEY.split('wms')[1], LAYERS: layerKeys })
        } else {
          tiles = mapApi.getWMS({ KEY: layer.KEY, LAYERS: layerKeys })
        }
        mapControl.addWmsLayer(_KEY, tiles)
      }
    }
    const newTilesKeys = Array.from(thisTilesKey).filter((key) => !curUsedTiles[key])
    for (const key of newTilesKeys) {
      mapControl.addLayer(mapControl.getWmsLayer(key))
      mapControl.setUsedLayers(key, true)
    }
  },
  updateLayer(mapControl: MapControl, layers: MapStudioParamWithZ[], isReverse = false) {
    const thisTiles = {}
    const thisTilesKey: Set<string> = new Set()
    //현재 보유하고있는 모든 wmsLayers
    const curMapWmsTilesKey = new Set(Object.keys(mapControl.getAllWmsLayers()))
    //현재 사용중인 모든 wmsKey
    const curUsedTiles = mapControl.getUsedLayers()
    let layerKeys: string
    for (const layer of layers) {
      if (isReverse) {
        layerKeys = layer.LAYERS.split(',').reverse().join(',')
      } else {
        layerKeys = layer.LAYERS
      }
      const _KEY = layer.KEY + layerKeys
      //wmsLayer를 보유중 -> 보유중인 wmslayer사용
      thisTilesKey.add(_KEY)
      if (mapControl.getWmsLayer(_KEY)) {
        thisTiles[_KEY] = mapControl.getWmsLayer(_KEY)
        //보유중이니까 등록할 필요 없음
        curMapWmsTilesKey.delete(_KEY)
        //wmsLayer 보유x -> 호출하여 보유
      } else {
        let tiles: BaseLayer
        if (_KEY.startsWith('base')) {
          const baseKey = _KEY.split(',')
          tiles = getBaseLayerState(baseKey[baseKey.length - 1])
        } else if (_KEY.startsWith(LayerType.WMTS)) {
          tiles = mapApi.getWMTS(
            { KEY: layer.KEY.split(LayerType.WMTS)[1], LAYERS: layerKeys },
            layer.zIndex,
          )
        } else if (_KEY.startsWith(LayerType.WMS)) {
          tiles = mapApi.getWMS({
            KEY: layer.KEY.split(LayerType.WMS)[1],
            LAYERS: layerKeys,
            zIndex: layer.zIndex,
          })
        } else if (_KEY.startsWith(LayerType.IMAGEWMS)) {
          tiles = mapApi.getImgageWMS({
            KEY: layer.KEY.split(LayerType.IMAGEWMS)[1],
            LAYERS: layerKeys,
            zIndex: layer.zIndex,
          })
        } else {
          tiles = mapApi.getWMS({ KEY: layer.KEY, LAYERS: layerKeys })
        }
        //보유하지 않았으니까 등록
        mapControl.addWmsLayer(_KEY, tiles)
        // }
      }
    }
    //사용중인데 layers에 없다면 removeLayer, 사용중이 아닌데 layers에 있다면 addLayer
    const unusedTilesKeys = Object.keys(curUsedTiles).filter((key) => !thisTilesKey.has(key))
    const newTilesKeys = Array.from(thisTilesKey).filter((key) => !curUsedTiles[key])
    for (const key of unusedTilesKeys) {
      mapControl.removeLayer(mapControl.getWmsLayer(key))
      mapControl.setUsedLayers(key, false)
    }
    for (const key of newTilesKeys) {
      mapControl.addLayer(mapControl.getWmsLayer(key))
      mapControl.setUsedLayers(key, true)
    }
    //보유중인데 사용하지 않는경우
  },
  startRoadView(mapControl?: MapControl) {
    if (mapControl?.isRoadView === false) {
      CommonUtil.errorMessage('로드뷰가 실행되지 않았습니다.')
      return false
    }
    const map = mapControl?.getMap()
    const view = map?.getView()
    view?.setZoom(16)
    const newMap = document.createElement('div')
    newMap.id = SecondMap.ID
    document.getElementById('mapContainer')?.appendChild(newMap)
    const kakaoContainer = newMap

    const rv = new kakao.maps.Roadview(kakaoContainer)

    const rvClient = new kakao.maps.RoadviewClient()

    const mapWalker = new MapWalker()
    const container = document.createElement('div')
    container.id = 'popup-rv'
    container.className = 'ol-popup-rv'
    const content = document.createElement('div')
    content.id = 'popup-content-rv'
    container.appendChild(content)
    const mapDiv = document.querySelector('.map-div')
    mapDiv?.appendChild(container)
    const roadViewOverlay = overlay(container, 'rv')

    map?.getOverlays().forEach((overlay) => {
      map.removeOverlay(overlay)
    })
    map?.addOverlay(roadViewOverlay)

    kakao.maps.event.addListener(rv, 'position_changed', function () {
      const rvPosition = rv.getPosition()
      const _mapCenter = transform(
        [rvPosition.getLng(), rvPosition.getLat()],
        'EPSG:4326',
        view!.getProjection(),
      )
      content.appendChild(mapWalker.getElement())
      roadViewOverlay.setPosition(_mapCenter)
      view?.setCenter(_mapCenter)
      if (mapControl?.isRoadView) {
      }
    })
    kakao.maps.event.addListener(rv, 'viewpoint_changed', function () {
      const viewPoint = rv.getViewpoint()
      mapWalker.setAngle(viewPoint.pan)
    })
    let pointer
    const pointerMove = (e) => {
      pointer = e.coordinate
    }
    map?.on('pointermove', pointerMove)
    const roadViewClickHandler = (e) => {
      toggleRoadview(e.coordinate)
    }
    map?.on('click', roadViewClickHandler)
    const mouseMove = () => {
      roadViewOverlay.setPosition(pointer)
    }
    const mouseup = () => {
      toggleRoadview(pointer)
      document.removeEventListener('mousemove', mouseMove)
    }

    mapWalker.getElement().addEventListener('mousedown', (e) => {
      document.addEventListener('mousemove', mouseMove)
      mapWalker.getElement().addEventListener('mouseup', mouseup)
    })

    function toggleRoadview(pointer: Coordinate) {
      const transformedPointer = transform(pointer!, view!.getProjection(), 'EPSG:4326')
      const transformedPointerForKakao = new kakao.maps.LatLng(
        transformedPointer[1],
        transformedPointer[0],
      )
      view?.setCenter(pointer)
      rvClient.getNearestPanoId(transformedPointerForKakao, 50, function (panoId) {
        // 파노라마 ID가 null 이면 로드뷰를 숨깁니다
        if (panoId === null) {
        } else {
          // panoId로 로드뷰를 설정합니다
          map?.un('click', roadViewClickHandler)
          rv.setPanoId(panoId, transformedPointerForKakao)
        }
      })
    }
  },

  createFeature({ type, coordinates, fromCRS, toCRS, properties }) {
    const types = {
      Polygon: Polygon,
      MultiPolygon: MultiPolygon,
      Point: Point,
      MultiPoint: MultiPoint,
    }
    const feature = new Feature({
      geometry: new types[type](coordinates).transform(fromCRS, toCRS),
    })
    feature.setProperties(properties)

    return feature
  },
  /**
   * testMap.vue
   */
  setMoveEnd(map: Map) {
    let zoom = map?.getView().getZoom() || 0
    zoom = +zoom.toFixed(0)
    const mapStore = useMapStore()
    const mapInfoStore = useMapInfoStore()
    const position = map?.getView().getCenter()
    //prev로 이동, next로 이동시 제한
    if (mapInfoStore.type === moveType.CURRENT) {
      mapInfoStore.addMapInfo({ zoomLevel: zoom, position: position })
    }
    mapStore.setViewState({ center: position!, zoom })
    mapUtil.setZoom(zoom)
    mapInfoStore.type = moveType.CURRENT
  },
  recordMove(map: Map) {
    const mapInfoStore = useMapInfoStore()
    mapInfoStore.resetMapInfo()
    map.on('moveend', () => mapUtil.setMoveEnd(map))
  },
  createSource(type: LayerType, options: any) {
    switch (type) {
      case LayerType.IMAGEWMS:
        return new ImageWMS({
          url: url + '/wms',
          params: {
            ...options,
          },
          ratio: 1,
          crossOrigin: 'Anonymous',
        })
      default:
        return new TileWMS({
          url: url + '/wms',
          params: {
            ...options,
          },
          transition: 0,
          crossOrigin: 'Anonymous',
        })
    }
  },

  updateSource(map: Map, id: string, source: Source) {
    const layer = mapUtil.getLayerById(map, id) as TileLayer<any> | undefined
    if (!layer) return null
    mapUtil.setSourceLayer(layer, source)
  },
  getParam(map: Map, id: string) {
    const layer = mapUtil.getLayerById(map, id) as TileLayer<any> | undefined
    if (!layer) return false
    const source = layer.getSource() as TileWMS | undefined
    if (!source) {
      CommonUtil.errorMessage('레이어가 존재하지 않습니다.')
      return false
    }
    return source.getParams()
  },
  updateParam(map: Map, id: string, newParams: any) {
    const layer = mapUtil.getLayerById(map, id) as TileLayer<any> | undefined
    if (!layer) return false
    const source = layer.getSource() as TileWMS | undefined
    if (!source) {
      CommonUtil.errorMessage('레이어가 존재하지 않습니다.')
      return false
    }
    source.updateParams(newParams)
  },
  removeLayer(map: Map, id: string) {
    const layer = mapUtil.getLayerById(map, id)
    if (!layer) return false

    map.removeLayer(layer)
  },
  getFeatures(map: Map, id: string) {
    const source = mapUtil.getVectorSourceById(map, id)
    return source?.getFeatures()
  },

  getVectorSourceById(map: Map, id: string) {
    const vectorLayer = mapUtil.getLayerById(map, id)
    try {
      const source = vectorLayer?.getSource() as VectorSource
      if (!source) throw new Error('레이어의 Source가 존재하지 않습니다.')
      return source
    } catch (error) {
      console.log(error)
      // CommonUtil.errorMessage(error as string)
    }
  },

  getLayerById(map: Map, id: string) {
    //id별 레이어는 하나만
    try {
      const layers = map.getAllLayers().filter((layer) => layer.get('id') === id)
      if (layers.length > 1) throw new Error('중복된 id의 레이어가 존재합니다.')
      return layers[0]
    } catch (error) {
      console.log(error)
      // CommonUtil.errorMessage(error as string)
    }
  },
  setVisibleLayer(layer: Layer, isShow: boolean) {
    layer.setVisible(isShow)
  },
  getSource(map: Map, id: string) {
    const layer = mapUtil.getLayerById(map, id) as TileLayer<any> | undefined
    if (!layer) return false
    const source = layer.getSource() as TileWMS | undefined
    return source
  },
  setSourceLayer(tileLayer: Layer, source: Source) {
    tileLayer.setSource(source)
  },
  addWMSLayer(map: Map, layer: Layer) {
    const layerId = layer.get('id')
    try {
      if (mapUtil.getLayerById(map, layerId)) {
        throw new Error('중복된 레이어아 존재합니다.')
      }
      map.addLayer(layer)
    } catch (error) {
      console.log(error)
      // CommonUtil.errorMessage(error as string)
    }
  },
  updateImageWmsSource(map: Map, id: string, source: Source) {
    const layer = mapUtil.getLayerById(map, id) as ImageLayer<any> | undefined
    if (!layer) return null
    mapUtil.setSourceLayer(layer, source)
  },
  removeFeaturesByPropertyKey(layerSource: VectorSource, features: Feature[], propertyKey: string) {
    features.forEach((feature) => {
      if (feature.getProperties()[propertyKey]) {
        layerSource.removeFeature(feature)
      }
    })
  },
  removeFeaturesByProperty(
    layerSource: VectorSource,
    features: Feature[],
    property: { [key: string]: any },
  ) {
    const keys = Object.keys(property)
    features.forEach((feature) => {
      for (const key of keys) {
        const propertyValue = feature.getProperties()[key]
        if (propertyValue && propertyValue === property[key]) {
          layerSource.removeFeature(feature)
        }
      }
    })
  },
  updateFeatureByProperty(features: Feature[], property: { [key: string]: any }) {
    const keys = Object.keys(property)
    features.forEach((feature) => {
      for (const key of keys) {
        feature.setProperties({ [key]: property[key] })
      }
    })
    return features
  },
  setFeaturePropertiesToFeatures(
    features: Feature[],
    properties: {
      [key: string]: string
    },
  ) {
    const keys = Object.keys(properties)
    for (const feature of features) {
      for (const key of keys) {
        feature.setProperties({ [key]: feature.getProperties()[properties[key]] })
      }
    }
  },
  setPropertiesToFeatures(
    features: Feature[],
    properties: {
      [key: string]: string
    },
  ) {
    const keys = Object.keys(properties)
    for (const feature of features) {
      for (const key of keys) {
        feature.setProperties({ [key]: properties[key] })
      }
    }
  },
  doFOption(map: Map, source: VectorSource, option?: FOption) {
    if (option?.isExtent) {
      map.getView().fit(source.getExtent(), { size: map.getSize() })
    }
    if (option?.isClear) {
      source.clear()
    }
  },
  addFeatures(map: Map, id: string, features: Feature[], fOption?: FOption) {
    const defaultOption = {
      isStyled: false,
      isClear: true,
      color: color_main,
      isExtent: true,
      type: '',
    }
    const option = mapUtil.mergeNotUndefined(defaultOption, fOption) as typeof fOption
    const vectorLayer = mapUtil.getLayerById(map, id)
    if (!vectorLayer) return false
    //get 레이어 소스
    const vectorSource = vectorLayer.getSource() as VectorSource
    if (option?.isClear) {
      vectorSource.clear()
    }
    vectorSource.addFeatures(features)
    if (option?.isExtent) {
      map.getView().fit(vectorSource.getExtent(), { size: map.getSize() })
    }
  },
  addOverlayLabel(map: Map, features: Feature[]) {
    let count = 0
    for (const feature of features) {
      const [minx, miny, maxx, maxy] = feature.getGeometry()?.getExtent() || [0, 0, 0, 0]
      if (minx === 0) return
      const center = [(minx + maxx) / 2, (miny + maxy) / 2]
      const container = document.createElement('div')
      container.classList.add('ol-popup-custom')
      const content = document.createElement('div')
      content.classList.add('popup-content')
      container.appendChild(content)
      document.body.appendChild(container)

      content.innerHTML = feature.getProperties()['gmpssLabel']
      const _overlay = overlay(container, count + '')
      map.addOverlay(_overlay)
      _overlay.setPosition(center)

      count++
    }
  },
  addWebglFeatures(
    map: Map,
    id: string,
    features: Feature[],
    webglOption?: {
      strokeWidth: number
      strokeColor: string
      circleRadius: number
      circleStrokeColor: string
      circleStrokeWidth: number
      circleFillColor: string
      rest?: any
    },
    fOption?: FOption,
  ) {
    const defaultOption = {
      isStyled: false,
      isClear: false,
      color: color_main,
      isExtent: false,
      type: '',
    }
    const option = mapUtil.mergeNotUndefined(defaultOption, fOption)
    if (!option.isStyled) {
      features.forEach((feature) => {
        feature.setProperties({ ...webglOption })
      })
    }
    const vectorLayer = mapUtil.getLayerById(map, id)
    if (!vectorLayer) return false
    //get 레이어 소스
    const vectorSource = vectorLayer.getSource() as VectorSource
    if (option?.isClear) {
      vectorSource.clear()
    }
    // mapUtil.addOverlayLabel(map, features)
    vectorSource.addFeatures(features)
    if (option?.isExtent) {
      map.getView().fit(vectorSource.getExtent(), { size: map.getSize() })
    }
  },
  addFeaturesWithFilter(map: Map, id: string, keyLayer: MapStudioParamWithZ, filter: Filter) {
    const vectorLayer = mapUtil.getLayerById(map, id)
    if (!vectorLayer) return false
    const vectorSource = vectorLayer.getSource() as VectorSource
    mapApi
      .getWFS({ KEY: keyLayer.KEY, LAYERS: keyLayer.LAYERS, filterdOptions: filter })
      .then((res: Feature[]) => {
        vectorSource.addFeatures(res)
        map.getView().fit(vectorSource.getExtent(), { size: map.getSize() })
      })
  },
  addFeaturesWithFilterAndStyle(
    map: Map,
    id: string,
    keyLayerZidx: MapStudioParamWithZ,
    filter: Filter,
    featureOpt: FeatureOption,
    fOption?: FOption,
  ) {
    const defaultOption = {
      isStyled: false,
      isClear: true,
      color: color_main,
      isExtent: true,
      type: '',
    }
    const option = mapUtil.mergeNotUndefined(defaultOption, fOption) as typeof fOption
    const vectorLayer = mapUtil.getLayerById(map, id)
    if (!vectorLayer) return false
    const vectorSource = vectorLayer.getSource() as VectorSource | undefined
    if (!vectorSource) {
      console.log('vectorSource가 존재하지 않습니다.')
      // CommonUtil.errorMessage('레이어가 존재하지 않습니다.')
      return false
    }
    if (keyLayerZidx.zIndex) {
      const vectorZindex = vectorLayer.getZIndex() || 0
      if (keyLayerZidx.zIndex > vectorZindex) vectorLayer.setZIndex(keyLayerZidx.zIndex)
    }
    if (option?.isClear) vectorSource.clear()

    const newFeatures = new Array<Feature<Geometry>>()

    return mapApi
      .getWFS({ KEY: keyLayerZidx.KEY, LAYERS: keyLayerZidx.LAYERS, filterdOptions: filter })
      .then((features) => {
        if (features.length === 0) {
          const _error = new Error('no feature')
          _error.name = 'NoFeature'
          throw _error
        }
        if (featureOpt.labelKey) {
          features.forEach((f, idx) => {
            newFeatures.push(f.clone() as Feature<Geometry>)
            if (!featureOpt.labelKey) {
              return
            }
            newFeatures[idx].setProperties({
              gmssLabel: f.getProperties()[featureOpt.labelKey],
            })
          })
        }
        if (featureOpt.style) {
          featureOpt.style(newFeatures, featureOpt.restStyleOptions)
        }
        vectorSource.addFeatures(newFeatures)
        if (option?.isExtent) {
          map.getView().fit(vectorSource.getExtent(), { size: map.getSize() })
        }
        return features
      })
      .catch((err) => {
        if (err.name === 'NoFeature') {
          CommonUtil.errorMessage('해당 지역엔 계획운영 정보가 없습니다.')
        } else {
          // CommonUtil.errorMessage('에러가 발생했습니다.')
          console.log(err)
        }
      })
  },
  createLayerByType(
    layerType: LayerType,
    option: MapStudioParam,
    zIndex?: number,
    id?: string,
    lid?: string,
  ) {
    let layer: any
    switch (layerType) {
      case LayerType.WMS: {
        layer = mapApi.getWMS({ ...option, zIndex }, LayerType.WMS, id)
        break
      }
      case LayerType.WMTS: {
        layer = mapApi.getWMTS(option, zIndex, id, lid)
        break
      }
      case LayerType.IMAGEWMS: {
        layer = mapApi.getImgageWMS({ ...option, zIndex }, LayerType.IMAGEWMS, id)
        break
      }
    }
    return layer
  },

  getSourceByType(layerType: LayerType, key: string, layer: string, option?: any) {
    let source: any
    switch (true) {
      case layerType === LayerType.WMS:
        {
          source = createWMSSource({ KEY: key, LAYERS: layer })
        }
        break
      case layerType === LayerType.IMAGEWMS:
        {
          source = createImageWMSSource({ KEY: key, LAYERS: layer })
        }
        break
      case layerType === LayerType.WMTS:
        {
          source = createWMTSSource({ KEY: key, LAYERS: layer }, option)
        }
        break
    }
    return source
  },
  clearFeatures(map: Map, id: string) {
    const vectorLayer = mapUtil.getLayerById(map, id)
    if (!vectorLayer) return false
    //get 레이어 소스
    const vectorSource = vectorLayer.getSource() as VectorSource
    //레이어 features clear
    vectorSource.clear()
  },
  fit(map: Map, extent: Extent) {
    const view = map.getView()
    view.fit(extent, { size: map.getSize() })
  },
  setLockInteraction<T extends Interaction>(
    map: Map,
    actionType: new (...args: any[]) => T,
    isLock: boolean,
  ) {
    const interactionList = map.getInteractions()
    interactionList.forEach((action) => {
      if (action instanceof actionType) {
        action.setActive(isLock)
      }
    })
  },
  setZIndexLayer(map: Map, id: string, zIndex: number) {
    const layer = mapUtil.getLayerById(map, id)
    if (!layer) return false
    layer?.setZIndex(zIndex)
  },

  async setLabel(mapType: MapType) {
    const map = mapUtil.getCurrentMapFromMapStore(mapType)
    if (!map) return
    const keyLayerStore = useKeyLayerStore()
    const { getPlanState } = keyLayerStore
    await mapUtil.delayGet(useMapStore().state[mapType].mapControl as Object, 'labelLayers', 300)
    const lll = useMapStore().state[mapType].mapControl?.labelLayers[getPlanState()[mapType]]
    const allVisibleLayers = map
      .getAllLayers()
      .filter((layer) => layer.getVisible() === true)
      .filter((layer) => layer.get('id') !== 'LABEL')
      .filter((layer) => {
        const layerType = layer.get('type')
        if (
          layerType === LayerType.IMAGEWMS ||
          layerType === LayerType.WMS ||
          layerType === LayerType.WMSCQL
        ) {
          return true
        }
      })
      .filter((layer) => layer.getSource())
    const labelLayerNames = allVisibleLayers
      .map((layer) => layer.getSource())
      .map((source: TileWMS) => {
        const layerNameList = source.getParams().LAYERS.split(',')
        return layerNameList.filter((layerName: string) => {
          if (lll.includes(layerName)) {
            return true
          }
        })
      })
      .flat(2)
      .join(',')
    const labelSource = mapUtil.getSource(map, 'LABEL') as TileWMS
    if (!labelSource) return
    const newParams = { ...labelSource.getParams(), LAYERS: labelLayerNames }
    if (newParams.CQL_FILTER) {
      const cql_filter = newParams.CQL_FILTER.split(',').filter((f) => f.length > 0)[0]
      const settedFilter = newParams.LAYERS.split(',')
        .map((item) => {
          if (item.toLowerCase().indexOf('limit') > 0) {
            return cql_filter
          } else {
            return ','
          }
        })
        .join('')
      labelSource.updateParams({ ...newParams, CQL_FILTER: settedFilter })
    } else {
      newParams.LAYERS = newParams.LAYERS.split(',')
        .filter((l) => l.toLowerCase().indexOf('limit') === -1)
        .join(',')
      labelSource.updateParams({ ...newParams })
    }
    labelSource.changed()
  },
}
export default mapUtil
