<template>
  <div class="legend">
    <button type="button" class="" :class="{ active: button.isActive }" @click="button.click()">
      <span>{{ button.title }}</span>
    </button>

    <div class="dropdown" :class="{ active: button.isActive }">
      <div class="" style="display: flex; flex-direction: column; height: 100%">
        <div
          class=""
          v-for="item in list"
          :key="item"
          style="flex: 1; display: flex; align-items: center; justify-content: end"
          :style="{ 'background-color': item.color }"
        >
          <span style="color: white; font-size: 11px; margin-right: 3px">
            {{ item.range }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { reactive } from 'vue'

  import { ToggleButton } from '@/js/map/control/ToggleButton'

  const props = withDefaults(
    defineProps<{
      list: { range: string; color: string }[]
    }>(),
    {},
  )

  const toggle = new ToggleButton({
    id: '',
    title: '범례',
    iconName: '',
  })

  const button = reactive(toggle)
</script>

<style scoped lang="scss">
  .legend {
    > button {
      width: 50px;
      height: 30px;
      font-size: 14px;
      text-align: center;
      background-color: #fff;
      border-radius: 4px;
      box-shadow: 0 0 12px rgba(0, 0, 0, 0.12);
      transition: 0.3s;

      &.active {
        color: white;
        background-color: #7aaad1;
      }
    }

    .dropdown {
      padding: 3px;
      position: absolute;
      width: 150px;
      height: 150px;
      bottom: 35px;
      overflow: hidden;
      background: #fff;
      border: 1px solid #e6edf6;
      border-radius: 4px;
      box-shadow: 0 0 12px rgba(0, 0, 0, 0.12);
      z-index: 1;
      transition: 0.3s;
      transform: scaleY(0);
      transform-origin: bottom;

      opacity: 0;

      &.active {
        transform: scaleY(1);
        opacity: 1;
      }
    }
  }
</style>
