import { MapStudioParam, MapStudioParamWithZ } from '@/types/map'
import { GeoJSON, WFS, WMSCapabilities, WMTSCapabilities } from 'ol/format'
import TileLayer from 'ol/layer/Tile'
import TileWMS from 'ol/source/TileWMS.js'
import { LayerType } from '@/enums/mapEnum'
import Filter from 'ol/format/filter/Filter'
import { ImageWMS, WMTS } from 'ol/source'
import ImageLayer from 'ol/layer/Image'
// import useKeyLayerStore from '@/stores/map/keyLayer'
// import { getlayerZindexByKey } from '@/js/layers'
import { optionsFromCapabilities } from 'ol/source/WMTS'
import {
  fetchLadfrl,
  fetchLadgrd,
  fetchLandCharacteristics,
  fetchLandMove,
  fetchLandUse,
  PublicDataParam,
} from '../app/land/publicData'
import PublicData from '../app/land/publicData/model'
import { landUseBasis } from './landUseBasis'
// import { useMapConfig } from '@/stores/map/mapConfig'
import { useCmmConfigStore } from '@/stores/config/cmmConfig'

import { IWMSCapabilities, IWMTSCapabilities } from './model'
import CommonUtil from '@/utils/commonUtil'

const cmmConfigStore = useCmmConfigStore()

/**
 * @param {Layer} layer
 * @returns
 */
const featureRequest = ({
  featureTypes,
  filterdOptions,
}: {
  featureTypes: string
  filterdOptions?: Filter
}) => {
  return new WFS().writeGetFeature({
    srsName: 'EPSG:3857',
    featureNS: 'http://www.opengis.net/wfs',
    featurePrefix: 'feature',
    featureTypes: [featureTypes],
    outputFormat: 'application/json',
    filter: filterdOptions,
  })
}

// 호출할 WFS 서비스 URL
const url = import.meta.env.VITE_API_MAPSTUDIO_URL
// const url = 'http://211.171.200.236:10101/mapstudio'

// GetFeature 요청 파라미터
const urlWithParams = (url: string, params: any) =>
  `${url}?${Object.entries(params)
    .map(([key, value]) => `${key}=${encodeURIComponent(value as string)}`)
    .join('&')}`

const wmsParser = new WMSCapabilities()
const wmtsParser = new WMTSCapabilities()

export const createWMSSource = (option: MapStudioParam, rest?: any) =>
  new TileWMS({
    url: url + '/wms',
    params: {
      GRAPHIC_BUFFER: 128,
      WIDTH: 128,
      HEIGHT: 128,
      ...option,
      ...rest,
    },
    transition: 0,
    crossOrigin: 'Anonymous',
  })

export const createImageWMSSource = (option: MapStudioParam) =>
  new ImageWMS({
    url: url + '/wms',
    params: { ...option },
    ratio: 1,
    crossOrigin: 'Anonymous',
  })

export const createWMTSSource = (keLayer: MapStudioParam, lid?: any) => {
  const keyLayerStore = useKeyLayerStore()
  const { option } = keyLayerStore.get(lid)
  const wmtsOption = optionsFromCapabilities(option, {
    url: url + '/wmts',
    layer: `${keLayer.LAYERS}`,
    matrixSet: `${keLayer.LAYERS}_MATRIXSET`,
  })
  delete wmtsOption?.urls
  if (!wmtsOption) return
  wmtsOption.url = url + '/wmts' + `?KEY=${keLayer.KEY}`
  return new WMTS(wmtsOption)
}

