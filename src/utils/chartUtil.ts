import { cloneDeep } from 'lodash-es'
// import { merge } from 'lodash/fp'
import { v4 as uuidV4 } from 'uuid'
import * as echarts from 'echarts'
type EChartsOption = echarts.EChartsOption

interface CustomEChartsOption extends EChartsOption {
  titleName: string
  unitName: string
}

interface dataList {
  label: string
  value: number
  color: string
}

export interface Iparam {
  data: dataList[] /* 데이터 */
  filter?: string[] /*필터 [보여질 항목 label값 array 형태로] */
  titleName: string /* 타이틀명 */
  unitName?: string /* 단위명 */
  isHorizontal?: boolean /* 축 변경 여부 true - 가로, false - 세로 */
  isAdmin?: boolean /* 관리자페이지 사용여부 */
  isLabelRotate?: boolean /*라벨 기울기 강제로*/
}

//라벨 기울기 체크용
const MAX_LABEL_FONT_SIZE = 6
const MAX_LABEL_SUM_SIZE = 30

const chartUtil = {
  chartOptionInit: () => {
    return {
      id: uuidV4().split('-').join(''),
      title: {},
      grid: {},
      tooltip: {},
      series: {},
      textStyle: {},
      legend: {},
      animationDurationUpdate: 0,
    }
  },

  /**
   * 현재 미사용 - 형태만 정의
   * @returns
   */
  infoInit: () => {
    return {
      id: uuidV4().split('-').join(''),
      title: {
        name: '',
        desc: '',
      },
      subTitle: {
        name: '',
        isIcon: false,
        iconType: 'up',
      },
      bottomTitle: {
        name: '',
        isIcon: false,
        iconType: 'up',
      },
    }
  },

  makeChartOption: function (type: 'BAR' | 'LINE' | 'PIE', options: Iparam) {
    let resultOptions
    if (type == 'BAR') {
      resultOptions = this.initBar(options)
    } else if (type == 'LINE') {
      resultOptions = this.initLine(options)
    } else if (type == 'PIE') {
      resultOptions = this.initPie(options)
    }

    //일반 데이터 세팅
    resultOptions['etc'] = Object.assign(
      {},
      {
        type: type,
        isHorizontal: options.isHorizontal,
        unitName: options.unitName,
        titleName: options.titleName,
        data: options.data,
        isAdmin: options.isAdmin ? options.isAdmin : false,
      },
    )

    return resultOptions
  },

  //그룹핑 데이터 가공
  groupByCountMakeChartData: function (data) {
    const result: any[] = []
    data.reduce(function (res, value) {
      if (!res[value.label]) {
        res[value.label] = { label: value.label, value: 0, color: chartUtil.random.color() }
        result.push(res[value.label])
      }
      res[value.label].value += 1
      return res
    }, {})
    return result
  },

  //그룹핑 데이터 가공
  groupByMakeChartData: function (dataList: any[], labelKey: string, valueKey: string) {
    const result: any[] = []
    dataList.reduce(function (res, obj) {
      if (!res[obj[labelKey]]) {
        res[obj[labelKey]] = { label: obj[labelKey], value: 0, color: chartUtil.random.color() }
        result.push(res[obj[labelKey]])
      }
      res[obj[labelKey]].value =
        (res[obj[labelKey]].value * 1000 + Number(obj[valueKey]) * 1000) / 1000
      return res
    }, {})
    return result
  },

  //차트형식 데이터 가공
  makeChartData: function (dataList: any[], labelKey: string, valueKey: string) {
    const colorList: string[] = []
    const makeColor = () => {
      // const _color = this.random.color()
      // if (colorList.indexOf(_color) > -1) {
      //   return makeColor()
      // } else {
      //   colorList.push(_color)
      //   return _color
      // }
      return this.random.color()
    }
    const result = dataList.map((item) => {
      return {
        label: item[labelKey] ? item[labelKey] : '없음',
        value: item[valueKey] ? item[valueKey] : 0,
        color: makeColor(),
      }
    })

    return result
  },

  initBar: function (_options: Iparam) {
    const options = _options || {}

    const data = options.data
    //init
    const chartOption = cloneDeep(this.chartOptionInit())

    //기울기 체크
    let isLabelRotation = this.labelRotationCheck(data)
    if (options.isLabelRotate) {
      isLabelRotation = options.isLabelRotate
    }
    options['isLabelRotation'] = isLabelRotation
    //기울기와 라벨길이에 따른 길이값
    const labelMaxLength = this.labelMaxLength(options)

    //차트 라벨
    const labelShow = false

    const title = {
      text: '목적별 현황',
      left: 'center',
      // top: 'center',
      textStyle: {
        fontSize: 15,
        color: 'rgba(33, 142, 150, 1)',
      },
    }

    const tooltip = {
      formatter: function (params) {
        return params.marker + params.name + '&nbsp;&nbsp;&nbsp;<b>' + params.value + '</b>'
      },
    }

    const grid = {
      top: options.isHorizontal ? '15px' : '5%',
      // left: options.isHorizontal ? this.labelMaxLength(options) + 15 : '50',
      left: labelMaxLength + 15,
      right: '35px',
      bottom: options.isHorizontal ? '40px' : !isLabelRotation ? labelMaxLength + 5 + 'px' : '40px',
    }

    const xAxis = {
      type: 'category',
      // axisPointer: {
      //   type: 'shadow',
      //   show: true
      // },
      data: data
        ? data.map((obj) => {
            return {
              value: obj.label,
              textStyle: {},
            }
          })
        : null,
      axisLabel: {
        interval: 0,
        rotate: options.isHorizontal ? 0 : isLabelRotation ? 0 : -45, //기울기
        show: true, //보여줌
        fontSize: options.isHorizontal ? 12 : 11, //라벨크기
        color: '#AAAAAA',
        formatter: function (value, index) {
          let res = ''
          if (!isLabelRotation && value.length > MAX_LABEL_FONT_SIZE) {
            res = value.substring(0, MAX_LABEL_FONT_SIZE) + '...'
          } else {
            res = value
          }
          return res
        },
      },
    }

    const yAxis = {
      type: 'value',
      axisLabel: {
        show: true,
        formatter: function (value, index) {
          let res = ''
          if (!isLabelRotation && value.length > MAX_LABEL_FONT_SIZE) {
            res = value.substring(0, MAX_LABEL_FONT_SIZE) + '...'
          } else {
            res = value
          }
          return res
        },
      },
      axisLine: {
        show: true,
      },
      //줄나뉨
      splitLine: {
        show: true,
      },
    }

    const series_x = {
      type: 'bar',
      stack: 'total',
      data: data
        ? data.map((obj) => {
            if (options.filter && options.filter.indexOf(obj.label) == -1) {
              return {
                itemStyle: {
                  color: '#EEEEEE',
                  opacity: 0.5,
                  borderColor: '#DDDDDD',
                  borderType: 'dashed',
                  borderWidth: 1,
                },
                value: obj.value,
              }
            } else {
              return {
                itemStyle: {
                  color: obj.color,
                  opacity: 1,
                },
                value: obj.value,
              }
            }
          })
        : null,
      label: {
        show: labelShow,
        position: options.isHorizontal ? 'right' : 'top',
      },
    }

    const series_y = {
      type: 'bar',
      stack: 'total',
      data: [],
    }

    const series = [
      options.isHorizontal ? series_y : series_x,
      options.isHorizontal ? series_x : series_y,
    ]

    const textStyle = {
      fontFamily: 'sans-serif',
    }

    // chartOption.title = this.title;
    chartOption.grid = grid
    // chartOption.tooltip = tooltip
    chartOption['xAxis'] = xAxis
    chartOption['yAxis'] = yAxis
    chartOption.series = series
    chartOption.textStyle = textStyle
    chartOption.animationDurationUpdate = 250

    // 사용 축 설정에 따라 축 변경.
    Object.assign(chartOption, {
      xAxis: options.isHorizontal ? yAxis : xAxis,
      yAxis: options.isHorizontal ? xAxis : yAxis,
    })
    // chartOption = merge(chartOption, {
    //   xAxis: options.isHorizontal ? yAxis : xAxis,
    //   yAxis: options.isHorizontal ? xAxis : yAxis,
    // })

    return chartOption
  },

  initPie: function (_options: { data: dataList[]; titleName: string; unitName?: string }) {
    const options = _options || {}

    const data = options.data

    //init
    const chartOption = cloneDeep(this.chartOptionInit())
    chartOption['titleName'] = options.titleName
    if (options.unitName) chartOption['unitName'] = options.unitName

    const tooltip = {
      trigger: 'item',
    }

    const title = {}

    const grid = {
      top: '10%',
      // right: '0%',
      // containLabel: true,
      // width: '250px',
      // height: '100px',
      // left: '10%',
      // bottom : '20%'
    }

    const legend = {
      top: '20%',
      right: '10%',
      orient: 'vertical',
      itemGap: 2,
      textStyle: {
        fontSize: 11,
      },
      type: 'scroll',
    }

    const series = {
      type: 'pie',
      radius: ['50%', '85%'],
      center: ['35%', '50%'],
      // top: '10%',
      // bottom:'0%',
      avoidLabelOverlap: false,
      label: {
        show: true,
        position: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        // formatter: (obj) => {
        //   const totalCnt = data
        //     .map((item) => item.value)
        //     .reduce((prev: number, curr: number) => prev + curr, 0)
        //   return totalCnt
        // },
        formatter: () => {
          const totalCnt = data
            .map((item) => item.value)
            .reduce((prev: number, curr: number) => (prev * 1000 + curr * 1000) / 1000, 0)
          return totalCnt
        },
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)',
        },
        // label: {
        //   show: true,
        //   fontSize: 40,
        //   fontWeight: 'bold'
        // }
      },
      labelLine: {
        show: false,
      },
      data: data
        ? data.map((obj) => {
            return {
              itemStyle: {
                color: obj.color,
                opacity: 1,
              },
              value: obj.value,
              name: obj.label,
            }
          })
        : [],
    }

    const textStyle = {
      fontFamily: 'sans-serif',
    }

    chartOption.title = title
    chartOption.grid = grid
    chartOption.tooltip = tooltip
    chartOption.legend = legend
    chartOption.series = series
    chartOption.textStyle = textStyle
    chartOption.animationDurationUpdate = 250

    return chartOption
  },

  /**
   *
   * @param {*} _options
   * @param opt_options.isHorizontal {Boolean} 축 변경 여부 true - 가로, false - 세로,
   * @param opt_options.isAdmin {Boolean} 접속자통계 관리 사용여부(관리자페이지에서 사용) true- 사용, false - 미사용
   * @param opt_options.titleName {String} 타이틀명
   * @returns
   */
  initLine: function (_options: Iparam) {
    const options = _options || {}

    const data = options.data

    //init
    const chartOption = cloneDeep(this.chartOptionInit())

    //차트 라벨
    const labelShow = false

    const title = {
      text: '목적별 현황',
      left: 'center',
      // top: 'center',
      textStyle: {
        fontSize: 15,
        color: 'rgba(33, 142, 150, 1)',
      },
    }

    const grid = {
      top: '10%',
      // containLabel: true,
      // width: '250px',
      // height: '60%',
      // left: '20%',bottom : '20%'
    }

    const isLabelRotation = this.labelRotationCheck(data)

    const xAxis = {
      type: 'category',
      data: data
        ? data.map((obj) => {
            return {
              value: obj.label,
              textStyle: {},
            }
          })
        : null,
      axisLabel: {
        interval: 0,
        rotate: options.isHorizontal ? 0 : isLabelRotation ? 0 : -45, //기울기
        show: true, //보여줌
        fontSize: options.isAdmin ? 12 : options.isHorizontal ? 11 : 10, //라벨크기
        overflow: 'truncate',
        ellipsis: '...',
        color: '#AAAAAA',
        formatter: function (value, index) {
          let res = ''
          if (!isLabelRotation && value.length > MAX_LABEL_FONT_SIZE) {
            res = value.substring(0, MAX_LABEL_FONT_SIZE) + '...'
          } else {
            res = value
          }
          return res
        },
      },

      //줄나뉨
      splitLine: {
        show: true,
      },
    }

    const yAxis = {
      type: 'value',
      axisLabel: {
        show: true,
        formatter: function (value, index) {
          let res = ''
          if (!isLabelRotation && value.length > MAX_LABEL_FONT_SIZE) {
            res = value.substring(0, MAX_LABEL_FONT_SIZE) + '...'
          } else {
            res = value
          }
          return res
        },
      },
      axisLine: {
        show: true,
      },
      //줄나뉨
      splitLine: {
        show: true,
      },
    }

    const series_x = {
      type: 'line',
      stack: 'total',
      data: data
        ? data.map((obj) => {
            if (options.filter && options.filter.indexOf(obj.label) == -1) {
              return {
                itemStyle: {
                  color: '#EEEEEE',
                  opacity: 0.5,
                  borderColor: '#DDDDDD',
                  borderType: 'dashed',
                  borderWidth: 1,
                },
                value: obj.value,
              }
            } else {
              return {
                itemStyle: {
                  // color: obj.color,
                  opacity: 1,
                },
                value: obj.value,
              }
            }
          })
        : null,
      label: {
        show: labelShow,
        position: options.isHorizontal ? 'right' : 'top',
      },
      lineStyle: {
        color: '#AAAAAA',
      },
    }

    const series_y = {
      type: 'line',
      stack: 'total',
      data: [],
      lineStyle: {
        color: '#AAAAAA',
      },
    }

    const series = [
      options.isHorizontal ? series_y : series_x,
      options.isHorizontal ? series_x : series_y,
    ]

    const textStyle = {
      fontFamily: 'sans-serif',
    }

    // chartOption.title = this.title;
    chartOption.grid = grid
    chartOption.tooltip = {}
    chartOption['xAxis'] = xAxis
    chartOption['yAxis'] = yAxis
    chartOption.series = series
    chartOption.textStyle = textStyle
    chartOption.animationDurationUpdate = 250

    // 사용 축 설정에 따라 축 변경.
    Object.assign(chartOption, {
      xAxis: options.isHorizontal ? yAxis : xAxis,
      yAxis: options.isHorizontal ? xAxis : yAxis,
    })

    if (!options.isAdmin) {
      Object.assign(chartOption.grid, {
        top: options.isHorizontal ? '5%' : '5%',
        left: options.isHorizontal ? '20%' : '50',
        right: options.isHorizontal ? '15%' : '5%',
        bottom: options.isHorizontal ? '10%' : '40',
      })
    }

    return chartOption
  },

  /**
   * 라벨 기울기 적용 여부 체크
   */
  labelRotationCheck: function (dataList: dataList[] = []) {
    if (dataList.length == 0) return true
    //max 라벨 객체
    const maxLabelObj = dataList.reduce((prev, item) => {
      return prev.label.length >= item.label.length ? prev : item
    })

    //라벨 길이 총합
    const maxLabelSum = dataList.reduce((prev, item) => prev + (item.label + '').length, 0)

    if (
      dataList &&
      maxLabelObj.label.length > MAX_LABEL_FONT_SIZE &&
      maxLabelSum > MAX_LABEL_SUM_SIZE
    ) {
      return false
    } else if (dataList && maxLabelSum > MAX_LABEL_SUM_SIZE) {
      return false
    } else {
      return true
    }
  },

  /**
   * 라벨 최대 길이 계산
   */
  labelMaxLength: function (options: Iparam) {
    if (options.data && options.data.length == 0) {
      return 0
    }
    //max 라벨 객체
    const maxLabelObj = options.data.reduce((prev, item) => {
      return prev.label.length >= item.label.length ? prev : item
    })

    //라벨 길이 계산
    function getTextWidth(text, font, isHorizontal) {
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')
      if (context) {
        if (isHorizontal) {
          context.font = `bold 12px ${font}`
        } else {
          context.font = `bold 12px ${font} ${!options['isLabelRotation'] ? 'rotate(-45deg)' : ''}`
        }

        const metrics = context.measureText(text)
        let res = Math.ceil(metrics.width) + 8
        if (!isHorizontal && options['isLabelRotation']) {
          res = 40
        }
        return res
      } else {
        return 0
      }
    }

    //6자리 이상이면 ...
    let text = maxLabelObj.label
    if (maxLabelObj.label.length > MAX_LABEL_FONT_SIZE) {
      text = maxLabelObj.label.substring(0, MAX_LABEL_FONT_SIZE) + '...'
    }

    return getTextWidth(text, 'Nanum Gothic', options.isHorizontal)
  },

  random: {
    value: () => Math.floor(Math.random() * 100),
    // color: () => {
    //   let hex = '#'
    //   for (let c = 0; c < 6; c++) {
    //     hex += Math.round(Math.random() * 0xf).toString(16)
    //   }
    //   return hex
    // },
    //색상 고정
    color: () => '#44619B',
  },
}
export default chartUtil
