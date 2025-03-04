<template>
  <el-aside :class="{ 'is-details-collapse': isOpen }">
    <slot name="content"></slot>
  </el-aside>
  <button
    type="button"
    class="btn_hide_widget"
    :class="[{ 'is-details-collapse': isOpen }]"
    @click="
      () => {
        isOpen = !isOpen
        setResize()
      }
    "
  >
    <el-icon>
      <ArrowLeft />
    </el-icon>
  </button>
</template>

<script setup lang="ts">
  import { useBoolean } from '@/hooks/useBoolean'

  const props = withDefaults(
    defineProps<{
      isDetailsCollapse?: boolean
    }>(),
    {
      isDetailsCollapse: false,
    },
  )
  const setResize = () => {
    const interval = setInterval(() => {
      window.dispatchEvent(new Event('resize'))
    }, 20)
    setTimeout(() => {
      clearInterval(interval)
    }, 200)
  }
  const {
    status: isOpen,
    toggle,
    on: openCollapse,
    off: closeCollapse,
  } = useBoolean(props.isDetailsCollapse)

  defineExpose({
    toggle,
    openCollapse,
    closeCollapse,
  })
</script>

<style scoped lang="scss">
  :deep.el-aside {
    width: 450px;
    height: 100%;
    display: flex;
    padding: 5px;
    margin-left: 5px;
    margin-right: -455px;
    border-radius: 5px;
    box-sizing: border-box;
    flex-direction: column;
    background-color: var(--el-fill-color-blank);
    transition: all var(--el-transition-duration);

    &.is-details-collapse {
      margin-right: 0px;
    }
  }

  .btn_hide_widget {
    z-index: 1000;
    position: absolute;
    cursor: pointer;
    transform: translateY(-50%);
    top: 50%;
    width: 20px;
    height: 50px;
    padding: 0px;
    right: 0px;
    border: 1px solid var(--ugis-border-color-gray);
    border-right: none;
    background-color: var(--ugis-bg-color-white);
    border-radius: 8px 0px 0px 8px;
    transition: all var(--el-transition-duration);

    &.is-details-collapse {
      right: 450px;

      > .el-icon {
        transform: rotate(180deg);
      }
    }

    &:hover {
      background-color: var(--ugis-bg-color-white);

      > .el-icon {
        color: var(--el-color-primary);
      }
    }
  }
</style>
