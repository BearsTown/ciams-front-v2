import { Coordinate } from 'ol/coordinate'
import { MapLayer } from '@/js/layer'

// export type SubMenu = '1' | '2'
// export type Tab = '1' | '2' | '3' | '4'
export type SimpleMap = `Map-${number}`
export type SubMenuMap = `Map-${number}-${number}-${number}`
export type LayerGroup = `LayerGroup-${string}`
// export type SubMenuMap = `Map-${SubMenu}-${Tab}`

export type MapType = SimpleMap | SubMenuMap

// MapType: 허용되는 값만 명시적으로 정의
// export type MapType =
//   | 'Map-1'
//   | 'Map-2'
//   | 'Map-3'
//   | 'Map-Sub-1-1'
//   | 'Map-Sub-1-2'
//   | 'Map-Sub-1-3'
//   | 'Map-Sub-2-1'
//   | 'Map-Sub-2-2'
//   | 'Map-Sub-2-3'

// MapLayerGroup
export type MapLayerGroup = {
  [key in MapType]: string
}

// 나머지 타입 정의 (변경 없음)
export type MapLayerGroupType =
  | 'Menu-1-1-1'
  | 'Menu-1-1-2'
  | 'Menu-1-2-1'
  | 'Menu-1-2-2'
  | 'Menu-1-2-3'
  | 'Menu-1-2-4'
  | 'Menu_1_Tab_A'
  | 'Menu_1_Tab_B'
  | 'Menu_1_Tab_C'
  | 'Menu_2_Sub_1'
  | 'Menu_2_Sub_2'
  | 'Menu_2_Sub_3'
  | 'Menu_3_Sub_1'
  | 'Menu_3_Sub_2'

export type CommonLayerGroup =
  | 'COMMON_LAYER_GROUP_1'
  | 'COMMON_LAYER_GROUP_1-2-1'
  | 'COMMON_LAYER_GROUP_1-2-2'
  | 'COMMON_LAYER_GROUP_1-2-3'
  | 'COMMON_LAYER_GROUP_1-2-4'
  | 'COMMON_LAYER_GROUP_2'
  | 'COMMON_LAYER_GROUP_3'

export type ViewLayerGroup = `VIEW_LAYER_GROUP_${string}`
// export type ViewLayerGroup =
//   | 'VIEW_LAYER_GROUP_1'
//   | 'VIEW_LAYER_GROUP_1-2-1'
//   | 'VIEW_LAYER_GROUP_1-2-2'
//   | 'VIEW_LAYER_GROUP_1-2-3'
//   | 'VIEW_LAYER_GROUP_2'
//   | 'VIEW_LAYER_GROUP_3'
//   | 'VIEW_LAYER_GROUP_4'
//   | 'VIEW_LAYER_GROUP_5'
//   | 'VIEW_LAYER_GROUP_6'
//   | 'VIEW_LAYER_GROUP_7'
//   | 'VIEW_LAYER_GROUP_8'

type LayerConfig<T> = {
  [K in MapType]?: Partial<Record<MapLayerGroupType, T>>
}

export type CommonLayerConfig = LayerConfig<CommonLayerGroup>
export type ViewLayerConfig = LayerConfig<ViewLayerGroup>

// 데이터 정의 (변경 없음)
export const CommonLayerTypes: CommonLayerConfig = {
  'Map-1': {
    Menu_1_Tab_A: 'COMMON_LAYER_GROUP_1',
    Menu_1_Tab_B: 'COMMON_LAYER_GROUP_1',
    Menu_1_Tab_C: 'COMMON_LAYER_GROUP_1',
  },
  'Map-1-2-1': {
    'Menu-1-2-1': 'COMMON_LAYER_GROUP_1-2-1',
    Menu_1_Tab_B: 'COMMON_LAYER_GROUP_1-2-1',
    Menu_1_Tab_C: 'COMMON_LAYER_GROUP_1-2-1',
  },
  'Map-1-2-2': {
    'Menu-1-2-2': 'COMMON_LAYER_GROUP_1-2-2',
  },
  'Map-1-2-3': {
    'Menu-1-2-3': 'COMMON_LAYER_GROUP_1-2-3',
  },
  'Map-1-2-4': {
    'Menu-1-2-4': 'COMMON_LAYER_GROUP_1-2-4',
  },
  'Map-2': {
    Menu_2_Sub_1: 'COMMON_LAYER_GROUP_2',
    Menu_2_Sub_2: 'COMMON_LAYER_GROUP_2',
    Menu_2_Sub_3: 'COMMON_LAYER_GROUP_2',
  },
  'Map-3': {
    Menu_3_Sub_1: 'COMMON_LAYER_GROUP_3',
    Menu_3_Sub_2: 'COMMON_LAYER_GROUP_3',
  },
  // 'Map-Sub-1-1': {
  //   Menu_1_Tab_A: 'COMMON_LAYER_GROUP_1',
  //   Menu_1_Tab_B: 'COMMON_LAYER_GROUP_1',
  // },
  // 'Map-Sub-1-3': {
  //   Menu_1_Tab_C: 'COMMON_LAYER_GROUP_1',
  // },
  // 'Map-Sub-2-1': {
  //   Menu_2_Sub_1: 'COMMON_LAYER_GROUP_2',
  // },
  // 'Map-Sub-2-2': {
  //   Menu_2_Sub_2: 'COMMON_LAYER_GROUP_2',
  // },
  // 'Map-Sub-2-3': {
  //   Menu_2_Sub_3: 'COMMON_LAYER_GROUP_2',
  // },
}

