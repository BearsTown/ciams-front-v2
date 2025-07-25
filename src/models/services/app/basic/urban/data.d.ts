import Feature from 'ol/Feature'

import { Item } from '@/types/data'
import { MapLayer } from '@/js/layer'
import { MapWrapper } from '@/js/mapWrapper'
import { UseBoolean } from '@/hooks/useBoolean'

import { CiamsDataAttribute, CiamsDataGroup } from '@/models/api/app/basic/urban'

interface Category extends CiamsDataGroup {
  active: UseBoolean
  years: YearDetail[]
}

interface YearDetail {
  id: string
  layerVisible: boolean
  title: string
  layer: MapLayer | null
  features: Feature[]
  year?: string
  style: string
  layerName?: string
  tableData: Item[]
  chartData: {}
}

interface State {
  categories: Category[]
  attributes: CiamsDataAttribute[]

  mapWrap?: MapWrapper

  activeCategory?: Category
  activeYear?: YearDetail
  activeDistId?: string
  activeDistFeature?: Feature
}
