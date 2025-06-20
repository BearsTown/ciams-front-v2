<template>
  <div class="page">
    <div class="header border-container">
      <div class="title">
        <template v-for="(item, index) in title" :key="index">
          <span style="vertical-align: middle">{{ item }}</span>
          <el-divider direction="vertical" v-if="index < title.length - 1" />
        </template>
      </div>

      <div style="" v-if="$slots.sub">
        <slot name="sub"></slot>
      </div>
    </div>

    <div class="center customScroll">
      <slot name="center"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { watch } from 'vue'

  import { useBoolean } from '@/hooks/useBoolean'

  const props = withDefaults(
    defineProps<{
      title: string[]
      isActive?: boolean
    }>(),
    {
      title: () => [''],
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
  .page {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;

    .header {
      height: 60px;
      flex-shrink: 0;
      margin-bottom: 5px;
      display: flex;
      align-items: center;
      //justify-content: left;
      justify-content: space-between;

      .title {
        color: #282828;
        font-size: 17px;
        font-weight: 700;
        letter-spacing: -0.4px;
      }
    }

    .center {
      flex: 1;
      overflow: hidden;
      //background-color: #f4f4f4;
    }
  }

  :deep(.el-divider--vertical) {
    border-left: 2px grey var(--el-border-style);
  }
</style>
