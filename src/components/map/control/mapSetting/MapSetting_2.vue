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
      <div class="form">
        <div class="form-group">
          <div class="form-row">
            <template v-for="layer in baseLayer" :key="layer.id">
              <label :for="layer.id" class="customRadio">
                <input
                  @change="
                    () => {
                      test(layer)
                    }
                  "
                  :checked="layer.checked"
                  :id="layer.id"
                  :name="layer.name"
                  type="radio"
                />
                <span class="customRadio-check"></span>
                <span class="customRadio-text">{{ layer.label }}</span>
              </label>
            </template>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">배경지도 스타일</label>
          <div>
            <div class="form-row style-list">
              <template v-for="(layer, index) in baseLayer" :key="mapType + layer.id + index">
                <template v-if="layer.checked">
                  <template v-for="item in layer.children.items" :key="mapType + item.id">
                    <div
                      style="width: 100%"
                      class="style-item"
                      :class="{ active: item.checked }"
                      @click="() => console.log(layer.id, item)"
                    >
                      <div class="img-wrap">
                        <img :src="item.src" :alt="item.alt" />
                      </div>
                      <span class="style-text">{{ item.label }}</span>
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
                v-for="(item, idx) in baseMapOptions"
                :key="item.id + idx"
                @click="() => {}"
                :class="{ active: item.checked }"
                class="customTab-item"
              >
                {{ item.label }}
              </li>
            </ul>
          </div>
        </div>
        <div class="form-group checkbox">
          <div class="form-label mapSet">레이어 설정</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { onBeforeMount, reactive, ref } from 'vue'

  import { ToggleButton } from '@/js/map/control/ToggleButton'
  import { BaseMapImg, BaseMapOption, MapType } from '@/enums/mapEnum'
  import { useGlobalStore } from '@/stores/app'
  import { MapWrapper } from '@/js/mapWrapper'
  import { useMapStore } from '@/stores/map/map'

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

  const defaultBaseLayer = {
    vworldLayer: {
      id: 'vworldLayer',
      checked: true,
      // type: 'radio',
      name: 'base-layer',
      label: 'v-world',
      children: {
        type: 'radio',
        name: 'layer-style',
        items: [
          {
            id: 'Base',
            src: BaseMapImg.VWORLD_BASE,
            alt: '브이월드 기본지도 이미지',
            label: '기본',
            checked: true,
          },
          {
            id: 'Satellite',
            src: BaseMapImg.VWORLD_SATELLITE,
            alt: '브이월드 위성지도 이미지',
            label: '위성',
            checked: false,
          },
          {
            id: 'white',
            src: BaseMapImg.VWROLD_GARY,
            alt: '브이월드 회색지도 이미지',
            label: '회색',
            checked: false,
          },
        ],
      },
    },
    kakaoLayer: {
      id: 'kakaoLayer',
      checked: false,
      type: 'radio',
      name: 'base-layer',
      label: 'kakao',
      children: {
        type: 'radio',
        name: 'layer-style',
        items: [
          {
            id: 'kakaoBase',
            src: BaseMapImg.KAKAO_BASE,
            alt: '카카오 기본지도 이미지',
            label: '기본',
            layerType: 'base',
            checked: true,
          },
          {
            id: 'kakaoSatellite',
            src: BaseMapImg.KAKAO_SATELLITE,
            alt: '카카오 위성지도 이미지',
            label: '위성',
            layerType: 'satellite',
            checked: false,
          },
        ],
      },
    },
  }
  const baseLayer = ref(defaultBaseLayer)

  type BaseMapOptions = {
    id: BaseMapOption
    label: string
    filter: string
    checked: boolean
  }

  const baseMapOptions = ref<BaseMapOptions[]>([
    {
      id: 'NORMAL',
      label: '기본',
      filter: 'map-filter-normal',
      checked: true,
    },
    {
      id: 'GRAY',
      label: '회색',
      filter: 'map-filter-gray',
      checked: false,
    },
    {
      id: 'LIGHT',
      label: '밝게',
      filter: 'map-filter-light',
      checked: false,
    },
    {
      id: 'DARK',
      label: '어둡게',
      filter: 'map-filter-dark',
      checked: false,
    },
  ])

  // const opacitySetting = ref({
  //   name: 'layer-opacity',
  //   type: 'radio',
  //   items: [
  //     {
  //       id: 'opacity-base-layer',
  //       label: '기본',
  //       filter: 'none',
  //       checked: true,
  //     },
  //     {
  //       id: 'opacity-gray-layer',
  //       label: '회색',
  //       filter: 'grayscale(1)',
  //       checked: false,
  //     },
  //     {
  //       id: 'opacity-bright-layer',
  //       label: '밝게',
  //       filter: 'brightness(1.1)',
  //       checked: false,
  //     },
  //     {
  //       id: 'opacity-dark-layer',
  //       label: '어둡게',
  //       filter: 'brightness(0.5)',
  //       checked: false,
  //     },
  //   ],
  // })

  const globalStore = useGlobalStore()

  const mapWrap = ref<MapWrapper>()
  const mapStore = useMapStore(props.mapType)

  onBeforeMount(async () => {
    mapWrap.value = await mapStore.getMapInstance()

    mapStore.controlManager?.addControl(toggle.id, {
      button: toggle,
      closeIgnores: [],
    })
  })

  defineExpose({})
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
