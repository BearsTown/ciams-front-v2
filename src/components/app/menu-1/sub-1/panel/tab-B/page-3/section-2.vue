<template>
  <PagePane :title="['사업체 밀도변화', '제조업 및 관련서비스업 밀도분석']">
    <template #center>
      <div class="container">
        <div class="top customScroll">
          <div class="text-wrap">
            - 최근 10년간(2011~2021년) 김천시의 제조업 및 관련서비스업은 도시지역에 밀집되어 있는
            모습이었으나, <br />
            - 점차 산업단지의 확장과 함께 산업단지를 중심으로 밀집되어 형성 된 것으로 나타남
          </div>
        </div>
        <div class="center" style="position: relative">
          <div class="left customScroll">
            <Density title="제조업 및 관련서비스업 밀도분석" type="TYPE1" />
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
  import { computed, onActivated, onBeforeMount, onMounted } from 'vue'

  import { useGlobalStore } from '@/stores/app'
  import { useMenu3Sub2Page1Store } from 'src/stores/app/menu-3/sub-2/page-1'
  import { API_INFO_CIAMS } from '@/config/config'
  import PagePane from '@/components/common/PagePane.vue'
  import { useCmmConfigStore } from '@/stores/config/cmmConfig'
  import Density from '@/components/app/menu-1/sub-1/panel/tab-B/page-3/Density.vue'

  const globalStore = useGlobalStore()
  const menu3Sub2Page1Store = useMenu3Sub2Page1Store()

  const cmmConfigStore = useCmmConfigStore()
  const prefixPath = API_INFO_CIAMS.PREFIX + '/api/v1/file/image/'
  const imgSrc = prefixPath + '590a2252-87bf-41e0-bfae-787cf5dbfa53'

  const title = computed(
    () => `${cmmConfigStore.cmmConfigState['SGG_NAME'].confValue} 산업여건변화`,
  )

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
