<template>
  <div
    class="mapController"
    :class="{
      active: rightOpenStatus,
    }"
  >
    <div style="padding-top: 15px; pointer-events: all">
      <MapSetting :map-type="mapType" />

      <component
        v-for="item in controls"
        :key="item.button.id"
        :button="item.button"
        :listeners="item.listeners"
        :is="getButtonComponent(item.button)"
      />
    </div>

    <div
      class="mapController-bottom"
      :class="{ active: rightOpenStatus }"
      style="pointer-events: all"
    >
      <ZoomSlider :map-type="mapType" />
      <MiniMap :map-type="mapType" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { computed, onBeforeMount, ref } from 'vue'
  import { storeToRefs } from 'pinia'

  import MiniMap from '@/components/map/control/MiniMap.vue'
  import ZoomSlider from '@/components/map/control/ZoomSlider.vue'
  import MapSetting from '@/components/map/control/mapSetting/MapSetting.vue'
  import TriggerButtonComponent from '@/components/map/control/TriggerButton.vue'
  import ToggleButtonComponent from '@/components/map/control/ToggleButton.vue'
  import GroupButtonComponent from '@/components/map/control/GroupButton.vue'

  import { Point } from 'ol/geom'
  import Feature from 'ol/Feature'
  import { GeoJSON, WFS } from 'ol/format'
  import { always } from 'ol/events/condition'
  import { intersects } from 'ol/format/filter'
  import { DrawEvent } from 'ol/interaction/Draw'
  import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style'

  import UitMap from '@uitgis/ol-ugis-test/uitMap'
  import UitMeasureInteraction from '@uitgis/ol-ugis-test/interaction/uitMeasure'
  import UitDragZoomInteraction from '@uitgis/ol-ugis-test/interaction/uitDragZoom'
  import UitDrawInteraction from '@uitgis/ol-ugis-test/interaction/uitDraw'
  import { locationInfoStyle, measureAreaStyle, measureLineStyle } from '@/js/map/mapStyle'

  import { API_INFO_MAPSTUDIO } from '@/config/config'
  import { MapInteractionType, MapType } from '@/enums/mapEnum'
  import { MapWrapper } from '@/js/mapWrapper'
  import { GroupButton } from '@/js/map/control/GroupButton'
  import { ToggleButton } from '@/js/map/control/ToggleButton'
  import { TriggerButton } from '@/js/map/control/TriggerButton'
  import { AbstractControlButton, ControlButton } from '@/js/map/control/AbstractControlButton'

  import { useGlobalStore } from '@/stores/app'
  import { useMapStore } from '@/stores/map/map'
  import { urlWithParams } from '@uitgis/ol-ugis-test/util'
  import CommonUtil from '@/utils/commonUtil'

  const globalStore = useGlobalStore()

  const { layoutSelected } = storeToRefs(globalStore)

  const uitMap = ref<UitMap>()
  const mapWrap = ref<MapWrapper>()

  const props = withDefaults(
    defineProps<{
      mapType: MapType
      useLand?: boolean
    }>(),
    {
      useLand: true,
    },
  )

  const mapStore = useMapStore(props.mapType)

  const rightOpenStatus = computed(() => {
    return (
      layoutSelected.value?.right?.visible?.status && layoutSelected.value?.right?.collapse?.status
    )
  })

  function getButtonComponent(button: AbstractControlButton) {
    if (button instanceof TriggerButton) {
      return TriggerButtonComponent
    } else if (button instanceof ToggleButton) {
      return ToggleButtonComponent
    } else if (button instanceof GroupButton) {
      return GroupButtonComponent
    }
  }

  const controls = ref<ControlButton[]>([])
  const $mapSetting = ref<InstanceType<typeof MapSetting>>()
  const $miniMap = ref<InstanceType<typeof MiniMap>>()

  const container = document.createElement('div')
  const textContainer = document.createElement('div')
  const buttonContainer = document.createElement('div')
  const buttonElement = document.createElement('button')
  buttonElement.className = 'tooltip-closer'
  const textElement = document.createElement('span')
  container.className = 'tooltip tooltip-static'
  const buttonId = 'close-btn'
  buttonElement.id = buttonId
  buttonContainer.append(buttonElement)
  const textId = 'text'
  textElement.id = textId
  textContainer.append(textElement)
  textContainer.className = 'tooltip-text'
  container.append(textContainer, buttonContainer)

  onBeforeMount(async () => {
    mapWrap.value = await mapStore.getMapInstance()
    uitMap.value = mapWrap.value?.getUitMap()

    // $miniMap.value?.init(mapWrap.value)

    const olMap = uitMap.value?.getMap()

    const measureLine = new UitMeasureInteraction({
      measureStyle: measureLineStyle,
      featureStyle: measureLineStyle,
      map: olMap!,
      layerId: 'measureLine',
      measureType: 'LineString',
      useFreehand: false,
      useSnap: false,
      zIndex: 10000,
      // overlayOption: {
      //   html: container,
      //   closeTarget: buttonId,
      //   textTarget: textId,
      // },
    })

    measureLine.setActive(false)

    mapStore.interactionManager?.addInteraction('measure-distance', measureLine)

    const measurePolygon = new UitMeasureInteraction({
      measureStyle: measureAreaStyle,
      featureStyle: measureAreaStyle,
      map: olMap!,
      layerId: 'measurePolygon',
      measureType: 'Polygon',
      useFreehand: false,
      useSnap: false,
      zIndex: 10000,
      // overlayOption: {
      //   html: container,
      //   closeTarget: buttonId,
      //   textTarget: textId,
      // },
    })

    measurePolygon.setActive(false)

    mapStore.interactionManager?.addInteraction('measure-area', measurePolygon)

    const dragZoomIn = new UitDragZoomInteraction({
      map: olMap!,
      dragZoomOptions: {
        out: false,
        className: 'ol-custom-dragzoom',
        condition: always,
      },
    })
    dragZoomIn.getInteraction()?.on('boxstart', () => {
      olMap!.getView().setViewportSize(olMap!.getSize())
    })

    dragZoomIn.setActive(false)

    mapStore.interactionManager?.addInteraction('drag-zoom-in', dragZoomIn)

    // dragZoomIn.getInteraction()?.on('change:active', (event) => {
    //   mapStore.controlManager?.getControl('group-map-move')?.setActive(event.target.getActive())
    // })

    const dragZoomOut = new UitDragZoomInteraction({
      map: olMap!,
      dragZoomOptions: {
        out: true,
        className: 'ol-custom-dragzoom',
        condition: always,
      },
    })
    dragZoomOut.getInteraction()?.on('boxstart', () => {
      olMap!.getView().setViewportSize(olMap!.getSize())
    })

    dragZoomOut.setActive(false)

    mapStore.interactionManager?.addInteraction('drag-zoom-out', dragZoomOut)

    const locationInfo = new UitDrawInteraction({
      map: olMap!,
      drawType: 'Point',
      layerId: 'LOCATION_INFO',
      useFreehand: true,
      useSnap: false,
      drawStyle: new Style({
        image: new CircleStyle({
          radius: 3,
          fill: new Fill({ color: 'red' }),
          stroke: new Stroke({
            color: 'black',
          }),
        }),
      }),
      featureStyle: locationInfoStyle,
      zIndex: 5000,
    })

    locationInfo.setActive(false)

    locationInfo.getInteraction()?.on('drawend', async (evt: DrawEvent) => {
      layoutSelected.value?.left?.visible?.on()
      layoutSelected.value?.left?.collapse?.off()
      layoutSelected.value?.right?.visible?.on()
      layoutSelected.value?.right?.collapse?.on()

      mapStore.locationInfoVisible = true
      mapStore.controlManager?.closeAll()

      const geom = evt.feature.getGeometry() as Point
      const coordinate = geom.getCoordinates()

      const pixel3 =
        olMap!.getCoordinateFromPixel([7, 0])[0] - olMap!.getCoordinateFromPixel([0, 0])[0]

      const bBox = [
        coordinate[0] - pixel3,
        coordinate[1] - pixel3,
        coordinate[0] + pixel3,
        coordinate[1] + pixel3,
      ]

      const filter = intersects(
        'SHAPE',
        new Point(coordinate),
        olMap!.getView().getProjection().getCode(),
      )

      const res = await fetch(
        urlWithParams(API_INFO_MAPSTUDIO.PREFIX + '/uwfs', {
          KEY: 'system',
        }),
        {
          method: 'POST',
          body: new XMLSerializer().serializeToString(
            new WFS().writeGetFeature({
              srsName: mapWrap.value?.getUitMap().getView().getProjection().getCode(),
              featureNS: 'http://www.opengis.net/wfs',
              featurePrefix: 'feature',
              outputFormat: 'application/json',
              featureTypes: ['CIAMS_LSMD_CONT_LDREG'],
              filter,
            }),
          ),
        },
      )

      let text = await res.text()
      text = text.replace(/\n/gi, '\\r\n')
      const features = new GeoJSON().readFeatures(text) as Feature[]

      if (CommonUtil.isEmpty(features)) {
        CommonUtil.errorMessage('필지정보가 존재하지 않습니다.')
        return false
      }

      mapStore.setSearchAddressFeature(features[0])

      setTimeout(() => {
        locationInfo.clear()
        locationInfo.getSource()?.addFeature(features[0])
        // olMap!.getView().fit(locationInfo.getSource()!.getExtent(), {
        //   padding: [200, 100, 200, 100],
        // })

        const map = mapWrap.value!.getUitMap().getMap()!

        // 좌우 패널의 픽셀 크기
        const leftPanelWidth = layoutSelected.value?.left?.collapse?.status ? 355 : 0 // 왼쪽 패널의 픽셀 크기
        const rightPanelWidth = layoutSelected.value?.right?.collapse?.status ? 585 : 0 // 오른쪽 패널의 픽셀 크기
        const bottomPanelWidth = layoutSelected.value?.bottom?.collapse?.status ? 350 : 0 // 하단 패널의 픽셀 크기

        // 뷰포트 크기 가져오기
        const viewportSize = map.getTargetElement().getBoundingClientRect()
        const mapWidth = viewportSize.width
        const mapHeight = viewportSize.height

        mapWrap.value
          ?.getUitMap()
          .getView()
          .fit(locationInfo.getSource()!.getExtent(), {
            // size: [mapWidth + leftPanelWidth - rightPanelWidth, mapHeight - bottomPanelWidth],
            padding: [0, rightPanelWidth, bottomPanelWidth, leftPanelWidth],
          })
      }, 1)

      mapStore.setLocInfo({
        point: {
          x: coordinate[0],
          y: coordinate[1],
        },
        pnu: features[0].get('PNU'),
      })
    })

    mapStore.interactionManager?.addInteraction('location-info', locationInfo)

    if (props.useLand) {
      controls.value?.push({
        button: new ToggleButton({
          id: 'location-info',
          title: '필지정보',
          iconName: 'view-info',
          interaction: locationInfo,
        }),
        listeners: [
          {
            key: 'active',
            fn: (value) => {
              console.log(`필지정보 ID :: [ ${value.id} ] :: [ ${value.state} ]`)
            },
          },
        ],
      })
    }

    controls.value = controls.value.concat([
      {
        button: new GroupButton({
          id: 'group-map-move',
          title: '지도이동',
          iconName: 'map-move',
          children: [
            {
              button: new ToggleButton({
                id: 'drag-zoom-in',
                title: '지도확대',
                iconName: 'area-zoomIn',
                interaction: dragZoomIn,
              }),
              listeners: [
                {
                  key: 'active',
                  fn: (value) => {
                    console.log(`지도확대 :: [ ${value.id} ] Active :: [ ${value.state} ]`)
                    // mapStore.interactionManager?.getInteraction(value.id)?.setActive(value.state)
                  },
                },
              ],
            },
            {
              button: new ToggleButton({
                id: 'drag-zoom-out',
                title: '지도축소',
                iconName: 'area-zoomOut',
                iconSize: 30,
                interaction: dragZoomOut,
              }),
              listeners: [
                {
                  key: 'active',
                  fn: (value) => {
                    console.log(`지도축소 :: [ ${value.id} ] Active :: [ ${value.state} ]`)
                    // mapStore.interactionManager?.getInteraction(value.id)?.setActive(value.state)
                  },
                },
              ],
            },
          ],
        }),
        closeIgnores: ['mini-map'],
        listeners: [
          {
            key: 'open',
            fn: (value) => {
              console.log(`지도이동 그룹 :: [ ${value.id} ] Open :: [ ${value.state} ]`)
              // if (value.state) {
              //   mapStore.controlManager?.closeAll(value.id)
              // }
            },
          },
          {
            key: 'active',
            fn: (value) => {
              console.log(`지도이동 그룹 :: [ ${value.id} ] Active :: [ ${value.state} ]`)
            },
          },
        ],
      },
      {
        button: new GroupButton({
          id: 'group-measure',
          title: '측정',
          iconName: 'measure',
          children: [
            {
              button: new ToggleButton({
                id: 'measure-distance',
                title: '거리측정',
                iconName: 'measure-distance',
                interaction: measureLine,
              }),
              listeners: [
                {
                  key: 'active',
                  fn: (value) => {
                    console.log(`거리측정 ID :: [ ${value.id} ] :: [ ${value.state} ]`)
                  },
                },
              ],
            },
            {
              button: new ToggleButton({
                id: 'measure-area',
                title: '면적측정',
                iconName: 'measure-area',
                interaction: measurePolygon,
              }),
              listeners: [
                {
                  key: 'active',
                  fn: (value) => {
                    console.log(`면적측정 ID :: [ ${value.id} ] :: [ ${value.state} ]`)
                  },
                },
              ],
            },
            {
              button: new TriggerButton({
                id: 'measure-refresh',
                title: '초기화',
                iconName: 'measure-refresh',
              }),
              listeners: [
                {
                  key: 'click',
                  fn: () => {
                    ;['measure-distance', 'measure-area'].forEach((val: MapInteractionType) => {
                      const measure = mapStore.interactionManager?.getInteraction(
                        val,
                      ) as UitMeasureInteraction
                      measure.clear()
                    })
                  },
                },
              ],
            },
          ],
        }),
        closeIgnores: ['mini-map'],
        listeners: [
          {
            key: 'open',
            fn: (value) => {
              console.log(`측정 그룹 ID :: [ ${value.id} ] Open :: [ ${value.state} ]`)
              if (value.state) {
                // mapStore.controlManager?.closeAll(value.id)
              }
            },
          },
          {
            key: 'active',
            fn: (value) => {
              console.log(`측정 그룹 ID :: [ ${value.id} ] Active :: [ ${value.state} ]`)
            },
          },
        ],
      },
      // {
      //   button: new ToggleButton({
      //     id: 'map-roadview',
      //     title: '로드뷰',
      //     iconName: 'map-roadview',
      //     interaction: undefined,
      //   }),
      //   closeIgnores: [],
      //   listeners: [
      //     {
      //       key: 'active',
      //       fn: (value) => {
      //         console.log(`로드뷰 ID :: [ ${value.id} ] :: [ ${value.state} ]`)
      //       },
      //     },
      //   ],
      // },
      // {
      //   button: new TriggerButton({
      //     id: 'print',
      //     title: '출력',
      //     iconName: 'print',
      //   }),
      //   listeners: [
      //     {
      //       key: 'click',
      //       fn: () => {
      //         globalStore.printDialog = true
      //       },
      //     },
      //   ],
      // },
    ])

    controls.value?.forEach((control) => {
      mapStore.controlManager?.addControl(control.button.id, {
        button: control.button as AbstractControlButton,
        closeIgnores: control.closeIgnores,
      })
    })
  })
