import {
  Circle,
  Circle as CircleStyle,
  Fill,
  Icon,
  RegularShape,
  Stroke,
  Style,
  Text,
} from 'ol/style.js'
import { Geometry, LineString, Point, Polygon } from 'ol/geom.js'
import { getArea, getLength } from 'ol/sphere.js'
import { GeometryFunction } from 'ol/style/Style'
import { DrawType, MeasureType } from '@/types/map'
import { Feature } from 'ol'

const dashMeasure = new Style({
  fill: new Fill({
    color: 'rgba(255, 255, 255, 0.2)',
  }),
  stroke: new Stroke({
    color: 'rgba(0, 0, 0, 0.5)',
    lineDash: [10, 10],
    width: 2,
  }),
  image: new CircleStyle({
    radius: 5,
    stroke: new Stroke({
      color: 'rgba(0, 0, 0, 0.7)',
    }),
    fill: new Fill({
      color: 'rgba(255, 255, 255, 0.2)',
    }),
  }),
})
const measureColor = '#44619b'
const measure = new Style({
  stroke: new Stroke({
    color: measureColor,
    width: 4,
  }),
  image: new CircleStyle({
    radius: 3,
    stroke: new Stroke({
      color: measureColor,
    }),
    fill: new Fill({
      color: measureColor,
    }),
  }),
})
interface labelStyleParam {
  textBaseline?: CanvasTextBaseline
  offsetX?: number
  offsetY?: number
  padding?: number[]
  backgroundColor?: string
  fillColor?: string
}
const labelStyle = (option?: labelStyleParam) =>
  new Style({
    text: new Text({
      font: '12px Pretendard, sans-serif',
      fill: new Fill({
        color: option?.fillColor || '#ffffff',
      }),
      backgroundFill: new Fill({
        color: option?.backgroundColor || '#44619B',
      }),
      padding: option?.padding || [6, 11, 6, 11],
      textBaseline: option?.textBaseline || 'bottom',
      offsetY: option?.offsetY || -16,
      offsetX: option?.offsetX || 0,
    }),
  })
const pointImage = (type: 'start' | 'end') =>
  new Style({
    image: new Icon({
      anchor: [0.5, 46],
      anchorXUnits: 'fraction',
      anchorYUnits: 'pixels',
      src: `../assets/svg/${type}.svg`,
    }),
    zIndex: 100,
  })
const wfsVectorStyle = (feature) =>
  new Style({
    stroke: new Stroke({
      color: 'rgba(0, 0, 255, 1.0)',
      width: 2,
    }),
    image: new CircleStyle({
      radius: 3,
      fill: new Fill({ color: 'black' }),
      stroke: new Stroke({
        color: 'black',
      }),
    }),
    text: new Text({
      font: '0.8rem sans-serif',
      fill: new Fill({ color: 'white' }),
      stroke: new Stroke({
        color: 'rgba(0, 0, 0, 1)',
        width: 4,
      }),
      text: feature.get('AREA_NUM') || '',
    }),
    zIndex: 100,
  })
const customVectorStyle = (feature: Feature) => {
  const { LABEL, color } = feature.getProperties()['properties']
  return new Style({
    stroke: new Stroke({
      color: color ?? '#000000',
      width: 2,
    }),
    image: new CircleStyle({
      radius: 3,
      fill: new Fill({ color: color ?? '#000000' }),
      stroke: new Stroke({
        color: color ?? '#000000',
      }),
    }),
    text: new Text({
      font: '0.8rem sans-serif',
      fill: new Fill({ color: 'white' }),
      stroke: new Stroke({
        color: 'rgba(0, 0, 0, 1)',
        width: 4,
      }),
      text: LABEL || '',
    }),
    zIndex: 100,
  })
}
const customVectorChangeColorStyle = (features, color: string) => {
  const style = (LABEL: string) =>
    new Style({
      stroke: new Stroke({
        color: color ?? '#000000',
        width: 2,
      }),
      image: new CircleStyle({
        radius: 3,
        fill: new Fill({ color: color ?? '#000000' }),
        stroke: new Stroke({
          color: color ?? '#000000',
        }),
      }),
      text: new Text({
        font: '0.8rem sans-serif',
        fill: new Fill({ color: 'white' }),
        stroke: new Stroke({
          color: 'rgba(0, 0, 0, 1)',
          width: 4,
        }),
        text: LABEL || '',
      }),
      zIndex: 100,
    })
  features.forEach((feature) =>
    feature.setStyle(style(feature.getProperties()['properties'].LABEL)),
  )
}

