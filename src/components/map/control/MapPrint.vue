<template>
  <div id="mapPrint" style="width: 100%; height: 100%"></div>
</template>

<script lang="ts" setup>
  import { onMounted, onUnmounted } from 'vue'
  import { useMapStore } from '@/stores/map/map'
  import { useGlobalStore } from '@/stores/app'
  import { storeToRefs } from 'pinia'
  import { MapType } from '@/enums/mapEnum'

  const globalStore = useGlobalStore()
  const { currentMapType } = storeToRefs(globalStore)

  const props = withDefaults(
    defineProps<{
      mapType: MapType
    }>(),
    {},
  )

  onMounted(async () => {
    const mapStore = useMapStore(props.mapType)
    const mapWrap = await mapStore.getMapInstance()

    const uitMap = mapWrap.getUitMap()
    const olMap = uitMap.getMap()

    console.log(olMap?.getTarget())

    olMap?.setTarget('mapPrint')
  })

  onUnmounted(async () => {
    const mapStore = useMapStore(props.mapType)
    const mapWrap = await mapStore.getMapInstance()

    const uitMap = mapWrap.getUitMap()
    const olMap = uitMap.getMap()

    // olMap!.setTarget(`ol-map-${currentMapType.value}`)
  })
</script>

<style lang="scss"></style>
