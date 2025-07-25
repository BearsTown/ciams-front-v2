<template>
  <div class="btn-wrap popup" v-if="button.isVisible" :class="{ active: button.isActive }">
    <button
      type="button"
      class="btn-control miniMap"
      :class="{ active: button.isActive }"
      @click="button.click()"
    >
      <SvgIcon :name="button.iconName" :size="button.iconSize" />
      <span class="control-tooltip">{{ button.title }}</span>
    </button>

    <div class="dropdown miniMap" style="padding: 10px">
      <div class="minimap-container">
        <div :id="baseId" class="overview-baseMap"></div>
        <div :id="mapId" class="overview-map"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { computed, onBeforeMount, reactive, ref, watch } from 'vue'

  import UitMap from '@uitgis/ol-ugis-test/uitMap'
  import UitMiniMap from '@uitgis/ol-ugis-test/map/uitMiniMap'
  import UitBaseMap from '@uitgis/ol-ugis-test/baseMap/uitBaseMap'

  import { MapType } from '@/enums/mapEnum'
  import { MapWrapper } from '@/js/mapWrapper'
  import { ToggleButton } from '@/js/map/control/ToggleButton'

  import { useMapStore } from '@/stores/map/map'

  const props = withDefaults(
    defineProps<{
      mapType: MapType
    }>(),
    {},
  )

  const baseId = computed(() => `mini-base-map-${props.mapType}`)
  const mapId = computed(() => `mini-ol-map-${props.mapType}`)

  const toggle = new ToggleButton({
    id: 'mini-map',
    title: '미니맵',
    iconName: 'mini-map',
  })

  toggle.onEventListener('active', (value) => {
    console.log(`Toggle [ ${value.id} ] Active :: [ ${value.state} ]`)
  })

  const button = reactive(toggle)

  let uitMap: UitMap
  let uitBaseMap: UitBaseMap
  const mapWrap = ref<MapWrapper>()
  const mapStore = useMapStore(props.mapType)

  onBeforeMount(async () => {
    mapWrap.value = await mapStore.getMapInstance()

    uitMap = mapWrap.value?.getUitMap()
    uitBaseMap = mapWrap.value?.getUitBaseMap()

    mapStore.controlManager?.addControl(toggle.id, {
      button: toggle,
      closeIgnores: ['group-measure', 'group-map-move'],
    })
  })

  let uitMiniMap

  watch(button, (value) => {
    if (value.isActive && uitMiniMap === undefined) {
      uitMiniMap = new UitMiniMap({
        baseMapOpt: {
          target: baseId.value,
        },
        mapOpt: {
          target: mapId.value,
        },
        referenceBaseMap: uitBaseMap,
        view: uitMap!.getView(),
        referenceMap: uitMap,
      })
    }
  })
</script>

<style lang="scss">
  .minimap-container {
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
    overflow: hidden;
  }

  .overview-baseMap {
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 1;
  }
  .overview-map {
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 10;
  }
</style>
