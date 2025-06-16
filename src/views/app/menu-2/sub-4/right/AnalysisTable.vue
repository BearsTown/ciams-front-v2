<template>
  <div class="analysis">
    <div class="analysis-content">
      <div class="customCard" style="display: flex; flex-direction: column">
        <div class="header">
          공업지역 유형화 분석 진단표
          <button type="button" class="btn-close" @click="emits('drawer-change', false)">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
            >
              <path
                d="M13.5 4.5L4.5 13.5M13.5 13.5L4.5 4.5"
                stroke="#212121"
                stroke-width="1.5"
                stroke-linecap="round"
              />
            </svg>
          </button>
        </div>

        <div style="display: flex; flex-direction: column; flex: 1; height: 100%">
          <div
            style="flex: 1; display: flex; flex-direction: column; overflow-y: auto; height: 100%"
          >
            <div class="container">
              <table class="customTable" style="table-layout: fixed; width: 100%; height: 100%">
                <colgroup>
                  <col style="width: 20%" />
                  <col style="width: 30%" />
                  <col style="width: 20%" />
                  <col style="width: 30%" />
                </colgroup>
                <thead>
                  <tr>
                    <th
                      style="
                        display: flex;
                        height: 100%;
                        color: white;
                        border: none;
                        margin-right: 3px;
                        border-radius: 13px;
                        align-items: center;
                        justify-content: center;
                        background-color: #3e5b7b;
                        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
                      "
                    >
                      <el-icon style="margin-right: 3px">
                        <InfoFilled />
                      </el-icon>
                      {{ overview?.locala === '양호' ? '관리형' : '정비형' }} 지역
                    </th>
                    <th>행정구역(소재지)</th>
                    <td colspan="2">{{ overview?.name }}</td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th>번호</th>
                    <td></td>
                    <th>집계구번호</th>
                    <td></td>
                  </tr>
                  <tr>
                    <th>공업지역 유형화</th>
                    <td>{{ overview?.fresult }}</td>
                    <th>ITA 분석 결과</th>
                    <td>{{ overview?.itaResult }}</td>
                  </tr>
                </tbody>
              </table>

              <br />

              <table class="customTable" style="table-layout: fixed; width: 100%">
                <colgroup>
                  <col style="width: 10%" />
                  <col style="width: 20%" />
                  <col style="width: 15%" />
                  <col style="" />
                  <col style="width: 10%" />
                  <col style="width: 20%" />
                </colgroup>
                <thead>
                  <tr>
                    <th>구분</th>
                    <th>지표</th>
                    <th>측정치</th>
                    <th colspan="2">참고(측정치)</th>
                    <th>비고</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th class="tg-c3ow" rowspan="3">산업<br />기반<br />평가</th>
                    <td>산업밀집도</td>
                    <td>{{ overview?.density }}</td>
                    <td style="text-align: left">해당 시군구 제조업 비율</td>
                    <td>-%</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>사업체 증감</td>
                    <td>{{ overview?.variaRe }}</td>
                    <td style="text-align: left">해당 시군구 제조업체 증감</td>
                    <td>-</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>선도·신흥산업 비율</td>
                    <td>{{ `${overview?.sssRate}%` }}</td>
                    <td style="text-align: left">해당 대상지 전체 선도·신흥산업 비율</td>
                    <td>-%</td>
                    <td></td>
                  </tr>
                  <tr>
                    <th class="tg-c3ow" rowspan="2">지역<br />여건<br />평가</th>
                    <td>노후건물 비율</td>
                    <td>{{ `${overview?.deterio}%` }}</td>
                    <td style="text-align: left">해당 대상지 전체 노후건물 비율</td>
                    <td>-%</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>도로율</td>
                    <td>{{ `${overview?.roadRate}%` }}</td>
                    <td style="text-align: left">해당 시군구 도로율</td>
                    <td>-%</td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onActivated, onDeactivated, onMounted, ref } from 'vue'
  import { storeToRefs } from 'pinia'
  import Table from '@/components/app/menu-1/sub-1/left/Table.vue'

  import { useMenu2Sub4Store } from 'src/stores/app/menu-2/sub-4'

  const menu2Sub4Store = useMenu2Sub4Store()
  const { overview } = storeToRefs(menu2Sub4Store)

  const emits = defineEmits<{
    (e: 'drawer-change', type: boolean): void
  }>()

  const state = ref({
    title: '',
    location: '',
    area: '',
    target: '',
    build: '',
  })

  onMounted(() => {})

  onActivated(() => {})

  onDeactivated(() => {})

  defineExpose({})
</script>

<style scoped lang="scss">
  .analysis {
    width: 100%;
    height: 100%;
    padding: 15px 12px;
  }

  .analysis-content {
    height: 100%;
    display: flex;
    flex-flow: column;
    overflow: hidden;
  }

  .analysis .customCard {
    height: 100%;
    padding: 20px;
  }

  .analysis .container.customScroll {
    height: calc(100% - 36px);
    overflow-y: auto;
  }

  .analysis .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
    padding-bottom: 17px;
    border-bottom: 1px solid #f4f4f4;
    font-size: 17px;
    font-weight: 700;
    letter-spacing: -0.02em;
    color: #212121;
  }

  .customCard {
    padding: 20px 10px !important;
  }

  .is-disabled {
    cursor: not-allowed;
  }

  .analysis {
    background: #f4f4f4;

    .header {
      margin-bottom: 5px;
    }

    .btn-submit {
      margin-top: 0;
    }
  }

  .header-section {
    border: 1px solid #ddd;
    padding: 10px;
    margin-bottom: 20px;
    background-color: #f9f9f9;
  }

  .header-section div {
    margin: 5px 0;
  }

  .customTable {
    border-collapse: collapse;
    border-spacing: 0;
  }

  .customTable thead tr,
  .customTable tbody tr {
    height: 40px;
  }

  .customTable th,
  .customTable td {
    vertical-align: middle;
    border: 1px solid #e0e0e0;
  }
</style>

<style scoped lang="scss"></style>
