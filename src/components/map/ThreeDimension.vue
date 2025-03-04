<template>
  <div id="vmap"></div>
</template>
<script setup lang="ts">
  declare const vw: any
  import { useMapStore } from '@/stores/map/map'
  import mittBus from '@/utils/mittBus'
  import { computed, watch } from 'vue'
  // const mapStore = useMapStore()
  // const mapKey = mapStore.getCurrentMapKey()
  // const isUse = computed(() => mapStore.state[mapKey!].map3d.isUse)

  function vwmap(center, zoom) {
    const mapOptions = new vw.MapOptions(
      vw.BasemapType.GRAPHIC,
      '',
      eval('vw.DensityType.BASIC'),
      eval('vw.DensityType.BASIC'),
      false,
      new vw.CameraPosition(new vw.CoordZ(127.425, 38.196, 13487000), new vw.Direction(-90, 0, 0)),
      new vw.CameraPosition(new vw.CoordZ(center[0], center[1], zoom), new vw.Direction(0, -60, 0)),
    )
    new vw.Map('vmap', mapOptions)
  }

  function geojson({ data }) {
    data.forEach((d, idx) => {
      const arr = []
      d.coordinates.forEach((coordinate) => {
        arr.push(new vw.Coord(coordinate[0], coordinate[1]))
      })
      const coordCol = new vw.Collection(arr)
      const polygon = new vw.geom.Polygon(coordCol)
      polygon.setId('polygon' + idx)
      polygon.setFillColor(new vw.Color(d.color.r, d.color.g, d.color.b, 125))
      polygon.create()
    })
  }

  async function init(e) {
    const { center, data, zoom } = JSON.parse(e)
    //vw 모듈 없어서 지도가 안보이는 부분 수정(?)
    await new Promise((res, rej) => {
      const checkState = () => {
        if (vw) return res(1)
        else {
          setTimeout(() => checkState(), 300)
        }
      }
      checkState()
    })
    vwmap(center, zoom)
    setTimeout(() => {
      geojson({ data })
    }, 1000)
  }
  const test = (data) => {
    init(data)
  }
  mittBus.on('3d-test', test)
  // const closeBtn = document.getElementById('close')
  // closeBtn.addEventListener('click' ,e=>{
  //   console.log(e)
  //   window.parent.postMessage('close','*')
  // })
</script>
<style>
  #vmap {
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;
    overflow: hidden;
  }
</style>
