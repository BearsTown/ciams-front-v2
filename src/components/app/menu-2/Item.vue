<template>
  <div class="container" style="margin-top: 5px">
    <div class="title" style="display: flex; align-items: center">
      <span style="flex: 1">{{ title }}</span>
      <!--      <el-switch size="small" />-->
    </div>

    <table class="customTable">
      <colgroup>
        <col style="width: 25%" />
        <col style="width: 25%" />
        <col style="width: 25%" />
        <col style="width: 25%" />
      </colgroup>
      <tbody>
        <tr>
          <th style="text-align: center; vertical-align: middle">지수</th>
          <td style="text-align: center; vertical-align: middle">{{ value1 }}</td>
          <th style="text-align: center; vertical-align: middle">구분</th>
          <td style="text-align: center; vertical-align: middle">{{ value2 }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue'

  import { type UseBoolean, useBoolean } from '@/hooks/useBoolean'

  const props = withDefaults(
    defineProps<{
      title?: string
      value1: string
      value2: string
    }>(),
    {
      title: '',
      value1: '',
      value2: '',
    },
  )
</script>

<style scoped lang="scss">
  .title {
    font-size: 15px;
    padding-bottom: 10px;
  }
</style>
