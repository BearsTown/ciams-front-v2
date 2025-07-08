<template>
  <fieldset class="fieldSet">
    <legend style="display: flex">
      <span class="layer-title">&nbsp; {{ mapLayer.title }}</span>
      <div class="customTooltip" v-if="true">
        <label>
          <input
            step="1"
            :value="getOpacity(mapLayer)"
            @input.stop="(e) => setOpacity(mapLayer, e.target)"
            type="range"
          />
        </label>
        <div class="span-opacity-contianer">
          <span class="opacity">{{ getOpacity(mapLayer) }}%</span>
        </div>
      </div>
    </legend>
    <label :for="mapLayer.getKey()" class="customCheckbox">
      <input
        :id="mapLayer.getKey()"
        @click="mapLayer.setUserVisible(!mapLayer.userVisible)"
        :checked="mapLayer.userVisible"
        type="checkbox"
      />
      <span class="customCheckbox-text">{{ mapLayer.title }}</span>
    </label>
  </fieldset>
</template>

<script lang="ts" setup>
  import { onBeforeMount } from 'vue'

  import { MapLayer } from '@/js/layer'

  const props = withDefaults(
    defineProps<{
      mapLayer: MapLayer
    }>(),
    {},
  )

  function getOpacity(mapLayer: MapLayer) {
    return Math.round(mapLayer.getLayer().getLayer()!.getOpacity() * 100)
  }

  function setOpacity(mapLayer: MapLayer, el: HTMLInputElement) {
    mapLayer
      .getLayer()
      .getLayer()
      ?.setOpacity(Number(el.value) / 100)
  }

  onBeforeMount(async () => {})

  defineExpose({})
</script>

<style scoped lang="scss">
  .mapController .dropdown.bgMap .form-group.checkbox .form-row {
    margin: 0;
  }

  .form-row {
    fieldset {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      overflow-wrap: break-word;
      border: 1px solid #7aaad1;
      border-radius: 3px;
      padding: 0px 3px;
      margin-bottom: 10px;
    }
    fieldset:last-child {
      margin-bottom: 0px;
    }
    .customTooltip {
      display: flex;
    }
    span.layer-title {
      width: 60px;
      line-height: 20px;
    }
    .span-opacity-contianer {
      display: flex;
      align-items: center;
    }
    span.opacity {
      font-size: 10px;
    }

    input[type='range'] {
      appearance: none;
      background: linear-gradient(to right, #f4f4f4 0%, #747474 100%);
      accent-color: #7aaad1;
      margin: 0 3px;
      cursor: pointer;
      border: #7aaad1;
      border-style: solid;
      border-width: 1px;
      border-radius: 10px;
      height: 15px;
    }
    .customTooltip-box {
      width: 260px;
    }
    .btn-tooltip {
      &.active {
        color: #7aaad1;
      }
    }
  }

  .form-row span.layer-title {
    width: 90px;
  }
</style>
