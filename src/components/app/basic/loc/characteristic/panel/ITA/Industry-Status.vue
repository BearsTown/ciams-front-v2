<template>
  <PagePane :title="title">
    <template #sub>
      <Source :list="sources" />
    </template>

    <template #center>
      <div class="container">
        <div class="top customScroll">
          <div class="text-wrap">
            <div style="display: flex; margin-bottom: 5px">
              <div class="header-title" style="margin: 0">
                {{ type }}
              </div>
              <el-text size="default">: {{ desc[type] }}</el-text>
            </div>

            <el-divider border-style="dashed" style="margin: 5px 0" />

            <template v-for="desc in descriptions" :key="desc.id">
              <p v-if="desc.description">- {{ desc.description }}</p>
            </template>
          </div>
        </div>
        <div class="center">
          <div class="left">
            <div
              class="border-box-square"
              style="display: flex; flex-direction: column; flex: 1; overflow-y: hidden"
            >
              <div style="margin: 8px 0; font-size: 15px; font-weight: bold">
                {{ type }} 밀도분석
              </div>
              <el-image
                style="width: 100%; height: 100%"
                :src="imgSrcC"
                fit="scale-down"
                :preview-src-list="[imgSrcC]"
                :preview-teleported="true"
                :zoom-rate="1.2"
              />
            </div>

            <div
              class="border-box-square"
              style="height: 300px; display: flex; flex-direction: column"
            >
              <div style="margin: 8px 0; font-size: 15px; font-weight: bold">대표{{ type }}</div>
              <el-table
                :data="repData"
                size="small"
                style="height: 100%; z-index: 0"
                empty-text="데이터가 없습니다."
                :show-header="true"
                scrollbar-always-on
                border
                table-layout="auto"
              >
                <el-table-column label="코드" align="center" width="55px">
                  <template #default="{ row }"> {{ row?.tcode }}{{ row?.clsCode }}</template>
                </el-table-column>
                <el-table-column label="사업체명" prop="corpName" align="center" />
                <el-table-column label="위치" prop="location" align="center" />
                <el-table-column
                  label="종사자수"
                  prop="workerCnt"
                  align="right"
                  header-align="center"
                >
                  <template #default="{ row: { workerCnt } }">
                    {{ Number.isFinite(workerCnt) ? CommonUtil.comma(workerCnt) : '-' }}
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>

          <div class="right">
            <div
              style="
                display: flex;
                flex-direction: column;
                height: 100%;
                border: none;
                box-shadow: none;
              "
            >
              <el-table
                :data="statusData"
                size="small"
                style="height: 100%; z-index: 0"
                empty-text="데이터가 없습니다."
                :show-header="true"
                scrollbar-always-on
                border
              >
                <el-table-column label="업종" align="center" fixed>
                  <el-table-column label="구분" prop="category" align="center" width="120px" />
                  <el-table-column label="코드" align="center" width="55px">
                    <template #default="{ row }"> {{ row?.tcode }}{{ row?.clsCode }}</template>
                  </el-table-column>
                  <el-table-column label="산업내용" prop="insNm" align="center" min-width="230px" />
                </el-table-column>

                <el-table-column
                  prop="lqValue"
                  header-align="right"
                  align="right"
                  width="110px"
                  sortable
                >
                  <template #header>
                    <span style="text-align: center; display: inline-block"
                      >산업입지계수<br />(LQ)</span
                    >
                  </template>
                  <template #default="{ row: { lqValue } }">
                    {{ Number.isFinite(lqValue) ? lqValue?.toFixed(1) : '-' }}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="grValue"
                  header-align="right"
                  align="right"
                  width="110px"
                  sortable
                >
                  <template #header>
                    <span style="text-align: center; display: inline-block">
                      고용성장률<br />(Growth)
                    </span>
                  </template>
                  <template #default="{ row: { grValue } }">
                    {{ Number.isFinite(grValue) ? CommonUtil.comma(grValue?.toFixed(1)) : '-' }}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="rsValue"
                  header-align="right"
                  align="right"
                  width="110px"
                  sortable
                >
                  <template #header>
                    <span style="text-align: center; display: inline-block"
                      >지역할당효과<br />(RS)
                    </span></template
                  >
                  <template #default="{ row: { rsValue } }">
                    {{ Number.isFinite(rsValue) ? CommonUtil.comma(rsValue?.toFixed(1)) : '-' }}
                  </template>
                </el-table-column>
                <el-table-column prop="corpCnt" align="right" width="90px" sortable>
                  <template #header>
                    <span style="text-align: center; display: inline-block"
                      >사업체수
                    </span></template
                  >
                  <template #default="{ row: { corpCnt } }">
                    {{ Number.isFinite(corpCnt) ? CommonUtil.comma(corpCnt) : '-' }}
                  </template>
                </el-table-column>
                <el-table-column prop="workerCnt" align="right" width="90px" sortable>
                  <template #header>
                    <span style="text-align: center; display: inline-block"
                      >종사자수</span
                    ></template
                  >
                  <template #default="{ row: { workerCnt } }">
                    {{ Number.isFinite(workerCnt) ? CommonUtil.comma(workerCnt) : '-' }}
                  </template>
                </el-table-column>
              </el-table>

              <div class="result-pagination">
                <el-pagination
                  size="small"
                  :total="pageInfo.totalCount"
                  :page-size="pageInfo.pageSize"
                  :current-page="pageInfo.pageNo"
                  layout="prev, pager, next"
                  @current-change="handleCurrentChange"
                  style="display: flex; align-items: center; justify-content: center; padding: 5px"
                  class="customPagination"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </PagePane>
