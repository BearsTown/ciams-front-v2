<template>
  <PagePane :title="title">
    <template #sub>
      <Source :list="sources" />
    </template>

    <template #center>
      <div class="container">
        <div class="top customScroll">
          <div class="text-wrap">
            <template v-for="desc in descriptions" :key="desc.id">
              <p v-if="desc.description">- {{ desc.description }}</p>
            </template>
          </div>
        </div>
        <div class="center" style="position: relative">
          <div class="left customScroll">
            <DensityImage title="" :densities="densities" />
          </div>
          <div style="position: absolute; bottom: 10px; left: 10px; width: 80px">
            <el-image :src="imgSrc" fit="cover" />
          </div>
        </div>
      </div>
    </template>
  </PagePane>
</template>

<script setup lang="ts">
  import { computed, onMounted, ref, watch } from 'vue'

  import Source from '@/components/common/Source.vue'
  import PagePane from '@/components/common/PagePane.vue'
  import DensityImage from '@/components/app/basic/loc/status/panel/density/Density-Image.vue'

  import { API_INFO_CIAMS } from '@/config/config'
  import { getConfig } from '@/api/app/config'

  import { CiamsBasicLocDescription } from '@/models/api/app/basic/loc/ciams-basic-loc-description'
  import { SourceGroupDTO } from '@/api/app/source/model'
  import { getDensityInfo } from '@/api/app/basic/loc/ind-status'

  import { useBasicLocIndStatusDensityStore } from '@/stores/app/basic/loc/ind-status/density'

  const basicLocIndStatusDensityStore = useBasicLocIndStatusDensityStore()

  const imgSrc = ref<string>('')
  const densities = ref<DensityImage[]>([])
  const sources = ref<SourceGroupDTO.SourceDTO[]>([])
  const descriptions = ref<CiamsBasicLocDescription[]>([])

  const title = computed(() => [
    '사업체 밀도변화',
    `${basicLocIndStatusDensityStore.selectedTab?.name}`,
  ])

  watch(
    () => basicLocIndStatusDensityStore.selectedTab,
    async (selectedTab) => {
      if (selectedTab) {
        const { data: rawData } = await getDensityInfo(selectedTab.id)
        densities.value = rawData.densities
        descriptions.value = rawData.descriptions
        sources.value = rawData.sources[0]?.sources
      }
    },
    { immediate: true },
  )

  onMounted(async () => {
    const { data } = await getConfig('BASIC_LOC_STATUS_DENSITY_LEGEND')
    const prefixPath = API_INFO_CIAMS.PREFIX + '/api/v1/file/image'
    imgSrc.value = `${prefixPath}/${data?.attachFile?.id}`
  })
</script>

<style lang="scss"></style>

<style scoped lang="scss">
  .container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;

    .center {
      flex: 1;
      height: 0;
      display: flex;
      overflow: hidden;
      flex-direction: row;

      .left {
        width: 100%;
        height: 100%;

        padding: 5px;
        background: #fff;
        border-radius: 8px;
      }

      .right {
        width: 50%;

        padding: 10px;
        background: #fff;
        margin-left: 8px;
        border-radius: 8px;
        overflow: hidden;
      }
    }

    .top {
      height: 80px;
      margin-bottom: 8px;
      min-height: 100px;
      max-height: 150px;

      padding: 10px;
      background: #fff;
      border-radius: 8px;
    }

    .bottom {
      height: 80px;
      margin-top: 8px;
      min-height: 100px;
      max-height: 150px;

      padding: 10px;
      background: #fff;
      border-radius: 8px;
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
  }

  .customTable tr > td:not([rowspan]) {
    border-left: 1px solid #e0e0e0;
  }
</style>
