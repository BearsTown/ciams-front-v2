<template>
  <div class="btn-wrap popup" v-if="button.isVisible" :class="{ active: button.isActive }">
    <button
      type="button"
      class="btn-control"
      :class="{ active: button.isActive }"
      @click="button.click()"
    >
      <SvgIcon :name="button.iconName" :size="button.iconSize" />
      <span class="control-tooltip">{{ button.title }}</span>
    </button>

    <div class="dropdown bgMap">
      <div class="dropdown-header">
        배경지도
        <button @click="button.setActive(false)" type="button" class="btn-close">
          <SvgIcon name="close" size="20" style="flex: 1" />
        </button>
      </div>
      <div class="form customScroll">
        <BaseMapComponent :map-type="mapType" />
        <LayersComponent :map-type="mapType" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { onBeforeMount, reactive, ref } from 'vue'

  import LayersComponent from '@/components/map/control/mapSetting/Layers.vue'
  import BaseMapComponent from '@/components/map/control/mapSetting/BaseMap.vue'

  import { ToggleButton } from '@/js/map/control/ToggleButton'
  import { MapType } from '@/enums/mapEnum'
  import { useGlobalStore } from '@/stores/app'
  import { MapWrapper } from '@/js/mapWrapper'
  import { useMapStore } from '@/stores/map/map'
  import UitBaseMap from '@uitgis/ol-ugis-test/baseMap/uitBaseMap'
  import UitMap from '@uitgis/ol-ugis-test/uitMap'

  const props = withDefaults(
    defineProps<{
      mapType: MapType
    }>(),
    {},
  )

  const toggle = new ToggleButton({
    id: 'map-setting',
    title: '지도설정',
    iconName: 'map-setting',
  })

  toggle.onEventListener('active', (value) => {
    console.log(`Toggle map-setting Active :: ${value.state}`)
  })

  const button = reactive(toggle)

  const globalStore = useGlobalStore()

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
      closeIgnores: [],
    })
  })

  defineExpose({})
</script>

<style scoped lang="scss">
  .mapController .dropdown.bgMap .form {
    //max-height: 760px;
    //min-height: 760px;
  }
</style>
