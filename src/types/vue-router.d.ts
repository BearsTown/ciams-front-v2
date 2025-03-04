import 'vue-router'
import { MapType } from '@/enums/mapEnum'

declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    icon?: string
    hidden?: boolean
    mapType?: MapType
    layout?: {
      left?: {
        visible: boolean
        collapse: boolean
      }
      right?: {
        visible: boolean
        collapse: boolean
      }
      center: {
        visible: boolean
      }
      panel?: {
        visible: boolean
      }
    }
  }
}
