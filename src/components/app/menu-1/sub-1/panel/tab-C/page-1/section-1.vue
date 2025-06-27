<template>
  <PagePane :title="['산업기반분석(ITA)']">
    <template #sub>
      <Source :list="sources" />
    </template>

    <template #center>
      <div class="container">
        <div class="top customScroll">
          <div class="text-wrap">
            - 지역 내 경제적 파급효과가 큰 선도산업 중 특히 LQ분석 지수가 높은 초기반산업은 화학섬유
            제조업, 철도장비 제조업, 전구 및 조명장치 제조업, 합성고무 및 플라스틱 물질 제조업으로
            나타났으며 <br />
            - 앞으로 김천시 지역경제의 중추적 역할을 할 것으로 예상되는 신흥산업에는 특수 목적용
            기계 제조업, 자동차 차체 및 트레일러 제조업, 구조용 금속제품, 탱크 및 증기발생기 제조업
            등으로 나타남
          </div>
        </div>
        <div class="center">
          <div class="left">
            <div
              style="
                display: flex;
                flex-direction: column;
                height: 100%;
                border: none;
                box-shadow: none;
              "
            >
              <div class="border-box-square" style="">
                <div style="margin: 8px 0">
                  <span style="font-weight: bold">산업기반분석(ITA) 분석</span>
                  <span style="font-size: 12px; color: #616161">※지침 제8조 적용</span>
                </div>
                <span style="font-size: 12px; color: #616161"
                  >입지계수분석, 고용성장률, 지역할당효과를 통하여 산업의 특성을 식별</span
                >
                <table style="margin: 8px 0" class="customTable">
                  <colgroup>
                    <col style="width: 50%" />
                    <col style="width: 50%" />
                  </colgroup>
                  <tbody>
                    <tr>
                      <td style="text-align: center; vertical-align: middle">산업입지계수(LQ)</td>
                      <td style="text-align: center; vertical-align: middle">
                        LQ &gt; 1 또는 LQ &lt; 1
                      </td>
                    </tr>
                    <tr>
                      <td style="text-align: center; vertical-align: middle">고용성장률(Growth)</td>
                      <td style="text-align: center; vertical-align: middle">
                        Growth &lt; 0 또는 Growth &gt; 0
                      </td>
                    </tr>
                    <tr>
                      <td style="text-align: center; vertical-align: middle">지역할당효과(RS)</td>
                      <td style="text-align: center; vertical-align: middle">
                        RS &lt; 0 또는 RS &gt; 0
                      </td>
                    </tr>
                  </tbody>
                </table>

                <!--                <el-divider border-style="dashed" style="margin: 10px 0" />-->

                <div style="font-size: 12px; color: #616161; margin-top: 15px; font-weight: bold">
                  &lt;ITA분석결과에 따른 산업분류&gt;
                </div>
                <table style="margin: 8px 0" class="customTable">
                  <colgroup>
                    <col style="width: 25%" />
                    <col style="width: 25%" />
                    <col style="width: 25%" />
                    <col style="width: 25%" />
                  </colgroup>
                  <thead>
                    <tr>
                      <th scope="col" style="text-align: center">LQ</th>
                      <th scope="col" style="text-align: center">Growth</th>
                      <th scope="col" style="text-align: center">RS</th>
                      <th scope="col" style="text-align: center">분석결과</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style="background-color: #e6b9b8">
                      <td style="text-align: center; vertical-align: middle" rowspan="4">
                        LQ &gt; 1
                      </td>
                      <td style="text-align: center; vertical-align: middle" rowspan="2">
                        Growth &gt; 0
                      </td>
                      <td style="text-align: center; vertical-align: middle">RS &gt; 0</td>
                      <td style="text-align: center; vertical-align: middle">선도산업</td>
                    </tr>
                    <tr>
                      <td style="text-align: center; vertical-align: middle">RS &lt; 0</td>
                      <td style="text-align: center; vertical-align: middle">특화성장산업</td>
                    </tr>
                    <tr>
                      <td style="text-align: center; vertical-align: middle" rowspan="2">
                        Growth &lt; 0
                      </td>
                      <td style="text-align: center; vertical-align: middle">RS &gt; 0</td>
                      <td style="text-align: center; vertical-align: middle">특화쇠퇴산업</td>
                    </tr>
                    <tr>
                      <td style="text-align: center; vertical-align: middle">RS &lt; 0</td>
                      <td style="text-align: center; vertical-align: middle">쇠퇴산업</td>
                    </tr>

                    <tr style="background-color: #dbe6c3">
                      <td style="text-align: center; vertical-align: middle" rowspan="4">
                        LQ &lt; 1
                      </td>
                      <td style="text-align: center; vertical-align: middle" rowspan="2">
                        Growth &gt; 0
                      </td>
                      <td style="text-align: center; vertical-align: middle">RS &gt; 0</td>
                      <td style="text-align: center; vertical-align: middle">신흥산업</td>
                    </tr>
                    <tr>
                      <td style="text-align: center; vertical-align: middle">RS &lt; 0</td>
                      <td style="text-align: center; vertical-align: middle">비특화성장산업</td>
                    </tr>
                    <tr>
                      <td style="text-align: center; vertical-align: middle" rowspan="2">
                        Growth &lt; 0
                      </td>
                      <td style="text-align: center; vertical-align: middle">RS &gt; 0</td>
                      <td style="text-align: center; vertical-align: middle" rowspan="2">
                        쇠퇴산업
                      </td>
                    </tr>
                    <tr>
                      <td style="text-align: center; vertical-align: middle">RS &lt; 0</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div class="border-box-square" style="">
                <div style="margin: 8px 0">
                  <span style="font-weight: bold">입지계수(LQ) 분석</span>
                  <span style="font-size: 12px; color: #616161">※지침 제8조 적용</span>
                </div>
                <span style="font-size: 12px; color: #616161"
                  >산출한 입지계수의 구간값을 기반으로 지역의 기반산업을 분석</span
                >
                <table style="margin: 8px 0" class="customTable">
                  <colgroup>
                    <col style="width: 20%" />
                    <col style="width: 20%" />
                    <col style="width: 20%" />
                    <col style="width: 20%" />
                    <col style="width: 20%" />
                  </colgroup>
                  <thead>
                    <tr>
                      <th style="text-align: center; vertical-align: middle">입지계수</th>
                      <th style="text-align: center; vertical-align: middle">2.0 이상</th>
                      <th style="text-align: center; vertical-align: middle">1.2 ~ 2.0</th>
                      <th style="text-align: center; vertical-align: middle">0.8 ~ 1.2</th>
                      <th style="text-align: center; vertical-align: middle">0.8 미만</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th style="text-align: center; vertical-align: middle">척도</th>
                      <td style="text-align: center; vertical-align: middle">초기반산업</td>
                      <td style="text-align: center; vertical-align: middle">기반산업</td>
                      <td style="text-align: center; vertical-align: middle">보통</td>
                      <td style="text-align: center; vertical-align: middle">비기반산업</td>
                    </tr>
                  </tbody>
                </table>
              </div>
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
                :data="records"
                size="small"
                style="height: 100%; z-index: 0"
                empty-text="데이터가 없습니다."
                :show-header="true"
                scrollbar-always-on
                :row-style="getRowStyle"
                border
              >
                <el-table-column label="업종" align="center">
                  <el-table-column label="구분" prop="category" align="center" width="120px" />
                  <el-table-column label="코드" align="center" width="55px">
                    <template #default="{ row }"> {{ row?.tcode }}{{ row?.clsCode }} </template>
                  </el-table-column>
                  <el-table-column label="산업내용" prop="insNm" align="center" />
                </el-table-column>
                <el-table-column label="ITA분석" prop="itaRec" align="center" width="100px" />
                <el-table-column label="LQ분석" prop="lqRec" align="center" width="100px" />
              </el-table>
            </div>
          </div>
        </div>
      </div>
    </template>
  </PagePane>
