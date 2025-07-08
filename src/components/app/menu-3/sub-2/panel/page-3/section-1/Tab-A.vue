<template>
  <div>
    <InsideCollapse title="환경친화적 공업지역 정비 기본방향" :is-open="true">
      <template #content>
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
              <td style="text-align: left">환경친화적인 공업지역 구조 형성</td>
            </tr>
            <tr>
              <td style="text-align: left">환경정화시설 설치 및 통합 관리</td>
            </tr>
            <tr>
              <td style="text-align: left">환경관리업종 이전 유도</td>
            </tr>
            <tr>
              <td style="text-align: left">업종전환 및 구조고도화</td>
            </tr>
          </tbody>
        </table></template
      >
    </InsideCollapse>

    <InsideCollapse title="분야별 환경관리방안" :is-open="true">
      <template #content>
        <div class="border-box-square">
          <div style="margin: 8px 0">
            <div class="tag">대기환경</div>
          </div>

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
                <td style="text-align: left">환경친화적인 공업지역 형성</td>
              </tr>
              <tr>
                <td style="text-align: left">대기오염물질 배출량 저감 및 처리 강화</td>
              </tr>
              <tr>
                <td style="text-align: left">미세먼지 저감대책 마련</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="border-box-square">
          <div style="margin: 8px 0">
            <div class="tag">수환경</div>
          </div>

          <div style="margin: 8px 0">관리대책 및 시스템 구축</div>

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
                  김천시의 수질오염총량 잔여량(BOD, T-P)은 현재(2024년 말 기준) 50% 미만으로,
                  배출부하량이 클 것으로 예상되는 대광동 일원은 공업지역 내에 저류시설, 여과시설 등
                  방재시설을 설치하여 배출오염부하량을 최소화하도록 관리
                </td>
              </tr>
            </tbody>
          </table>

          <br />

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
                <td style="text-align: left">하수도 보급률 향상 및 시설 확충계획 수립</td>
              </tr>
            </tbody>
          </table>

          <br />

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
                <td style="text-align: left">저영향개발(LID) 기법 적용 검토</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="border-box-square">
          <div style="margin: 8px 0">
            <div class="tag">환경오염발생업종</div>
          </div>

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
                  통합관리 사업장에서 발생하는 오염물질 등을 효과적으로 줄이기 위하여 배출 시설 등을
                  통합 관리
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
    </InsideCollapse>
  </div>
</template>

<script setup lang="ts">
  import { onActivated, onBeforeMount, onMounted } from 'vue'

  import Table from '@/components/app/menu-1/sub-1/left/Table.vue'
  import InsideCollapse from '@/components/common/collapse/InsideCollapse.vue'

  import { API_INFO_CIAMS } from '@/config/config'

  import { useGlobalStore } from '@/stores/app'
  import { useMenu3Sub2Page1Store } from '@/stores/app/menu-3/sub-2/page-1'

  const globalStore = useGlobalStore()
  const menu3Sub2Page1Store = useMenu3Sub2Page1Store()

  const prefixPath = API_INFO_CIAMS.PREFIX + '/api/v1/file/image/'
  const imgSrc = prefixPath + '57bc04bb-a88c-465d-8472-2343b0715e99'
  const imgSrc2 = prefixPath + '474c590f-b735-44dd-8f89-7703b20f8b32'

  onMounted(async () => {})

  onBeforeMount(() => {})

  onActivated(() => {})
</script>

<style scoped lang="scss">
  .border-box-square:first-child {
    margin: 0;
  }

  .header-title {
    margin: 8px 0;
    color: #212121;
    font-size: 15px;
    font-weight: 700;
    letter-spacing: -0.02em;
  }

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

        padding: 5px;
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

  .tag {
    width: 150px;
    height: 31px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    background-color: #d9d9d9;
    //border: 1px solid #9e9e9e;
    font-size: 13px;
    font-weight: 600;
    color: white;
    box-shadow: 3px 3px 3px 0 rgba(0, 0, 0, 0.12);
  }

  .title-sub {
    font-size: 13px;
    font-weight: 700;
    letter-spacing: -0.02em;
    color: #212121;
  }
</style>
