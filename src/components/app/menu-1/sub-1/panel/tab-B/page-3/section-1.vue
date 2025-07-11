<template>
  <PagePane :title="['사업체 밀도변화', '전체 사업체 밀도분석']">
    <template #sub>
      <Source :list="sources" />
    </template>

    <template #center>
      <div class="container">
        <div class="top customScroll">
          <div class="text-wrap">
            <template v-for="(note, idx) in notes" :key="note">
              <p>- {{ note }}</p>
            </template>
          </div>
        </div>
        <div class="center" style="position: relative">
          <div class="left customScroll">
            <Density title="전체 사업체 밀도분석" :infos="infos" />
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
  import { onActivated, onBeforeMount, onMounted, ref } from 'vue'

  import PagePane from '@/components/common/PagePane.vue'
  import Source from '@/components/common/Source.vue'
  import Density from '@/components/app/menu-1/sub-1/panel/tab-B/page-3/Density.vue'

  import { API_INFO_CIAMS } from '@/config/config'

  import { getSources } from '@/api/app/source'
  import { SourceGroupDTO } from '@/api/app/source/model'
  import { getDensityInfos } from '@/api/app/menu-1/sub-1/tab-b/page-3'

  import { useGlobalStore } from '@/stores/app'
  import { useCmmConfigStore } from '@/stores/config/cmmConfig'

  const globalStore = useGlobalStore()

  const cmmConfigStore = useCmmConfigStore()
  const prefixPath = API_INFO_CIAMS.PREFIX + '/api/v1/file/image/'
  const imgSrc = prefixPath + '1_2.산업특성분석_3p_범례.png'

  const infos = ref<Density[]>([])
  const notes = ref<string[]>([])
  const sources = ref<SourceGroupDTO.SourceDTO[]>([])

  onMounted(async () => {
    const { data: rawData } = await getDensityInfos('ALL')

    infos.value = rawData.infos
    notes.value = rawData.notes

    const { data: sourceData } = await getSources({
      category: '산업현황분석',
      targetId: 'B001',
    })

    sources.value = sourceData[0]?.sources
  })

  onBeforeMount(() => {})

  onActivated(() => {})
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
      > p {
        padding-left: 0.5em;
        text-indent: -0.6em;
      }
    }
  }

  .customTable tr > td:not([rowspan]) {
    border-left: 1px solid #e0e0e0;
  }
</style>
