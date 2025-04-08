import type { Attribute, Item, RatioOptions } from '@/utils/data.types'

export function calculateRatios(
  dataList: Item[],
  attributes: Attribute[],
  options: RatioOptions = {},
): Item[] {
  const round = options.round ?? 1
  const cloned = dataList.map((item) => ({ ...item, ratio: {} }))

  attributes.forEach((attr) => {
    if (!attr.useRatio) return

    const total = dataList.reduce((sum, item) => sum + (item.data[attr.name] ?? 0), 0)

    cloned.forEach((item) => {
      const value = item.data[attr.name] ?? 0
      const ratio = total > 0 ? (value / total) * 100 : 0
      item.ratio![attr.name] = parseFloat(ratio.toFixed(round))
    })
  })

  return cloned
}

export const processData = (features, columns, rows, groupName, useNoneColumn) => {
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
    const cls1 = feature.getProperties()[groupName]
    let matched = false

    // 컬럼별로 매핑
    columns.forEach((col) => {
      if (col.useRange) {
        // 범위 기반 매핑
        // const value = parseFloat(feature.getProperties()[rows[0].name]) || 0 // 첫 번째 열 기준 (예: CLS1 값이 아닌 다른 값도 가능)
        if (cls1 >= col.start && cls1 <= col.end) {
          rows.forEach((row) => {
            const rowValue = feature.getProperties()[row.name]
            if (row.aggType === 'COUNT') {
              groupedData[col.name][row.name] += 1
              totals[row.name] += 1
            } else if (row.aggType === 'SUM') {
              const value = parseFloat(rowValue) || 0
              groupedData[col.name][row.name] += value
              totals[row.name] += value
            }
          })
          matched = true
        }
      } else if (!matched && col.name === cls1) {
        // 범위가 아닌 경우 CLS1 기준으로 매핑
        rows.forEach((row) => {
          const rowValue = feature.getProperties()[row.name]
          if (row.aggType === 'COUNT') {
            groupedData[col.name][row.name] += 1
            totals[row.name] += 1
          } else if (row.aggType === 'SUM') {
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
        rows.forEach((row) => {
          const rowValue = feature.getProperties()[row.name]
          if (row.aggType === 'COUNT') {
            groupedData[col.name][row.name] += 1
            totals[row.name] += 1
          } else if (row.aggType === 'SUM') {
            const value = parseFloat(rowValue) || 0
            groupedData[col.name][row.name] += value
            totals[row.name] += value
          }
        })
        matched = true
      }
    })
  })

  return columns.map((col) => {
    const data = {}
    rows.forEach((row) => {
      const value = groupedData[col.name][row.name]
      const total = totals[row.name]
      const ratio = total > 0 ? (value / total) * 100 : 0
      data[row.name] = {
        value,
        ratio: parseFloat(ratio.toFixed(1)),
      }
    })

    const allZero = rows.every((row) => groupedData[col.name][row.name] === 0)

    return {
      ...col,
      data,
      visible: useNoneColumn ? true : !allZero,
    }
  })
}
