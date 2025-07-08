<template>
  <div style="margin: 5px">
    <div
      :class="['common-collapse', 'outside-collapse', { 'is-disabled': useDisabled && !isActive }]"
      @click="toggleOpen"
    >
      <div>
        <div style="width: 30px">
          <button type="button" class="btn-toggle" :class="{ 'is-open': isOpen }">
            <svg
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
          </button>
          <!--          <el-icon class="icon-caret-collapse" :class="{ 'is-open': isOpen }">-->
          <!--            <CaretRight />-->
          <!--          </el-icon>-->
        </div>

        <div class="title">
          {{ title }}
        </div>

        <div class="func-button" @click.prevent.stop>
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
      <div v-show="isOpen">
        <div class="border-box-round" :class="{ 'is-disabled': useDisabled && !isActive }">
          <slot name="content"></slot>
        </div>
      </div>
    </el-collapse-transition>
  </div>
</template>

<script setup lang="ts">
  import { watch } from 'vue'

  import { useBoolean } from '@/hooks/useBoolean'

  const props = withDefaults(
    defineProps<{
      type: string
      title: string
      isOpen?: boolean
      isActive?: boolean
      useDisabled?: boolean
    }>(),
    {
      type: 'switch', // ['info', 'switch'],
      title: '',
      isOpen: true,
      isActive: true,
      useDisabled: true,
    },
  )

  const { status: isOpen, toggle: toggleOpen } = useBoolean(props.isOpen)
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
  .outside-collapse {
    background-color: #7aaad1;
    transition: opacity var(--el-transition-duration);

    &:deep(.btn-toggle) {
      //color: var(--ugis-color-white);
      color: var(--ugis-color-black);
      transform: rotate(90deg);

      transition: transform var(--el-transition-duration);

      &.is-open {
        transform: rotate(180deg);
      }
    }

    & > div {
      .title {
        text-align: center;
        color: var(--ugis-color-white);
      }

      .func-button {
        width: 30px;
        justify-content: center;
        color: var(--ugis-color-white);
      }
    }
  }
</style>