</script>

<style lang="scss">
  @import '@/assets/css/mapController.css';
  @import '@/assets/css/printModal.css';
</style>

<style scoped lang="scss"></style>

<style>
  .ol-custom-dragzoom {
    border: 1px solid green;
    border-color: red !important;
    border-width: 3px !important;
    background-color: rgba(255, 255, 255, 0.4);
    z-index: 10000;
  }

  .tooltip {
    position: relative;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 4px;
    padding: 4px 8px;
    white-space: nowrap;
    transform: translate(-50%, -100%);
    display: flex;
    font-size: 13px;
  }

  .tooltip-measure {
    opacity: 1;
    font-weight: bold;
  }
  .tooltip-text {
    align-content: center;
  }
  .tooltip-static {
    background-color: var(--el-color-primary);
    color: white;
  }

  .tooltip-closer:after {
    color: red;
    content: 'X';
    padding-left: 5px;
    font-size: 13px;
  }

  .tooltip-measure:before,
  .tooltip-static:before {
    border-top: 6px solid rgba(0, 0, 0, 0.5);
    border-right: 6px solid transparent;
    border-left: 6px solid transparent;
    content: '';
    position: absolute;
    bottom: -6px;
    margin-left: -7px;
    left: 50%;
  }

  .tooltip-static:before {
    border-top-color: #7aaad1;
  }
</style>
