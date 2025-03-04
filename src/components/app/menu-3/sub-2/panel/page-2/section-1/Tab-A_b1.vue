<template>
  <InsideCollapse title="산업혁신구역 지정기준 및 기본방향" :is-open="true">
    <template #content>
      <div style="display: flex">
        <div style="flex: 1">
          <div class="border-box-square" style="">
            <div style="margin: 8px 0">지정기준</div>
            <table class="customTable">
              <colgroup>
                <col />
              </colgroup>
              <thead>
                <tr>
                  <th scope="col" style="text-align: center">내용</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="text-align: left">
                    필수 규모: 5,000㎡ 이상(단위필지 5,000㎡ 이하 가능)
                  </td>
                </tr>
                <tr>
                  <td style="text-align: left">신산업 수요 증가 지역</td>
                </tr>
                <tr>
                  <td style="text-align: left">대규모 공장 이적지, 공급기관 이적지</td>
                </tr>
                <tr>
                  <td style="text-align: left">노후도: 20년 이상 산업시설 50% 이상</td>
                </tr>
              </tbody>
            </table>
            <!--
            <div class="text-wrap">
              ∘ 필수 규모: 5,000㎡ 이상(단위필지 5,000㎡ 이하 가능) <br />
              ∘ 신산업 수요 증가 지역 <br />
              ∘ 대규모 공장 이적지, 공급기관 이적지 <br />
              ∘ 노후도: 20년 이상 산업시설 50% 이상 <br />
            </div>
            -->
          </div>

          <div class="border-box-square" style="">
            <div style="margin: 8px 0">혁신방향</div>
            <table class="customTable">
              <colgroup>
                <col style="width: 25%" />
                <col />
              </colgroup>
              <thead>
                <tr>
                  <th scope="col" style="text-align: center">구분</th>
                  <th scope="col" style="text-align: center">내용</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>산업혁신센터 신설</td>
                  <td>신산업 및 지원기능 상업ㆍ업무ㆍ주거기능 등</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="border-box-square" style="">
            <div style="margin: 8px 0">계획방향</div>
            <table class="customTable">
              <colgroup>
                <col style="width: 25%" />
                <col />
              </colgroup>
              <thead>
                <tr>
                  <th scope="col" style="text-align: center">구분</th>
                  <th scope="col" style="text-align: center">내용</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>토지이용계획</td>
                  <td>
                    산업기능과 지역의 부족한 기능을 복합하는 일터, 쉼터, 편의시설 등 종합적 입체적
                    유치공간 및 유치계획 수립
                  </td>
                </tr>
                <tr>
                  <td>복합개발계획</td>
                  <td>「국토계획법」 제40조의3에 따른 도시혁신구역 활용</td>
                </tr>
                <tr>
                  <td>지원기반시설계획</td>
                  <td>지원기반시설의 설치는 공공과 사업시행자를 구분</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div style="padding: 5px"></div>

        <div style="flex: 1">
          <div class="border-box-square" style="">
            <div style="margin: 8px 0">지정기준</div>
            <div class="text-wrap">
              - 최근 10년간(2011~2021년) 김천시 전체 인구는(140,239명) 증가(0.29%)하였음 <br />
              - 그 중 대신동이 24,895명으로 가장 많은 인구비율을 나타냈으며 인구 증가율은 율곡동이
              41.65%로 가장 높음
            </div>
          </div>
        </div>
      </div>
    </template>
  </InsideCollapse>
</template>

<script setup lang="ts">
  import { onActivated, onBeforeMount, onMounted } from 'vue'

  import { useGlobalStore } from '@/stores/app'
  import { useMenu3Sub2Page1Store } from 'src/stores/app/menu-3/sub-2/page-1'
  import { API_INFO_CIAMS } from '@/config/config'
  import { InsideCollapse } from '@/components/common/collapse'
  import Table from '@/components/app/menu-1/sub-1/left/Table.vue'

  const globalStore = useGlobalStore()
  const menu3Sub2Page1Store = useMenu3Sub2Page1Store()

  const prefixPath = API_INFO_CIAMS.PREFIX + '/api/v1/file/image/'
  const imgSrc = prefixPath + '45252c84-6272-49dc-a246-62c8f581158c'

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
