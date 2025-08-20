<template>
  <PagePane :title="titles">
    <template #center>
      <div class="container">
        <div class="center">
          <div class="left customScroll">
            <div class="container">
              <div v-for="con in contents" :key="con.id">
                <InsideCollapse :title="con.title" :is-open="con.useCollapse">
                  <template #content>
                    <div
                      v-if="con"
                      class="ck-editor"
                      style="width: 100%; height: 100%; line-height: 1.5"
                    >
                      <div v-html="con.content" class="ck-content" style="padding: 10px"></div>
                    </div>
                  </template>
                </InsideCollapse>
              </div>

              <template v-if="CommonUtil.isEmpty(contents)">
                <el-empty description="데이터가 없습니다." :image-size="400" style="height: 100%" />
              </template>
            </div>
          </div>
        </div>
      </div>
    </template>
  </PagePane>
</template>

<script setup lang="ts">
  import { computed, ref, watch } from 'vue'

  import PagePane from '@/components/common/PagePane.vue'
  import { InsideCollapse } from '@/components/common/collapse'

  import CommonUtil from '@/utils/commonUtil'

  import { Content } from '@/models/api/app/content'
  import { getContentList } from '@/api/app/content'

  import { usePlanImprovementZoneStore } from '@/stores/app/plan/Improvement-zone'

  const planImprovementZoneStore = usePlanImprovementZoneStore()

  const titles = computed<string[]>(() => [
    `${planImprovementZoneStore.selectedGroup?.title}`,
    `${planImprovementZoneStore.selectedItem?.title}`,
  ])

  const props = withDefaults(
    defineProps<{
      menuId?: number
    }>(),
    {},
  )

  const contents = ref<Content[]>([])

  watch(
    () => props.menuId,
    async (newVal) => {
      if (CommonUtil.isEmpty(newVal)) return

      const { data } = await getContentList(newVal!)
      contents.value = data
    },
    { immediate: true },
  )
</script>

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
