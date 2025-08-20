<template>
  <PagePane :title="title">
    <template #center>
      <div class="container">
        <div class="center">
          <div class="left customScroll">
            <div class="container">
              <div class="ck-editor" style="width: 100%; height: 100%; line-height: 1.5">
                <div v-html="content.contents" class="ck-content" style="padding: 10px"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </PagePane>
</template>

<script setup lang="ts">
  import PagePane from '@/components/common/PagePane.vue'
  import { onActivated, ref } from 'vue'
  import Archive from '@/api/admin/archive/model'
  import archiveService from '@/api/app/archive/archiveService'

  const props = withDefaults(
    defineProps<{
      title: string[]
    }>(),
    {
      title: () => [],
    },
  )

  const content = ref({} as Archive.Archive)

  onActivated(async () => {
    const { data } = await archiveService.getArchiveDetail('58b6a8bb-472e-4e7a-935b-13c69a2ba28d')
    content.value = data
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
