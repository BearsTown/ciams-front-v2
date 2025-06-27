<template>
  <PagePane :title="['공업지역기본계획 산업의 범위2']">
    <template #center>
      <div class="container">
        <div class="center">
          <div class="left customScroll">
            <div class="container">
              <span style="margin: 5px; color: #616161">
                산업기반분석은 산업발전법 제2조에 따른 산업을 대상으로 분석(지침 제8조 제2호)
              </span>
              <span style="margin: 5px; color: #616161">
                ※「산업발전법」 제2조, 령 제2조, 별표1(산업의 범위) : 제조업, 제조업의 경쟁력 강화와
                밀접하게 관련되는 서비스업
              </span>
              <table class="customTable">
                <colgroup>
                  <col style="width: 10%" />
                  <col style="width: 15%" />
                  <col style="width: 5%" />
                  <col style="width: 70%" />
                </colgroup>
                <thead>
                  <tr>
                    <th colspan="3" style="text-align: center; vertical-align: middle">업종</th>
                    <th scope="col" style="text-align: center; vertical-align: middle">
                      한국표준산업분류 산업내용
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <template v-for="(category, catIndex) in tableData" :key="catIndex">
                    <tr v-for="(group, typeIndex) in category.data" :key="typeIndex">
                      <!-- 카테고리 (제조업, 제조업 관련 서비스업) -->
                      <td
                        v-if="typeIndex === 0"
                        :rowspan="category.data.length"
                        style="text-align: center; vertical-align: middle"
                      >
                        {{ category.category }}
                      </td>

                      <!-- 업종 분류 (예: 제조업, 건설업 등) -->
                      <td style="text-align: center; vertical-align: middle">
                        {{ group.type.name }}
                      </td>
                      <td style="text-align: center; vertical-align: middle">
                        {{ group.type.code }}
                      </td>

                      <!-- 코드 - 모든 코드를 하나의 td에 br로 분리 -->
                      <td style="text-align: left">
                        <template v-for="(code, codeIndex) in group.codes" :key="codeIndex">
                          {{ code.code }} {{ code.name }}
                          <br v-if="codeIndex < group.codes.length - 1" />
                        </template>
                      </td>
                    </tr>
                  </template>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </template>
  </PagePane>
</template>

