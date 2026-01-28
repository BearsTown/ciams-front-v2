import CommonUtil from '@/utils/commonUtil'

function calculateRatios(data, totals, key, decimalPlaces = 1) {
  // 입력 검증
  if (!data || typeof data !== 'object' || !totals || !totals[key]) {
    return new Map()
  }

  const total = totals[key]

  // 총합이 0인 경우 처리
  const result = new Map()
  if (total === 0) {
    Object.keys(data).forEach((category) => {
      result.set(category, (0).toFixed(decimalPlaces))
    })
    return result
  }

  // 비율 계산 (높은 정밀도 유지)
  const ratios = Object.entries(data).map(([category, values]) => {
    if (typeof values[key] !== 'number' || isNaN(values[key])) {
      throw new Error(`'${key}' 값은 숫자여야 합니다.`)
    }
    return { category, ratio: (values[key] / total) * 100 }
  })

  // 소수점 자릿수에 맞춰 반올림
  const roundedRatios = ratios.map((item) => ({
    category: item.category,
    ratio: Number(item.ratio.toFixed(decimalPlaces)),
  }))

  // 반올림 후 총합 계산
  let roundedTotal = roundedRatios.reduce((acc, item) => acc + item.ratio, 0)

  // 총합이 100이 되도록 조정
  if (Math.abs(roundedTotal - 100) > 0.0001) {
    // 가장 큰 비율의 인덱스 찾기
    const maxIndex = roundedRatios.reduce(
      (maxIdx, item, idx) => (item.ratio > roundedRatios[maxIdx].ratio ? idx : maxIdx),
      0,
    )

    // 오차 계산 (100 - 현재 총합)
    const adjustment = 100 - roundedTotal

    // 가장 큰 비율에 오차를 더해 조정
    roundedRatios[maxIndex].ratio = Number(
      (roundedRatios[maxIndex].ratio + adjustment).toFixed(decimalPlaces),
    )
  }

  // Map 객체에 결과 저장
  roundedRatios.forEach((item) => {
    result.set(item.category, item.ratio.toFixed(decimalPlaces))
  })

  return result
}

export function processData(params) {
  const { features, columns, rows, groupName, useNoneColumn } = params

  // 동적으로 집계할 객체 초기화
  const groupedData = {}

  // 전체 합계를 저장할 객체
  const totals = {}
  rows.forEach((row) => {
    totals[row.name] = 0
  })

  // 각 컬럼별로 rows에 정의된 모든 열을 0으로 초기화
  columns.forEach((col) => {
    groupedData[col.name] = {}
    rows.forEach((row) => {
      groupedData[col.name][row.name] = 0
    })
  })

  // Feature 데이터를 순회하며 집계
  features.forEach((feature) => {
    const cls1 = feature.get([groupName])
    let matched = false

    // 컬럼별로 매핑
    columns.forEach((col) => {
      if (col.useRange) {
        // 범위 기반 매핑
        if (Number(cls1) >= Number(col.start) && Number(cls1) <= Number(col.end)) {
          feature.set('color', col.color)

          rows.forEach((row) => {
            if (row.aggType === 'COUNT') {
              groupedData[col.name][row.name] += 1
              totals[row.name] += 1
            } else if (row.aggType === 'SUM') {
              const rowValue = feature.get([row.name])
              const value = parseFloat(rowValue) || 0
              groupedData[col.name][row.name] += value
              totals[row.name] += value
            }
          })
          matched = true
        }
      } else if (!matched && col.name === cls1) {
        // 범위가 아닌 경우 CLS1 기준으로 매핑
        feature.set('color', col.color)

        rows.forEach((row) => {
          if (row.aggType === 'COUNT') {
            groupedData[col.name][row.name] += 1
            totals[row.name] += 1
          } else if (row.aggType === 'SUM') {
            const rowValue = feature.get([row.name])
            const value = parseFloat(rowValue) || 0
            groupedData[col.name][row.name] += value
            totals[row.name] += value
          }
        })
        matched = true
      } else if (
        !matched &&
        !columns.map((col) => col.name).includes(cls1) &&
        col.name === 'other'
      ) {
        // 기타 처리
        feature.set('color', col.color)

        rows.forEach((row) => {
          if (row.aggType === 'COUNT') {
            groupedData[col.name][row.name] += 1
            totals[row.name] += 1
          } else if (row.aggType === 'SUM') {
            const rowValue = feature.get([row.name])
            const value = parseFloat(rowValue) || 0
            groupedData[col.name][row.name] += value
            totals[row.name] += value
          }
        })
        matched = true
      } else {
        if (!matched) {
          feature.set('color', 'rgb(0,0,0,0)')
          feature.set('removed', true)
        }
      }
    })
  })

  return columns.map((col) => {
    const data = {}
    // 각 row에 대해 값 설정
    rows.forEach((row) => {
      let value = groupedData[col.name][row.name]

      if (row.dataType === 'INTEGER') {
        value = Math.trunc(value)
      } else if (row.dataType === 'DOUBLE') {
        value = parseFloat(parseFloat(value).toFixed(1))
      }

      data[row.name] = { value, ratio: 0 } // 임시로 0 설정
    })

    // 각 row.name에 대해 비율 계산
    rows.forEach((row) => {
      const ratios = calculateRatios(groupedData, totals, row.name, 1)
      data[row.name].ratio = parseFloat(ratios.get(col.name) || '0')
    })

    const allZero = rows.every((row) => groupedData[col.name][row.name] === 0)

    return {
      ...col,
      data,
      // dataType: 123,
      visible: useNoneColumn ? true : !allZero,
    }
  })
}

