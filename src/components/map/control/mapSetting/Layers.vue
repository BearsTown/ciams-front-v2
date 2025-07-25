<template>
  <div class="form-group checkbox">
    <div class="form-label mapSet">레이어 설정</div>
    <div>
      <div class="form-row">
        <template v-if="tocCommonLayers">
          <template v-for="tcLayer in tocCommonLayers" :key="tcLayer">
            <GroupLayer :title="tcLayer.title" :layers="tcLayer.layers" />
          </template>
        </template>
        <template v-if="tocViewLayers">
          <template v-for="tvLayer in tocViewLayers" :key="tvLayer">
            <GroupLayer :title="tvLayer.title" :layers="tvLayer.layers" />
          </template>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { computed, onBeforeMount, ref } from 'vue'

  import GroupLayer from '@/components/map/control/mapSetting/GroupLayer.vue'

  import UitMap from '@uitgis/ol-ugis-test/uitMap'
  import UitBaseMap from '@uitgis/ol-ugis-test/baseMap/uitBaseMap'

  import { MapWrapper } from '@/js/mapWrapper'
  import { CommonLayerTypes, MapType, ViewLayerTypes } from '@/enums/mapEnum'

  import { useMapStore } from '@/stores/map/map'

  const props = withDefaults(
    defineProps<{
      mapType: MapType
    }>(),
    {},
  )

  let uitMap: UitMap
  let uitBaseMap: UitBaseMap
  const mapWrap = ref<MapWrapper>()
  const mapStore = useMapStore(props.mapType)

  const tocCommonLayers = computed(() => {
    return mapWrap.value?.getTocCommonLayerGroups()[
      CommonLayerTypes[props.mapType]![mapStore?.currentMapGroup]!
    ]
  })

  const tocViewLayers = computed(() => {
    return mapWrap.value?.getTocViewLayerGroups()[
      ViewLayerTypes[props.mapType]![mapStore?.currentMapGroup]!
    ]
  })

  onBeforeMount(async () => {
    mapWrap.value = await mapStore.getMapInstance()

    uitMap = mapWrap.value?.getUitMap()
    uitBaseMap = mapWrap.value?.getUitBaseMap()
  })
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
      border: 1px solid #7aaad1;
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
      accent-color: #7aaad1;
      margin: 0 3px;
      cursor: pointer;
      border: #7aaad1;
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
        color: #7aaad1;
      }
    }
  }

  .form-row span.layer-title {
    width: 90px;
  }
</style>
