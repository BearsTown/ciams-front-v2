import JstOl3Parser from 'jsts/org/locationtech/jts/io/OL3Parser' // DEVELOPMENT
import WKTReader from 'jsts/org/locationtech/jts/io/WKTReader' // DEVELOPMENT

import Point from 'ol/geom/Point'
import LineString from 'ol/geom/LineString'
import LinearRing from 'ol/geom/LinearRing'
import Polygon from 'ol/geom/Polygon'
import MultiPoint from 'ol/geom/MultiPoint'
import MultiLineString from 'ol/geom/MultiLineString'
import MultiPolygon from 'ol/geom/MultiPolygon'
import GeometryCollection from 'ol/geom/GeometryCollection'
import 'jsts/org/locationtech/jts/monkey.js'

/**
 *
 * @class
 */
class TopologyUtil {
  static parser = new JstOl3Parser()

  /**
   *
   * @param {ol.geometry} geometry
   * @param {Integer} buffer
   */
  static addBuffer(geometry, buffer = 0) {
    const jstsGeom = TopologyUtil.parser.read(geometry)
    const buffered = jstsGeom.buffer(buffer)
    return TopologyUtil.parser.write(buffered)
  }

  static addUnion(geometry1, geometry2) {
    const jstsGeom1 = TopologyUtil.parser.read(geometry1)
    const jstsGeom2 = TopologyUtil.parser.read(geometry2)

    const _union = jstsGeom1.union(jstsGeom2)

    return TopologyUtil.parser.write(_union)
  }
}

TopologyUtil.parser.inject(
  Point,
  LineString,
  LinearRing,
  Polygon,
  MultiPoint,
  MultiLineString,
  MultiPolygon,
  GeometryCollection,
)

export default TopologyUtil
