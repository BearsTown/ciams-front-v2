<template>
  <InsideCollapse title="기본방향" :is-open="true">
    <template #content>
      <div class="border-box-square">
        <div style="margin: 8px 0" class="title-sub">미래전략산업 도출</div>
        <el-image
          style="width: 100%"
          :src="imgSrc"
          fit="scale-down"
          :preview-src-list="[imgSrc]"
          :preview-teleported="true"
          :zoom-rate="1.2"
        />
      </div>

      <el-divider border-style="dashed" />

      <div class="border-box-square">
        <div style="margin: 8px 0" class="title-sub">미래전략산업별 기본방향</div>

        <div class="container">
          <div class="center">
            <div class="left">
              <div class="border-box-square" style="flex: 1">
                <div style="margin: 8px 0">
                  <div class="tag" style="background-color: #9cbb5a">첨단신소재 부품가공</div>
                </div>
                <div class="text-wrap">
                  <p>- 업종의 고부가가치화 및 안정적인 일자리 생태계 조성</p>
                  <p>- 산업 공정의 스마트화를 통한 지속가능한 산업으로 육성</p>
                </div>
              </div>

              <div class="border-box-square" style="flex: 1">
                <div style="margin: 8px 0">
                  <div class="tag" style="background-color: #8064a2">라이프케어뷰티</div>
                </div>
                <div class="text-wrap">
                  <p>
                    - 김천시 내 라이프케어뷰티 기업은 대부분 식품분야가 주력 으로 식품분야에서 점차
                    화장품, 의약 분야로 고부가가치 유망 품목의 육성 및 전환
                  </p>
                </div>
              </div>

              <div class="border-box-square" style="flex: 1">
                <div style="margin: 8px 0">
                  <div class="tag" style="background-color: #f79339">철도산업</div>
                </div>
                <div class="text-wrap">
                  <p>- 지리적 이점을 활용하여 철도관련 산업체를 바탕으로 철도산업클러스터 조성</p>
                  <p>- 철도 및 관련 산업의 체계적인 전문인력 양성</p>
                </div>
              </div>

              <div class="border-box-square" style="flex: 1">
                <div style="margin: 8px 0">
                  <div class="tag" style="background-color: #d9d9d9">스마트 제조업</div>
                </div>
                <div class="text-wrap">
                  <p>
                    - 스마트 제조업 도입으로 제조업에 대한 3D업종 인식 개선 및 뿌리산업의 전통적인
                    거부감 전환
                  </p>
                </div>
              </div>
            </div>

            <div class="right">
              <div class="border-box-square" style="height: 100%">
                <el-image
                  style="width: 100%; height: 100%"
                  :src="imgSrc2"
                  fit="scale-down"
                  :preview-src-list="[imgSrc2]"
                  :preview-teleported="true"
                  :zoom-rate="1.2"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="border-box-round" style="">
          <div class="text-wrap">
            <p>
              - 미래전략산업 중 김천시에 집적되어 있는 첨단신소재부품가공 업종과 라이프케어뷰티
              업종을 도시공업지역의 현황에 맞춰 산업육성
            </p>
            <p>
              - 김천시 선도산업이자 산업입지계수가 높은 철도장비제조업을 현재 김천시에서 추진중인
              철도특구계획과 함께 발전가능하도록 신성장동력산업으로 육성
            </p>
          </div>
        </div>
      </div>
    </template>
  </InsideCollapse>
</template>

<script setup lang="ts">
  import { onActivated, onBeforeMount, onMounted } from 'vue'

  import { InsideCollapse } from '@/components/common/collapse'

  import { API_INFO_CIAMS } from '@/config/config'

  import { useGlobalStore } from '@/stores/app'
  import { useMenu3Sub2Page1Store } from '@/stores/app/menu-3/sub-2/page-1'

  const globalStore = useGlobalStore()
  const menu3Sub2Page1Store = useMenu3Sub2Page1Store()

  const prefixPath = API_INFO_CIAMS.PREFIX + '/api/v1/file/image/'
  const imgSrc = prefixPath + '45252c84-6272-49dc-a246-62c8f581158c'
  const imgSrc2 = prefixPath + '5b2f4914-d8b1-4103-b0cf-39d2eb4b9374'

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
      height: auto;
      display: flex;
      flex-direction: row;

      .left {
        width: 50%;
        height: auto;

        display: flex;
        flex-direction: column;
        //padding: 5px;
        background: #fff;
        border-radius: 8px;
      }

      .right {
        width: 50%;
        height: auto;

        //padding: 5px;
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
    margin: 8px 0;
    color: #212121;
    font-size: 15px;
    font-weight: 700;
    letter-spacing: -0.02em;
  }

  .tag {
    width: 120px;
    height: 31px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
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
