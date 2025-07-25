<template>
  <div class="" style="display: flex; flex-direction: column; height: 100%">
    <div style="flex: 1; overflow-y: hidden">
      <DistList
        :page-size="50"
        ref="distListRef"
        @item-select="zoneItemSelect"
        @clear="clear"
        @on-mounted="handleChildMounted"
      />
    </div>

    <el-divider border-style="dashed" style="margin: 10px 0" />

    <div class="customScroll" style="flex: 1; overflow-y: auto">
      <template v-for="(category, idx) in state.categories" :key="category.id">
        <InsideCollapse
          :title="category.name"
          :is-open="category.active.status"
          style="margin: 0 0 10px"
        >
          <template #sub>
            <div style="display: flex">
              <div style="flex: 1"></div>
              <el-switch
                size="small"
                v-model="category.active.status"
                @change="handleSwitchChange(category.id)"
                @click.prevent.stop
              />
            </div>
          </template>
        </InsideCollapse>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onActivated, onBeforeMount, onMounted, reactive, ref } from 'vue'

  import { InsideCollapse } from '@/components/common/collapse'
  import DistList from '@/components/common/DistList/DistList.vue'

  import { Style } from 'ol/style'

  import { MapLayer } from '@/js/layer'
  import { MapWrapper } from '@/js/mapWrapper'
  import { MapLayerGroupType, MapType, ViewLayerTypes } from '@/enums/mapEnum'

  import { GisCiamsDistDTO } from '@/api/app/gis/dist/model'

  import { useMapStore } from '@/stores/map/map'
  import { useBasicUrbanDistrictStore } from '@/stores/app/basic/urban/district'

  const distListRef = ref<InstanceType<typeof DistList>>()

  const basicUrbanDistrictStore = useBasicUrbanDistrictStore()

  const mapType: MapType = 'Map-Urban-Dist'
  const mapLayerGroupType: MapLayerGroupType = 'Menu-1-2-2'
  const mapWrap = ref<MapWrapper>()
  const mapStore = useMapStore(mapType)
  const layerGroupName = ViewLayerTypes[mapType]![mapLayerGroupType]

  const state = basicUrbanDistrictStore.state

  const mapLayers = reactive<MapLayer[]>([])

  async function handleSwitchChange(categoryId) {
    await basicUrbanDistrictStore.setActiveCategory(categoryId)
  }

  async function zoneItemSelect(item: GisCiamsDistDTO.Search.Row) {
    await basicUrbanDistrictStore.callSelectDist(item.distNo)
  }

  function clear() {
    basicUrbanDistrictStore.distVectorLayer.clear()
  }

  async function handleChildMounted() {
    mapWrap.value = await mapStore.getMapInstance()

    distListRef.value?.selectIndex()
  }

  onMounted(async () => {})

  onBeforeMount(async () => {
    await basicUrbanDistrictStore.init(1)
    await handleSwitchChange(basicUrbanDistrictStore.state.categories[0].id)
  })

  onActivated(() => {
    mapStore.currentMapGroup = 'Menu-1-2-2'

    mapWrap.value?.setViewLayersVisible(layerGroupName!, true)
  })
</script>

<style scoped lang="scss">
  .border-box-round {
    background: #fff;
    border-radius: 8px;
  }

  :deep(.inside-collapse) {
    > div {
      .title {
        font-size: 13px;
        font-weight: normal;
      }
    }
  }
</style>
