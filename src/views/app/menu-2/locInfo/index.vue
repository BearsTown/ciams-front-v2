<template>
  <LocationInfo v-show="visible" :mapType="currentMapType" />
</template>

<script setup lang="ts">
  import { computed, onMounted, ref } from 'vue'
  import { storeToRefs } from 'pinia'

  import { useGlobalStore } from '@/stores/app'
  import { useMapStore } from '@/stores/map/map'

  import LocationInfo from '@/components/common/locationInfo'
  import { intersects } from 'ol/format/filter'
  import { Point } from 'ol/geom'
  import { fetchFeatures } from '@uitgis/ol-ugis-test/api/feature'
  import { GeoJSON } from 'ol/format'
  import Feature from 'ol/Feature'
  import UitDrawInteraction from '@uitgis/ol-ugis-test/interaction/uitDraw'
  import { MapWrapper } from '@/js/mapWrapper'

  const globalStore = useGlobalStore()
  const { layoutSelected, currentMapType } = storeToRefs(globalStore)

  const mapStore = useMapStore(currentMapType.value)
  const mapWrap = ref<MapWrapper>()

  const visible = computed(() => {
    // const mapStore = useMapStore(currentMapType.value)
    return mapStore.locationInfoVisible
  })

  // const route = useRoute()
  // console.log(route)
  // console.log(route.query)

  onMounted(async () => {
    mapWrap.value = await mapStore.getMapInstance()

    const uitMap = mapWrap.value?.getUitMap()
    const olMap = uitMap.getMap()

    if (mapStore.locParams?.point) {
      console.log(mapStore.locParams.point)

      layoutSelected.value?.left?.visible?.on()
      layoutSelected.value?.left?.collapse?.off()
      layoutSelected.value?.right?.visible?.on()
      layoutSelected.value?.right?.collapse?.on()

      mapStore.locationInfoVisible = true

      const filter = intersects(
        'SHAPE',
        new Point([mapStore.locParams.point.x, mapStore.locParams.point.y]),
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
        const locInteraction = mapStore.interactionManager?.getInteraction(
          'location-info',
        ) as UitDrawInteraction

        locInteraction?.clear()
        locInteraction?.getSource()?.addFeature(features[0])

        // olMap!.getView().fit(locInteraction.getSource()!.getExtent(), {
        //   padding: [200, 100, 200, 100],
        // })

        // 좌우 패널의 픽셀 크기
        const leftPanelWidth = layoutSelected.value?.left?.collapse?.status ? 355 : 0 // 왼쪽 패널의 픽셀 크기
        const rightPanelWidth = layoutSelected.value?.right?.collapse?.status ? 585 : 0 // 오른쪽 패널의 픽셀 크기
        const bottomPanelWidth = layoutSelected.value?.bottom?.collapse?.status ? 350 : 0 // 하단 패널의 픽셀 크기

        // 뷰포트 크기 가져오기
        const viewportSize = olMap!.getTargetElement().getBoundingClientRect()
        const mapWidth = viewportSize.width
        const mapHeight = viewportSize.height

        mapWrap.value
          ?.getUitMap()
          .getView()
          .fit(locInteraction.getSource()!.getExtent(), {
            // size: [mapWidth + leftPanelWidth - rightPanelWidth, mapHeight - bottomPanelWidth],
            padding: [0, rightPanelWidth, bottomPanelWidth, leftPanelWidth],
          })
      }, 1)

      mapStore.setLocInfo({
        point: {
          x: mapStore.locParams.point.x,
          y: mapStore.locParams.point.y,
        },
        pnu: features[0].get('PNU'),
      })
    }
  })
</script>

<style scoped lang="scss"></style>
