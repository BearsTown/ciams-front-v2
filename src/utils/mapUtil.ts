import { sortBy } from 'lodash'
import { Feature } from 'ol'
import { Polygon } from 'ol/geom'

class MapUtil {
  static transformFeature = function (feature: Feature, bfProj: string, afProj: string) {
    const transFeature = feature.clone()
    if (transFeature) transFeature.getGeometry().transform(bfProj, afProj)

    return transFeature
  }

  /**
   *
   * @param extent
   * @param width 너비 개수
   * @param height 높이 개수
   * @returns
   */
  static makeFeaturesToBbox = function (extent: number[], width: number, height: number) {
    //예)[14388398.430457704,4279601.822131196,14389102.615113335,4280254.753387451]
    const bbox = extent
    const minx = bbox[0]
    const miny = bbox[1]
    const maxx = bbox[2]
    const maxy = bbox[3]

    const gap_Width = (maxx - minx) / width
    const gap_Height = (maxy - miny) / height

    const resultFeature: any[] = []
    const _bbox = [minx, miny, minx, miny]
    for (let y = 0; y < height; y++) {
      _bbox[1] = miny + gap_Height * y
      _bbox[3] = miny + gap_Height * (y + 1)
      for (let x = 0; x < width; x++) {
        _bbox[0] = minx + gap_Width * x
        _bbox[2] = minx + gap_Width * (x + 1)

        const coord = [
          [
            [_bbox[0], _bbox[1]],
            [_bbox[0], _bbox[3]],
            [_bbox[2], _bbox[3]],
            [_bbox[2], _bbox[1]],
            [_bbox[0], _bbox[1]],
          ],
        ]

        const feature = new Feature(new Polygon(coord))
        resultFeature.push(feature)
      }
    }

    return resultFeature
  }

  /**
   * makeFeaturesToBbox로 생성한 feature 상단부터 좌->우, 위->아래로 정렬 후 리턴
   * @param featureArr
   * @param rowCnt 격자 한 열당 feature 개수
   * @returns
   */
  static sortIdxArrPerRow = (featureArr, rowCnt: number) => {
    if (isNaN(rowCnt) || rowCnt < 0) {
      console.log('rowCnt is null')
      return false
    }

    const cloneFeatureArr: any[] = []
    for (const feature of featureArr) {
      cloneFeatureArr.push(feature.clone())
    }

    const sortArrX = sortBy(featureArr, (item) => item.getGeometry().getExtent()[0])
    for (let i = 0; i < sortArrX.length; i++) {
      sortArrX[i].set('sort_x', i)
    }

    const sortArrY = sortBy(featureArr, (item) => item.getGeometry().getExtent()[1] * -1)
    for (let i = 0; i < sortArrY.length; i++) {
      sortArrY[i].set('sort_y', parseInt(i / rowCnt + ''))
    }

    const sortArr = sortBy(featureArr, [
      (item) => item.getProperties()['sort_y'],
      (item) => item.getProperties()['sort_x'],
    ])

    return sortArr
  }
}

export default MapUtil