</template>

<script setup lang="ts">
  import { computed, onMounted, ref } from 'vue'

  import Source from '@/components/common/Source.vue'
  import PagePane from '@/components/common/PagePane.vue'

  import { pageObject } from '@/js/common'
  import CommonUtil from '@/utils/commonUtil'
  import { API_INFO_CIAMS } from '@/config/config'

  import { ItaDto } from '@/models/api/app/basic/loc/characteristic/ita'
  import { StatusDto } from '@/models/api/app/basic/loc/characteristic/status'
  import { CiamsBasicLocDescription } from '@/models/api/app/basic/loc/ciams-basic-loc-description'

  import { SourceGroupDTO } from '@/api/app/source/model'

  import {
    getIndustryStatus,
    getIndustryStatusTemp,
    getItaData,
  } from '@/api/app/basic/loc/characteristic'
  import { useBasicLocIndCharITAStore } from '@/stores/app/basic/loc/ind-char/ITA'

  const basicLocIndCharITAStore = useBasicLocIndCharITAStore()

  const pageObj = pageObject()
  const pageInfo = pageObj.pageInfo
  pageInfo.currentPageSize = 20

  const repData = ref<StatusDto.IndustryRep[]>([])
  const sources = ref<SourceGroupDTO.SourceDTO[]>([])
  const statusData = ref<ItaDto.Data.Search.Row[]>([])
  const descriptions = ref<CiamsBasicLocDescription[]>([])

  const currentTabComponent = computed(() => basicLocIndCharITAStore.selectedTabId)

  const props = withDefaults(
    defineProps<{
      type: '선도산업' | '신흥산업' | '쇠퇴산업' | '초기반산업'
    }>(),
    {},
  )

  const desc = {
    선도산업:
      '전국 대비 지역의 지역특화도가 높고, 종사자수가 증가하고 있으며, 전국대비 해당 지역의 경쟁력이 높은 산업',
    신흥산업:
      '전국 대비 지역의 지역특화도는 낮으나, 종사자수가 증가하고 있으며, 전국 대비 해당 지역의 경쟁력이 높은 산업',
    쇠퇴산업:
      '전국 대비 지역의 지역특화도가 낮고, 종사자수가 감소하고 있으며, 전국 대비 해당 지역의 경쟁력이 낮은 산업',
    초기반산업: '전국 대비 지역의 현재 특화업종을 식별하는 입지계수가 2.0 이상인 산업',
  }

  const title = computed(() => ['산업기반분석(ITA)', `${props.type} 현황`])

  const memos = ref<string[]>([])
  const imgSrc = ref<string>('')
  const imgSrcC = computed(() => `${prefixPath}${imgSrc.value}`)

  const prefixPath = `${API_INFO_CIAMS.PREFIX}/api/v1/file/image/`

  const top5lqValue = computed<number[]>(() =>
    [...statusData.value]
      .sort((a, b) => b.lqValue - a.lqValue)
      .slice(0, 5)
      .map((item) => item.lqValue),
  )

  async function search(pageNo: number, size: number) {
    const { data } = await getItaData({
      size,
      pageNo,
      type: props.type,
    })
    responseData(data)
  }

  function runSearch() {
    search(1, pageInfo.currentPageSize)
  }

  function responseData(data: ItaDto.Data.Search.Result) {
    statusData.value = data.list

    pageObj.setPageData(data.page)
  }

  function handleCurrentChange(pageNo: number) {
    search(pageNo, pageInfo.currentPageSize)
  }

  onMounted(async () => {
    const { data: rawStatusData } = await getIndustryStatus({
      type: props.type,
    })

    repData.value = rawStatusData.industryReps
    sources.value = rawStatusData.sources[0]?.sources
    descriptions.value = rawStatusData.descriptions

    const rawTempData = await getIndustryStatusTemp({
      type: props.type,
    })

    imgSrc.value = rawTempData.image

    runSearch()
  })
