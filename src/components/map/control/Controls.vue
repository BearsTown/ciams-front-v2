<template>
  <div
    class="mapController"
    :class="{
      active: rightOpenStatus,
    }"
  >
    <div style="padding-top: 15px; flex: 1">
      <MapSetting :map-type="mapType" />

      <component
        v-for="item in controls"
        :key="item.button.id"
        :button="item.button"
        :listeners="item.listeners"
        :is="getButtonComponent(item.button)"
      />
    </div>

    <div class="mapController-bottom" :class="{ active: rightOpenStatus }">
      <ZoomSlider :map-type="mapType" />
      <MiniMap :map-type="mapType" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { storeToRefs } from 'pinia'

  import { useGlobalStore } from '@/stores/app'
  import { TriggerButton } from '@/js/map/control/TriggerButton'
  import { ToggleButton } from '@/js/map/control/ToggleButton'
  import { GroupButton } from '@/js/map/control/GroupButton'
  import { AbstractControlButton, ControlButton } from '@/js/map/control/AbstractControlButton'

  import TriggerButtonComponent from '@/components/map/control/TriggerButton.vue'
  import ToggleButtonComponent from '@/components/map/control/ToggleButton.vue'
  import GroupButtonComponent from '@/components/map/control/GroupButton.vue'
  import { MapType } from '@/enums/mapEnum'
  import ZoomSlider from '@/components/map/control/ZoomSlider.vue'
  import { computed, onBeforeMount, ref } from 'vue'
  import { MapWrapper } from '@/js/mapWrapper'
  import UitMap from '@uitgis/ol-ugis-test/uitMap'
  import MapSetting from '@/components/map/control/mapSetting/MapSetting.vue'
  import MiniMap from '@/components/map/control/MiniMap.vue'

  import UitDragZoomInteraction from '@uitgis/ol-ugis-test/interaction/uitDragZoom'
  import { always } from 'ol/events/condition'
  import { useMapStore } from '@/stores/map/map'
  import UitDrawInteraction from '@uitgis/ol-ugis-test/interaction/uitDraw'
  import { locationInfoStyle } from '@/js/map/mapStyle'
  import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style'
  import { DrawEvent } from 'ol/interaction/Draw'
  import { Point } from 'ol/geom'
  import { fetchFeatures } from '@uitgis/ol-ugis-test/api/feature'
  import { intersects } from 'ol/format/filter'
  import { GeoJSON } from 'ol/format'
  import Feature from 'ol/Feature'

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

  onBeforeMount(async () => {
    mapWrap.value = await mapStore.getMapInstance()
    uitMap.value = mapWrap.value?.getUitMap()

    // $miniMap.value?.init(mapWrap.value)

    const olMap = uitMap.value?.getMap()

    console.log(olMap)

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

      const mapStudioUrl = import.meta.env.VITE_API_MAPSTUDIO_URL
      const res = await fetchFeatures({
        url: mapStudioUrl,
        key: 'AF781CA7-729A-BA0C-C965-E6751C9CE3EA',
        featureRequestProps: {
          layers: 'CIAMS_P1_LSMD_CONT_LDREG',
          filter: filter,
          srsName: mapWrap.value?.getUitMap().getView().getProjection().getCode(),
        },
      })
      let text = await res.text()
      text = text.replace(/\n/gi, '\\r\n')
      const features = new GeoJSON().readFeatures(text) as Feature[]

      mapStore.setSearchAddressFeature(features[0])

      setTimeout(() => {
        locationInfo.clear()
        locationInfo.getSource()?.addFeature(features[0])
        olMap!.getView().fit(locationInfo.getSource()!.getExtent(), {
          padding: [200, 100, 200, 100],
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
      // {
      //   button: new GroupButton({
      //     id: 'group-measure',
      //     title: 'group-measure',
      //     iconName: 'measure',
      //     children: [
      //       {
      //         button: new ToggleButton({
      //           id: 'measure-distance',
      //           title: '거리측정',
      //           iconName: 'measure-distance',
      //           interaction: undefined,
      //         }),
      //         listeners: [
      //           {
      //             key: 'active',
      //             fn: (value) => {
      //               console.log(`거리측정 ID :: [ ${value.id} ] :: [ ${value.state} ]`)
      //             },
      //           },
      //         ],
      //       },
      //       {
      //         button: new ToggleButton({
      //           id: 'measure-area',
      //           title: '면적측정',
      //           iconName: 'measure-area',
      //           interaction: undefined,
      //         }),
      //         listeners: [
      //           {
      //             key: 'active',
      //             fn: (value) => {
      //               console.log(`면적측정 ID :: [ ${value.id} ] :: [ ${value.state} ]`)
      //             },
      //           },
      //         ],
      //       },
      //     ],
      //   }),
      //   closeIgnores: ['mini-map'],
      //   listeners: [
      //     {
      //       key: 'open',
      //       fn: (value) => {
      //         console.log(`측정 그룹 ID :: [ ${value.id} ] Open :: [ ${value.state} ]`)
      //         if (value.state) {
      //           // mapStore.controlManager?.closeAll(value.id)
      //         }
      //       },
      //     },
      //     {
      //       key: 'active',
      //       fn: (value) => {
      //         console.log(`측정 그룹 ID :: [ ${value.id} ] Active :: [ ${value.state} ]`)
      //       },
      //     },
      //   ],
      // },
      // {
      //   button: new TriggerButton({
      //     id: 'history-previous',
      //     title: 'home',
      //     iconName: 'home',
      //   }),
      //   listeners: [
      //     {
      //       key: 'click',
      //       fn: (value) => {
      //         console.log(`Home ID :: [ ${value.id} ] Click :: [ ${value.state} ]`)
      //       },
      //     },
      //   ],
      // },
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

<style scoped lang="scss">
  .mapController {
    //z-index: 5;
    display: flex;
    flex-flow: column;
    right: 10px !important;

    &.active {
      right: 594px !important;
    }

    .mapController-bottom {
      padding-top: 0;
      padding-bottom: 15px;
      flex-flow: column;
    }
  }
</style>

<style>
  .ol-custom-dragzoom {
    border: 1px solid green;
    border-color: red !important;
    border-width: 3px !important;
    background-color: rgba(255, 255, 255, 0.4);
    z-index: 10000;
  }
</style>
