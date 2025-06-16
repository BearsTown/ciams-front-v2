<template>
  <div class="urbanInfo active">
    <div class="container">
      <div class="title">지역여건 분석</div>

      <div class="title">
        {{ overview ? `${overview.zoneName} (${commonUtil.comma(overview.zoneArea.toFixed(3))}㎡)` : '-' }}
        {{ overview ? `${overview.useDist}` : '' }}
      </div>

      <table class="customTable analysis">
        <colgroup>
          <col style="width: 30%" />
          <col style="width: 35%" />
          <col style="width: 35%" />
        </colgroup>
        <thead>
          <tr>
            <th scope="col" style="text-align: center">구분</th>
            <th scope="col" style="text-align: center">산업시설 노후도</th>
            <th scope="col" style="text-align: center">도로율</th>
          </tr>
        </thead>
        <tbody>
          <tr :class="{ active: didgh }">
            <td style="text-align: center; vertical-align: middle">양호</td>
            <td style="text-align: center; vertical-align: middle">50% 미만</td>
            <td style="text-align: center; vertical-align: middle">10% 이상</td>
          </tr>
          <tr :class="{ active: qnffid }">
            <td style="text-align: center; vertical-align: middle">불량</td>
            <td style="text-align: center; vertical-align: middle">50% 이상</td>
            <td style="text-align: center; vertical-align: middle">10% 미만</td>
          </tr>
        </tbody>
      </table>
    </div>

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
</template>

<script setup lang="ts">
  import { computed, onBeforeMount, onMounted } from 'vue'
  import { storeToRefs } from 'pinia'

  import Table from '@/components/app/menu-1/sub-1/left/Table.vue'

  import commonUtil from '@/utils/commonUtil'
  import { useMenu2Sub2Store } from '@/stores/app/menu-2/sub-2'
  import Item from '@/components/app/menu-2/Item.vue'

  const menu2Sub2Store = useMenu2Sub2Store()
  const { overview } = storeToRefs(menu2Sub2Store)

  const didgh = computed(() => overview?.value?.locResult === '양호')
  const qnffid = computed(() => overview?.value?.locResult === '불량')

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
