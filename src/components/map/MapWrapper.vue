<template>
  <div class="mapContainer">
    <div :id="mapConfig.baseMapId" class="base-map"></div>
    <div :id="mapConfig.olMapId" class="ol-map"></div>

    <div v-if="mapConfig.isMapLocation" class="mapLocation" :class="{ active: rightOpenStatus }">
      <span class="location-text">X : {{ centerRef[0] }}</span>
      <span class="location-text">Y : {{ centerRef[1] }}</span>
    </div>

    <slot name="control"></slot>
  </div>
</template>

<script setup lang="ts">
  import 'ol/ol.css'
  import { computed, onMounted } from 'vue'

  import UitMap from '@uitgis/ol-ugis-test/uitMap'
  import { MapType, MapWrapperConfig } from '@/enums/mapEnum'
  import { useMapStore } from '@/stores/map/map'
  import { useGlobalStore } from '@/stores/app'
  import { storeToRefs } from 'pinia'
  import commonUtil from '@/utils/commonUtil'

  const props = withDefaults(
    defineProps<{
      mapType: MapType
      mapConfig: MapWrapperConfig
    }>(),
    {},
  )

  const globalStore = useGlobalStore()
  const mapStore = useMapStore(props.mapType)

  const { layoutSelected } = storeToRefs(globalStore)

  // let mapObject: MapObject
  // const mapCacheStore = useMapCacheStore(props.mapType)

  const rightOpenStatus = computed(() => {
    return (
      layoutSelected.value?.right?.visible?.status && layoutSelected.value?.right?.collapse?.status
    )
  })

  const centerRef = computed(() => {
    const center = mapStore.mapInfo.state?.center || [0, 0]
    return [commonUtil.toRound3(center[0]) || 0, commonUtil.toRound3(center[1]) || 0]
  })

  const changeListener = (evt) => {
    mapStore.mapInfo?.updateState('zoom', evt.map.getView().getZoom())
    mapStore.mapInfo?.updateState('center', evt.map.getView().getCenter())
    // mapObject.mapInfo?.updateState('zoom', evt.map.getView().getZoom())
    // mapObject.mapInfo?.updateState('center', evt.map.getView().getCenter())
  }

  function centerListener(uitMap: UitMap) {
    uitMap.getMap()?.on('moveend', changeListener)
    // uitMap.getView().on('change:center', changeListener)
    // uitMap.getMap()?.on('change:view', (evt) => {
    //   evt.target.getView().on('change:center', changeListener)
    // })
  }

  onMounted(async () => {
    const mapWrap = await mapStore.initializeMap(props.mapConfig)
    // mapObject = mapCacheStore.getMapObject(props.mapType)
    // const mapWrap = await mapObject.getMapInstance()

    centerListener(mapWrap.getUitMap())
  })

  defineExpose({})
</script>

<style scoped lang="scss">
  .mapContainer {
    width: 100%;
    height: 100%;
    position: relative;

    .base-map {
      z-index: 0;
      width: 100%;
      height: 100%;
      position: absolute;

      &.map-filter-normal {
        filter: none;
      }
      &.map-filter-gray {
        filter: grayscale(1);
      }
      &.map-filter-light {
        filter: brightness(1.2);
      }
      &.map-filter-dark {
        filter: brightness(0.5);
      }
    }

    .ol-map {
      z-index: 1;
      width: 100%;
      height: 100%;
      position: absolute;
    }
  }
</style>
