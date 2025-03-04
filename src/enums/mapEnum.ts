import { Coordinate } from 'ol/coordinate'
import { MapLayer } from '@/js/layer'

export enum MapType {
  MAP_1 = 'Map-1',
  MAP_2 = 'Map-2',
  MAP_3 = 'Map-3',
}

// export type MapLayerGroup = {
//   [MapType.MAP_1]: 'Menu_1_Tab_A' | 'Menu_1_Tab_B' | 'Menu_1_Tab_C'
//   [MapType.MAP_2]: 'Menu_2_Sub_1' | 'Menu_2_Sub_2' | 'Menu_2_Sub_3'
//   [MapType.MAP_3]: ''
// }

export type MapLayerGroup = {
  [key in MapType]: string
}

export type MapLayerGroupType =
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
  | 'COMMON_LAYER_GROUP_2'
  | 'COMMON_LAYER_GROUP_3'

// export type CommonLayerType = {
//   [key in MapType]: {
//     [menu in MapLayerGroupType]?: CommonLayerGroup
//   }
// }

type CommonLayerType = {
  [K in MapType]: {
    [V in MapLayerGroupType]?: CommonLayerGroup
  }
}

export type ViewLayerGroup =
  | 'VIEW_LAYER_GROUP_1'
  | 'VIEW_LAYER_GROUP_2'
  | 'VIEW_LAYER_GROUP_3'
  | 'VIEW_LAYER_GROUP_4'
  | 'VIEW_LAYER_GROUP_5'
  | 'VIEW_LAYER_GROUP_6'
  | 'VIEW_LAYER_GROUP_7'
  | 'VIEW_LAYER_GROUP_8'

type ViewLayerType = {
  [K in MapType]: {
    [V in MapLayerGroupType]?: ViewLayerGroup
  }
}

// export type ViewLayerType = {
//   [K in keyof MapLayerGroup]: {
//     [V in MapLayerGroup[K]]: `VIEW_LAYER_GROUP_${number}`
//   }
// }

export const CommonLayerTypes: CommonLayerType = {
  [MapType.MAP_1]: {
    Menu_1_Tab_A: 'COMMON_LAYER_GROUP_1',
    Menu_1_Tab_B: 'COMMON_LAYER_GROUP_1',
    Menu_1_Tab_C: 'COMMON_LAYER_GROUP_1',
  },
  [MapType.MAP_2]: {
    Menu_2_Sub_1: 'COMMON_LAYER_GROUP_2',
    Menu_2_Sub_2: 'COMMON_LAYER_GROUP_2',
    Menu_2_Sub_3: 'COMMON_LAYER_GROUP_2',
  },
  [MapType.MAP_3]: { Menu_3_Sub_1: 'COMMON_LAYER_GROUP_3', Menu_3_Sub_2: 'COMMON_LAYER_GROUP_3' },
}

export const ViewLayerTypes: ViewLayerType = {
  [MapType.MAP_1]: {
    Menu_1_Tab_A: 'VIEW_LAYER_GROUP_1',
    Menu_1_Tab_B: 'VIEW_LAYER_GROUP_2',
    Menu_1_Tab_C: 'VIEW_LAYER_GROUP_3',
  },
  [MapType.MAP_2]: {
    Menu_2_Sub_1: 'VIEW_LAYER_GROUP_4',
    Menu_2_Sub_2: 'VIEW_LAYER_GROUP_5',
    Menu_2_Sub_3: 'VIEW_LAYER_GROUP_6',
  },
  [MapType.MAP_3]: {
    Menu_3_Sub_1: 'VIEW_LAYER_GROUP_7',
    Menu_3_Sub_2: 'VIEW_LAYER_GROUP_8',
  },
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
