import { MapType } from '@/enums/mapEnum'
import { Feature } from 'ol'

export interface MapStudioParam {
  LAYERS: string
  KEY: string
}
export interface MapStudioParamWithZ extends MapStudioParam {
  zIndex?: number
}

export interface PointXY {
  x: number
  y: number
}
export interface FeatureOption {
  //label명을 알려주는 key
  labelKey?: string
  type?: string
  style?: (feature: Feature[], color?: any) => void
  restStyleOptions: any
}

export type MeasureType = 'Polygon' | 'LineString' | 'LineContour'
export type DrawType = MeasureType | 'Box' | 'Circle' | 'Point' | 'Point2' | 'Polygon2'

export type MapTypeEnum = (typeof MapType)[keyof typeof MapType]

interface VworldSearchParam {
  service: 'search'
  request: 'search'
  version: '2.0'
  crs?: string // 기본 EPSG:4326
  bbox?: string //"minx,miny,maxx,maxy"
  size: number // 최소 1 최대 1000 기본 10
  page: number
  query: string
  type: 'place' | 'address' | 'district' | 'road'
  format: 'json'
  errorformat: 'json'
  key: string
}

export interface VworldAddressSearchParam extends VworldSearchParam {
  type: 'address'
  category: string
}
export interface VworldRoadSearchParam extends VworldSearchParam {
  type: 'road'
}
export interface VworldPlaceSearchParam extends VworldSearchParam {
  type: 'place'
}
