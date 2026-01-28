<template>
  <div v-if="descs" class="container" style="margin-top: 5px">
    <div
      class="title"
      style="display: flex; align-items: center; font-size: 15px; padding-bottom: 10px"
    >
      <span style="flex: 1">{{ title }}</span>
    </div>

    <table class="customTable">
      <colgroup>
        <col v-if="useType" style="width: 30%" />
        <col />
      </colgroup>
      <thead>
        <tr>
          <th v-if="useType" scope="col" style="text-align: center">구분</th>
          <th scope="col" style="text-align: center">설명</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="(items, type) in descs" :key="type">
          <tr v-for="(item, idx) in items" :key="idx">
            <td v-if="useType && idx === 0" :rowspan="items.length" style="vertical-align: middle">
              {{ type }}
            </td>
            <td style="text-align: left">{{ item.description }}</td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
  import { ClassifyAnalysisDto } from '@/models/api/app/classify-analysis/ciams-analysis'

  const props = withDefaults(
    defineProps<{
      title: string
      useType: boolean
      descs?: ClassifyAnalysisDto.Desc.Find.Result
    }>(),
    {
      useType: true,
    },
  )
</script>

<style scoped lang="scss">
  .customTable tr > td:not([rowspan]) {
    border-left: 1px solid #e0e0e0;
  }
</style>
