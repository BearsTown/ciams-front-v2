<template>
  <div class="urbanInfo" style="padding: 0">
    <div class="container search">
      <div class="search-box">
        <div class="form-group">
          <label class="form-label">검색어</label>
          <div>
            <input
              type="text"
              class="customInput"
              placeholder="검색어"
              v-model="name"
              @keyup.enter="keyEnter"
            />
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">관리유형</label>
          <div>
            <el-select v-model="temp" placeholder="관리유형을 선택하세요" size="small">
              <el-option
                v-for="state in statusCode"
                :key="state.value"
                :label="state.label"
                :value="state.value"
              />
            </el-select>
          </div>
        </div>
      </div>
      <div class="bottom">
        <div class="btn-group">
          <button type="button" class="btn-search" @click="runSearch">검색</button>
          <button type="button" class="btn-reload" @click="clear">초기화</button>
        </div>
      </div>
    </div>

    <div class="container info" style="overflow-y: hidden; flex: 1">
      <div style="display: flex; flex-direction: column; height: 100%">
        <div class="result-header">검색결과 총 {{ pageInfo.totalCount }}건</div>
        <div class="result-wrap" style="flex: 1; overflow-y: auto">
          <AreaPageList
            ref="areaPageListRef"
            :area-list-items="areaItems"
            @item-select="areaItemSelect"
          />
        </div>
        <div class="result-pagination">
          <el-pagination
            size="small"
            :total="pageInfo.totalCount"
            :page-size="pageInfo.pageSize"
            :current-page="pageInfo.pageNo"
            layout="prev, pager, next"
            @current-change="handleCurrentChange"
            style="display: flex; align-items: center; justify-content: center; padding: 5px"
            class="customPagination"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import AreaPageList from '@/components/common/ZoneTable/ZonePageList.vue'

  import { onMounted, ref } from 'vue'

  import { getPlanArea } from '@/api/app/plan'
  import { Plan } from '@/api/app/plan/model'
  import { pageObject } from '@/js/common'

  // import { usePlanAreaStore } from '@/stores/app/operation/planArea'

  // const planAreaStore = usePlanAreaStore()
  // const { isMainLink, planArea, modal } = storeToRefs(planAreaStore)

  const props = withDefaults(
    defineProps<{
      pageSize: number
    }>(),
    {
      pageSize: 4,
    },
  )

  const name = ref('')
  const pageObj = pageObject()
  const pageInfo = pageObj.pageInfo
  pageInfo.currentPageSize = props!.pageSize

  const currentParams = ref<Plan.Search.Params>()
  const areaItems = ref<Plan.Search.Row[]>()
  const areaPageListRef = ref<InstanceType<typeof AreaPageList>>()

  const emits = defineEmits<{
    (e: 'item-select', type: Plan.Search.Row): void
    (e: 'clear'): void
  }>()

  const temp = ref()
  const statusCode = [
    { value: '', label: '전체' },
    { value: 0, label: '산업관리형' },
    { value: 1, label: '산업정비형' },
    { value: 2, label: '산업혁신형' },
    { value: 3, label: '산업정비•혁신형' },
  ]

  function setParams(params: Plan.Search.Params) {
    currentParams.value = params
  }

  async function search(pageNo: number, size: number) {
    const params = {
      size,
      pageNo,
      ...currentParams.value,
    } as Plan.Search.Params

    const { data } = await getPlanArea(params)
    responseData(data)
  }

  function clear() {
    name.value = ''

    runSearch()
    emits('clear')
  }

  function keyEnter() {
    runSearch()
  }

  function runSearch() {
    const params = {
      name: name.value,
    }

    setParams(params)
    search(1, pageInfo.currentPageSize)
  }

  function responseData(data: Plan.Search.Result) {
    areaItems.value = data.list
    pageObj.setPageData(data.page)
  }

  function handleCurrentChange(pageNo: number) {
    search(pageNo, pageInfo.currentPageSize)
  }

  function areaItemSelect(item: Plan.Search.Row) {
    emits('item-select', item)
  }

  onMounted(async () => {
    await runSearch()

    //메인화면 성장관리구역 링크 실행
    // if (isMainLink.value == true) {
    //   mittBus.emit('ciamsPlan-area-item-select', planArea.value)

    //지도 로딩 완료 전 호출시 제대로 호출이 안됨
    setTimeout(() => {
      const baseLayer = 'CIAMS_PLANID_PLAN'
      // mapUtil.selectHighLight(
      //   planArea.value.planId,
      //   'PLAN',
      //   baseLayer.replace('PLANID', planArea.value.planId.toUpperCase()),
      //   equalTo('AREA_NAME', planArea.value.name),
      // )
      // planAreaStore.setIsMainLink(false)
    }, 500)
    // }
  })

  defineExpose({
    areaItemSelect,
  })
</script>

<style scoped lang="scss">
  .urbanInfo {
    display: flex;
    flex-direction: column;
  }

  .urbanInfo .search .btn-group {
    flex: 1;
  }

  .urbanInfo .result-wrap {
    height: auto;
  }

  .btn-fixed {
    display: block;

    :deep(.el-radio-button) {
      width: 100%;
      min-width: 70px;
      max-width: 75px;

      .el-radio-button__inner {
        width: 100%;
        padding: 8px;
      }
    }
  }

  .select-bottom {
    :deep(.el-input) {
      & > .is-focus {
        box-shadow: none !important;
      }

      :hover {
        box-shadow: none !important;
      }
    }

    :deep(.el-input__wrapper) {
      box-shadow: none;
      border-radius: 0;
      border-bottom: 1px solid;
    }
  }
</style>