</template>

<script setup lang="ts">
  import { onActivated, onBeforeMount, onMounted, ref } from 'vue'

  import { useGlobalStore } from '@/stores/app'
  import { useMenu3Sub2Page1Store } from 'src/stores/app/menu-3/sub-2/page-1'
  import PagePane from '@/components/common/PagePane.vue'
  import { useCmmConfigStore } from '@/stores/config/cmmConfig'
  import Table from '@/components/app/menu-1/sub-1/left/Table.vue'
  import { getItaDatas } from '@/api/app/menu-1/sub-1/tab-c'
  import { ItaData } from '@/api/app/menu-1/sub-1/tab-c/model'
  import CommonUtil from '@/utils/commonUtil'
  import Source from '@/components/common/Source.vue'
  import { SourceGroupDTO } from '@/api/app/source/model'
  import { getSources } from '@/api/app/source'

  const globalStore = useGlobalStore()
  const menu3Sub2Page1Store = useMenu3Sub2Page1Store()

  const cmmConfigStore = useCmmConfigStore()

  const records = ref<ItaData[]>()
  const sources = ref<SourceGroupDTO.SourceDTO[]>([])

  async function loadConfig() {
    try {
      await cmmConfigStore.loadCmmConfig()
      await cmmConfigStore.loadMapConfig()
    } catch (err) {
      CommonUtil.errorMessage(err)
    }
  }

  const getRowStyle = ({ row }: { row: ItaData }) => {
    let color = ''
    let backgroundColor = ''

    switch (row.itaRec) {
      case '선도산업':
        backgroundColor = '#e6b9b8'
        break
      case '신흥산업':
        backgroundColor = '#dbe6c3'
        break
      case '쇠퇴산업':
        backgroundColor = '#B5AAA7'
        break
    }

    switch (row.lqRec) {
      case '초기반산업':
        color = '#C00000'
        break
    }

    return {
      color,
      backgroundColor,
    }
  }

  // const getCellStyle = ({ row, column }: { row: ItaData; column }) => {
  //   let color = ''
  //
  //   if (column.property === 'itaRec') {
  //     color = 'blue !important'
  //   }
  //
  //   return {
  //     color,
  //   }
  // }

  onMounted(async () => {
    await loadConfig()

    const { data: sourceData } = await getSources({
      category: '산업특성분석',
      targetId: '산업기반분석',
    })

    sources.value = sourceData[0]?.sources

    const sidoCd = cmmConfigStore.cmmConfigState['SIDO_CODE']?.confValue
    const sggCd = cmmConfigStore.cmmConfigState['SGG_CODE']?.confValue
    const { data } = await getItaDatas(`${sidoCd}${sggCd}`)

    records.value = data
  })

  onBeforeMount(() => {})

  onActivated(() => {})
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
      overflow-y: hidden;
      height: 100%;

      .left {
        width: 50%;
        padding: 10px;
        background: #fff;
        border-radius: 8px;
      }

      .right {
        width: 50%;
        padding: 10px;
        background: #fff;
        display: flex;
        flex-direction: column;
        margin-left: 8px;
        border-radius: 8px;
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
  :deep(.el-table__body) tr:hover > td {
    background-color: transparent !important;
  }
</style>
