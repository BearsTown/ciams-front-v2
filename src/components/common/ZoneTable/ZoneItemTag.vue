<template>
  <div class="list-item-tag" :style="{ 'background-color': tagCategory?.color }">
    {{ tagCategory?.label }}
  </div>
</template>

<script setup lang="ts">
  import { TagCategory } from '@/types/common'

  const props = withDefaults(
    defineProps<{
      tagCategory?: TagCategory
    }>(),
    {},
  )
</script>

<style scoped lang="scss">
  .list-item-tag {
    width: 80px;
    height: 20px;
    color: white;
    display: flex;
    font-size: 11px;
    border-radius: 4px;
    align-items: center;
    justify-content: center;
    box-shadow: 3px 3px 3px 0 rgba(0, 0, 0, 0.12);
  }
</style>