const mapApi = {
  getWMSCapabilities: async (option: {
    KEY: string
    layerType: string
  }): Promise<IWMSCapabilities> => {
    const res = await fetch(
      urlWithParams(url + '/' + option.layerType, {
        SERVICE: option.layerType,
        KEY: option.KEY,
        REQUEST: 'GetCapabilities',
      }),
    )
    const text = await res.text()
    return wmsParser.read(text)
  },
  getWMTSCapabilities: async (option: {
    KEY: string
    layerType: string
    layers: string
  }): Promise<IWMTSCapabilities> => {
    const res = await fetch(
      urlWithParams(url + '/' + option.layerType, {
        SERVICE: option.layerType,
        KEY: option.KEY,
        REQUEST: 'GetCapabilities',
        VERSION: '1.0.0',
      }),
    )
    const text = await res.text()
    return wmtsParser.read(text)
  },
  // equalTo('AREA_NUM', option.planAreaName)
  getWFS: async (option: MapStudioParam & { filterdOptions?: Filter }) => {
    const res = await fetch(
      urlWithParams(url + '/wfs', {
        KEY: option.KEY,
      }),
      {
        method: 'POST',
        body: new XMLSerializer().serializeToString(
          featureRequest({
            featureTypes: option.LAYERS,
            filterdOptions: option.filterdOptions,
          }),
        ),
      },
    )
    let json = await res.text()
    //줄바뀜 문자 치환처리
    json = json.replace(/\n/gi, '\\r\\n')
    const features = new GeoJSON().readFeatures(json)
    return features
  },

  getImgageWMS: (option: MapStudioParamWithZ, layerType?: LayerType, id?: string) => {
    const tileLayer = new ImageLayer({
      properties: { type: layerType ? layerType : LayerType.IMAGEWMS, id },
      source: new ImageWMS({
        url: url + '/wms',
        params: { ...option },
        ratio: 1,
        crossOrigin: 'Anonymous',
      }),
      zIndex: option.zIndex || useKeyLayerStore().getZindexByKey(option.KEY)?.zIndex || 1,
    })
    return tileLayer
  },
  getWMS: (option: MapStudioParamWithZ, layerType?: string, id?: string) => {
    const tileLayer = new TileLayer({
      properties: { id: id, type: layerType ? layerType : LayerType.WMS },
      source: createWMSSource(option),
      zIndex:
        option.zIndex ||
        useKeyLayerStore().getZindexByKey(option.KEY)?.zIndex ||
        getlayerZindexByKey(option.KEY).zIndex ||
        1,
    })
    return tileLayer
  },
  getWMSCqlFilter: (option: MapStudioParamWithZ, layerType?: string, CQL_FILTER?: any) => {
    const tileLayer = new TileLayer({
      properties: { type: layerType ? layerType : LayerType.WMSCQL },
      source: createWMSSource(option, { CQL_FILTER }),
      zIndex:
        option.zIndex ||
        useKeyLayerStore().getZindexByKey(option.KEY)?.zIndex ||
        getlayerZindexByKey(option.KEY).zIndex ||
        1,
    })
    return tileLayer
  },
  getWMTS: (option: MapStudioParam, zIndex?: number, id?: string, lid?: string) => {
    const tileLayer = new TileLayer({
      properties: { type: LayerType.WMTS, id },
      zIndex: zIndex ? zIndex : 1,
      source: createWMTSSource(option, lid),
    })
    return tileLayer
  },
  getCopyWMS: (option: MapStudioParam, zIndex?: number) => {
    const tileLayer = new TileLayer({
      properties: { type: LayerType.COPY },
      source: new TileWMS({
        url: url + '/wms',
        params: { ...option },
        transition: 0,
        crossOrigin: 'Anonymous',
      }),
      zIndex: zIndex,
    })
    return tileLayer
  },
  getCopyWMTS: (option: MapStudioParam, zIndex?: number, id?: string, lid?: string) => {
    const tileLayer = new TileLayer({
      properties: { type: LayerType.COPY },
      zIndex: zIndex ? zIndex : 1,
      source: createWMTSSource(option, lid),
    })
    return tileLayer
  },
  getTestLandData: async (PNU: number | string, signal?: any) => {
    const res = await fetch('http://211.171.200.55:9000/parcel/api/v1/land?pnu=' + PNU)
    if (!res.ok) throw new Error()
    return res
  },
  getTestBuildData: async (PNU: number | string, signal?: any) => {
    const res = await fetch(`http://211.171.200.55:9000/kras/api/v1/land/${PNU}/building`)
    if (!res.ok) throw new Error()
    return res
  },
  getLandData: async (PNU: string) => {
    // const pnu = PNU.startsWith('51') ? PNU : '5178025630100010000'

    try {
      await cmmConfigStore.loadMapConfig()
    } catch (err) {
      CommonUtil.errorMessage(err)
    }

    const pnu = PNU
    // const mapConfig = useMapConfig().state
    const vworld_api_key = import.meta.env.DEV
      ? import.meta.env.VITE_APP_KEY_VWORLD_LOCAL
      : cmmConfigStore.mapConfigState['VWORLD_KEY'].confValue

    const result: {
      ladfrlVOList: any
      ladgrdVOList: any
      landCharacteristicss: any
      landUses: any
      landMoves: any
    } = {
      ladfrlVOList: [],
      ladgrdVOList: [],
      landCharacteristicss: [],
      landUses: [],
      landMoves: [],
    }

    const option: PublicDataParam = {
      domain: window.location.origin,
      key: vworld_api_key,
      pnu: pnu,
    }

    const ladfrl = fetchLadfrl(option).then(async (res) => {
      const text = await res.text()
      return {
        ladfrlVOList: xmlToJson(
          new DOMParser().parseFromString(text as unknown as string, 'text/xml'),
        ),
      } as PublicData.LadfrlService.ResultData
    })
    const ladgrd = fetchLadgrd(option).then((res) => {
      return {
        ladgrdVOList: xmlToJson(
          new DOMParser().parseFromString(res.data as unknown as string, 'text/xml'),
        ),
      } as PublicData.LadgrdService.ResultData
    })
    const landCharacteristics = fetchLandCharacteristics(option).then((res) => res.data)
    type DataField = Set<{
      prposAreaDstrcCode: string
      prposAreaDstrcCodeNm: string
    }>
    // luLawnms 가 있다면 set -> array
    const landUse = fetchLandUse(option).then(async (res) => {
      const data: { UQ: Set<string>; UM: Set<string> } = { UQ: new Set(), UM: new Set() }
      res.data.landUses.field.forEach((d) => {
        if (landUseBasis.includes(d.prposAreaDstrcCodeNm)) {
          data.UQ.add(d.prposAreaDstrcCodeNm)
        } else {
          data.UM.add(d.prposAreaDstrcCodeNm)
        }
      })
      return data
    })
    const landMove = fetchLandMove(option).then((res) => res.data)
    const settledPromises = await Promise.allSettled([
      ladfrl,
      ladgrd,
      landCharacteristics,
      landUse,
      landMove,
    ])

    // 각 Promise의 결과를 result 객체에 저장
    settledPromises.forEach((settledPromise, index) => {
      if (settledPromise.status === 'fulfilled') {
        const res = settledPromise.value as {
          ladfrlVOList
          ladgrdVOList
          landCharacteristicss
          landUse
          landMoves
          response
        }
        if (res.response) {
          return
        }
        switch (index) {
          case 0:
            result.ladfrlVOList = res.ladfrlVOList.fields.ladfrlVOList
            break
          case 1:
            result.ladgrdVOList = res.ladgrdVOList.fields.ladgrdVOList
            break
          case 2:
            result.landCharacteristicss = res.landCharacteristicss.field
            break
          case 3:
            result.landUses = res
            break
          case 4:
            result.landMoves = res.landMoves.field
            break
        }
      } else {
        // Promise가 실패한 경우 에러 처리
        console.error(`Promise ${index} failed:`, settledPromise.reason)
      }
    })
    return result
  },
  //표고/경사도 정보 조회
  getRegionData: async (params: {
    // MapStudio 사용자 키
    key: string
    //AltitudeByRegion.tif - 표고(고도값) 조회, SlopeByRegion.tif - 경사도 조회
    layer: 'AltitudeByRegion.tif' | 'SlopeByRegion.tif'
    //WKT 포맷의 지적 또는 영역
    geometryWKT: string
    // EPSG 좌표계 코드
    crs: string
  }) => {
    // 추후 적용 예정 부분 (맨 아래 테스트)
    return await fetch(
      url +
        `/api/v1/getRasterInArea/${params.key}/${params.layer}/${params.geometryWKT}/${params.crs}`,
    )
    // return await fetch(
    //   'http://211.171.200.56:7881/mapstudio' +
    //     `/api/v1/getRasterInArea/${params.key}/${params.layer}/${params.geometryWKT}/${params.crs}`,
    // )
    // return await fetch(
    //   `http://211.171.200.56:7881/mapstudio/api/v1/getRasterInArea/system/${params.layer}/POLYGON ((307302.97926963726 364903.93647574174, 307310.81144387403 364905.0571074863, 307342.9240908339 364905.4194923439, 307356.347462917 364781.4917340134, 307326.54593302566 364793.4199733346, 307289.3456080799 364799.4762152708, 307270.81058708037 364800.9862696775, 307261.44902479346 364800.2034550682, 307238.36895407236 364890.219085495, 307246.66163828183 364893.6737611224, 307263.1054146718 364896.2051066797, 307276.3910796156 364899.08585768344, 307286.7146770219 364901.54579623044, 307293.49708676 364903.0791029427, 307302.97926963726 364903.93647574174))/EPSG:5186`,
    // )
  },
  getCountour: async (params: {
    // MapStudio 사용자 키
    key: string
    layer: 'AltitudeByRegion.tif'
    //WKT 포맷의 지적 또는 영역
    geometryWKT: string
    // EPSG 좌표계 코드
    crs: string
  }) => {
    return await fetch(
      url +
        `/api/v1/getCrossSection/${params.key}/${params.layer}/${params.geometryWKT}/${params.crs}`,
    )
  },
}
function xmlToJson(xml) {
  // Create the return object
  let obj = {}

  if (xml.nodeType == 1) {
    // element
    // do attributes
    if (xml.attributes.length > 0) {
      obj['@attributes'] = {}
      for (let j = 0; j < xml.attributes.length; j++) {
        const attribute = xml.attributes.item(j)
        obj['@attributes'][attribute.nodeName] = attribute.nodeValue
      }
    }
  } else if (xml.nodeType == 3) {
    // text
    obj = xml.nodeValue
  }

  // do children
  // If all text nodes inside, get concatenated text from them.
  const textNodes = [].slice.call(xml.childNodes).filter(function (node: { nodeType: number }) {
    return node.nodeType === 3
  })
  if (xml.hasChildNodes() && xml.childNodes.length === textNodes.length) {
    obj = [].slice.call(xml.childNodes).reduce(function (text, node: { nodeValue: number }) {
      return text + node.nodeValue
    }, '')
  } else if (xml.hasChildNodes()) {
    for (let i = 0; i < xml.childNodes.length; i++) {
      const item = xml.childNodes.item(i)
      const nodeName = item.nodeName
      if (typeof obj[nodeName] == 'undefined') {
        obj[nodeName] = xmlToJson(item)
      } else {
        if (typeof obj[nodeName].push == 'undefined') {
          const old = obj[nodeName]
          obj[nodeName] = []
          obj[nodeName].push(old)
        }
        obj[nodeName].push(xmlToJson(item))
      }
    }
  }
  return obj
}
export { mapApi }
