<template>
  <InsideCollapse title="경상북도 산업지원 제도" :is-open="true">
    <template #content>
      <div style="margin: 8px 0">경상북도 산업지원 제도와 연계하여 미래전략산업을 지원</div>
      <table class="customTable">
        <colgroup>
          <col style="width: 10%" />
          <col style="width: 30%" />
          <col style="width: 10%" />
          <col style="width: 40%" />
          <col style="width: 10%" />
        </colgroup>
        <thead>
          <tr>
            <th scope="col" style="text-align: center; vertical-align: middle">구분</th>
            <th scope="col" style="text-align: center; vertical-align: middle">지원대상</th>
            <th scope="col" style="text-align: center; vertical-align: middle">
              관련 <br />
              미래전략산업
            </th>
            <th scope="col" style="text-align: center; vertical-align: middle">지원내용</th>
            <th scope="col" style="text-align: center; vertical-align: middle">비고</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="item in tableData" :key="item">
            <tr>
              <td style="text-align: center; vertical-align: middle">{{ item.data1 }}</td>
              <td style="text-align: left; vertical-align: middle">
                <template v-for="(d2, d2idx) in item.data2" :key="d2idx">
                  {{ d2 }}
                  <br v-if="d2idx < item.data2.length - 1" />
                </template>
              </td>
              <td style="text-align: center; vertical-align: middle">{{ item.data3 }}</td>
              <td style="text-align: left; vertical-align: middle">
                <template v-for="(d4, d4idx) in item.data4" :key="d4idx">
                  {{ d4 }}
                  <br v-if="d4idx < item.data4.length - 1" />
                </template>
              </td>
              <td style="text-align: center; vertical-align: middle">{{ item.data5 }}</td>
            </tr>
          </template>
        </tbody>
      </table>
    </template>
  </InsideCollapse>
</template>

