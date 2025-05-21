<template>
  <PagePane :title="title">
    <template #center>
      <div class="container">
        <div class="center" style="overflow: hidden">
          <div
            class="left"
            v-if="groups?.[0]"
            :style="groups.length === 1 ? { width: '100%' } : ''"
          >
            <div
              style="
                display: flex;
                flex-direction: column;
                height: 100%;
                border: none;
                box-shadow: none;
              "
            >
              <DataComp
                :title="groups[0]?.title"
                :view="groups[0]?.view"
                :data-id="groups[0]?.dataId"
                @update:view="(newView) => groups[0]!.view = newView"
              />
            </div>
          </div>

          <div class="right" v-if="1 < groups.length">
            <div
              style="
                display: flex;
                flex-direction: column;
                height: 100%;
                border: none;
                box-shadow: none;
              "
            >
              <DataComp
                :title="groups[1]?.title"
                :view="groups[1]?.view"
                :data-id="groups[1]?.dataId"
                @update:view="(newView) => groups[1]!.view = newView"
              />
            </div>
          </div>
        </div>
        <!--
        <div class="bottom customScroll">
          <div class="text-wrap">
            - 지역 내 경제적 파급효과가 큰 선도산업 중 특히 LQ분석 지수가 높은 초기반산업은 화학섬유
            제조업, 철도장비 제조업, 전구 및 조명장치 제조업, 합성고무 및 플라스틱 물질 제조업으로
            나타났으며 <br />
            - 앞으로 김천시 지역경제의 중추적 역할을 할 것으로 예상되는 신흥산업에는 특수 목적용
            기계 제조업, 자동차 차체 및 트레일러 제조업, 구조용 금속제품, 탱크 및 증기발생기 제조업
            등으로 나타남
          </div>
        </div>
        -->
      </div>
    </template>
  </PagePane>
</template>

<script setup lang="ts">
  import { onActivated, onBeforeMount, onMounted, ref, watch } from 'vue'

  import { useGlobalStore } from '@/stores/app'
  import { useMenu3Sub2Page1Store } from 'src/stores/app/menu-3/sub-2/page-1'
  import PagePane from '@/components/common/PagePane.vue'
  import { useCmmConfigStore } from '@/stores/config/cmmConfig'
  import CommonUtil from '@/utils/commonUtil'
  import { getStatusGroups } from '@/api/app/menu-1/sub-1/tab-a'
  import DataComp from '@/components/app/menu-1/sub-1/panel/tab-A/DataComponent.vue'

  const globalStore = useGlobalStore()
  const menu3Sub2Page1Store = useMenu3Sub2Page1Store()

  const cmmConfigStore = useCmmConfigStore()

  async function loadConfig() {
    try {
      await cmmConfigStore.loadCmmConfig()
      await cmmConfigStore.loadMapConfig()
    } catch (err) {
      CommonUtil.errorMessage(err)
    }
  }

  const props = withDefaults(
    defineProps<{
      title?: string[]
      statusId: number
    }>(),
    {
      title: () => [],
    },
  )

  const groups = ref<any[]>([])

  async function loadGroup(statusId: number) {
    const { data } = await getStatusGroups(statusId)
    groups.value = data
  }

  watch(
    () => props.statusId,
    async () => {
      console.log(props.statusId)

      await loadGroup(props.statusId)
    },
    { immediate: true },
  )

  onMounted(async () => {
    await loadConfig()

    // const sidoCd = cmmConfigStore.cmmConfigState['SIDO_CODE']?.confValue
    // const sggCd = cmmConfigStore.cmmConfigState['SGG_CODE']?.confValue
    // const { data } = await getItaDatas(`${sidoCd}${sggCd}`)
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
      display: flex;
      flex-direction: row;
      overflow-y: hidden;
      height: 100%;
      gap: 8px;

      .left {
        width: 50%;
        padding: 10px;
        background: #fff;
        border-radius: 8px;
      }

      .right {
        width: 50%;
        padding: 10px;
        background: #fff;
        display: flex;
        flex-direction: column;
        //margin-left: 8px;
        border-radius: 8px;
      }

      .right-top {
      }

      .right-bottom {
      }
    }

    .bottom {
      height: 80px;
      margin-top: 8px;
      min-height: 100px;
      max-height: 200px;

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

  .border-box-square:first-child {
    margin: 0;
  }

  .header-title {
    margin: 5px 0;
    color: #212121;
    font-size: 15px;
    font-weight: 700;
    letter-spacing: -0.02em;
  }

  .customTable th,
  .customTable td {
    border-left: 1px solid #e0e0e0;
    border-right: 1px solid #e0e0e0;
  }

  :deep(th.el-table__cell) {
    background-color: var(--el-fill-color-light);
  }

  :deep(.el-table) .warning-row {
    --el-table-tr-bg-color: #e6b9b8;
  }
  :deep(.el-table) .success-row {
    --el-table-tr-bg-color: var(--el-color-success-light-9);
  }
  //:deep(.el-table__body) tr:hover > td {
  //  background-color: transparent !important;
  //}
</style>
