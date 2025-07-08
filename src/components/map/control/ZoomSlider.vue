<template>
  <div class="btn-wrap slider">
    <button @click="setZoom(true)" type="button" class="btn-control plus">
      <SvgIcon size="22" name="plus" />
      <span class="control-tooltip">확대보기</span>
    </button>
    <span class="slider-text">{{ sliderValue }}</span>
    <div class="slider-wrap">
      <Vue3Slider
        v-if="showSlider"
        v-model="sliderValue"
        orientation="vertical"
        color="#7AAAD1"
        :handleScale="1"
        track-color="#E0E0E0"
        :step="1"
        :min="zoomOptions.minZoom"
        :max="zoomOptions.maxZoom"
        :alwaysShowHandle="true"
      />
    </div>
    <button @click="setZoom(false)" type="button" class="btn-control minus">
      <SvgIcon size="22" name="minus" />
      <span class="control-tooltip">축소보기</span>
    </button>
  </div>
</template>

<script lang="ts" setup>
  import { computed, nextTick, onBeforeMount, ref } from 'vue'
  import { storeToRefs } from 'pinia'

  import UitMap from '@uitgis/ol-ugis-test/uitMap'

  import { MapType } from '@/enums/mapEnum'
  import { MapWrapper } from '@/js/mapWrapper'

  import { useGlobalStore } from '@/stores/app'
  import { useMapStore } from '@/stores/map/map'

  const props = withDefaults(
    defineProps<{
      mapType: MapType
    }>(),
    {},
  )

  const globalStore = useGlobalStore()
  const { layoutSelected } = storeToRefs(globalStore)

  const uitMap = ref<UitMap>()
  const mapWrap = ref<MapWrapper>()
  const showSlider = ref<boolean>(true)
  const mapStore = useMapStore(props.mapType)
  const zoomOptions = ref<{ minZoom: number; maxZoom: number }>({
    minZoom: 0,
    maxZoom: 28,
  })

  const sliderValue = computed<number>({
    get() {
      return mapStore.mapInfo?.state?.zoom || 10
    },
    set(newValue) {
      uitMap.value?.getView().setZoom(newValue)
    },
  })

  function setZoom(status: boolean) {
    const view = uitMap.value?.getView()
    const zoom = view?.getZoom()

    if (status) {
      view?.setZoom(zoom! + 1)
    } else {
      view?.setZoom(zoom! - 1)
    }
  }

  onBeforeMount(async () => {
    mapWrap.value = await mapStore.getMapInstance()
    uitMap.value = mapWrap.value?.getUitMap()

    uitMap.value?.getMap()?.on('change:view', (evt) => {
      console.log(uitMap.value?.getView().getMinZoom())
      console.log(uitMap.value?.getView().getMaxZoom())

      zoomOptions.value = {
        minZoom: uitMap.value!.getView().getMinZoom(),
        maxZoom: uitMap.value!.getView().getMaxZoom(),
      }

      showSlider.value = false
      nextTick(() => {
        showSlider.value = true
      })
    })
  })
</script>

<style scoped lang="scss">
  .mapController {
    .btn-wrap.slider {
      box-shadow: 0 0 12px rgba(0, 0, 0, 0.1);
    }
  }
</style>