<script setup lang="ts">
  import { onActivated, onBeforeMount, onMounted } from 'vue'

  import { InsideCollapse } from '@/components/common/collapse'
  import Table from '@/components/app/menu-1/sub-1/left/Table.vue'

  import { API_INFO_CIAMS } from '@/config/config'

  import { useGlobalStore } from '@/stores/app'
  import { useMenu3Sub2Page1Store } from '@/stores/app/menu-3/sub-2/page-1'

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
      data1: '바이오산업',
      data2: [
        'DNA, 단백질, 세포 등 생명체 관련 기술을 직ㆍ간접적으로 활용하여 제품, 서비스 등 다양한 부가가치를 생산하는 산업군(의약, 화학, 전자, 에너지, 농업, 식품, 해양 등 바이오기술과 융합 가능한 산업 포함)',
      ],
      data3: '라이프케어뷰티',
      data4: [
        '① 경쟁력 향상을 위한 기업 육성',
        '② 기업 및 연구기관 유치',
        '③ 지원시설, 기반시설 조성',
        '④ 연구개발, 기술개발',
        '⑤ 전문인력 양성ㆍ유치, 창업ㆍ보육 및 시험ㆍ인증',
        '⑥ 행사, 홍보 및 정보교류',
        '⑦ 사업비 지원',
        '⑧ 기관ㆍ단체ㆍ산업계간 협력관계 구축',
      ],
      data5: '경상북도 \n' + '바이오산업 \n' + '육성 및 지원에 관한 조례 \n' + '(2022.4.25)',
    },
    {
      data1: '소재·부품·장비산업',
      data2: [
        '상품의 제조에 사용되는 원재료 또는 중간생산물을 생산하거나, 제품을 생산하는 장치 또는 설비와 관련한 산업',
      ],
      data3: '첨단신소재 부품가공',
      data4: [
        '① 소재ㆍ부품ㆍ장비산업 역량강화를 위한 기술개발',
        '② 산ㆍ학ㆍ연 공동 기술개발 및 사업화 지원, 기술창업',
        '③ 전문기술 인력 양성 및 교육',
        '④ 소재ㆍ부품ㆍ장비 전문기업의 기술촉진 및 판로',
        '⑤ 소재ㆍ부품ㆍ장비 관련 기업의 유치 및 정착을 위한 기반시설 구축',
        '⑥ 국내ㆍ외 세미나ㆍ전시회ㆍ박람회 등의 개최ㆍ유치ㆍ참여',
        '⑦ 해외 교류ㆍ시장 진출 및 마케팅 활성화',
        '⑧ 국제 공동 연구개발 및 협력 사업',
        '⑨ 소재ㆍ부품ㆍ장비 산업특화단지 내 입주기업 육성',
        '⑩ 소재ㆍ부품ㆍ장비산업 활성화를 위한 민간투자 유치',
        '⑪ 국내ㆍ외 투자 기업에 대해 입지공급, 투자절차 간소화, 투자보조금 등 지원',
      ],
      data5: '경상북도 \n' + '소재·부품·장비산업 \n' + '육성 및 지원 조례 \n' + '(2021.1.4)',
    },
    {
      data1: '이차전지산업',
      data2: [
        '이차전지의 제조와 양극재, 음극재, 전해액, 분리막 등 이차전지에 쓰이는 소재ㆍ부품ㆍ장비의 생산 및 사용된 이차전지의 재사용·재활용을 목적으로 하는 산업',
      ],
      data3: '첨단신소재 부품가공',
      data4: [
        '① 산업 발전을 위한 기술개발 지원',
        '② 산학연 공동 기술개발 지원',
        '③ 전문기술인력 양성 및 교육 지원',
        '④ 제품의 상용화 및 판매ㆍ촉진 지원',
        '⑤ 투자유치 및 박람회 등의 행사 및 홍보',
        '⑥ 제조ㆍ조립ㆍ분석ㆍ평가 등을 위한 기반시설 구축',
        '⑦ 사업 수행 기관 등에 필요한 비용 지원',
        '⑧ 기업 등의 유치를 위한 행정적ㆍ재정적 지원',
      ],
      data5: '경상북도 \n' + '이차전지산업 \n' + '육성 및 지원에 관한 조례 \n' + '(2023.10.5)',
    },
    {
      data1: '환경친화적 자동차 정비산업',
      data2: [
        '환경친화적 자동차(전기자동차, 태양광자동차, 하이브리드자동차, 수소전기자동차 등 환경기준에 부합하는 자동차) 의 정비 관련 산업',
      ],
      data3: '뿌리산업(자동차 정비)',
      data4: [
        '① 환경친화적 자동차 정비 관련 사업의 부가가치 증대 및 경쟁력 확보 방안 연구 지원',
        '② 내연기관 자동차에서 환경친화적 자동차로 정비 차종을 확대하고자 하는 자동차 정비업체에 대한 경영 진단, 개선 등의 상담 지원',
        '③ 환경친화적 자동차 정비 기반 구축 사업',
        '④ 환경친화적 자동차 정비를 위한 전문인력 양성 및 신기술 교육 지원',
        '⑤ 사업 수행 기관 등에 필요한 비용 지원',
      ],
      data5:
        '경상북도 \n' +
        '환경친화적 \n' +
        '자동차 정비산업 \n' +
        '육성 및 지원 조례 \n' +
        '(2022.4.25)',
    },
    {
      data1: '뿌리산업',
      data2: [
        '주조, 금형, 소성가공, 용접, 표면처리, 열처리 등 공정기술을 활용하여 사업을 영위하는 업종',
      ],
      data3: '뿌리산업',
      data4: [
        '① 중소기업 육성기금 융자 우대지원 ',
        '② 기업인 예우 및 기업활동 지원 ',
        '③ 경북신용보증재단의 보증조건 우대 ',
        '④ 뿌리기업 재직자를 대상으로 국내·외 연수, 일시 장려금 지급, 장학금 또는 학자금 융자 등 우대 ',
        '⑤ 뿌리기업 창업자에 대한 자금 융자 및 관련 정보 제공 등 창업 지원 ',
        '⑥ 뿌리산업 인력양성을 위한 교육·훈련 ',
        '⑦ 뿌리기업의 첨단화ㆍ자동화 및 친환경 기업으로의 전환 촉진',
      ],
      data5: '경상북도 \n' + '뿌리산업 진흥 및 \n' + '육성에 관한 조례 \n' + '(2012.12.27)',
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
