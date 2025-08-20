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

  import Pane from '@/components/app/plan/Improvement-zone/panel'

  import { usePlanImprovementZoneStore } from '@/stores/app/plan/Improvement-zone'

  const planImprovementZoneStore = usePlanImprovementZoneStore()

  const selectedItemId = computed(() => planImprovementZoneStore?.selectedItem?.id)
</script>

<style scoped lang="scss">
  .panel {
    width: 100%;
    height: 100%;
    padding: 10px;
    background-color: #f4f4f4;
  }
</style>
