<template>
  <div class="container" style="display: flex; flex-direction: row">
    <div style="flex: 1; display: flex; flex-direction: column">
      <div style="display: flex; flex-direction: column">
        <div class="title" style="display: flex; flex-direction: column">
          <span style="flex: 1">{{ title }}</span>
        </div>

        <table class="customTable">
          <colgroup>
            <col style="width: 50%" />
            <col style="width: 50%" />
          </colgroup>
          <tbody>
            <template v-for="item in items" :key="item">
              <tr>
                <th style="text-align: center; vertical-align: middle">{{ item.label }}</th>
                <td style="text-align: right; vertical-align: middle">
                  {{ valueFormatter(item.value, item.unit) }}
                </td>
              </tr>
            </template>
          </tbody>
        </table>

        <Source :list="sources" style="font-size: 11px; margin-top: 5px" />
      </div>
    </div>

    <div style="flex: 1; height: 160px">
      <v-chart
        v-if="!CommonUtil.isInvalidNumber(data.value)"
        class="chart"
        :option="option"
        autoresize
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'

  import VChart from 'vue-echarts'

  import Source from '@/components/common/Source.vue'

  import { dataUtil } from '@/utils'
  import CommonUtil from '@/utils/commonUtil'

  import { SourceGroupDTO } from '@/api/app/source/model'

  const props = withDefaults(
    defineProps<{
      title?: string
      data: {
        value: number
        names: string[2]
      }
      items: {
        label: string
        value: string | number
        unit: string
      }[]
      sources?: SourceGroupDTO.SourceDTO[]
      colors?: string[]
    }>(),
    {
      title: '',
      sources: () => [],
    },
  )

  const rData = computed(() => {
    const value = CommonUtil.isInvalidNumber(props.data.value) ? 0 : props.data.value
    const formatted = dataUtil.formatPercentage(value, 1)

    return [
      {
        name: props.data.names[0],
        value: formatted.base,
      },
      {
        name: props.data.names[1],
        value: formatted.etc,
      },
    ]
  })

  const option = computed(() => ({
    tooltip: {
      valueFormatter: (value: number) => `${value} %`,
    },
    series: [
      {
        type: 'pie',
        radius: '90%',
        avoidLabelOverlap: false,
        itemStyle: {
          borderWidth: 2,
          borderRadius: 5,
          borderColor: '#fff',
        },
        label: {
          show: true,
          position: 'inside',
          formatter: '{b}\n{c}%',
          color: '#fff',
          textBorderColor: '#000',
          textBorderWidth: 2,
          fontSize: 12,
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
        data: CommonUtil.isInvalidNumber(props.data.value) ? [] : rData.value,
        color: props.colors,
      },
    ],
  }))

  function valueFormatter(val: number | string, unit: string) {
    if (typeof val === 'string') {
      return `${val} ${unit}`
    } else if (CommonUtil.isInvalidNumber(val)) {
      return `${unit}`
    } else {
      return `${CommonUtil.comma(val)} ${unit}`
    }
  }
</script>

<style scoped lang="scss">
  .title {
    font-size: 15px;
    padding-bottom: 10px;
  }
</style>