const color_main = '#0F825F'
const color_sub_main = '#52B597'

export const defaultLabelText = (feature: Feature) =>
  new Text({
    font: 'bold 0.8rem sans-serif',
    backgroundFill: new Fill({
      color: color_main,
    }),
    backgroundStroke: new Stroke({
      color: color_sub_main,
      width: 1,
    }),
    padding: [5, 5, 1, 5],
    fill: new Fill({ color: '#ffffff' }),
    overflow: true,
    text: feature?.get('ciamsLabel') || '',
  })

const bufferLineStyle = (features: Feature[], option: any) => {
  // 외곽선 주위에 버퍼 생성
  const dyanamicStyle = (feature?: Feature) =>
    new Style({
      stroke: new Stroke({
        color: color_sub_main,
        width: 6,
      }),
      text: defaultLabelText(feature!),
      zIndex: 100,
    })
  const bufferedStyle = dyanamicStyle().clone()
  const stroke = bufferedStyle.getStroke() as Stroke
  stroke.setWidth(stroke.getWidth()! - 2)
  stroke.setColor(option.color || color_main)

  features.forEach((feature) => {
    feature.setStyle([dyanamicStyle(feature), bufferedStyle])
  })
}
/**
 * fill 색상을 넣는 것으로 수정
 * 기존 color 의 색상을 hex코드로 수정
 */
export const setStrokeColorWithColor = (
  feature: Feature,
  option: { strokeWidth?: number; color: string },
) => {
  // const { r, g, b } = commonUtil.hex2rgb(color)
  // const fillColor = commonUtil.rgbaToHex(r, g, b, 0.3)
  const style = new Style({
    stroke: new Stroke({
      color: color_main,
      width: option.strokeWidth ?? 4,
    }),
    fill: new Fill({
      color: option.color,
    }),
    image: new CircleStyle({
      radius: 7,
      fill: new Fill({ color: '#000000' }),
      stroke: new Stroke({
        color: 'black',
      }),
    }),
    text: defaultLabelText(feature),
    zIndex: 100,
  })
  feature.setStyle(style)
}
export const setFillColor = (feature: Feature) => {
  const fillColor = new Style({
    stroke: new Stroke({
      color: feature.get('isClick') ? '#fb7979' : '#9699f8',
      width: feature.get('isClick') ? 3 : 0.5,
    }),
    fill: new Fill({
      color: feature.get('color'),
    }),
  })
  feature.setStyle(fillColor)
}

const dyanamicStyleSetColor = (features, option?: any) => {
  const dyanamicStyle = (feature) =>
    new Style({
      stroke:
        option?.stroke ||
        new Stroke({
          color: color_main,
          width: 4,
        }),
      fill: option?.fill,
      image: new CircleStyle({
        radius: 3,
        fill: new Fill({ color: '#44619B' }),
        stroke: new Stroke({
          color: '#44619B',
        }),
      }),

      text: defaultLabelText(feature),

      zIndex: 100,
    })

  features.forEach((feature) => {
    feature.setStyle(dyanamicStyle(feature))
  })
}
const locationStyle = new Style({
  image: new CircleStyle({
    fill: new Fill({ color: 'dodgerblue' }),
    radius: 8,
    stroke: new Stroke({
      color: 'white',
      width: 1,
    }),
  }),
})

const lineStyle = (feature) => [
  new Style({
    stroke: new Stroke({
      color: '#ffffff',
      width: 10,
    }),
  }),
  new Style({
    stroke: new Stroke({
      color: color_main,
      width: 6,
    }),
    text: new Text({
      font: 'bold 0.8rem sans-serif',
      backgroundFill: new Fill({
        color: color_main,
      }),
      backgroundStroke: new Stroke({
        color: color_sub_main,
        width: 1,
      }),
      padding: [5, 5, 1, 5],
      fill: new Fill({ color: '#ffffff' }),
      offsetY: -30,
      overflow: true,
      text: feature?.get('gmpssLabel') || '',
    }),
    image: new RegularShape({
      radius: 6,
      points: 3,
      fill: new Fill({
        color: 'dodgerblue',
      }),
    }),
  }),
]

