<template>
  <PagePane :title="['산업기반분석(ITA)', '산업기반분석 결과']">
    <template #sub>
      <Source :list="sources" />
    </template>

    <template #center>
      <div class="container">
        <div class="center">
          <div class="left customScroll">
            <ITAResultTable :data="data" />
          </div>
        </div>
      </div>
    </template>
  </PagePane>
</template>

<script setup lang="ts">
  import { onActivated, onBeforeMount, onMounted, ref } from 'vue'

  import { useGlobalStore } from '@/stores/app'
  import PagePane from '@/components/common/PagePane.vue'
  import { useCmmConfigStore } from '@/stores/config/cmmConfig'
  import { getItaResultDatas } from '@/api/app/menu-1/sub-1/tab-c'
  import { ItaResultData } from '@/api/app/menu-1/sub-1/tab-c/model'
  import ITAResultTable from '@/components/app/menu-1/sub-1/panel/tab-C/ITAResultTable.vue'
  import CommonUtil from '@/utils/commonUtil'
  import Source from '@/components/common/Source.vue'
  import { SourceGroupDTO } from '@/api/app/source/model'
  import { getSources } from '@/api/app/source'

  const globalStore = useGlobalStore()
  const cmmConfigStore = useCmmConfigStore()

  const data = ref<ItaResultData[]>([])
  const sources = ref<SourceGroupDTO.SourceDTO[]>([])

  async function loadConfig() {
    try {
      await cmmConfigStore.loadCmmConfig()
      await cmmConfigStore.loadMapConfig()
    } catch (err) {
      CommonUtil.errorMessage(err)
    }
  }

  onMounted(async () => {
    await loadConfig()

    const sidoCd = cmmConfigStore.cmmConfigState['SIDO_CODE']?.confValue
    const sggCd = cmmConfigStore.cmmConfigState['SGG_CODE']?.confValue

    const { data: sourceData } = await getSources({
      category: '산업특성분석',
      targetId: `${sidoCd}${sggCd}`,
    })

    sources.value = sourceData[0]?.sources

    const { data: rawData } = await getItaResultDatas(`${sidoCd}${sggCd}`)
    data.value = rawData
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
      height: 0px;
      display: flex;
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
