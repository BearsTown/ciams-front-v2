<template>
  <div
    id="test-map"
    class="common-layout"
    style="width: 100%; height: 100%; display: flex; flex-flow: row"
  ></div>
</template>

<script setup lang="ts">
  import { onMounted } from 'vue'

  import 'ol/ol.css'
  import View from 'ol/View'
  import OSM from 'ol/source/OSM'
  import TileLayer from 'ol/layer/Tile'

  import UitMap from '@uitgis/ol-ugis-test/uitMap'

  const map = new UitMap({
    target: 'test-map',
    layers: [],
    view: new View({
      center: [14389851, 4279652.465548385],
      zoom: 11,
    }),
  })

  onMounted(() => {
    map.init()

    map.getMap()?.addLayer(
      new TileLayer({
        source: new OSM(),
      }),
    )
  })
</script>

<style scoped></style>
