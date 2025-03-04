<template>
  <svg :style="getStyle" aria-hidden="true">
    <use :href="symbolId" />
  </svg>
</template>

<script setup lang="ts">
  import { computed, CSSProperties } from 'vue'

  const props = withDefaults(
    defineProps<{
      name: string
      prefix?: string
      size?: number | string
    }>(),
    {
      prefix: 'icon',
      size: 20,
    },
  )

  const symbolId = computed(() => `#${props.prefix}-${props.name}`)

  const getStyle = computed((): CSSProperties => {
    const { size } = props
    let s = `${size}`
    s = `${s.replace('px', '')}px`
    return {
      width: s,
      height: s,
    }
  })
</script>
