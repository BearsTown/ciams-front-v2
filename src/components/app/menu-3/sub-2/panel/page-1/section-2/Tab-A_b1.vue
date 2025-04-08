<template>
  <InsideCollapse title="경상북도 산업지원 제도" :is-open="true">
    <template #content>
      <div>
        <spam>경상북도 산업지원 제도와 연계하여 미래전략산업을 지원</spam>
      </div>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="data1" label="구분" width="150" />
        <el-table-column prop="data2" label="지원대상" width="280">
          <template #default="scope">
            <div style="display: flex; align-items: start; flex-direction: column">
              <template v-for="item in scope.row.data2" :key="item">
                <span style="margin-left: 10px">{{ item }}</span>
              </template>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="data3" label="관련 미래전략산업" width="180" />
        <el-table-column prop="data4" label="지원내용">
          <template #default="scope">
            <div style="display: flex; align-items: start; flex-direction: column">
              <template v-for="item in scope.row.data4" :key="item">
                <span style="margin-left: 10px">{{ item }}</span>
              </template>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="data5" label="비고" width="180" />
      </el-table>
    </template>
  </InsideCollapse>
</template>

<script setup lang="ts">
  import { onActivated, onBeforeMount, onMounted } from 'vue'

  import { useGlobalStore } from '@/stores/app'
  import { useMenu3Sub2Page1Store } from 'src/stores/app/menu-3/sub-2/page-1'
  import { API_INFO_CIAMS } from '@/config/config'
  import { InsideCollapse } from '@/components/common/collapse'

  const globalStore = useGlobalStore()
  const menu3Sub2Page1Store = useMenu3Sub2Page1Store()

  const prefixPath = API_INFO_CIAMS.PREFIX + '/api/v1/file/image/'
  const imgSrc = prefixPath + '45252c84-6272-49dc-a246-62c8f581158c'

  const tableData = [
    {
      data1: '미래자동차산업',
      data2: [
        '자율주행 자동차와 관련한 산업',
        '환경친화적 자동차와 관련한 산업',
        '자동차 제조업',
        '튜닝 등 자동차 소재·부품업과 관련한 산업',
      ],
      data3: '첨단신소재 부품가공',
      data4: [
        '① 내연기관자동차 관련 업종의 미래자동차 관련 업종전환 유도 및 지원',
        '② 인력양성, 기술개발, 시험‧인증, 사업화 및 마케팅 지원',
        '③ 출자‧출연·보조·융자',
        '④ 유망기업‧연구기관 유치 및 육성',
        '⑤ 연구‧기업지원 관련 인프라 구축 및 집적화',
        '⑥ 전시회, 학술회의와 각종 행사의 개최 및 유치',
        '⑦ 산‧학‧연 협력체계 구축 및 활성화 지원',
      ],
      data5: '경상북도 \n' + '미래자동차산업 \n' + '육성 및 지원 조례 \n' + '(2022.11.3)',
    },
    {
      data1: '미래자동차산업',
      data2: [
        '자율주행 자동차와 관련한 산업',
        '환경친화적 자동차와 관련한 산업',
        '자동차 제조업',
        '튜닝 등 자동차 소재·부품업과 관련한 산업',
      ],
      data3: '첨단신소재 부품가공',
      data4: [
        '① 내연기관자동차 관련 업종의 미래자동차 관련 업종전환 유도 및 지원',
        '② 인력양성, 기술개발, 시험‧인증, 사업화 및 마케팅 지원',
        '③ 출자‧출연·보조·융자',
        '④ 유망기업‧연구기관 유치 및 육성',
        '⑤ 연구‧기업지원 관련 인프라 구축 및 집적화',
        '⑥ 전시회, 학술회의와 각종 행사의 개최 및 유치',
        '⑦ 산‧학‧연 협력체계 구축 및 활성화 지원',
      ],
      data5: '경상북도 \n' + '미래자동차산업 \n' + '육성 및 지원 조례 \n' + '(2022.11.3)',
    },
    {
      data1: '미래자동차산업',
      data2: [
        '자율주행 자동차와 관련한 산업',
        '환경친화적 자동차와 관련한 산업',
        '자동차 제조업',
        '튜닝 등 자동차 소재·부품업과 관련한 산업',
      ],
      data3: '첨단신소재 부품가공',
      data4: [
        '① 내연기관자동차 관련 업종의 미래자동차 관련 업종전환 유도 및 지원',
        '② 인력양성, 기술개발, 시험‧인증, 사업화 및 마케팅 지원',
        '③ 출자‧출연·보조·융자',
        '④ 유망기업‧연구기관 유치 및 육성',
        '⑤ 연구‧기업지원 관련 인프라 구축 및 집적화',
        '⑥ 전시회, 학술회의와 각종 행사의 개최 및 유치',
        '⑦ 산‧학‧연 협력체계 구축 및 활성화 지원',
      ],
      data5: '경상북도 \n' + '미래자동차산업 \n' + '육성 및 지원 조례 \n' + '(2022.11.3)',
    },
  ]

  onMounted(async () => {})

  onBeforeMount(() => {})

  onActivated(() => {})
</script>

<style scoped lang="scss">
  .container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;

    .center {
      flex: 1;
      height: 0px;
      display: flex;
      flex-direction: row;

      .left {
        width: 100%;
        height: 100%;

        padding: 5px;
        background: #fff;
        border-radius: 8px;
      }

      .right {
        width: 50%;

        padding: 10px;
        background: #fff;
        margin-left: 8px;
        border-radius: 8px;
      }
    }

    .bottom {
      height: 80px;
      margin-top: 8px;
      min-height: 100px;
      max-height: 150px;

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
</style>
