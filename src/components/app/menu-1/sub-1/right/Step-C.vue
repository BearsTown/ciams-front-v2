<template>
  <div class="urbanInfo active">
    <div class="container" style="height: 100%">
      <div class="title">
        {{ overview ? `${overview.name} (${commonUtil.comma(overview.area.toFixed(3))}㎢)` : '-' }}
        {{ overview ? `${overview.remark}` : '' }}
      </div>

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
            <td style="text-align: center; vertical-align: middle">토지소유자</td>
            <td style="text-align: left">
              국유지: 2.4% <br />
              공유지: 17.4% <br />
              사유지: 80.2%
            </td>
          </tr>
          <tr>
            <td style="text-align: center; vertical-align: middle">토지지목</td>
            <td style="text-align: left">
              공장: 66.4% <br />
              도로: 11.0% <br />
              전: 3.6% <br />
              기타: 3.5%
            </td>
          </tr>
          <tr>
            <td style="text-align: center; vertical-align: middle">건축물용도</td>
            <td style="text-align: left">
              공장: 41.1% <br />
              주거: 20.4% <br />
              근린생활시설: 14.8% <br />
              기타: 3.0%
            </td>
          </tr>
          <tr>
            <td style="text-align: center; vertical-align: middle">건축물노후도</td>
            <td style="text-align: left">20년 이상 건축물 40.2%</td>
          </tr>
          <tr>
            <td style="text-align: center; vertical-align: middle">산업현황</td>
            <td style="text-align: left">
              사업체: {{ overview ? `${overview.csC}` : '-' }}개 <br />
              종사자: 5,124명
            </td>
          </tr>
          <tr>
            <td style="text-align: center; vertical-align: middle">지역특성</td>
            <td style="text-align: left">
              김천 일반산업단지, 대광농공단지 인접 <br />
              기반시설 양호 <br />
              김천시 산업 발달에 중추적인 위치 <br />
              유한킴벌리, 코오롱, 두산전자 등 대기업
            </td>
          </tr>
          <tr>
            <td style="text-align: center; vertical-align: middle">주요산업</td>
            <td style="text-align: left">
              전구 및 조명 장치 제조업<br />
              화학물질 및 화학제품 제조업
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onBeforeMount, onMounted, watch } from 'vue'
  import { storeToRefs } from 'pinia'

  import { useMenu1StepCStore } from '@/stores/app/menu-1/step-c'
  import commonUtil from '@/utils/commonUtil'

  const menu1StepCStore = useMenu1StepCStore()
  const { overview } = storeToRefs(menu1StepCStore)

  watch(overview, () => {})

  onBeforeMount(() => {})

  onMounted(async () => {})

  defineExpose({
    setInfoData,
  })

  async function setInfoData() {}
</script>

<style scoped lang="scss">
  .title {
    font-size: 17px;
    padding-bottom: 10px;
  }

  .targetEdit {
    display: flex !important;
    flex-direction: column !important;
  }

  .targetEdit-content {
    flex: 1;
  }

  .customCard {
    height: 100%;
  }

  .targetEdit-top {
    height: auto;
    //padding: 10px;
  }

  .targetEdit-tab {
    > li {
      padding: 0 5px;
    }
  }

  .no-data {
    width: 100%;
    height: 100%;
    padding: 15px 12px;
  }
</style>
