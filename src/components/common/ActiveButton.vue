<template>
  <div
    :class="['active-button', { 'is-active': isActive, 'is-disabled': isDisabled }]"
    @click="!isDisabled && onActive()"
  >
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
      isDisabled?: boolean
    }>(),
    {
      title: '',
      isActive: false,
      isDisabled: false,
    },
  )

  const { status: isActive, on: onActive } = useBoolean(props.isActive)
  const { status: isDisabled } = useBoolean(props.isDisabled)

  const emits = defineEmits<{
    (e: 'change:active', type: boolean): void
  }>()

  function setActive(val: boolean) {
    isActive.value = val
    handleActiveChange(isActive.value)
  }

  function setDisable(val: boolean) {
    isDisabled.value = val
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
    setDisable,
  })
</script>

<style scoped lang="scss">
  .active-button {
    cursor: pointer;
    font-size: 14px;
    padding: 10px;
    color: #616161;
    border-radius: 8px;
    background: #fff;
    //text-align: center;
    box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.12);
    transition: 0.3s;

    &:not(.is-disabled):hover {
      //color: var(--ugis-color-white);
      color: var(--ugis-color-temp-2);
      opacity: 0.95;
      //background-color: var(--ugis-color-temp-2);
    }

    &:not(:first-child) {
      margin-top: 5px;
    }

    &.is-disabled {
      cursor: not-allowed;
    }
  }

  .is-active {
    //color: var(--ugis-color-white);
    color: var(--ugis-color-temp-2);
    opacity: 0.95;
    //background-color: var(--ugis-color-temp-2);
  }
</style>
