<template>
  <div class="container customScroll">
    <div class="customCard">
      <InsideCollapse title="건물목록" :is-open="true">
        <template v-if="kgeoBuildInfos && kgeoBuildInfos.length > 0" #content>
          <el-table
            ref="tableRef"
            :data="kgeoBuildInfos"
            size="small"
            style="height: 100%; z-index: 0"
            empty-text="데이터가 없습니다."
            :show-header="true"
            scrollbar-always-on
            max-height="300"
            border
            :highlight-current-row="true"
            @current-change="handleBuildListSelectionChange"
          >
            <el-table-column label="대장종류" align="center">
              <template #default="scope">
                {{ ldgrNm(scope.row) }}
              </template>
            </el-table-column>
            <el-table-column label="건물명" prop="bldgNm" align="center" />
            <el-table-column label="동명" prop="dngNm" align="center" />
            <el-table-column label="주용도" prop="mnUsgCdNm" align="center" />
            <el-table-column label="연면적(㎡)" prop="gfa" align="center" />
            <el-table-column label="사용승인일" prop="useAprvYmd" align="center" />
          </el-table>
        </template>
      </InsideCollapse>
    </div>

    <div class="customCard">
      <InsideCollapse title="건축물정보" :is-open="true">
        <template #content>
          <InfoDescription
            :labelList="
              currentKgeoBuildInfo?.ldgrKindCd === '1'
                ? kGeoBuildInfoLabels_1
                : kGeoBuildInfoLabels_2
            "
            :data="currentKgeoBuildInfo"
            :label-size="24"
            :colSize="2"
          />
        </template>
      </InsideCollapse>
    </div>

    <div
      class="customCard"
      v-if="currentKgeoBuildInfo?.ldgrKindCd === '2' || currentKgeoBuildInfo?.ldgrKindCd === '3'"
    >
      <InsideCollapse title="층별현황" :is-open="true">
        <template v-if="currentKgeoBuildInfo?.floorInfo?.length > 0" #content>
          <el-table
            ref="tableRefFloor"
            :data="currentKgeoBuildInfo.floorInfo"
            size="small"
            style="height: 100%; z-index: 0"
            empty-text="데이터가 없습니다."
            :show-header="true"
            scrollbar-always-on
            max-height="300"
            border
          >
            <el-table-column label="구분" prop="flrSeCdNm" align="center" />
            <el-table-column label="층별" prop="flrNoNm" align="center" />
            <el-table-column label="주부속구분" prop="manxSeCdNm" align="center" />
            <el-table-column label="구조" prop="strctCdNm" align="center" />
            <el-table-column label="용도" prop="mnUsgCdNm" align="center" />
            <el-table-column label="면적(㎡)" prop="area" align="center" />
          </el-table>
        </template>
      </InsideCollapse>
    </div>

    <div
      class="customCard"
      v-if="currentKgeoBuildInfo?.ldgrKindCd === '2' || currentKgeoBuildInfo?.ldgrKindCd === '3'"
    >
      <InsideCollapse title="호별현황" :is-open="true">
        <template #sub>
          <div style="display: flex; justify-content: end">
            <button type="button" class="btn-basic" @click.prevent.stop="getSV0000000153()">
              조회
            </button>
          </div>
        </template>
        <template #content>
          <el-table
            :data="bdhList"
            size="small"
            style="height: 100%; z-index: 0"
            empty-text="데이터가 없습니다."
            :show-header="true"
            scrollbar-always-on
            max-height="300"
            border
          >
            <el-table-column label="동명" prop="dngNm" align="center" />
            <el-table-column label="호명" prop="hoNm" align="center" />
          </el-table>
        </template>
      </InsideCollapse>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { nextTick, onActivated, onDeactivated, ref, watch } from 'vue'
  import { storeToRefs } from 'pinia'

  import { InsideCollapse } from '@/components/common/collapse'
  import { MapType } from '@/enums/mapEnum' // import Kgeo from '@/api/app/kgeo/model'
  import Kgeo from '@/models/api/app/kgeo'
  import { getKgeoBuildInfo, getKgeoServiceData } from '@/api/app/kgeo'

  import { useGlobalStore } from '@/stores/app'
  import { useMapStore } from '@/stores/map/map'
  import { useOpenApiStore } from '@/stores/app/openapi'
  import InfoDescription from '@/components/common/locationInfo/InfoDescription.vue'
  import { kGeoBuildInfoLabels_1, kGeoBuildInfoLabels_2 } from '@/js/KgeoTableItems'
  import { SV0000000153 } from '@/models/api/app/kgeo/SV0000000153'
  import Map from '@/js/map/map'

  interface KeyValue {
    KEY: string
    VALUE: string
  }

  const props = withDefaults(
    defineProps<{
      mapType: MapType
    }>(),
    {},
  )

  const loaded = ref<boolean>(false)
  const isActive = ref<boolean>(false)

  const mapStore = useMapStore(props.mapType)
  const globalStore = useGlobalStore()
  const openApiStore = useOpenApiStore()

  const { locInfo } = storeToRefs(mapStore)

  const tableRef = ref()
  const kgeoBuildInfos = ref<Kgeo.BuildInfo[]>()
  const currentKgeoBuildInfo = ref<Kgeo.BuildInfo>()
  const bdhList = ref<SV0000000153.BdhList[]>()

  interface BuildRow {
    kindNm: string
    bldgNm: string
    dngNm: string
    mnUsgCdNm: string
    gfa: number
    useAprvYmd: string
  }

  const kgeoBuildInfosss = ref<any[]>()

  // const { kgeoBuildInfo: kGeoBuildInfo } = storeToRefs(openApiStore)

  // const ladUsePlanLawB = ref([] as KeyValue[])
  // const SV0000000167 = ref<Kgeo.SV0000000167.Result>()

  // const ldgrKindCd = ref<string>() // 대장종류코드

  // const builds = ref<BuildRow[]>([])

  const ldgrNm = function (row: Kgeo.BuildInfo) {
    let name = ''
    switch (row.ldgrKindCd) {
      case '1': {
        name = row.buldKndNm!
        break
      }
      case '2':
      case '3': {
        name = `${row.buldKndNm}(${row.manxSeCdNm})`
        break
      }
    }
    return name
  }

  async function loadData() {
    Map.getBuildVworld('KGEO', props.mapType)

    const { pnu } = mapStore.locInfo
    const { data } = await getKgeoBuildInfo(pnu + '')

    kgeoBuildInfos.value = data
    loaded.value = true

    await nextTick()
    currentKgeoBuildInfo.value = kgeoBuildInfos.value[0]
    tableRef.value.setCurrentRow(currentKgeoBuildInfo.value)

    globalStore.loadingOff()
  }

  function handleBuildListSelectionChange(currentRow: Kgeo.BuildInfo) {
    currentKgeoBuildInfo.value = currentRow
    bdhList.value = []
  }

  async function getSV0000000153() {
    globalStore.loadingOn()

    const { pnu } = mapStore.locInfo
    const { data } = await getKgeoServiceData('SV0000000153', {
      pnu,
      bdrgSn: currentKgeoBuildInfo.value?.bdrgSn,
    })

    if (data.code === 200) {
      data?.result?.bdhList
      bdhList.value = data?.result?.bdhList
    } else {
      bdhList.value = []
    }

    globalStore.loadingOff()
  }

  onActivated(() => {
    isActive.value = true

    if (!loaded.value && locInfo.value?.pnu) {
      loadData()
    }
  })

  onDeactivated(() => {
    isActive.value = false
  })

  watch(locInfo, () => {
    // openApiStore.setKgeoInfoItem({})
    // ladUsePlanLawB.value = [] as KeyValue[]
    // SV0000000167.value = {} as Kgeo.SV0000000167.Result

    kgeoBuildInfos.value = []
    loaded.value = false
    if (isActive.value) {
      loadData()
    }
  })

  // watch(detailItem, () => {
  //   if (!CommonUtil.isEmpty(detailItem)) {
  //     ladUsePlanLawB.value = getLawStr(detailItem.value.SV0000000167?.base.ladUsePlanLawB)
  //   }
  // })
