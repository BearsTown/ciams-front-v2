<template>
  <PagePane :title="['산업기반분석(ITA)', '산업특성분석 결과']">
    <template #sub>
      <Source :list="sources" />
    </template>

    <template #center>
      <div class="container">
        <div class="center">
          <div class="left customScroll">
            <ITAResult v-if="sggCode" :sgg-cd="sggCode" />
          </div>
        </div>
      </div>
    </template>
  </PagePane>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue'

  import Source from '@/components/common/Source.vue'
  import PagePane from '@/components/common/PagePane.vue'
  import ITAResult from '@/components/app/basic/loc/characteristic/panel/ITA-Result.vue'

  import { getSources } from '@/api/app/source'
  import { SourceGroupDTO } from '@/api/app/source/model'

  import { useCmmConfigStore } from '@/stores/config/cmmConfig'

  const cmmConfigStore = useCmmConfigStore()

  const sggCode = ref<string>()
  const sources = ref<SourceGroupDTO.SourceDTO[]>([])

  onMounted(async () => {
    const sidoCd = cmmConfigStore.cmmConfigState['SIDO_CODE']?.confValue
    const sggCd = cmmConfigStore.cmmConfigState['SGG_CODE']?.confValue

    sggCode.value = `${sidoCd}${sggCd}`

    const { data: sourceData } = await getSources({
      category: '산업특성분석',
      targetId: sggCode.value,
    })

    sources.value = sourceData[0]?.sources
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
