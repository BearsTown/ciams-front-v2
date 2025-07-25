import UitMap from '@uitgis/ol-ugis-test/uitMap'
import { MapLayer } from '@/js/layer'
import { CommonLayerGroup, MapType, MapWrapperConfig, ViewLayerGroup } from '@/enums/mapEnum'
import UitBaseMap from '@uitgis/ol-ugis-test/baseMap/uitBaseMap'
import View from 'ol/View'

export class MapWrapper {
  private mapType: MapType
  private config: MapWrapperConfig
  private uitMap: UitMap | undefined
  private uitBaseMap: UitBaseMap | undefined

  private tocViewLayerGroups: {
    [key in ViewLayerGroup]?: MapLayer[]
  }

  private tocCommonLayerGroups: {
    [key in CommonLayerGroup]?: { title: string; layers: MapLayer[] }[]
  }

  private viewLayers: { [key in ViewLayerGroup]?: MapLayer[] }
  private commonLayers: { [key in CommonLayerGroup]?: MapLayer[] }

  constructor({ mapType, config }: { mapType: MapType; config: MapWrapperConfig }) {
    this.mapType = mapType
    this.config = config

    this.viewLayers = {}
    this.commonLayers = {}
    this.tocViewLayerGroups = {}
    this.tocCommonLayerGroups = {}

    // this._init()
  }

  static async create({
    mapType,
    config,
  }: {
    mapType: MapType
    config: MapWrapperConfig
  }): Promise<MapWrapper> {
    const instance = new MapWrapper({ mapType, config })
    await instance._init()

    return instance
  }

  private async _init(): Promise<void> {
    const uitMap = new UitMap({
      target: this.config.olMapId,
      layers: [],
      view: new View({
        constrainResolution: true,
        center: this.config.center,
        zoom: this.config.zoom,
      }),
    })
    uitMap.init()

    const uitBaseMap = new UitBaseMap({
      target: this.config.baseMapId,
      baseMapApiKey: {
        kakao: this.config.kakao,
        vWorld: this.config.vWorld,
        tmsVWorld: this.config.vWorld,
      },
      uitMap,
      baseMapKey: this.config.baseMapKey,
    })
    // ;(async () => {
    await uitBaseMap.firstInit()
    // })()

    this.uitMap = uitMap
    this.uitBaseMap = uitBaseMap
  }

  getMapType(): MapType {
    return this.mapType
  }

  getConfig(): MapWrapperConfig {
    return this.config
  }

  getUitMap(): UitMap {
    return this.uitMap!
  }

  getUitBaseMap(): UitBaseMap {
    return this.uitBaseMap!
  }

  addCommonLayer({ key, layers }: { key: string; layers: MapLayer[] }): void {
    if (layers && Array.isArray(layers) && 0 < layers.length) {
      if (!this.commonLayers[key]) {
        this.commonLayers[key] = layers
      } else {
        this.commonLayers[key].push(...layers)
      }
    }
  }

  addViewLayer({ key, layers }: { key: ViewLayerGroup; layers: MapLayer[] }): void {
    if (layers && Array.isArray(layers) && 0 < layers.length) {
      if (!this.viewLayers[key]) {
        this.viewLayers[key] = layers
      } else {
        this.viewLayers[key]!.push(...layers)
      }
    }
  }

  setViewLayersVisible(key: string, state: boolean): void {
    this.viewLayers[key]?.forEach((layer) => layer.setViewVisible(state))

    Object.keys(this.viewLayers)
      .filter((key_) => key_ !== key)
      .forEach((key_) => {
        this.viewLayers[key_]?.forEach((layer) => layer.setViewVisible(false))
      })
  }

  setCommonLayersVisible(key: string, state: boolean): void {
    this.commonLayers[key]?.forEach((layer) => layer.setViewVisible(state))

    Object.keys(this.commonLayers)
      .filter((key_) => key_ !== key)
      .forEach((key_) => {
        this.commonLayers[key_]?.forEach((layer) => layer.setViewVisible(false))
      })
  }

  setTocViewLayerGroups(group: ViewLayerGroup, item: MapLayer) {
    if (!this.tocViewLayerGroups[group]) {
      this.tocViewLayerGroups[group] = []
    }

    this.tocViewLayerGroups[group]?.push(item)
  }

  getTocViewLayerGroups() {
    return this.tocViewLayerGroups
  }

  setTocCommonLayerGroups(group: CommonLayerGroup, item: { title: string; layers: MapLayer[] }) {
    if (!this.tocCommonLayerGroups[group]) {
      this.tocCommonLayerGroups[group] = []
    }

    this.tocCommonLayerGroups[group]?.push(item)
  }

  getTocCommonLayerGroups() {
    return this.tocCommonLayerGroups
  }

  getViewLayers() {
    return this.viewLayers
  }
}
