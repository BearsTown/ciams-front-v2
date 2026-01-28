<template>
  <div style="display: flex; flex-direction: column; overflow-y: hidden">
    <el-tabs v-model="activeName" type="" stretch="stretch" style="flex: 1; overflow-y: hidden">
      <template v-for="item in codes" :key="item.code">
        <el-tab-pane :label="item.codeName" :name="item.code" style="height: 100%">
          <keep-alive>
            <LQSub
              ref="lqSubRefs"
              v-if="activeName === item.code"
              :lq-parent-code="item.code"
              :desc="item.codeDesc"
              :lq-map-type="lqMapType"
              @update-data="updateData"
            />
          </keep-alive>
        </el-tab-pane>
      </template>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue'

  import LQSub from '@/components/app/basic/loc/status/panel/tech-lq/LQSub.vue'

  import { Fill, Stroke, Style, Text } from 'ol/style'

  import { styleUtil } from '@/utils'
  import { MapType } from '@/enums/mapEnum'
  import CommonUtil from '@/utils/commonUtil'
  import { UitWFSLayer } from '@uitgis/ol-ugis-test/layer'

  import { TechLQDto } from '@/models/api/app/basic/loc/industry/techLq'

  import { getCodeList } from '@/api/app/common'

  import { useCmmConfigStore } from '@/stores/config/cmmConfig'

  const props = withDefaults(
    defineProps<{
      lqParentCode: string
      layer: UitWFSLayer
      lqMapType: string
    }>(),
    {},
  )

  const cmmConfigStore = useCmmConfigStore()

  const codes = ref()
  const activeName = ref()
  const sggCode = ref<string>()
  const lqSubRefs = ref<LQSub[]>([])

  function updateData(
    data: {
      type: MapType
      data: TechLQDto.TechLQ.Find.Result[]
      styleInfo: {
        breaks: number[]
        colors: string[]
        legend: { range: string; color: string }[]
      }
    } | null,
  ) {
    if (CommonUtil.isEmpty(data)) {
      props.layer.getLayer().setStyle(
        new Style({
          stroke: new Stroke({
            color: '#FFFFFF',
            width: 1,
          }),
          fill: new Fill({
            color: CommonUtil.hex2rgb('#F4FFF4', 0.8),
          }),
          zIndex: 100,
        }),
      )

      updateLegend(null)
    } else {
      props.layer.getLayer().setStyle(function (feature) {
        const sggCd = feature.get('SGG_CD')
        const target = data?.data.find((item) => item.sggCd === sggCd)
        let labelGeometry

        let geometry = feature.getGeometry()
        if (geometry.getType() === 'MultiPolygon') {
          const polygons = geometry.getPolygons()
          geometry = getMaxPoly(polygons)
          labelGeometry = geometry.getInteriorPoint()
        } else if (geometry.getType() === 'Polygon') {
          labelGeometry = geometry.getInteriorPoint()
        }

        let color = CommonUtil.hex2rgb('#F4FFF4', 0.8)
        if (!CommonUtil.isEmpty(target)) {
          const fColor = styleUtil.getColorForValue(
            target![data!.type],
            data?.styleInfo.breaks,
            data?.styleInfo.legend,
          )
          color = CommonUtil.hex2rgb(fColor, 0.8)
        }
        const cStyle = new Style({
          stroke: new Stroke({
            color: sggCd === sggCode.value ? '#FF0000' : '#FFFFFF',
            width: 2,
          }),
          fill: new Fill({
            color,
          }),
          zIndex: sggCd === sggCode.value ? 1 : 0,
        })

        const labelStyle = new Style({
          geometry: labelGeometry,
          text: new Text({
            font: '12px Calibri,sans-serif',
            overflow: true,
            fill: new Fill({
              color: '#000',
            }),
            stroke: new Stroke({
              color: '#fff',
              width: 3,
            }),
            text: feature.get('SGG_NM'),
          }),
          zIndex: 101,
        })

        return [labelStyle, cStyle]
      })

      updateLegend(data!.styleInfo)
    }
  }

  function getMaxPoly(polygons) {
    let maxPoly = polygons[0]
    let maxArea = polygons[0].getArea()
    for (let i = 1; i < polygons.length; i++) {
      const area = polygons[i].getArea()
      if (area > maxArea) {
        maxArea = area
        maxPoly = polygons[i]
      }
    }
    return maxPoly
  }

  function updateMapType() {
    lqSubRefs.value?.forEach((value) => {
      value.updateData()
    })
  }

  function updateLegend(
    styleInfo: {
      breaks: number[]
      colors: string[]
      legend: { range: string; color: string }[]
    } | null,
  ) {
    if (CommonUtil.isEmpty(styleInfo)) {
      emits('update-legend', null)
    } else {
      emits('update-legend', styleInfo)
    }
  }

  const emits = defineEmits<{
    (
      e: 'update-legend',
      type: {
        breaks: number[]
        colors: string[]
        legend: { range: string; color: string }[]
      } | null,
    ): void
  }>()

  onMounted(async () => {
    const sidoCd = cmmConfigStore.cmmConfigState['SIDO_CODE']?.confValue
    const sggCd = cmmConfigStore.cmmConfigState['SGG_CODE']?.confValue

    sggCode.value = `${sidoCd}${sggCd}`

    const { data: rawData } = await getCodeList(props.lqParentCode)

    codes.value = rawData

    activeName.value = codes.value[0].code
  })

  defineExpose({
    updateMapType,
    updateLegend,
  })
</script>

<style lang="scss"></style>

<style scoped lang="scss">
  .container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;

    .center {
      flex: 1;
      display: flex;
      flex-direction: row;
      overflow-y: hidden;
      height: 100%;

      .left {
        width: 50%;
        padding: 10px;
        background: #fff;
        border-radius: 8px;
      }

      .right {
        width: 50%;
        padding: 10px;
        background: #fff;
        display: flex;
        flex-direction: column;
        margin-left: 8px;
        border-radius: 8px;
      }

      .right-top {
      }

      .right-bottom {
      }
    }

    .bottom {
      height: 80px;
      margin-top: 8px;
      min-height: 100px;
      max-height: 200px;

      padding: 10px;
      background: #fff;
      border-radius: 8px;
    }

    .customScroll {
      height: max-content;
      overflow-y: auto;
    }

    .text-wrap {
      color: #616161;
      font-size: 15px;
      font-weight: 400;
      line-height: 1.5;
    }
  }

  .border-box-square:first-child {
    margin: 0;
  }

  .header-title {
    margin: 5px 0;
    color: #212121;
    font-size: 15px;
    font-weight: 700;
    letter-spacing: -0.02em;
  }

  .customTable tr > td:not([rowspan]) {
    border-left: 1px solid #e0e0e0;
  }

  :deep(.el-tabs__header) {
    margin-bottom: 5px;
  }
</style>
