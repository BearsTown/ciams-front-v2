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

  const globalStore = useGlobalStore()

  const { layoutSelected } = storeToRefs(globalStore)

  const uitMap = ref<UitMap>()
  const mapWrap = ref<MapWrapper>()

  const props = withDefaults(
    defineProps<{
      mapType: MapType
    }>(),
    {},
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

  const controls = ref<ControlButton[]>()
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

    controls.value = [
      {
        button: new GroupButton({
          id: 'group-measure',
          title: 'group-measure',
          iconName: 'measure',
          children: [
            {
              button: new ToggleButton({
                id: 'measure-distance',
                title: '거리측정',
                iconName: 'measure-distance',
                interaction: undefined,
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
                interaction: undefined,
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
      {
        button: new TriggerButton({
          id: 'history-previous',
          title: 'home',
          iconName: 'home',
        }),
        listeners: [
          {
            key: 'click',
            fn: (value) => {
              console.log(`Home ID :: [ ${value.id} ] Click :: [ ${value.state} ]`)
            },
          },
        ],
      },
      {
        button: new GroupButton({
          id: 'group-map-move',
          title: 'group-map-move',
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
        button: new ToggleButton({
          id: 'map-roadview',
          title: '로드뷰',
          iconName: 'map-roadview',
          interaction: undefined,
        }),
        closeIgnores: [],
        listeners: [
          {
            key: 'active',
            fn: (value) => {
              console.log(`로드뷰 ID :: [ ${value.id} ] :: [ ${value.state} ]`)
            },
          },
        ],
      },
    ]

    mapStore.controlManager?.addControl(controls.value[0].button.id, {
      button: controls.value[0].button,
      closeIgnores: controls.value[0].closeIgnores,
    })

    mapStore.controlManager?.addControl(controls.value[2].button.id, {
      button: controls.value[2].button,
      closeIgnores: controls.value[2].closeIgnores,
    })

    mapStore.controlManager?.addControl(controls.value[3].button.id, {
      button: controls.value[3].button,
      closeIgnores: controls.value[3].closeIgnores,
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
