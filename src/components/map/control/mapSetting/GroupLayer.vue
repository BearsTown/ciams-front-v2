<template>
  <fieldset class="fieldSet">
    <legend style="display: flex">
      <span class="layer-title">&nbsp; {{ title }}</span>
      <div class="customTooltip" v-if="true">
        <label>
          <input
            step="1"
            :value="getOpacity()"
            @input.stop="(e) => setOpacity(e.target)"
            type="range"
          />
        </label>
        <div class="span-opacity-contianer">
          <span class="opacity">{{ getOpacity() }}%</span>
        </div>
      </div>
    </legend>
    <template v-for="layer in layers" :key="layer">
      <label :for="layer.getKey()" class="customCheckbox">
        <input
          :id="layer.getKey()"
          @click="layer.setUserVisible(!layer.userVisible)"
          :checked="layer.userVisible"
          type="checkbox"
        />
        <span class="customCheckbox-text">{{ layer.title }}</span>
      </label>
    </template>
  </fieldset>
</template>

<script lang="ts" setup>
  import { MapLayer } from '@/js/layer'

  const props = withDefaults(
    defineProps<{
      title: string
      layers: MapLayer[]
    }>(),
    {},
  )

  function getOpacity() {
    const layer = props.layers[0]
    return Math.round(layer.getLayer().getLayer()!.getOpacity() * 100)
  }

  function setOpacity(el: HTMLInputElement) {
    props.layers.forEach((layer) => {
      layer
        .getLayer()
        .getLayer()
        ?.setOpacity(Number(el.value) / 100)
    })
  }
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
    width: 110px;
  }
</style>
