<template>
  <div class="" style="display: flex; flex-direction: column; height: 100%">
    <div style="flex: 1; overflow-y: hidden">
      <ZoneList :page-size="50" @item-select="zoneItemSelect" @clear="clear" />
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
  import { onActivated, onBeforeMount, onMounted } from 'vue'

  import { InsideCollapse } from '@/components/common/collapse'

  import { useMenu1Sub2store } from '@/stores/app/menu-1/sub-2'
  import { useMenu1_2_3Store } from '@/stores/app/menu-1/sub-2/tab-c'

  // import { useManagementStore } from '@/stores/app/zoneEstablish/management'
  import { useMapStore } from '@/stores/map/map'
  import { MapLayerGroupType, MapType, ViewLayerTypes } from '@/enums/mapEnum'
  import { useGlobalStore } from '@/stores/app'
  import ZoneList from '@/components/common/DistList/DistList.vue'
  import { GisCiamsDistDTO } from '@/api/app/gis/dist/model'
  import { Style } from 'ol/style'

  const globalStore = useGlobalStore()
  const menu1sub2store = useMenu1Sub2store()
  const menu1_2_3Store = useMenu1_2_3Store()

  // const mapType = MapType.MAP_1
  const mapType: MapType = 'Map-1-2-3'
  const mapLayerGroupType: MapLayerGroupType = 'Menu-1-2-3'
  // const mapWrap = ref<MapWrapper>()
  const mapStore = useMapStore(mapType)
  const layerGroupName = ViewLayerTypes[mapType]![mapLayerGroupType]

  // const { state } = storeToRefs(menu1_2_3Store)
  const state = menu1_2_3Store.state

  function load() {}

  // 카레고리 변경
  async function handleSwitchChange(categoryId) {
    await menu1_2_3Store.setActiveCategory(categoryId)
  }

  async function zoneItemSelect(item: GisCiamsDistDTO.Search.Row) {
    await menu1_2_3Store.callSelectDist(item.distNo)
    // await menu1_2_3Store.loadDistFeatures(item.distNo)
  }

  function clear() {
    // overview.value = null
    menu1_2_3Store.distVectorLayer.clear()
  }

  onMounted(async () => {})

  onBeforeMount(async () => {
    // mapWrap.value = await mapStore.getMapInstance()
    // mapWrap.value = await mapCacheStore.getMapObject(mapType).getMapInstance()

    console.log(state.categories)

    await menu1_2_3Store.init(2)

    console.log(state.categories)
    load()

    // menu1_2_3Store.state.categories[0].active.on()
    await handleSwitchChange(menu1_2_3Store.state.categories[0].id)
  })

  onActivated(() => {
    mapStore.currentMapGroup = 'Menu-1-2-3'
    //
    // mapWrap.value?.setViewLayersVisible(layerGroupName!, true)
    menu1_2_3Store.mapWrap.value?.setViewLayersVisible(layerGroupName!, true)
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
