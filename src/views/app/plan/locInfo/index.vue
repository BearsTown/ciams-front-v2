<template>
  <LocationInfo v-show="visible" :mapType="currentMapType" />
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'

  import LocationInfo from '@/components/common/locationInfo'

  import { useGlobalStore } from '@/stores/app'
  import { useMapStore } from '@/stores/map/map'

  const globalStore = useGlobalStore()
  const { layoutSelected, currentMapType } = storeToRefs(globalStore)

  const visible = computed(() => {
    const mapStore = useMapStore(currentMapType.value)
    return mapStore.locationInfoVisible
  })
</script>

<style scoped lang="scss"></style>
