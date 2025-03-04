<template>
  <div class="urbanInfo active">
    <div class="container">
      <div class="title">산업기반 분석</div>

      <div class="title">
        {{ overview ? `${overview.name} (${commonUtil.comma(overview.area.toFixed(3))}㎢)` : '-' }}
        {{ overview ? `${overview.remark}` : '' }}
      </div>

      <table class="customTable analysis">
        <colgroup>
          <col style="width: 20%" />
          <col style="width: 40%" />
          <col style="width: 20%" />
          <col style="width: 20%" />
        </colgroup>
        <thead>
          <tr>
            <th scope="col" style="text-align: center">구분</th>
            <th scope="col" style="text-align: center">선도·신흥산업 비율</th>
            <th scope="col" style="text-align: center">산업밀집도</th>
            <th scope="col" style="text-align: center">사업체수</th>
          </tr>
        </thead>
        <tbody>
          <tr :class="{ active: tjdwkd }">
            <td style="text-align: center; vertical-align: middle">성장</td>
            <td style="text-align: center; vertical-align: middle">30% 이상</td>
            <td style="text-align: center; vertical-align: middle">1 이상</td>
            <td style="text-align: center; vertical-align: middle">증가</td>
          </tr>
          <tr :class="{ active: dbwl }">
            <td style="text-align: center; vertical-align: middle">유지</td>
            <td style="text-align: center; vertical-align: middle">-</td>
            <td style="text-align: center; vertical-align: middle">1 이상</td>
            <td style="text-align: center; vertical-align: middle">증가</td>
          </tr>
          <tr :class="{ active: thlxhl }">
            <td style="text-align: center; vertical-align: middle">쇠퇴</td>
            <td style="text-align: center; vertical-align: middle">30% 미만</td>
            <td style="text-align: center; vertical-align: middle">1 미만</td>
            <td style="text-align: center; vertical-align: middle">감소</td>
          </tr>
        </tbody>
      </table>
    </div>

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
  </div>
</template>

<script setup lang="ts">
  import { computed, onBeforeMount, onMounted } from 'vue'
  import { storeToRefs } from 'pinia'

  import Item from '@/components/app/menu-2/Item.vue'
  import Table from '@/components/app/menu-1/sub-1/left/Table.vue'

  import { useMenu2Sub1Store } from '@/stores/app/menu-2/sub-1'
  import commonUtil from '@/utils/commonUtil'

  const menu2Sub1Store = useMenu2Sub1Store()
  const { overview } = storeToRefs(menu2Sub1Store)

  const tjdwkd = computed(() => overview?.value?.itaResult === '성장')
  const dbwl = computed(() => overview?.value?.itaResult === '유지')
  const thlxhl = computed(() => overview?.value?.itaResult === '쇠퇴')

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
</style>
