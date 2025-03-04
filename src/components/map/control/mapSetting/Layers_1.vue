<template>
  <div class="form-group checkbox">
    <div class="form-label mapSet">레이어 설정</div>
    <div>
      <div class="form-row">
        <template v-if="commonLayers">
          <template v-for="cLayer in commonLayers" :key="cLayer">
            <fieldset class="fieldSet">
              <legend style="display: flex">
                <span class="layer-title">&nbsp; {{ cLayer.title }}</span>
                <div class="customTooltip" v-if="true">
                  <label>
                    <input
                      step="1"
                      :value="getOpacity(cLayer.layers)"
                      @input.stop="(e) => setOpacity(mLayer, e.target)"
                      type="range"
                    />
                  </label>
                  <div class="span-opacity-contianer">
                    <span class="opacity">{{ getOpacity(mLayer) }}%</span>
                  </div>
                </div>
              </legend>
              <label :for="mLayer.getKey()" class="customCheckbox">
                <input
                  :id="mLayer.getKey()"
                  @click="mLayer.setUserVisible(!mLayer.userVisible)"
                  :checked="mLayer.userVisible"
                  type="checkbox"
                />
                <span class="customCheckbox-text">{{ mLayer.title }}</span>
              </label>
            </fieldset>
          </template>
        </template>

        <template v-if="viewLayers">
          <template v-for="mLayer in viewLayers" :key="mLayer.getKey()">
            <template v-if="mLayer.state.useLayerSetting">
              <fieldset class="fieldSet">
                <legend style="display: flex">
                  <span class="layer-title">&nbsp; {{ mLayer.title }}</span>
                  <div class="customTooltip" v-if="true">
                    <label>
                      <input
                        step="1"
                        :value="getOpacity(mLayer)"
                        @input.stop="(e) => setOpacity(mLayer, e.target)"
                        type="range"
                      />
                    </label>
                    <div class="span-opacity-contianer">
                      <span class="opacity">{{ getOpacity(mLayer) }}%</span>
                    </div>
                  </div>
                </legend>
                <label :for="mLayer.getKey()" class="customCheckbox">
                  <input
                    :id="mLayer.getKey()"
                    @click="mLayer.setUserVisible(!mLayer.userVisible)"
                    :checked="mLayer.userVisible"
                    type="checkbox"
                  />
                  <span class="customCheckbox-text">{{ mLayer.title }}</span>
                </label>
              </fieldset>
            </template>
          </template>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { CommonLayerTypes, MapType, ViewLayerTypes } from '@/enums/mapEnum'
  import { computed, onBeforeMount, ref } from 'vue'
  import { useGlobalStore } from '@/stores/app'
  import UitMap from '@uitgis/ol-ugis-test/uitMap'
  import UitBaseMap from '@uitgis/ol-ugis-test/baseMap/uitBaseMap'
  import { MapWrapper } from '@/js/mapWrapper'
  import { useMapStore } from '@/stores/map/map'
  import { MapLayer } from '@/js/layer'

  const props = withDefaults(
    defineProps<{
      mapType: MapType
    }>(),
    {},
  )

  const globalStore = useGlobalStore()

  let uitMap: UitMap
  let uitBaseMap: UitBaseMap
  const mapWrap = ref<MapWrapper>()
  const mapStore = useMapStore(props.mapType)

  const commonLayers = computed(() => {
    return mapWrap.value?.getTocLayerGroups()
  })

  const viewLayers = computed(() => {
    return mapWrap.value?.getViewLayers()[ViewLayerTypes[props.mapType][mapStore?.currentMapGroup]!]
  })

  function getOpacity(mapLayer: MapLayer) {
    return Math.round(mapLayer.getLayer().getLayer()!.getOpacity() * 100)
  }

  function setOpacity(mapLayer: MapLayer, el: HTMLInputElement) {
    mapLayer
      .getLayer()
      .getLayer()
      ?.setOpacity(Number(el.value) / 100)
  }

  onBeforeMount(async () => {
    mapWrap.value = await mapStore.getMapInstance()

    uitMap = mapWrap.value?.getUitMap()
    uitBaseMap = mapWrap.value?.getUitBaseMap()
  })

  defineExpose({})
</script>

<style scoped lang="scss">
  .mapController .dropdown.bgMap .form-group.checkbox .form-row {
    margin: 0;
  }

  .form-row {
    fieldset {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      overflow-wrap: break-word;
      border: 1px solid #52b597;
      border-radius: 3px;
      padding: 0px 3px;
      margin-bottom: 10px;
    }
    fieldset:last-child {
      margin-bottom: 0px;
    }
    .customTooltip {
      display: flex;
    }
    span.layer-title {
      width: 60px;
      line-height: 20px;
    }
    .span-opacity-contianer {
      display: flex;
      align-items: center;
    }
    span.opacity {
      font-size: 10px;
    }

    input[type='range'] {
      appearance: none;
      background: linear-gradient(to right, #f4f4f4 0%, #747474 100%);
      accent-color: #52b597;
      margin: 0 3px;
      cursor: pointer;
      border: #52b597;
      border-style: solid;
      border-width: 1px;
      border-radius: 10px;
      height: 15px;
    }
    .customTooltip-box {
      width: 260px;
    }
    .btn-tooltip {
      &.active {
        color: #52b597;
      }
    }
  }

  .form-row span.layer-title {
    width: 90px;
  }
</style>
