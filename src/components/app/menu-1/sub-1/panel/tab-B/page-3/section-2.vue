<template>
  <PagePane :title="['사업체 밀도변화', '제조업 및 관련서비스업 밀도분석']">
    <template #sub>
      <Source :list="sources" />
    </template>

    <template #center>
      <div class="container">
        <div class="top customScroll">
          <div class="text-wrap">
            <template v-for="(note, idx) in notes" :key="note">
              - {{ note }}
              <br v-if="idx < notes.length - 1" />
            </template>
          </div>
        </div>
        <div class="center" style="position: relative">
          <div class="left customScroll">
            <Density title="제조업 및 관련서비스업 밀도분석" :infos="infos" />
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

  import { useGlobalStore } from '@/stores/app'
  import { useMenu3Sub2Page1Store } from 'src/stores/app/menu-3/sub-2/page-1'
  import { API_INFO_CIAMS } from '@/config/config'
  import PagePane from '@/components/common/PagePane.vue'
  import { useCmmConfigStore } from '@/stores/config/cmmConfig'
  import Density from '@/components/app/menu-1/sub-1/panel/tab-B/page-3/Density.vue'
  import { getDensityInfos } from '@/api/app/menu-1/sub-1/tab-b/page-3'
  import Source from '@/components/common/Source.vue'
  import { SourceGroupDTO } from '@/api/app/source/model'
  import { getSources } from '@/api/app/source'

  const globalStore = useGlobalStore()
  const menu3Sub2Page1Store = useMenu3Sub2Page1Store()

  const cmmConfigStore = useCmmConfigStore()
  const prefixPath = API_INFO_CIAMS.PREFIX + '/api/v1/file/image/'
  const imgSrc = prefixPath + '590a2252-87bf-41e0-bfae-787cf5dbfa53'

  const infos = ref<Density[]>([])
  const notes = ref<string[]>([])
  const sources = ref<SourceGroupDTO.SourceDTO[]>([])

  onMounted(async () => {
    const { data: rawData } = await getDensityInfos('TYPE1')

    infos.value = rawData.infos
    notes.value = rawData.notes

    const { data: sourceData } = await getSources({
      category: '산업현황분석',
      targetId: 'B001',
    })

    sources.value = sourceData[0]?.sources
  })

  onMounted(async () => {})

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
