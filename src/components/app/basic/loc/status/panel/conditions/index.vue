<template>
  <PagePane :title="title">
    <template #center>
      <div class="container">
        <div class="center">
          <div class="left customScroll">
            <div class="container">
              <el-image
                style="width: 100%"
                :src="imgSrc"
                fit="scale-down"
                :preview-src-list="[imgSrc]"
                :preview-teleported="true"
                :zoom-rate="1.2"
              />
            </div>
          </div>
        </div>
      </div>
    </template>
  </PagePane>
</template>

<script setup lang="ts">
  import { computed, onMounted, ref } from 'vue'

  import PagePane from '@/components/common/PagePane.vue'

  import { getConfig } from '@/api/app/config'
  import { API_INFO_CIAMS } from '@/config/config'

  import { useCmmConfigStore } from '@/stores/config/cmmConfig'

  const cmmConfigStore = useCmmConfigStore()

  const imgSrc = ref<string>('')

  const title = computed(() => [
    '산업현황분석',
    `${cmmConfigStore.cmmConfigState['SGG_NAME'].confValue} 산업여건변화`,
  ])

  onMounted(async () => {
    const { data } = await getConfig('BASIC_LOC_STATUS_CONDITIONS')
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
    justify-content: center;
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