</script>

<style lang="scss"></style>

<style scoped lang="scss">
  .container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;

    .center {
      flex: 1;
      display: flex;
      flex-direction: row;
      //overflow-y: hidden;
      overflow: hidden;
      height: 100%;
      gap: 8px;

      .left {
        width: 400px;
        padding: 10px;
        background: #fff;
        border-radius: 8px;
        display: flex;
        flex-direction: column;
      }

      .right {
        flex: 1;
        padding: 10px;
        background: #fff;
        display: flex;
        flex-direction: column;
        //margin-left: 8px;
        border-radius: 8px;
        overflow: hidden;
      }

      .right-top {
      }

      .right-bottom {
      }
    }

    .top {
      height: 80px;
      margin-bottom: 8px;
      min-height: 100px;
      max-height: 200px;

      padding: 10px;
      background: #fff;
      border-radius: 8px;
    }

    .bottom {
      height: 80px;
      margin-top: 8px;
      min-height: 100px;
      max-height: 200px;

      padding: 10px;
      background: #fff;
      border-radius: 8px;
    }

    .customScroll {
      height: max-content;
      overflow-y: auto;
    }

    .text-wrap {
      color: #616161;
      font-size: 15px;
      font-weight: 400;
      line-height: 1.5;

      > p {
        padding-left: 0.5em;
        text-indent: -0.6em;
      }
    }
  }

  .border-box-square:first-child {
    margin: 0;
  }

  .header-title {
    margin: 5px 0;
    color: #212121;
    font-size: 15px;
    font-weight: 700;
    letter-spacing: -0.02em;
  }

  .customTable th,
  .customTable td {
    border-left: 1px solid #e0e0e0;
    border-right: 1px solid #e0e0e0;
  }

  :deep(th.el-table__cell) {
    background-color: var(--el-fill-color-light);
  }

  :deep(.el-table) .warning-row {
    --el-table-tr-bg-color: #e6b9b8;
  }

  :deep(.el-table) .success-row {
    --el-table-tr-bg-color: var(--el-color-success-light-9);
  }

  //:deep(.el-table__body) tr:hover > td {
  //  background-color: transparent !important;
  //}
</style>
