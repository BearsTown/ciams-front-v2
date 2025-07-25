import View from 'ol/View'

import UitMap from '@uitgis/ol-ugis-test/uitMap'
import { UitWMSLayer, UitWMTSLayer } from '@uitgis/ol-ugis-test/layer'
import UitBaseMap from '@uitgis/ol-ugis-test/baseMap/uitBaseMap'

import { MapLayer } from '@/js/layer'
import { CommonLayerGroup, MapType, MapWrapperConfig, ViewLayerGroup } from '@/enums/mapEnum'

export class MapWrapper {
  private mapType: MapType
  private config: MapWrapperConfig
  private uitMap: UitMap | undefined
  private uitBaseMap: UitBaseMap | undefined
  private labelLayer: UitWMSLayer
  private viewLabelNames: string[]
  private commonLabelNames: string[]

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

    this.viewLabelNames = []
    this.commonLabelNames = []

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

      layers
        .filter(
          (mLayer) =>
            mLayer.getLayer() instanceof UitWMSLayer || mLayer.getLayer() instanceof UitWMTSLayer,
        )
        .forEach((mLayer) => {
          mLayer.visible.on('change:visible', ({ layer, visible }) => {
            if (mLayer.getLayer() instanceof UitWMSLayer) {
              const wmsLayer = layer as UitWMSLayer

              if (visible) {
                this.commonLabelNames = this.commonLabelNames.concat(wmsLayer.getParamLAYERS())
              } else {
                this.commonLabelNames = this.commonLabelNames.filter(
                  (layerName) => !wmsLayer.getParamLAYERS().includes(layerName),
                )
              }
            } else if (mLayer.getLayer() instanceof UitWMTSLayer) {
              const wmtsLayer = layer as UitWMTSLayer

              const name = wmtsLayer.getLayer().getSource().getLayer().slice(2)
              if (visible) {
                this.commonLabelNames = this.commonLabelNames.concat([name])
              } else {
                this.commonLabelNames = this.commonLabelNames.filter(
                  (layerName) => ![name].includes(layerName),
                )
              }
            }

            this.labelLayer.setLAYERS([...this.commonLabelNames, ...this.viewLabelNames])
          })
        })
    }
  }

  addViewLayer({ key, layers }: { key: ViewLayerGroup; layers: MapLayer[] }): void {
    if (layers && Array.isArray(layers) && 0 < layers.length) {
      if (!this.viewLayers[key]) {
        this.viewLayers[key] = layers
      } else {
        this.viewLayers[key]!.push(...layers)
      }

      layers
        .filter(
          (mLayer) =>
            mLayer.getLayer() instanceof UitWMSLayer || mLayer.getLayer() instanceof UitWMTSLayer,
        )
        .forEach((mLayer) => {
          mLayer.visible.on('change:visible', ({ layer, visible }) => {
            const wmsLayer = layer as UitWMSLayer

            if (visible) {
              this.viewLabelNames = this.viewLabelNames.concat(wmsLayer.getParamLAYERS())
            } else {
              this.viewLabelNames = this.viewLabelNames.filter(
                (layerName) => !wmsLayer.getParamLAYERS().includes(layerName),
              )
            }

            this.labelLayer.setLAYERS([...this.commonLabelNames, ...this.viewLabelNames])
          })
        })
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

  getLabelLayer() {
    return this.labelLayer
  }

  setLabelLayer(layer: UitWMSLayer) {
    if (this.labelLayer) {
    } else {
      this.labelLayer = layer
      this.uitMap?.addWMSLayer(layer)
    }
  }

  private addLabel(type: 'view' | 'common', layerName: string) {
    if (type === 'view') {
    } else if (type === 'common') {
    }
  }
}
