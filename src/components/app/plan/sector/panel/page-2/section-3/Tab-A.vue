<template>
  <div>
    <InsideCollapse title="기본방향" :is-open="true">
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
              <td style="text-align: left">상위계획 및 관련계획과의 정합성</td>
            </tr>
            <tr>
              <td style="text-align: left">관리유형별 분석단위의 종합관리체계 마련</td>
            </tr>
            <tr>
              <td style="text-align: left">분석단위별 지역여건분석 및 부족한 기반시설 공급 유도</td>
            </tr>
          </tbody>
        </table></template
      >
    </InsideCollapse>

    <InsideCollapse title="지원기반시설별 계획방향" :is-open="true">
      <template #content>
        <div class="border-box-square">
          <div style="margin: 8px 0">
            <div class="tag">도로계획</div>
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
                <td style="text-align: left">간선도로 영향 최소화</td>
              </tr>
              <tr>
                <td style="text-align: left">비정형 도로나 교차로의 정형화</td>
              </tr>
              <tr>
                <td style="text-align: left">
                  장래 교통수요에 기초한 도로계획 (교통수요예측, 도로용량ㆍ서비스 수준)
                </td>
              </tr>
              <tr>
                <td style="text-align: left">
                  주거지역과 도시공업지역 간의 접근성 개선을 위한 교통망 확충
                </td>
              </tr>
              <tr>
                <td style="text-align: left">보행환경 안전성 확보 및 자전거 통행 여건개선</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="border-box-square">
          <div style="margin: 8px 0">
            <div class="tag">공원ㆍ녹지계획</div>
          </div>

          <div style="margin: 8px 0">공원ㆍ녹지 입지기준 적정성 확보</div>

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
                  김천시 도시공업지역 내에는 공원이 전무하므로, 공원이용권 검토를 통해 도시공업지역
                  내 공원 위치 제안
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="border-box-square">
          <div style="margin: 8px 0">
            <div class="tag">공급처리계획</div>
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
                  2040 김천 도시기본계획」에서 제시된 지표 활용하여 개발사업 시행 후 예상되는
                  유발인구, 오ㆍ폐수 등의 변화를 고려하여 안정적이고 구체적인 공급처리계획 수립
                </td>
              </tr>
              <tr>
                <td style="text-align: left">
                  도시공업지역 내 저류시설이 전무하므로, 공장 화재 등으로 인한 수질오염사고 발생시를
                  대비하여 저류시설 신규 조성
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="border-box-square">
          <div style="margin: 8px 0">
            <div class="tag">산업지원시설 등 계획</div>
          </div>

          <div style="margin: 8px 0">공공임대산업시설</div>

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
                  초기 중소기업의 입주공간으로 활용하여 새로운 도시혁신공간 도모
                </td>
              </tr>
              <tr>
                <td style="text-align: left">
                  예비창업 ~ 벤처기업까지의 성장단계별 지원프로그램 운영 및 노하우 공유
                </td>
              </tr>
            </tbody>
          </table>

          <div style="margin: 8px 0">연계협력공간</div>

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
                  접근성이 뛰어나고, 상징적인 공간인 평화동 산업혁신구역에 연계협력공간을 계획하여
                  활용도와 접근성을 높임
                </td>
              </tr>
              <tr>
                <td style="text-align: left">
                  연계협력공간을 활용하여 대광동 공업지역 내 대기업과 중소기업간의 협력 유도
                </td>
              </tr>
              <tr>
                <td style="text-align: left">공업지역 내 선순환 생태계 형성을 통한 일자리 창출</td>
              </tr>
            </tbody>
          </table>

          <div style="margin: 8px 0">주거지원시설</div>

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
                <td style="text-align: left">타지역 근로자 유입을 위한 기숙사 등 주거지원</td>
              </tr>
              <tr>
                <td style="text-align: left">
                  산업시설 종사자의 직주근접을 고려한 주거ㆍ편의기능 도입
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
  import InsideCollapse from '@/components/common/collapse/InsideCollapse.vue'
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
