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
  import { computed, onBeforeMount, reactive, ref } from 'vue'

  import LayersComponent from '@/components/map/control/mapSetting/Layers.vue'
  import BaseMapComponent from '@/components/map/control/mapSetting/BaseMap.vue'

  import { ToggleButton } from '@/js/map/control/ToggleButton'
  import { BaseMap, BaseMapImg, BaseMapOption, MapType } from '@/enums/mapEnum'
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

  function test(layer) {
    console.log(layer)
  }

  const baseMaps = ref<{
    [K in BaseMap]: {
      checked: boolean
      label: string
      types: {
        [K in string]: {
          src: BaseMapImg
          alt: string
          label: string
          checked: boolean
        }
      }
    }
  }>({
    vWorld: {
      checked: true,
      label: '브이월드',
      types: {
        normal: {
          src: BaseMapImg.VWORLD_BASE,
          alt: '브이월드 기본지도 이미지',
          label: '기본',
          checked: true,
        },
        satellite: {
          src: BaseMapImg.VWORLD_SATELLITE,
          alt: '브이월드 위성지도 이미지',
          label: '위성',
          checked: false,
        },
        white: {
          src: BaseMapImg.VWROLD_GARY,
          alt: '브이월드 회색지도 이미지',
          label: '회색',
          checked: false,
        },
      },
    },
    kakao: {
      checked: false,
      label: '카카오',
      types: {
        normal: {
          src: BaseMapImg.KAKAO_BASE,
          alt: '카카오 기본지도 이미지',
          label: '기본',
          checked: true,
        },
        satellite: {
          src: BaseMapImg.KAKAO_SATELLITE,
          alt: '카카오 위성지도 이미지',
          label: '위성',
          checked: false,
        },
      },
    },
  })

  const baseMapOptions = ref<{
    [K in BaseMapOption]: {
      label: string
      filter: string
      checked: boolean
    }
  }>({
    NORMAL: {
      label: '기본',
      filter: 'map-filter-normal',
      checked: true,
    },
    GRAY: {
      label: '회색',
      filter: 'map-filter-gray',
      checked: false,
    },
    LIGHT: {
      label: '밝게',
      filter: 'map-filter-light',
      checked: false,
    },
    DARK: {
      label: '어둡게',
      filter: 'map-filter-dark',
      checked: false,
    },
  })

  const globalStore = useGlobalStore()

  let uitMap: UitMap
  let uitBaseMap: UitBaseMap
  const mapWrap = ref<MapWrapper>()
  const mapStore = useMapStore(props.mapType)

  const activeCodeKey = computed({
    get() {
      return Object.entries(baseMaps.value).find(([_, base]) => base.checked)?.[0]
    },
    set(newKey: string) {
      Object.entries(baseMaps.value).forEach(([key, base]) => {
        base.checked = key === newKey
      })
    },
  })

  const activeTypeKey = computed({
    get() {
      return (
        Object.entries(baseMaps.value[activeCodeKey.value!].types) as [
          string,
          { src: BaseMapImg; alt: string; label: string; checked: boolean },
        ][]
      ).find(([_, type]) => type.checked)?.[0]
    },
    set(newKey: string) {
      const types = baseMaps.value[activeCodeKey.value!].types as {
        [K in string]: {
          src: BaseMapImg
          alt: string
          label: string
          checked: boolean
        }
      }

      Object.entries(types).forEach(([key, type]) => {
        type.checked = key === newKey
      })
    },
  })

  const activeOptionKey = computed(() => mapStore.mapInfo?.state?.baseMapOption)

  function changeBaseMapByCode(baseMap: BaseMap) {
    activeCodeKey.value = baseMap

    Object.keys(baseMaps.value).forEach((k) => {
      baseMaps.value[k].checked = k === baseMap
    })

    changeBaseMapByType(activeTypeKey.value)
  }

  function changeBaseMapByType(type) {
    Object.keys(baseMaps.value[activeCodeKey.value!].types).forEach((k) => {
      baseMaps.value[activeCodeKey.value!].types[k].checked = k === type
    })

    changeBaseMap(`${activeCodeKey.value}_${type}`)
  }

  function changeBaseMap(baseMapKey: string) {
    uitMap.getView().setConstrainResolution(false)
    uitBaseMap?.changeBaseMap(baseMapKey)
    uitMap.getView().setConstrainResolution(true)

    mapStore.mapInfo?.updateState('baseMapKey', baseMapKey)
  }

  function changeBaseMapOption(option: BaseMapOption) {
    Object.keys(baseMapOptions.value).forEach((k) => {
      baseMapOptions.value[k].checked = k === option
    })

    const op = Object.values(baseMapOptions.value).find((option) => option.checked)

    const element = document.getElementById(mapWrap.value!.getConfig().baseMapId!)

    element!.className = element!.className
      .split(' ')
      .filter((cls) => !cls.startsWith('map-filter-'))
      .join(' ')

    element!.classList.add(op!.filter)

    mapStore.mapInfo?.updateState('baseMapOption', option)
  }

  onBeforeMount(async () => {
    mapWrap.value = await mapStore.getMapInstance()

    uitMap = mapWrap.value?.getUitMap()
    uitBaseMap = mapWrap.value?.getUitBaseMap()

    const [code, type] = uitBaseMap.getBaseMapKey().split('_')
    activeCodeKey.value = code as BaseMap
    activeTypeKey.value = type

    changeBaseMapOption(activeOptionKey.value)

    mapStore.controlManager?.addControl(toggle.id, {
      button: toggle,
      closeIgnores: [],
    })
  })

  defineExpose({})
</script>

<style scoped lang="scss">
  .mapController .dropdown.bgMap .form {
    max-height: 760px;
    min-height: 760px;
  }
</style>