export const ViewLayerTypes: ViewLayerConfig = {
  'Map-1': {
    Menu_1_Tab_A: 'VIEW_LAYER_GROUP_1',
    Menu_1_Tab_B: 'VIEW_LAYER_GROUP_2',
    Menu_1_Tab_C: 'VIEW_LAYER_GROUP_3',
  },
  'Map-1-2-1': {
    'Menu-1-2-1': 'VIEW_LAYER_GROUP_1-2-1',
  },
  'Map-1-2-2': {
    'Menu-1-2-2': 'VIEW_LAYER_GROUP_1-2-2',
  },
  'Map-1-2-3': {
    'Menu-1-2-3': 'VIEW_LAYER_GROUP_1-2-3',
  },
  'Map-1-2-4': {
    'Menu-1-2-4': 'VIEW_LAYER_GROUP_1-2-4',
  },
  'Map-2': {
    Menu_2_Sub_1: 'VIEW_LAYER_GROUP_4',
    Menu_2_Sub_2: 'VIEW_LAYER_GROUP_5',
    Menu_2_Sub_3: 'VIEW_LAYER_GROUP_6',
  },
  'Map-3': {
    Menu_3_Sub_1: 'VIEW_LAYER_GROUP_7',
    Menu_3_Sub_2: 'VIEW_LAYER_GROUP_8',
  },
  // 'Map-Sub-1-1': {
  //   Menu_1_Tab_A: 'VIEW_LAYER_GROUP_1',
  //   Menu_1_Tab_B: 'VIEW_LAYER_GROUP_2',
  // },
  // 'Map-Sub-1-3': {
  //   Menu_1_Tab_C: 'VIEW_LAYER_GROUP_3',
  // },
  // 'Map-Sub-2-1': {
  //   Menu_2_Sub_1: 'VIEW_LAYER_GROUP_4',
  // },
  // 'Map-Sub-2-2': {
  //   Menu_2_Sub_2: 'VIEW_LAYER_GROUP_5',
  // },
  // 'Map-Sub-2-3': {
  //   Menu_2_Sub_3: 'VIEW_LAYER_GROUP_6',
  // },
}

// 유틸리티 함수
export function getCommonLayer(map: MapType, tab: MapLayerGroupType): CommonLayerGroup | undefined {
  return CommonLayerTypes[map]?.[tab]
}

export function getViewLayer(map: MapType, tab: MapLayerGroupType): ViewLayerGroup | undefined {
  return ViewLayerTypes[map]?.[tab]
}

export enum BaseMapImg {
  VWORLD_BASE = '../assets/image/temp/map/mapStyle_basic.png',
  VWROLD_GARY = '../assets/image/temp/map/mapStyle_gray.png',
  VWORLD_SATELLITE = '../assets/image/temp/map/mapStyle_satellite.png',
  KAKAO_BASE = '../assets/image/temp/map/mapStyle_basic.png',
  KAKAO_SATELLITE = '../assets/image/temp/map/mapStyle_satellite.png',
}

export type MapInfo = {
  zoom: number
  center: Coordinate
  baseMapKey: string
  baseMapOption: BaseMapOption
}

export type MapWrapperConfig = {
  zoom: number
  center: Coordinate
  kakao: string
  vWorld: string
  baseMapKey: string
  baseMapOption: BaseMapOption
  olMapId: string
  baseMapId: string
  isMapLocation?: boolean
}

export type MapInteractionType =
  | 'drag-pan'
  | 'drag-zoom-in'
  | 'drag-zoom-out'
  | 'measure-distance'
  | 'measure-area'
  | 'location-info'

export type MapControlType =
  | MapInteractionType
  | 'map-setting'
  | 'location-info'
  | 'group-measure'
  | 'group-map-move'
  | 'history-previous'
  | 'history-next'
  | 'full-extent'
  | 'mini-map'
  | 'map-roadview'

export type BaseMap = 'vWorld' | 'kakao'

export type BaseMapOption = 'NORMAL' | 'GRAY' | 'LIGHT' | 'DARK'

export interface LayerState {
  layer: MapLayer
  userVisible: boolean
  useLegend?: boolean
  useLayerSetting?: boolean
}

export enum LayerType {
  WMTS = 'wmts',
  WMS = 'wms',
  IMAGEWMS = 'imagewms',
  WFS = 'wfs',
  BASE = '',
  LOCATION = 'location',
  DRAW = 'draw',
  DRAWINFO = 'drawInfo',
  MEASURE = 'measure',
  WFSVECTOR = 'wfsVector',
  CUSTOM = 'custom',
  ROADVIEW = 'roadView',
  COPY = 'copy',
  HIGHLIGHT = 'highlight',
  HIGHLIGHTTOP = 'highlgihtTop',
  WMSCQL = 'wmsCQL',
  WEBGL = 'webgl',
  WEBGLPOINTS = 'webglPoints',
}
