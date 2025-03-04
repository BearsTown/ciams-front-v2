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
        <button @click="" type="button" class="btn-close">
          <SvgIcon name="close" size="20" style="flex: 1" />
        </button>
      </div>
      <div class="form customScroll" style="max-height: 760px; min-height: 760px">
        <div class="form-group">
          <div>
            <div class="form-row">
              <template v-for="layer in baseLayer" :key="mapType + layer.id">
                <label :for="mapType + layer.id" class="customRadio">
                  <input
                    @change="
                      () => {
                        test(layer)
                      }
                    "
                    :checked="layer.checked"
                    :id="mapType + layer.id"
                    :name="mapType + layer.name"
                    type="radio"
                  />
                  <span class="customRadio-check"></span>
                  <span class="customRadio-text">{{ layer.label }}</span>
                </label>
              </template>
            </div>
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
                v-for="(oSetting, idx) in opacitySetting.items"
                :key="mapType + oSetting.id + idx"
                @click="() => console.log(oSetting.filter, oSetting.id)"
                :class="{ active: oSetting.checked }"
                class="customTab-item"
              >
                {{ oSetting.label }}
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
  import { BaseMapImg, MapType } from '@/enums/mapEnum'
  import { useGlobalStore } from '@/stores/app'
  import { MapWrapper } from '@/js/mapWrapper'
  import { useMapStore } from '@/stores/map/map'
  import { MapObject } from '@/hooks/useMapWrapper'
  import { useMapCacheStore } from '@/stores/map/mapCache'

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
    if (value.state) {
      // controlManager.value?.closeAll('map-setting')
    }
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
  const opacitySetting = ref({
    name: 'layer-opacity',
    type: 'radio',
    items: [
      {
        id: 'opacity-base-layer',
        label: '기본',
        filter: 'none',
        checked: true,
      },
      {
        id: 'opacity-gray-layer',
        label: '회색',
        filter: 'grayscale(1)',
        checked: false,
      },
      {
        id: 'opacity-bright-layer',
        label: '밝게',
        filter: 'brightness(1.1)',
        checked: false,
      },
      {
        id: 'opacity-dark-layer',
        label: '어둡게',
        filter: 'brightness(0.5)',
        checked: false,
      },
    ],
  })

  // const controlManager = ref<ControlManager>()

  const globalStore = useGlobalStore()

  let mapObject: MapObject
  const mapWrap = ref<MapWrapper>()
  const mapStore = useMapStore(props.mapType)
  // const mapCacheStore = useMapCacheStore(props.mapType)

  async function init(mw: MapWrapper) {
    mapWrap.value = mw

    // uitMap.value = mapWrap.value?.getUitMap()
    // controlManager.value = globalStore.getControlManager(props.mapType)

    // mapObject = mapCacheStore.getMapObject(props.mapType)

    mapStore.controlManager?.addControl(toggle.id, {
      button: toggle,
      closeIgnores: [],
    })
  }

  onBeforeMount(async () => {
    // mapWrap.value = await globalStore.getMapInstance(props.mapType)
    // uitMap.value = mapWrap.value?.getUitMap()
    // debugger
    // controlManager.value = globalStore.getControlManager(props.mapType)
    //
    // controlManager.value?.addControl('map-setting', {
    //   button: toggle,
    //   closeIgnores: ['mini-map'],
    // })
  })

  defineExpose({
    init,
  })
</script>

<style lang="scss"></style>
