<template>
  <table class="customTable">
    <colgroup>
      <template v-for="i in colSize" :key="i">
        <col :width="`${labelSize}%`" />
        <col :width="`${100 / colSize - labelSize}%`" />
      </template>
    </colgroup>
    <tbody>
      <tr v-for="idx in rowSize" :key="idx">
        <template v-for="i in colSize" :key="i">
          <th style="text-align: center">
            {{ currentLabel(idx, i)?.label || '' }}
          </th>
          <td style="text-align: center">
            {{ data ? currentLabel(idx, i)?.formatter(data) : '' }}
          </td>
        </template>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
  import { computed, toRefs } from 'vue'

  import Kgeo from '@/models/api/app/kgeo'

  interface LabelList {
    label: string
    prop: string
    formatter: (row: Kgeo.BuildInfo) => string
    width: string
  }

  const props = withDefaults(
    defineProps<{
      labelList: LabelList[]
      data?: Object
      labelSize: number
      colSize: number
    }>(),
    {},
  )

  const { labelList, data, labelSize, colSize } = toRefs(props)

  const rowSize = computed<number>(() => {
    return Math.ceil(labelList.value.length / colSize.value)
  })

  const currentLabel = (idx: number, i: number): LabelList => {
    const index = idx * colSize.value - (colSize.value - i + 1)
    return labelList.value[index]
  }
</script>
<style lang="scss" scoped>
  .customTable {
    :deep(td),
    :deep(th) {
      font-size: 12px !important;
      padding: 8px 7px !important;
    }
  }
</style>
