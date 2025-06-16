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
      <div class="map-container">
        <div id="overview-baseMap"></div>
        <div id="overview-map"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { onBeforeMount, reactive, ref } from 'vue'

  import { ToggleButton } from '@/js/map/control/ToggleButton'
  import { MapType } from '@/enums/mapEnum'
  import { useGlobalStore } from '@/stores/app'
  import { MapWrapper } from '@/js/mapWrapper'
  import { useMapStore } from '@/stores/map/map'
  import UitMap from '@uitgis/ol-ugis-test/uitMap'
  import UitBaseMap from '@uitgis/ol-ugis-test/baseMap/uitBaseMap'

  const props = withDefaults(
    defineProps<{
      mapType: MapType
    }>(),
    {},
  )

  const toggle = new ToggleButton({
    id: 'mini-map',
    title: '미니맵',
    iconName: 'mini-map',
  })

  toggle.onEventListener('active', (value) => {
    console.log(`Toggle [ ${value.id} ] Active :: [ ${value.state} ]`)
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
      closeIgnores: ['group-measure', 'group-map-move'],
    })
  })

  defineExpose({})
</script>

<style lang="scss"></style>
