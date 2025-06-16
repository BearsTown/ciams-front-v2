import UitDefaultLayer, { UitDefaultLayerProps } from '@uitgis/ol-ugis-test/layer/uitDefaultLayer'
import { ImageWMS, TileWMS } from 'ol/source'
import ImageLayer from 'ol/layer/Image'
import TileLayer from 'ol/layer/Tile'

interface SourceParamsProps {
  KEY: string
  LAYERS: Array<string>
  CRS?: string
  STYLES?: string
  FORMAT?: string
  BGCOLOR?: string
  EXCEPTIONS?: string
  LABEL?: string
  GRAPHIC_BUFFER?: string
  ANTI?: string
  TEXT_ANTI?: string
  VERSION?: string
  _CQL_FILTER?: { target: string; value: string }[]
}
interface SourceParams extends SourceParamsProps {
  CQL_FILTER?: string
}
interface UitUWMSLayerProps extends UitDefaultLayerProps {
  sourceParams: SourceParamsProps
  preload?: number
  isSingleTile?: boolean
  useCQL_FILTER?: boolean
  crossOrigin?: string
}

export default class UitUWMSLayer extends UitDefaultLayer {
  private source: ImageWMS | TileWMS | null = null
  private preload?: number
  private isSingleTile?: boolean
  private sourceParams: SourceParams
  private useCQL_FILTER: boolean
  private crossOrigin?: string

  constructor(props: UitUWMSLayerProps) {
    super(props)
    this.layerType = 'WMS'
    this.preload = props.preload || Infinity
    this.isSingleTile = props.isSingleTile || false
    this.useCQL_FILTER = props.useCQL_FILTER || false
    this.sourceParams = this.initSourceParams(props.sourceParams)
    this.crossOrigin = props.crossOrigin || 'Anonymous'
    this.initLayer()
  }
  private initSourceParams(propsSourceParams: SourceParamsProps) {
    let sourceParams
    if (this.useCQL_FILTER) {
      sourceParams = new Proxy<SourceParams>(
        { KEY: '', LAYERS: [] },
        {
          set(target, prop, value) {
            target[prop] = value
            if (target['_CQL_FILTER']) {
              const CQL_FILTER = Array.from({ length: target['LAYERS'].length }, () => ',')
              target._CQL_FILTER.forEach((item) => {
                const idx = target.LAYERS.indexOf(item.target)
                CQL_FILTER[idx] = item.value
              })
              target.CQL_FILTER = CQL_FILTER.join(',')
              delete target['_CQL_FILTER']
            }
            return true
          },
        },
      )
      Object.entries(propsSourceParams).forEach(([key, value]) => {
        sourceParams[key] = value
      })
    } else {
      sourceParams = propsSourceParams
    }
    return sourceParams
  }

  private initLayer() {
    if (this.isSingleTile) {
      this.source = this.createImageWMS({
        baseUrl: this.baseUrl,
        sourceParams: this.sourceParams,
      })
      this.layer = new ImageLayer({
        source: this.source,
        properties: this.properties,
        zIndex: this.zIndex,
        className: this.className,
        opacity: this.opacity,
        visible: this.visible,
        minZoom: this.minZoom,
        maxZoom: this.maxZoom,
      })
    } else {
      this.source = this.createTileWMS({
        baseUrl: this.baseUrl,
        sourceParams: this.sourceParams,
      })
      this.layer = new TileLayer({
        source: this.source,
        properties: this.properties,
        zIndex: this.zIndex,
        className: this.className,
        opacity: this.opacity,
        visible: this.visible,
        minZoom: this.minZoom,
        maxZoom: this.maxZoom,
        preload: this.preload,
      })
    }
  }
  createImageWMS({ baseUrl, sourceParams }: { baseUrl: string; sourceParams: SourceParamsProps }) {
    return new ImageWMS({
      url: baseUrl + '/uwms',
      params: {
        ...sourceParams,
        LAYERS: sourceParams.LAYERS.join(','),
      },
      ratio: 1,
      projection: sourceParams.CRS,
      crossOrigin: this.crossOrigin,
    })
  }
  createTileWMS({ baseUrl, sourceParams }: { baseUrl: string; sourceParams: SourceParamsProps }) {
    return new TileWMS({
      url: baseUrl + '/uwms',
      params: {
        ...sourceParams,
        LAYERS: sourceParams.LAYERS.join(','),
      },
      projection: sourceParams.CRS,
      crossOrigin: this.crossOrigin,
    })
  }

  getSource() {
    return this.layer?.getSource() as ImageWMS | TileWMS | null
  }
  setSource(source: TileWMS | ImageWMS) {
    switch (true) {
      case source instanceof TileWMS: {
        if (this.layer instanceof TileLayer) {
          this.layer.setSource(source)
          this.source = source
        } else {
          throw new Error('layer type이 맞지 않습니다.')
        }
        break
      }
      case source instanceof ImageWMS: {
        if (this.layer instanceof ImageLayer) {
          this.layer.setSource(source)
          this.source = source
        } else {
          throw new Error('layer type이 맞지 않습니다.')
        }
        break
      }
    }
    this.updateSourceParams(source.getParams())
  }

  getParamKEY() {
    return this.sourceParams.KEY
  }

  getSourceParams() {
    const source = this.layer?.getSource() as TileWMS | ImageWMS
    return source.getParams()
  }

  getParamLAYERS() {
    return this.sourceParams.LAYERS
  }
  updateSourceParams(params: Partial<SourceParamsProps>) {
    Object.entries(params).forEach(([key, value]) => {
      this.sourceParams[key] = value
    })
  }
  updateParams(params: Partial<SourceParamsProps>) {
    const source = this.layer?.getSource() as TileWMS | ImageWMS
    this.updateSourceParams(params)
    source.updateParams({
      ...this.sourceParams,
      LAYERS: this.sourceParams.LAYERS.join(','),
    })
  }

  setLayerParamKey(KEY: string) {
    this.updateParams({ KEY })
  }

  setLAYERS(LAYERS: Array<string>) {
    this.updateParams({ LAYERS })
  }
}
