<template>
  <div class="source">
    <div v-if="0 < list?.length" style="margin-right: 5px">출처 :</div>
    <div>
      <p v-for="(item, index) in list" :key="index">
        {{ formatText(item) }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { SourceGroupDTO } from '@/api/app/source/model'

  const props = withDefaults(
    defineProps<{
      list: SourceGroupDTO.SourceDTO[]
    }>(),
    {},
  )

  const formatText = (item: (typeof props.list)[number]) => {
    const { sourceOrgan, sourceService, title, sub } = item.source
    const { timePoint } = item

    let result = `${sourceOrgan}, `
    if (sourceService) result += `${sourceService}`
    result += ` 「${title}`
    if (sub) result += ` (${sub})`
    result += `」`
    if (timePoint) result += ` (${timePoint})`

    return result
  }
</script>

<style scoped lang="scss">
  .source {
    display: flex;
    align-items: center;
    padding: 5px;
    color: #616161;
  }
</style>
