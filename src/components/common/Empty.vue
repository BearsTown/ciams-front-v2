<template>
  <div class="empty">
    <p>{{ title }}</p>
  </div>
</template>

<script setup lang="ts">
  const props = withDefaults(
    defineProps<{
      title?: string
    }>(),
    {
      title: '데이터가 없습니다.',
    },
  )
</script>

<style scoped lang="scss">
  .empty {
    flex: 1;
    margin: 0;
    height: 100%;
    display: flex;
    text-align: center;
    align-items: center;
    box-sizing: border-box;
    flex-direction: column;
    justify-content: center;

    > p {
      padding: var(--el-empty-padding);
      font-size: var(--el-font-size-base);
      color: var(--el-text-color-secondary);
    }
  }
</style>
