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
      <template v-for="category in state.categories" :key="category.id">
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
  import { onActivated, onBeforeMount, ref } from 'vue'

  import { InsideCollapse } from '@/components/common/collapse'
  import DistList from '@/components/common/DistList/DistList.vue'

  import { Style } from 'ol/style'
  import { MapWrapper } from '@/js/mapWrapper'
  import { MapLayerGroupType, MapType, ViewLayerTypes } from '@/enums/mapEnum'

  import { GisCiamsDistDTO } from '@/api/app/gis/dist/model'

  import { useMapStore } from '@/stores/map/map'
  import { useBasicUrbanInstanceStore } from '@/stores/app/basic/urban/common'

  const distListRef = ref<InstanceType<typeof DistList>>()

  const basicUrbanCompanyStore = useBasicUrbanInstanceStore('Map-Urban-Comp')

  const mapType: MapType = 'Map-Urban-Comp'
  const mapLayerGroupType: MapLayerGroupType = 'Menu-1-2-3'
  const mapWrap = ref<MapWrapper>()
  const mapStore = useMapStore(mapType)
  const layerGroupName = ViewLayerTypes[mapType]![mapLayerGroupType]

  const state = basicUrbanCompanyStore.state

  async function handleSwitchChange(categoryId) {
    await basicUrbanCompanyStore.setActiveCategory(categoryId)
  }

  async function zoneItemSelect(item: GisCiamsDistDTO.Search.Row) {
    await basicUrbanCompanyStore.callSelectDist(item.distNo)
  }

  function clear() {
    basicUrbanCompanyStore.distVectorLayer.clear()
  }

  async function handleChildMounted() {
    mapWrap.value = await mapStore.getMapInstance()

    distListRef.value?.selectIndex()
  }

  onBeforeMount(async () => {
    await basicUrbanCompanyStore.init(2)
    await handleSwitchChange(basicUrbanCompanyStore.state.categories[0].id)
  })

  onActivated(() => {
    mapStore.currentMapGroup = 'Menu-1-2-3'

    basicUrbanCompanyStore.mapWrap.value?.setViewLayersVisible(layerGroupName!, true)
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
