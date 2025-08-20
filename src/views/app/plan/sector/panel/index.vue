<template>
  <div class="panel">
    <keep-alive>
      <component
        :is="Pane"
        :v-if="selectedItemId"
        :key="selectedItemId"
        :menu-id="selectedItemId"
      />
    </keep-alive>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'

  import Pane from '@/components/app/plan/sector/panel'

  import { usePlanSectorStore } from '@/stores/app/plan/sector'

  const planSectorStore = usePlanSectorStore()

  const selectedItemId = computed(() => planSectorStore?.selectedItem?.id)
</script>

<style scoped lang="scss">
  .panel {
    width: 100%;
    height: 100%;
    padding: 10px;
    background-color: #f4f4f4;
  }
</style>
