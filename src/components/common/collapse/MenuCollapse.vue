<template>
  <div :style="!isOpen ? { 'overflow-y': 'visible' } : ''">
    <div
      :class="['popButton', { 'is-active': isOpen }]"
      :style="[{ 'text-align': align }]"
      @click="onOpen"
    >
      <div>
        <div v-if="type !== ''" style="width: 30px"></div>

        <div class="title">
          {{ title }}
        </div>

        <div v-if="type !== ''" class="func-button" @click.prevent.stop>
          <el-icon v-if="type === 'info'" @click.prevent.stop="$emit('info-click')">
            <InfoFilled />
          </el-icon>
          <el-switch
            v-else
            size="small"
            v-model="isActive"
            @click.prevent.stop
            @change="handleSwitchChange"
            style="--el-switch-on-color: #4d7d99; --el-switch-off-color: var(--ugis-color-gray)"
          />
        </div>
      </div>
    </div>

    <el-collapse-transition>
      <div v-if="isChild" style="" v-show="isOpen">
        <el-scrollbar
          style="height: 100%; background-color: white; padding: 5px"
          class="border-box-round"
          :class="{ 'is-disabled': useDisabled && !isActive }"
        >
          <slot name="content"></slot>
        </el-scrollbar>
      </div>
    </el-collapse-transition>
  </div>
</template>

<script setup lang="ts">
  import { watch } from 'vue'
  import { InfoFilled } from '@element-plus/icons-vue'

  import { useBoolean } from '@/hooks/useBoolean'

  const props = withDefaults(
    defineProps<{
      type: string
      title: string
      align?: 'left' | 'center'
      isOpen?: boolean
      isActive?: boolean
      isChild?: boolean
      useDisabled?: boolean
    }>(),
    {
      type: '', // ['', 'info', 'switch'],
      title: '',
      align: 'center',
      isOpen: true,
      isActive: true,
      isChild: true,
      useDisabled: true,
    },
  )

  const { status: isOpen, on: onOpen } = useBoolean(props.isOpen)
  const { status: isActive, toggle: toggleActive } = useBoolean(props.isActive)

  const emits = defineEmits<{
    (e: 'info-click'): void
    (e: 'open-change', type: boolean): void
    (e: 'switch-change', type: boolean): void
  }>()

  function setSwitch(val: boolean) {
    isActive.value = val
    handleSwitchChange(isActive.value)
  }

  function setOpen(val: boolean) {
    isOpen.value = val
    handleOpenChange(isOpen.value)
  }

  function handleOpenChange(val: boolean) {
    emits('open-change', val)
  }

  function handleSwitchChange(val: boolean) {
    emits('switch-change', val)
  }

  watch(
    () => props.isActive,
    () => {
      isActive.value = props.isActive
    },
  )

  watch(
    () => isOpen.value,
    () => {
      handleOpenChange(isOpen.value)
    },
  )

  defineExpose({
    isOpen,
    isActive,
    setSwitch,
    setOpen,
  })
</script>

<style scoped lang="scss">
  .popButton {
    cursor: pointer;
    font-size: 16px;
    padding: 10px;
    color: #616161;
    border-radius: 8px;
    background: #fff;
    //text-align: center;
    box-shadow: 2px 2px 3px 2px rgba(0, 0, 0, 0.12);
    transition: 0.2s;

    &:hover {
      color: var(--ugis-color-white);
      opacity: 0.95;
      background-color: var(--ugis-color-temp-2);
    }

    &:not(:first-child) {
      margin-top: 8px;
    }
  }

  .title {
    padding: 5px 0;
  }

  .is-active {
    color: var(--ugis-color-white);
    opacity: 0.95;
    background-color: var(--ugis-color-temp-2);
  }
</style>
