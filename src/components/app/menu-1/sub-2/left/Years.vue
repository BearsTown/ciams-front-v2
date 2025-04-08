<template>
  <el-space wrap style="display: grid; grid-template-columns: repeat(4, 1fr); width: 100%">
    <el-button v-for="i in 10" :key="i" style="width: 100%">
      {{ 2015 + i }}
    </el-button>
  </el-space>
</template>

<script setup lang="ts">
  const props = withDefaults(
    defineProps<{
      title: string
      records: object[]
    }>(),
    {
      title: '',
      records: () => {
        return []
      },
    },
  )
</script>

<style scoped lang="scss"></style>