const fixedPointStyle = new Style({
  image: new Circle({
    radius: 4,
    stroke: new Stroke({
      color: '#44619b',
      width: 2,
    }),
    fill: new Fill({
      color: '#ffffff',
    }),
  }),
})

const pointStyle = (option: {
  feature?: Feature<Point>
  style: {
    strokeColor: string
    size: number
    fillColor: string
  }
}) =>
  new Style({
    image: new Circle({
      radius: option.style.size,
      stroke: new Stroke({
        color: option.style.strokeColor,
        width: option.style.size,
      }),
      fill: new Fill({
        color: option.style.fillColor,
      }),
    }),
  })
const segmentStyle = new Style({
  text: new Text({
    font: '12px Pretendard, sans-serif',
    fill: new Fill({
      color: '#ffffff',
    }),
    backgroundFill: new Fill({
      color: 'rgba(0, 0, 0, 0.50)',
    }),
    padding: [2, 2, 2, 2],
    textBaseline: 'bottom',
    offsetY: -12,
  }),
  image: new RegularShape({
    radius: 6,
    points: 3,
    angle: Math.PI,
    displacement: [0, 8],
    fill: new Fill({
      color: 'rgba(0, 0, 0, 0.50)',
    }),
  }),
})

const formatLength = function (line) {
  const length = getLength(line)
  let output
  if (length > 100) {
    output = Math.round((length / 1000) * 100) / 100 + ' km'
  } else {
    output = Math.round(length * 100) / 100 + ' m'
  }
  return output
}