<script setup lang="ts">
  import { onActivated, onBeforeMount, onMounted } from 'vue'

  import { useGlobalStore } from '@/stores/app'
  import { useMenu3Sub2Page1Store } from '@/stores/app/menu-3/sub-2/page-1'
  import { API_INFO_CIAMS } from '@/config/config'
  import Table from '@/components/app/menu-1/sub-1/left/Table.vue'
  import PagePane from '@/components/common/PagePane.vue'

  const globalStore = useGlobalStore()
  const menu3Sub2Page1Store = useMenu3Sub2Page1Store()

  const prefixPath = API_INFO_CIAMS.PREFIX + '/api/v1/file/image/'
  const imgSrc = prefixPath + '45252c84-6272-49dc-a246-62c8f581158c'

  // 카테고리 rowspan 계산 함수
  const getCategoryRowspan = (category) => {
    return category.data.reduce((total, group) => total + group.codes.length, 0)
  }

  const tableData = [
    {
      category: '제조업',
      data: [
        {
          type: { code: 'C', name: '제조업' },
          codes: [
            { code: 10, name: '식료품' },
            { code: 11, name: '음료' },
            { code: 12, name: '담배' },
            { code: 13, name: '섬유제품(의복 제외)' },
            { code: 14, name: '의복, 의복액세서리 및 모피제품' },
            { code: 15, name: '가죽, 가방 및 신발' },
            { code: 16, name: '목재 및 나무제품(가구 제외)' },
            { code: 17, name: '펄프, 종이 및 종이제품' },
            { code: 18, name: '인쇄 및 기록매체 복제업' },
            { code: 19, name: '코크스, 연탄 및 석유정제품' },
            { code: 20, name: '화학물질 및 화학제품(의약품 제외)' },
            { code: 21, name: '의료용 물질 및 의약품' },
            { code: 22, name: '고무 및 플라스틱제품' },
            { code: 23, name: '비금속 광물제품' },
            { code: 24, name: '1차 금속' },
            { code: 25, name: '금속가공제품(기계 및 가구 제외)' },
            { code: 26, name: '전자부품, 컴퓨터, 영상, 음향 및 통신장비' },
            { code: 27, name: '의료, 정밀, 광학기기 및 시계' },
            { code: 28, name: '전기장비' },
            { code: 29, name: '기타 기계 및 장비' },
            { code: 30, name: '자동차 및 트레일러' },
            { code: 31, name: '기타 운송장비' },
            { code: 32, name: '가구' },
            { code: 33, name: '기타 제품' },
            { code: 34, name: '산업용 기계 및 장비 수리업' },
          ],
        },
      ],
    },
    {
      category: '제조업 관련 서비스업',
      data: [
        {
          type: { code: 'D', name: '전기, 가스, 증기 및 공기조절 공급업' },
          codes: [{ code: 35, name: '전기, 가스, 증기 및 공기조절 공급업' }],
        },
        {
          type: { code: 'E', name: '수도, 하수 및 폐기물 처리, 원료 재생업' },
          codes: [
            { code: 36, name: '수도업' },
            { code: 370, name: '하수, 폐수 및 분뇨 처리업' },
            { code: 381, name: '폐기물 수집, 운반업' },
            { code: 382, name: '폐기물 처리업' },
            { code: 39, name: '환경 정화 및 복원업' },
          ],
        },
        {
          type: { code: 'F', name: '건설업' },
          codes: [
            { code: 41224, name: '환경설비 건설업' },
            { code: 41225, name: '산업 생산시설 종합 건설업' },
            { code: 42201, name: '배관 및 냉·난방 공사업' },
            { code: 42204, name: '소방시설 공사업' },
            { code: 4231, name: '전기 공사업' },
          ],
        },
        {
          type: { code: 'G', name: '도매 및 소매업' },
          codes: [
            { code: 45, name: '자동차 및 부품 판매업' },
            { code: 46, name: '도매 및 상품 중개업' },
            { code: 47, name: '소매업(자동차 제외)' },
          ],
        },
        {
          type: { code: 'H', name: '운수 및 창고업' },
          codes: [
            { code: 49211, name: '도시철도 운송업' },
            { code: 493, name: '도로 화물 운송업' },
            { code: 494, name: '소화물 전문 운송업' },
            { code: 495, name: '파이프라인 운송업' },
            { code: 50112, name: '외항 화물 운송업' },
            { code: 50122, name: '내항 화물 운송업' },
            { code: 50203, name: '기타 내륙 수상 운송업' },
            { code: 512, name: '항공 화물 운송업' },
            { code: 5210, name: '보관 및 창고업' },
            { code: 5291, name: '육상 운송지원 서비스업' },
            { code: 52921, name: '항구 및 기타 해상 터미널 운영업' },
            { code: 52931, name: '공항 운영업' },
            { code: 5294, name: '화물 취급업' },
            { code: 52993, name: '화물운송 중개, 대리 및 관련 서비스업' },
          ],
        },
        {
          type: { code: 'J', name: '정보통신업' },
          codes: [
            { code: 582, name: '소프트웨어 개발 및 공급업' },
            { code: 5911, name: '영화, 비디오물 및 방송 프로그램 제작업' },
            { code: 59120, name: '영화, 비디오물 및 방송 프로그램 제작 관련 서비스업' },
            { code: 59201, name: '음악 및 기타 오디오물 출판업' },
            { code: 60, name: '방송업' },
            { code: 612, name: '전기통신업' },
            { code: 62, name: '컴퓨터 프로그래밍, 시스템 통합 및 관리업' },
            { code: 63, name: '정보서비스업' },
          ],
        },
        {
          type: { code: 'M', name: '전문, 과학 및 기술 서비스업' },
          codes: [
            { code: 70, name: '연구개발업' },
            { code: 71, name: '전문 서비스업' },
            { code: 732, name: '전문 디자인업' },
            { code: 73902, name: '번역 및 통역 서비스업' },
            { code: 73903, name: '사업 및 무형 재산권 중개업' },
            { code: 73904, name: '물품 감정, 계량 및 견본 추출업' },
            { code: 73909, name: '그 외 기타 분류 안된 전문, 과학 및 기술 서비스업' },
          ],
        },
        {
          type: { code: 'P', name: '교육 서비스업' },
          codes: [{ code: 85502, name: '온라인 교육학원' }],
        },
        {
          type: { code: 'Q', name: '보건업 및 사회복지 서비스업' },
          codes: [
            { code: 861, name: '병원' },
            { code: 862, name: '의원' },
            { code: 869, name: '기타 보건업' },
          ],
        },
        {
          type: { code: 'S', name: '협회 및 단체, 수리 및 기타 개인 서비스업' },
          codes: [
            { code: 952, name: '자동차 및 모터사이클 수리업' },
            { code: 96911, name: '산업용 세탁업' },
          ],
        },
      ],
    },
  ]

  onMounted(async () => {})

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

  .customTable tr > td:not([rowspan]) {
    border-left: 1px solid #e0e0e0;
  }
</style>
