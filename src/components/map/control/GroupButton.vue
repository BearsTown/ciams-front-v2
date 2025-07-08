<template>
  <div class="btn-wrap button" v-if="group.isVisible" :class="{ active: group.isActive }">
    <button
      type="button"
      class="btn-control group"
      :class="{ open: group.isOpen, active: group.isActive }"
      @click="group.click()"
    >
      <SvgIcon :name="group.iconName" :size="group.iconSize" />
      <span class="control-tooltip">{{ group.title }}</span>
    </button>
    <template v-if="group.children">
      <div class="dropdown">
        <template :key="cBtn.button.id" v-for="cBtn of group.children">
          <button
            v-if="cBtn.button.isVisible"
            type="button"
            class="btn-control"
            :class="{ open: cBtn.button.isActive }"
            @click="cBtn.button.click()"
          >
            <SvgIcon :name="cBtn.button.iconName" :size="cBtn.button.iconSize" />
            <span class="control-tooltip">{{ cBtn.button.title }}</span>
          </button>
        </template>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
  import { reactive } from 'vue'

  import { GroupButton } from '@/js/map/control/GroupButton'
  import { ListenerKey } from '@/js/map/control/IControlButton'

  const props = withDefaults(
    defineProps<{
      button: GroupButton
      listeners: { key: ListenerKey; fn: (state?: any) => void }[]
    }>(),
    {},
  )

  const group = reactive(props.button)

  props.listeners.forEach((listener) => {
    group.onEventListener(listener.key, listener.fn)
  })

  group.children.forEach((child) => {
    child.listeners.forEach((listener) => {
      child.button.onEventListener(listener.key, listener.fn)
    })
  })
</script>

<style lang="scss" scoped>
  //.mapController .btn-control:not(:disabled).active + .dropdown {
  //  opacity: 0;
  //  visibility: hidden;
  //  pointer-events: none;
  //}

  //.mapController .btn-control:not(:disabled).open {
  //  transition: 0.3s;
  //  background-color: #7AAAD1;
  //}

  //.mapController .btn-control:not(:disabled).open svg {
  //  fill: #fff;
  //}

  //.mapController .btn-control:not(:disabled).open + .dropdown {
  //  opacity: 1;
  //  visibility: visible;
  //  pointer-events: all;
  //  transform: translateX(0);
  //  transition: 0.3s;
  //}
</style>