export function processChartData(params) {
  const { axis, attributes, tableData } = params

  const categories = [
    {
      type: 'category',
      data: tableData.filter((item) => item.visible === true).map((item) => item.shorts),
      axisPointer: {
        type: 'shadow',
      },
      axisLabel: {
        interval: 0,
        fontSize: 10,
      },
    },
  ]

  const values = attributes.map((item) => ({
    type: 'value',
    name: item.label,
  }))

  const series: object[] = []

  attributes.forEach((attr, idx) => {
    const item = {
      name: attr.label,
      type: attr.seriesType,
      // barWidth: 20,
      barMaxWidth: '20',
      [`${axis === 'X' ? 'y' : 'x'}AxisIndex`]: idx,
      data: [] as object[],
      tooltip: {
        valueFormatter: function (value) {
          // return `${value} ${attr.unit}`
          return CommonUtil.comma(value as number) + ` ${attr.unit}`
        },
      },
    }

    tableData.forEach((data) => {
      if (!data.visible) return false

      item.data.push({
        value: data.data[attr.name].value,
        itemStyle: {
          color: data.color,
        },
      })
    })

    series.push(item)
  })

  return {
    series,
    grid: {
      top: '10%',
      left: '5%',
      right: '10%',
      bottom: '0%',
      containLabel: true,
    },
    tooltip: {
      trigger: 'item',
      axisPointer: {
        type: 'shadow',
        crossStyle: {
          // color: '#999',
        },
      },
    },
    dataZoom: [
      {
        type: 'inside',
      },
    ],
    xAxis: axis === 'X' ? categories : values,
    yAxis: axis === 'X' ? values : categories,
    // ...(axis === 'X'
    //   ? { xAxis: categories, yAxis: values }
    //   : axis === 'Y'
    //   ? { xAxis: values, yAxis: categories }
    //   : null),
  }
}

export function axisMinMax(data: number[]) {
  const minValue = Math.min(...data)
  const maxValue = Math.max(...data)

  const digits = Math.floor(Math.log10(maxValue)) + 1

  let unit
  if (digits <= 2) {
    unit = Math.pow(10, digits - 1) // 1자리: 1, 2자리: 10
  } else {
    unit = Math.pow(10, digits - 2) // 3자리: 100, 4자리: 1000, 5자리: 10000, 6자리: 10000
  }

  return {
    axisMin: Math.floor(minValue / unit) * unit,
    axisMax: Math.ceil(maxValue / unit) * unit,
  }
}

export function formatPercentage(value: number, decimals = 1) {
  if (value < 0 || value > 100) {
    throw new Error('Value must be between 0 and 100')
  }

  const formattedBase = Number(value.toFixed(decimals))
  const formattedEtc = Number((100 - value).toFixed(decimals))

  return {
    base: formattedBase,
    etc: formattedEtc,
  }
}
