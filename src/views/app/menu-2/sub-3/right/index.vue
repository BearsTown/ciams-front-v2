<template>
  <div class="urbanInfo active" style="display: flex; flex-direction: column">
    <div class="container">
      <div class="title">유형화 종합 분석</div>

      <div class="title">
        {{ overview ? `${overview.name} (${commonUtil.comma(overview.area.toFixed(3))}㎢)` : '-' }}
        {{ overview ? `${overview.remark}` : '' }}
      </div>

      <table class="customTable analysis">
        <colgroup>
          <col style="width: 20%" />
          <col style="width: 20%" />
          <col style="width: 40%" />
          <col style="width: 20%" />
        </colgroup>
        <thead>
          <tr>
            <th scope="col" style="text-align: center">산업기반 분석</th>
            <th scope="col" style="text-align: center">지역여건 분석</th>
            <th scope="col" style="text-align: center">구분</th>
            <th scope="col" style="text-align: center">유형</th>
          </tr>
        </thead>
        <tbody>
          <tr :class="{ active: tjdwkd1 }">
            <td style="text-align: center; vertical-align: middle">성장</td>
            <td style="text-align: center; vertical-align: middle">양호</td>
            <td style="text-align: center; vertical-align: middle">산업성장/여건양호 지역</td>
            <td style="text-align: center; vertical-align: middle">관리형</td>
          </tr>
          <tr :class="{ active: tjdwkd2 }">
            <td style="text-align: center; vertical-align: middle">유지</td>
            <td style="text-align: center; vertical-align: middle">양호</td>
            <td style="text-align: center; vertical-align: middle">산업유지/여건양호 지역</td>
            <td style="text-align: center; vertical-align: middle">관리형</td>
          </tr>
          <tr :class="{ active: tjdwkd3 }">
            <td style="text-align: center; vertical-align: middle">쇠퇴</td>
            <td style="text-align: center; vertical-align: middle">양호</td>
            <td style="text-align: center; vertical-align: middle">산업쇠퇴/여건양호 지역</td>
            <td style="text-align: center; vertical-align: middle">관리형</td>
          </tr>
          <tr :class="{ active: tjdwkd4 }">
            <td style="text-align: center; vertical-align: middle">성장</td>
            <td style="text-align: center; vertical-align: middle">불량</td>
            <td style="text-align: center; vertical-align: middle">산업성장/여건불량 지역</td>
            <td style="text-align: center; vertical-align: middle">정비형</td>
          </tr>
          <tr :class="{ active: tjdwkd5 }">
            <td style="text-align: center; vertical-align: middle">유지</td>
            <td style="text-align: center; vertical-align: middle">불량</td>
            <td style="text-align: center; vertical-align: middle">산업유지/여건불량 지역</td>
            <td style="text-align: center; vertical-align: middle">정비형</td>
          </tr>
          <tr :class="{ active: tjdwkd6 }">
            <td style="text-align: center; vertical-align: middle">쇠퇴</td>
            <td style="text-align: center; vertical-align: middle">불량</td>
            <td style="text-align: center; vertical-align: middle">산업성장/여건불량 지역</td>
            <td style="text-align: center; vertical-align: middle">정비형</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="container customScroll" style="flex: 1; overflow-y: auto; margin-top: 5px">
      <Item
        title="선도·신흥산업 비율"
        :value1="overview ? `${overview.sssRate}%` : ''"
        :value2="overview ? `${overview.sssRe}` : ''"
      />

      <Item
        title="산업밀집도"
        :value1="overview ? `${overview.density}%` : ''"
        :value2="overview ? `${overview.densityRe}` : ''"
      />

      <Item
        title="사업체수 증감"
        :value1="overview ? `${overview.variation}` : ''"
        :value2="overview ? `${overview.variaRe}` : ''"
      />

      <Item
        title="산업시설 노후도"
        :value1="overview ? `${overview.deterio}%` : ''"
        :value2="overview ? `${overview.deterioRe}` : ''"
      />

      <Item
        title="도로율"
        :value1="overview ? `${overview.roadRate}%` : ''"
        :value2="overview ? `${overview.roadRe}` : ''"
      />
    </div>

    <div class="container" style="margin-top: 5px">
      <div class="title" style="display: flex; align-items: center">
        <span style="flex: 1">분석 결과</span>
        <button
          type="button"
          class="btn-green"
          :class="{ 'is-disabled': !overview }"
          :disabled="!overview"
          @click="dialog = true"
        >
          분석 진단표
        </button>
      </div>

      <table class="customTable">
        <colgroup>
          <col style="width: 50%" />
          <col style="width: 50%" />
        </colgroup>
        <thead>
          <tr>
            <th scope="col" style="text-align: center">유형구분원칙</th>
            <th scope="col" style="text-align: center">관리유형설정</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="text-align: center; vertical-align: middle">
              {{ result }}
            </td>
            <td style="text-align: center; vertical-align: middle">혁신형</td>
          </tr>
        </tbody>
      </table>
    </div>

    <el-dialog
      v-model="dialog"
      align-center
      :show-close="false"
      :append-to-body="true"
      :destroy-on-close="true"
      :close-on-click-modal="false"
      class="dialog-analysis"
    >
      <AnalysisTable @drawer-change="dialogChangeListener" />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
  import { computed, onBeforeMount, onMounted, ref } from 'vue'
  import { storeToRefs } from 'pinia'

  import Table from '@/components/app/menu-1/sub-1/left/Table.vue'
  import AnalysisTable from '@/views/app/menu-2/sub-3/right/AnalysisTable.vue'

  import commonUtil from '@/utils/commonUtil'
  import { useMenu2Sub3Store } from '@/stores/app/menu-2/sub-3'
  import Item from '@/components/app/menu-2/Item.vue'

  const menu2Sub3Store = useMenu2Sub3Store()
  const { overview } = storeToRefs(menu2Sub3Store)

  const dialog = ref<boolean>(false)

  const tjdwkd1 = computed(
    () => overview?.value?.itaResult === '성장' && overview?.value?.locala === '양호',
  )
  const tjdwkd2 = computed(
    () => overview?.value?.itaResult === '유지' && overview?.value?.locala === '양호',
  )
  const tjdwkd3 = computed(
    () => overview?.value?.itaResult === '쇠퇴' && overview?.value?.locala === '양호',
  )
  const tjdwkd4 = computed(
    () => overview?.value?.itaResult === '성장' && overview?.value?.locala === '불량',
  )
  const tjdwkd5 = computed(
    () => overview?.value?.itaResult === '유지' && overview?.value?.locala === '불량',
  )
  const tjdwkd6 = computed(
    () => overview?.value?.itaResult === '쇠퇴' && overview?.value?.locala === '불량',
  )

  const result = computed(() => (overview?.value?.locala === '양호' ? '관리형' : '정비형'))

  function dialogChangeListener(state: boolean) {
    dialog.value = state
  }

  onBeforeMount(() => {})

  onMounted(async () => {})

  defineExpose({})
</script>

<style scoped lang="scss">
  .title {
    font-size: 17px;
    padding-bottom: 10px;
  }

  .analysis {
    tbody {
      tr.active {
        td {
          background: #f5c49c;
        }
      }
    }
  }

  .btn-green {
    float: right;
    height: 28px;
    padding: 0 16px;
    border-radius: 4px;
    background: #52b597;
    color: #fff;
    text-align: center;
    font-size: 14px;
    font-weight: 500;
    letter-spacing: -0.28px;

    &:not(:disabled):hover {
      opacity: 0.8;
      transition: opacity 0.3s;
    }
  }
</style>

<style lang="scss">
  .dialog-analysis {
    width: 960px;

    .el-dialog__header {
      display: none !important;
    }

    .el-dialog__body {
      padding: 0;
      height: 100%;
    }
  }

  .el-drawer__body {
    padding: 0 !important;
  }
</style>
