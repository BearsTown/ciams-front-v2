<template>
  <div class="form-group">
    <div class="form-row">
      <template v-for="(base, key) in baseMaps" :key="key">
        <label :for="key" class="customRadio">
          <input
            type="radio"
            name="base-map-code"
            :id="key"
            :checked="base.checked"
            @change="changeBaseMapByCode(key)"
          />
          <span class="customRadio-check"></span>
          <span class="customRadio-text">{{ base.label }}</span>
        </label>
      </template>
    </div>
  </div>
  <div class="form-group">
    <label class="form-label">배경지도 스타일</label>
    <div>
      <div class="form-row style-list">
        <template v-for="(base, bKey) in baseMaps" :key="bKey">
          <template v-if="base.checked">
            <template v-for="(type, tkey) in base.types" :key="tkey">
              <div
                style="width: 100%"
                class="style-item"
                :class="{ active: type.checked }"
                @click="changeBaseMapByType(tkey)"
              >
                <div class="img-wrap">
                  <img :src="type.src" :alt="type.alt" />
                </div>
                <span class="style-text">{{ type.label }}</span>
              </div>
            </template>
          </template>
        </template>
      </div>
    </div>
  </div>
  <div class="form-group">
    <label class="form-label">배경지도 옵션</label>
    <div>
      <ul class="customTab max">
        <li
          v-for="(item, key) in baseMapOptions"
          :key="key"
          @click="changeBaseMapOption(key)"
          class="customTab-item"
          :class="{ active: key === activeOptionKey }"
        >
          {{ item.label }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { computed, onBeforeMount, ref } from 'vue'

  import UitMap from '@uitgis/ol-ugis-test/uitMap'
  import UitBaseMap from '@uitgis/ol-ugis-test/baseMap/uitBaseMap'

  import { MapWrapper } from '@/js/mapWrapper'
  import { BaseMap, BaseMapImg, BaseMapOption, MapType } from '@/enums/mapEnum'

  import { useMapStore } from '@/stores/map/map'

  const props = withDefaults(
    defineProps<{
      mapType: MapType
    }>(),
    {},
  )

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
  })
</script>

<style scoped lang="scss">
  .map-filter-normal {
    filter: none;
  }
  .map-filter-gray {
    filter: grayscale(1);
  }
  .map-filter-light {
    filter: brightness(1.2);
  }
  .map-filter-dark {
    filter: brightness(0.5);
  }

  .mapController .dropdown.bgMap .form {
    max-height: 760px;
    min-height: 760px;
  }
</style>