</script>

<style scoped lang="scss">
  .border-box-round {
    border: none;
  }

  .customTable tbody th,
  .customTable tbody td {
    border-left: 1px solid #e0e0e0;
    border-right: 1px solid #e0e0e0;
  }

  .center td,
  .center th {
    text-align: center !important;
    vertical-align: middle !important;
  }

  .btn-basic {
    width: auto;
    padding: 0 16px;
    height: 24px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 500;
    letter-spacing: -0.24px;
    background: #44619b;
    color: #fff;
    margin-right: 5px;

    &:not(:disabled):hover {
      opacity: 0.8;
    }
  }

  .legendArea {
    display: flex;
    flex-wrap: wrap;

    .legend {
      flex: 50%;
      display: flex;
      align-items: center;

      .box {
        display: flex;
        width: 16px;
        height: 16px;
        margin-right: 7px;
        box-sizing: border-box;

        &.default {
          border: 1.5px solid #bebe0b;
        }

        img {
          width: 100%;
          height: 100%;
        }
      }

      .txt {
        font-size: 16px;
        color: #666;
      }
    }
  }

  :deep(.el-table) .current-row {
    --el-table-current-row-bg-color: rgb(236, 245, 255);
  }

  :deep(.el-table) thead th {
    background: var(--el-fill-color-light);
  }
</style>
