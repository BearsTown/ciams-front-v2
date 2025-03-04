<template>
  <div :class="['active-button', { 'is-active': isActive }]" @click="onActive">
    <div class="title">
      {{ title }}
    </div>
  </div>
</template>

<script setup lang="ts">
  import { watch } from 'vue'

  import { useBoolean } from '@/hooks/useBoolean'

  const props = withDefaults(
    defineProps<{
      title: string
      isActive?: boolean
    }>(),
    {
      title: '',
      isActive: false,
    },
  )

  const { status: isActive, on: onActive } = useBoolean(props.isActive)

  const emits = defineEmits<{
    (e: 'change:active', type: boolean): void
  }>()

  function setActive(val: boolean) {
    isActive.value = val
    handleActiveChange(isActive.value)
  }

  function handleActiveChange(val: boolean) {
    emits('change:active', val)
  }

  watch(
    () => props.isActive,
    () => {
      isActive.value = props.isActive
    },
  )

  watch(
    () => isActive.value,
    () => {
      handleActiveChange(isActive.value)
    },
  )

  defineExpose({
    isActive,
    setActive,
  })
</script>

<style scoped lang="scss">
  .active-button {
    cursor: pointer;
    font-size: 14px;
    padding: 10px;
    color: #616161;
    //border-radius: 8px;
    background: #fff;
    //text-align: center;
    box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.12);
    transition: 0.2s;

    &:hover {
      color: var(--ugis-color-white);
      opacity: 0.95;
      background-color: var(--ugis-color-temp-2);
    }

    &:not(:first-child) {
      margin-top: 5px;
    }
  }

  .is-active {
    color: var(--ugis-color-white);
    opacity: 0.95;
    background-color: var(--ugis-color-temp-2);
  }
</style>
