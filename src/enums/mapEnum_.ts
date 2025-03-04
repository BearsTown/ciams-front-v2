import { Coordinate } from 'ol/coordinate'

// export enum MapType {
//   MAP_1 = 'Map-1',
//   MAP_2 = 'Map-2',
//   MAP_3 = 'Map-3',
// }

// export type MapType = {
//   MAP_1: 'Map-1'
//   MAP_2: 'Map-2'
//   MAP_3: 'Map-3'
// }

export type MapType = 'Map-1' | 'Map-2' | 'Map-3'

// type MapGroup = {
//   [MapType.MAP_1]: 'Menu_1_Tab_A' | 'Menu_1_Tab_B' | 'Menu_1_Tab_C'
//   [MapType.MAP_2]: 'Menu_2_Sub_1' | 'Menu_2_Sub_2' | 'Menu_2_Sub_3'
//   [MapType.MAP_3]: never
// }

type MapGroup = {
  'Map-1': 'Menu_1_Tab_A' | 'Menu_1_Tab_B' | 'Menu_1_Tab_C'
  'Map-2': 'Menu_2_Sub_1' | 'Menu_2_Sub_2' | 'Menu_2_Sub_3'
  'Map-3': 'TEMP'
}

// type ViewLayerType = {
//   [K in MapType]: Record<MapGroup[K], string>
// }

type ViewLayerType = {
  [K in keyof MapGroup]: Record<MapGroup[K], string>
}

export const CommonLayerType: Record<MapType, string> = {
  [MapType.MAP_1]: 'COMMON_LAYER_GROUP_1',
  [MapType.MAP_2]: 'COMMON_LAYER_GROUP_2',
  [MapType.MAP_3]: 'COMMON_LAYER_GROUP_3',
}

export const ViewLayerType: ViewLayerType = {
  'Map-1': {
    Menu_1_Tab_A: 'VIEW_LAYER_GROUP_1',
    Menu_1_Tab_B: 'VIEW_LAYER_GROUP_2',
    Menu_1_Tab_C: 'VIEW_LAYER_GROUP_3',
  },
  'Map-2': {
    Menu_2_Sub_1: 'VIEW_LAYER_GROUP_4',
    Menu_2_Sub_2: 'VIEW_LAYER_GROUP_5',
    Menu_2_Sub_3: 'VIEW_LAYER_GROUP_6',
  },
  'Map-3': { TEMP: 'TEMP' },
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
}

export type MapWrapperConfig = {
  center: Coordinate
  zoom: number
  kakao: string
  tmsVWorld: string
  baseMapKey: string
}

export type MapInteractionType = 'drag-pan' | 'drag-zoom-in' | 'drag-zoom-out'

export type MapControlType =
  | MapInteractionType
  | 'map-setting'
  | 'group-measure'
  | 'measure-distance'
  | 'measure-area'
  | 'measure-clear'
  | 'group-map-move'
  | 'history-previous'
  | 'history-next'
  | 'full-extent'
  | 'mini-map'
