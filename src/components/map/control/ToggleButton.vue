<template>
  <div class="btn-wrap button" v-if="button.isVisible" :class="{ active: button.isActive }">
    <button
      type="button"
      class="btn-control"
      :class="{ active: button.isActive }"
      @click="button.click()"
    >
      <SvgIcon :name="button.iconName" :size="button.iconSize" />
      <span class="control-tooltip">{{ button.title }}</span>
    </button>
  </div>
</template>

<script lang="ts" setup>
  import { reactive } from 'vue'

  import { ToggleButton } from '@/js/map/control/ToggleButton'
  import { ListenerKey } from '@/js/map/control/IControlButton'

  const props = withDefaults(
    defineProps<{
      button: ToggleButton
      listeners: { key: ListenerKey; fn: (state?: any) => void }[]
    }>(),
    {},
  )

  const button = reactive(props.button)

  props.listeners.forEach((listener) => {
    button.onEventListener(listener.key, listener.fn)
  })
</script>

<style lang="scss"></style>
