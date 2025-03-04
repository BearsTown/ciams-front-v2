<template>
  <div class="customSelect" :class="{ active: selectActive, disabled: disabled }">
    <div class="customSelect-label" @click="labelClickAction">
      <!-- placeholder -->
      <span v-if="!activeLabel" class="customSelect-value placeholder">{{ placeholder }}</span>

      <!-- value 있을 때 -->
      <span class="customSelect-value">{{ activeLabel }}</span>

      <span class="customSelect-arrow" v-if="!onlyLabel && props.list.length > 1">
        <svg
          v-if="isGosi"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g id="chevron-down">
            <path
              id="Vector"
              d="M7 10L12.0008 14.58L17 10"
              stroke="#424242"
              stroke-width="1.2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </g>
        </svg>
        <svg
          v-else
          width="11"
          height="6"
          viewBox="0 0 11 6"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1 5L5.5 1L10 5"
            stroke="#98A8BA"
            stroke-width="1.2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </span>
    </div>
    <div class="customSelect-dropdown customScroll">
      <ul>
        <li
          class="customSelect-item"
          v-for="item in list"
          :key="item.value"
          @click="clickAction(item)"
        >
          {{ item.label }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, watchEffect } from 'vue'
  import { computed } from 'vue'
  import { ref } from 'vue'

  const selectActive = ref(false)
  const activeLabel = ref('')
  const activeItem = ref()

  const props = withDefaults(
    defineProps<{
      list: {
        label: string
        value: any
      }[]
      placeholder?: string
      defaultValue?: any
      disabled?: boolean
      isGosi?: boolean
      onlyLabel?: boolean
    }>(),
    {
      placeholder: '선택해주세요',
      disabled: false,
      isGosi: false,
      onlyLabel: false,
    },
  )

  const emits = defineEmits<{
    (e: 'change', value: boolean): void
  }>()

  const labelClickAction = () => {
    if (!props.onlyLabel || props.list.length < 2) selectActive.value = !selectActive.value
  }

  const clickAction = (item) => {
    activeLabel.value = item.label
    selectActive.value = !selectActive.value
    emits('change', item.value)
  }

  watchEffect(() => {
    if (props.defaultValue) {
      let _item = props.list.find((item) => item.value == props.defaultValue)
      if (_item) {
        activeItem.value = _item
        activeLabel.value = _item.label
      }
    }
  })

  defineExpose({
    value: () => activeItem.value,
  })
</script>
