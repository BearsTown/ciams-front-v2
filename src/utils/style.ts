export function createLegend(data, levels, startColor, baseColor) {
  // 데이터 정렬 및 중복 제거
  const sortedData = [...new Set(data)].sort((a, b) => a - b)

  // 정확한 경계값 계산 (또는 지정)
  const breaks = jenks(sortedData, levels)

  // 색상 보간 생성
  const colors = interpolateColors(startColor, baseColor, levels)

  // 범례 정보 생성
  const legend = createLegendInfo(breaks, colors)

  return {
    breaks,
    colors,
    legend,
  }
}

export function jenks(data, n_classes) {
  n_classes = parseInt(n_classes)
  // data = [...new Set(data)].sort((a, b) => a - b);
  const matrices = jenksMatrices(data, n_classes),
    lower_class_limits = matrices.lower_class_limits
  let k = data.length - 1
  const kclass = []
  let countNum = n_classes

  if (data.length < n_classes + 1) {
    let valPerSlice = data
    const tmpValperSlice = []
    for (let i = 0; i < n_classes + 1; i++) {
      if (data.length == 1) {
        let max = data[0]
        if (max < 0) {
          let gap = (0 - max) / n_classes
          tmpValperSlice.push(max + gap * i)
        } else {
          tmpValperSlice.push(max + max * i)
        }
      } else {
        if (i == 0) {
          let min = Math.min.apply(null, data)
          let max = Math.max.apply(null, data)
          let gap = (max - min) / n_classes
        }

        if (min < 0) {
          if (gap < 0) {
            tmpValperSlice.push(min - gap * i)
          } else {
            tmpValperSlice.push(min + gap * i)
          }
        } else {
          tmpValperSlice.push(min + gap * i)
        }

        if (i == n_classes) {
          tmpValperSlice.pop()
          tmpValperSlice.push(max)
        }
      }
    }

    valPerSlice = tmpValperSlice
    for (let i = 0; i < valPerSlice.length; i++) {
      valPerSlice[i] = parseFloat(parseFloat(valPerSlice[i]).toFixed(2))
    }

    return valPerSlice
  }

  kclass[n_classes] = data[data.length - 1]
  kclass[0] = data[0]

  while (countNum > 1) {
    kclass[countNum - 1] = data[lower_class_limits[k][countNum] - 1]
    k = lower_class_limits[k][countNum] - 1
    if (k < 0) {
      k = 0
    }
    countNum--
  }

  for (let i = 0; i < kclass.length; i++) {
    kclass[i] = parseFloat(parseFloat(kclass[i]).toFixed(2))
  }

  return kclass
}

function jenksMatrices(data, n_classes) {
  let lower_class_limits = [],
    variance_combinations = [],
    i,
    j,
    variance = 0

  for (i = 0; i < data.length + 1; i++) {
    let tmp1 = [],
      tmp2 = []
    for (j = 0; j < n_classes + 1; j++) {
      tmp1.push(0)
      tmp2.push(0)
    }
    lower_class_limits.push(tmp1)
    variance_combinations.push(tmp2)
  }

  for (i = 1; i < n_classes + 1; i++) {
    lower_class_limits[1][i] = 1
    variance_combinations[1][i] = 0

    for (j = 2; j < data.length + 1; j++) {
      variance_combinations[j][i] = Infinity
    }
  }

  for (let l = 2; l < data.length + 1; l++) {
    let sum = 0,
      sum_squares = 0,
      w = 0,
      i4 = 0

    for (let m = 1; m < l + 1; m++) {
      let lower_class_limit = l - m + 1,
        val = data[lower_class_limit - 1]
      w++
      sum += val
      sum_squares += val * val
      variance = sum_squares - (sum * sum) / w
      i4 = lower_class_limit - 1

      if (i4 !== 0) {
        for (j = 2; j < n_classes + 1; j++) {
          if (variance_combinations[l][j] >= variance + variance_combinations[i4][j - 1]) {
            lower_class_limits[l][j] = lower_class_limit
            variance_combinations[l][j] = variance + variance_combinations[i4][j - 1]
          }
        }
      }
    }
    lower_class_limits[l][1] = 1
    variance_combinations[l][1] = variance
  }

  return {
    lower_class_limits: lower_class_limits,
    variance_combinations: variance_combinations,
  }
}

/**
 * HEX 색상 문자열을 RGB 배열로 변환
 * @param {string} hex - HEX 색상 문자열
 * @returns {Array<number>} [r, g, b] 형태의 RGB 배열
 */
function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return [r, g, b]
}

/**
 * RGB 배열을 HEX 색상 문자열로 변환
 * @param {Array<number>} rgb - [r, g, b] 형태의 RGB 배열
 * @returns {string} HEX 색상 문자열
 */
function rgbToHex(rgb) {
  return (
    '#' +
    rgb
      .map((x) => {
        const hex = Math.round(x).toString(16)
        return hex.length === 1 ? '0' + hex : hex
      })
      .join('')
  )
}

/**
 * 두 색상 사이의 색상을 보간하여 색상 배열 생성
 * @param {string} startColor - 시작 색상 (HEX)
 * @param {string} endColor - 종료 색상 (HEX)
 * @param {number} steps - 생성할 색상 개수
 * @returns {Array<string>} 보간된 HEX 색상 배열
 */
function interpolateColors(startColor, endColor, steps) {
  const startRgb = hexToRgb(startColor)
  const endRgb = hexToRgb(endColor)

  const stepFactor = 1 / (steps - 1)
  const interpolatedColorArray = []

  for (let i = 0; i < steps; i++) {
    const factor = stepFactor * i
    const interpolatedRgb = startRgb.map((start, index) => {
      return start + factor * (endRgb[index] - start)
    })

    interpolatedColorArray.push(rgbToHex(interpolatedRgb))
  }

  return interpolatedColorArray
}

/**
 * 급간 범위와 색상을 결합하여 범례 정보 생성
 * @param {Array<number>} breaks - 급간 경계값 배열
 * @param {Array<string>} colors - 색상 배열
 * @returns {Array<Object>} 범례 정보 배열
 */
function createLegendInfo(breaks, colors) {
  const legend = [] as object[]

  // 첫 번째 급간 (최소값 이하)
  legend.push({
    range: `${breaks[1]} 이하`,
    color: colors[0],
  })

  // 중간 급간들
  for (let i = 2; i < breaks.length - 1; i++) {
    legend.push({
      range: `${breaks[i - 1]} ~ ${breaks[i]} 이하`,
      color: colors[i - 1],
    })
  }

  // 마지막 급간 (최대값 초과)
  legend.push({
    range: `${breaks[breaks.length - 2]} 초과`,
    color: colors[colors.length - 1],
  })

  return legend
}

/**
 * 데이터 값에 해당하는 색상을 찾는 함수
 * @param {number} value - 데이터 값
 * @param {Array<number>} breaks - 급간 경계값 배열
 * @param {Array<string>} colors - 색상 배열
 * @returns {string} 데이터 값에 해당하는 색상
 */
export function getColorForValue(value, breaks, colors) {
  // 최소값 이하
  if (value <= breaks[1]) {
    return colors[0]
  }

  // 중간 값들
  for (let i = 2; i < breaks.length - 1; i++) {
    if (value <= breaks[i]) {
      return colors[i - 1]
    }
  }

  // 최대값 초과
  return colors[colors.length - 1]
}
