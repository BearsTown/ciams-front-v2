<template>
  <el-space
    wrap
    :style="{
      display: 'grid',
      gridTemplateColumns: `repeat(${columnCount}, 1fr)`,
      width: '100%',
      height: '100%',
    }"
  >
    <el-card v-for="year in years" :key="year">
      <template #header>
        <el-text tag="b">{{ year }}년</el-text>
      </template>
      <el-image
        :src="getImageUrl(year)"
        fit="scale-down"
        :preview-src-list="[getImageUrl(year)]"
        :preview-teleported="true"
        :zoom-rate="1.2"
        style="height: 100%; overflow: hidden"
      />
    </el-card>
  </el-space>
</template>

<script setup lang="ts">
  import { computed, onMounted, ref } from 'vue'

  import { API_INFO_CIAMS } from '@/config/config'

  import { DensityDto } from '@/models/api/app/basic/loc/industry/density'

  const props = withDefaults(
    defineProps<{
      title: string
      densities: DensityDto.Density[]
    }>(),
    {
      title: '',
    },
  )

  const activeYear = ref()
  const columnCount = computed(() => {
    return years.value?.length > 3 ? 4 : years.value?.length
  })
  const years = computed(() => props.densities?.map((density) => density.year))
  const yearImage = computed(() => {
    return props.densities?.reduce((acc, density) => {
      acc[density.year] = density.image
      return acc
    }, {})
  })

  const prefixPath = `${API_INFO_CIAMS.PREFIX}/api/v1/file/image/`
  const getImageUrl = (year: string): string => {
    const imageId = yearImage.value[year]
    return imageId ? `${prefixPath}${imageId}` : ''
  }

  onMounted(async () => {
    activeYear.value = years.value[years.value.length - 1]
  })
</script>

<style scoped lang="scss">
  :deep(.el-tabs__header) {
    margin-bottom: 5px;
  }

  .header-title {
    text-align: center;
    margin: 8px 0;
    color: #212121;
    font-size: 15px;
    font-weight: 700;
    letter-spacing: -0.02em;
  }

  .detail {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: #fff;
    border-radius: 8px;

    .top {
      flex: 1;
      //flex: 0 1 auto;
    }

    .bottom {
      height: 200px;
    }
  }

  .customScroll {
    height: max-content;
    overflow-y: auto;
  }
  .text-wrap {
    color: #616161;
    font-size: 15px;
    font-weight: 400;
    line-height: 1.5;
  }
</style>