const formatArea = function (polygon) {
  const area = getArea(polygon)
  let output
  if (area > 10000) {
    output = Math.round((area / 1000000) * 100) / 100 + ' km\xB2'
  } else {
    output = Math.round(area * 100) / 100 + ' m\xB2'
  }
  return output
}
function measureStyleFunction(feature, drawType?: MeasureType, calc = true) {
  const styles = [measure]
  const geometry = feature.getGeometry() as Polygon | LineString
  const segmentStyles = [segmentStyle]
  let startPoint: string | Geometry | GeometryFunction | undefined
  let endPoint: string | Geometry | GeometryFunction | undefined
  let point: string | Geometry | GeometryFunction | undefined
  let label: string | undefined
  let line: LineString | undefined
  if (!drawType || geometry instanceof LineString) {
    point = new Point(geometry.getLastCoordinate())
    startPoint = new Point(geometry.getFirstCoordinate())
    endPoint = new Point(geometry.getLastCoordinate())
    label = formatLength(geometry)
    line = geometry as LineString
  }
  if (line && calc) {
    let count = 0
    const jointStyles = [fixedPointStyle]
    line.forEachSegment(function (a, b) {
      const segment = new LineString([a, b])
      const label = formatLength(segment)
      if (segmentStyles.length - 1 < count) {
        segmentStyles.push(segmentStyle.clone())
        jointStyles.push(fixedPointStyle.clone())
      }
      const segmentPoint = new Point(segment.getCoordinateAt(0.5))
      const jointPoint = new Point(segment.getCoordinateAt(1))
      segmentStyles[count].setGeometry(segmentPoint)
      segmentStyles[count].getText()?.setText(label)
      jointStyles[count].setGeometry(jointPoint)

      styles.push(segmentStyles[count])
      styles.push(jointStyles[count])
      count++
    })
  }

  if (label && point) {
    const _labelStyle = labelStyle({ offsetX: -40, offsetY: 20 })
    _labelStyle.setGeometry(point)
    _labelStyle.getText()?.setText(`${label}`)
    styles.push(_labelStyle)
  }
  if (startPoint) {
    const geomStyle = fixedPointStyle.clone()
    const _pointImage = pointImage('start')
    _pointImage.setGeometry(startPoint)
    geomStyle.setGeometry(startPoint)
    styles.push(_pointImage)
    styles.push(geomStyle)
  }
  if (endPoint) {
    const _pointImage = pointImage('end')
    _pointImage.setGeometry(endPoint)
    styles.push(_pointImage)
  }
  return styles
}
function dashMeasureStyleFunction(feature, drawType?: MeasureType, calc = true) {
  const styles = [measure]
  const geometry = feature.getGeometry()
  const segmentStyles = [segmentStyle]
  const type = geometry.getType()
  let point: string | Geometry | GeometryFunction | undefined
  let label: string | undefined
  let line: LineString | undefined
  let startPoint: string | Geometry | GeometryFunction | undefined
  let endPoint: string | Geometry | GeometryFunction | undefined
  if (!drawType || drawType === type) {
    if (type === 'Polygon') {
      point = geometry.getInteriorPoint()
      label = '면적 ' + formatArea(geometry)
      line = new LineString(geometry.getCoordinates()[0])
    } else if (type === 'LineString') {
      point = new Point(geometry.getLastCoordinate())
      label = '거리 ' + formatLength(geometry)
      line = geometry
    }
    startPoint = new Point(geometry.getFirstCoordinate())
    endPoint = new Point(geometry.getLastCoordinate())
  }
  if (line && calc) {
    let count = 0
    const jointStyles = [fixedPointStyle]
    line.forEachSegment(function (a, b) {
      const segment = new LineString([a, b])
      const label = formatLength(segment)
      if (segmentStyles.length - 1 < count) {
        segmentStyles.push(segmentStyle.clone())
        jointStyles.push(fixedPointStyle.clone())
      }
      const segmentPoint = new Point(segment.getCoordinateAt(0.5))
      segmentStyles[count].setGeometry(segmentPoint)
      segmentStyles[count].getText()?.setText(label)
      const jointPoint = new Point(segment.getCoordinateAt(1))
      jointStyles[count].setGeometry(jointPoint)
      styles.push(segmentStyles[count])
      styles.push(jointStyles[count])
      count++
    })
  }

  if (label && point) {
    const _labelStyle = labelStyle({ offsetX: -40, offsetY: 20 })
    _labelStyle.setGeometry(point)

    _labelStyle.getText()?.setText(`${label}`)
    styles.push(_labelStyle)
  }
  if (startPoint) {
    const geomStyle = fixedPointStyle.clone()
    geomStyle.setGeometry(startPoint)
    styles.push(geomStyle)
  }
  return styles
}
const _labelStyle = new Style({
  text: new Text({
    font: '12px Pretendard, sans-serif',
    fill: new Fill({
      color: '#ffffff',
    }),
    backgroundFill: new Fill({
      color: '#44619B',
    }),
    padding: [3, 3, 3, 3],
    textBaseline: 'bottom',
    offsetY: -15,
  }),
  image: new RegularShape({
    points: 3,
    fill: new Fill({
      color: '#44619B',
    }),
  }),
})
const tipStyle = new Style({
  text: new Text({
    font: '12px Pretendard, sans-serif',
    fill: new Fill({
      color: '#ffffff',
    }),
    backgroundFill: new Fill({
      color: '#44619B',
    }),
    padding: [6, 11, 6, 11],
    textAlign: 'left',
    offsetX: 20,
    offsetY: 5,
  }),
})
function setStyleWithText(feature, drawType, tip) {
  let tipPoint
  const styles: any[] = []
  const geometry = feature.getGeometry()
  const type = geometry.getType()
  let point: string | Geometry | GeometryFunction | undefined
  let label: string | undefined
  if (!drawType || drawType === type || type === 'Point') {
    styles.push(dashMeasure)
    if (type === 'Polygon') {
      point = geometry.getInteriorPoint()
    } else if (type === 'LineString') {
      point = new Point(geometry.getLastCoordinate())
    }
  }
  if (label && point) {
    labelStyle().getText()?.setText(label)
    styles.push(_labelStyle)
  }
  if (tip && type === 'Point') {
    tipPoint = geometry
    tipStyle.getText()?.setText(tip)
    styles.push(tipStyle)
  }
  return styles
}

const locationInfoStyle = (feature: Feature) => {
  return new Style({
    stroke: new Stroke({
      color: color_main,
      width: 4,
    }),
    fill: new Fill({
      color: 'rgba(255, 255, 255, 0.2)',
    }),
    text: defaultLabelText(feature),
    zIndex: 100,
  })
}

export {
  lineStyle,
  pointStyle,
  dashMeasureStyleFunction,
  labelStyle,
  setStyleWithText,
  locationStyle,
  dyanamicStyleSetColor,
  bufferLineStyle,
  wfsVectorStyle,
  customVectorStyle,
  customVectorChangeColorStyle,
  measureStyleFunction,
  locationInfoStyle,
}
