<template>
  <InsideCollapse title="건축물 권장용도(업종) 계획" :is-open="true">
    <template #content>
      <table class="customTable">
        <colgroup>
          <col style="width: 10%" />
          <col style="width: 20%" />
          <col style="width: 40%" />
        </colgroup>
        <thead>
          <tr>
            <th scope="col" style="text-align: center">미래전략산업분야</th>
            <th scope="col" style="text-align: center">구성요소</th>
            <th scope="col" style="text-align: center">권장업종</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="vertical-align: middle">첨단신소재 부품가공</td>
            <td style="text-align: left; vertical-align: middle">
              경량 신소재 고분자 플라스틱(EP) <br />
              기능성 / 금속 / 세라믹 복합재료 및 성형 공정 <br />
              친환경 고기능성 열표면 처리장치ㆍ 공정 <br />
              이차전지/연료전지 응용 소재ㆍ 제조공정 <br />
              AI 응용기술 기반 성형가공 공정
            </td>
            <td style="text-align: left; vertical-align: middle">
              [C202] 합성고무 및 플라스틱 <br />
              [C241] 1차 철강 <br />
              [C242] 1차 비철금속 <br />
              [C259] 기타 금속 가공제품 <br />
              [C292] 특수 목적용 기계 <br />
              [C302] 자동차 차체 및 트레일러 <br />
              [C303] 자동차 신품 부품
            </td>
          </tr>

          <tr>
            <td style="vertical-align: middle">라이프 뷰티케어</td>
            <td style="text-align: left; vertical-align: middle">
              건강기능성 화장품 <br />
              친환경 편의식품 / 웰빙 전통식품 <br />
              코스메슈티컬 제품 <br />
              의약품 및 의약품 원료
            </td>
            <td style="text-align: left; vertical-align: middle">
              [C103] 과일, 채소 가공 및 저장 <br />
              [C107] 기타 식품 <br />
              [C111] 음료 <br />
              [C213] 의료용품 및 기타 의약 <br />
              [H493] 도로 화물 운송업 <br />
              [H521] 보관 및 창고업
            </td>
          </tr>

          <tr>
            <td style="vertical-align: middle">철도산업</td>
            <td style="text-align: left; vertical-align: middle">
              철도차량 부품 및 관련 장비ㆍ장치물 제조업 <br />
              기관차 및 기타 철도차량 제조업 <br />
              철도 화물 운송 / 철도 종합 물류업 <br />
              스마트 철도 관제
            </td>
            <td style="text-align: left; vertical-align: middle">
              [C312] 철도장비 <br />
              [F412] 토목건설업 <br />
              [G465] 기계장비 및 관련 물품 도매업 <br />
              [H491] 철도운송업 <br />
              [H521] 보관 및 창고업 <br />
              [H529] 기타 운송관련 서비스업
            </td>
          </tr>

          <tr>
            <td style="vertical-align: middle">스마트제조업</td>
            <td style="text-align: left; vertical-align: middle">
              뿌리산업의 스마트화 <br />
              데이터 기반 제조공정 <br />
              응용시스템 및 설비 제어 <br />
              산업용 통신/네트워크
            </td>
            <td style="text-align: left; vertical-align: middle">
              [C201] 기초 화학물질 <br />
              [C202] 합성고무 및 플라스틱 <br />
              [C222] 플라스틱제품 <br />
              [C241] 1차 철강 <br />
              [C262] 전자제품 <br />
              [C312] 철도장비 <br />
              [C264] 통신 및 방송 장비 <br />
              [C292] 특수 목적용 기계
            </td>
          </tr>
        </tbody>
      </table>

      <el-divider border-style="dashed" />

      <InsideCollapse title="건축물 밀도계획" :is-open="true">
        <template #content>
          <div class="text-wrap">
            건축물의 밀도계획에 관한 사항은 「도시 공업지역의 관리 및 활성화를 위한 계획 및
            정비ㆍ운영 등에 관한 지침」 제10조제2항에 따라 향후 산업정비구역 또는 산업혁신구역 지정
            시 사업지별로 관련법령 및 지침 등을 준용하여 건축물 밀도계획 수립 (필요시
            「도시공업지역법 시행령」 제50조에 따라 건폐율, 용적률 특례 적용)
          </div>
        </template>
      </InsideCollapse>
    </template>
  </InsideCollapse>
</template>

<script setup lang="ts">
  import { InsideCollapse } from '@/components/common/collapse'
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

  .customTable tr > td:not([rowspan]) {
    border-left: 1px solid #e0e0e0;
  }
</style>
