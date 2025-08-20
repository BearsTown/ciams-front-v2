<template>
  <div style="width: 100%; height: 100%; overflow: hidden; display: flex; flex-direction: column">
    <div class="customCard-header" style="display: flex; justify-content: space-between">
      <div class="title">컨텐츠 목록</div>
      <div class="btn-group">
        <el-button
          type="primary"
          v-if="!isActivePriority"
          class="button"
          :disabled="isDisabled"
          @click="
            () => {
              mode = 'ADD'
              isOpenDialog = true
            }
          "
        >
          추가
        </el-button>
        <el-button
          type="primary"
          v-if="!isActivePriority"
          :disabled="!isPriority"
          @click="isActivePriority = !isActivePriority"
        >
          순서 변경
        </el-button>
        <el-button
          type="success"
          v-if="isActivePriority"
          :class="{ 'is-disabled': !isPriority }"
          :disabled="!isPriority"
          @click="changePrioritySave"
        >
          저장
        </el-button>
        <el-button
          v-if="isActivePriority"
          style="color: var(--el-button-text-color)"
          :class="{ 'is-disabled': !isPriority }"
          :disabled="!isPriority"
          @click="changePriorityCancel"
        >
          취소
        </el-button>
      </div>
    </div>

    <div class="customScroll scrollY" style="flex: 1">
      <draggable item-key="key" :list="contents" :disabled="!isActivePriority" ghost-class="ghost">
        <template #item="{ element, index }">
          <div :class="{ priority: isActivePriority }">
            <InsideCollapse
              :ref="(el) => setContentRef(el, element.id, index)"
              :title="element.title"
              :is-open="element.useCollapse"
              style="flex: 1"
            >
              <template #sub>
                <div style="display: flex; justify-content: end">
                  <el-button
                    v-if="!isActivePriority"
                    link
                    @click.stop="handleButtonClick('EDIT', element.id)"
                  >
                    <el-icon>
                      <EditPen />
                    </el-icon>
                  </el-button>
                  <el-button
                    v-if="!isActivePriority"
                    type="danger"
                    link
                    @click.stop="handleButtonClick('DELETE', element.id)"
                  >
                    <el-icon>
                      <Delete />
                    </el-icon>
                  </el-button>
                </div>
              </template>
              <template #content>
                <div
                  v-if="element"
                  class="ck-editor"
                  style="width: 100%; height: 100%; line-height: 1.5; overflow: hidden"
                >
                  <div
                    v-html="element.content"
                    class="ck-content"
                    style="width: 100%; height: 100%; padding: 10px"
                  ></div>
                </div>
              </template>
            </InsideCollapse>

            <div v-if="isActivePriority" class="item-move">
              <span class="drag-handle">
                <el-icon size="25"><DCaret /></el-icon>
              </span>
            </div>
          </div>
        </template>
      </draggable>
    </div>

    <template v-if="CommonUtil.isEmpty(contents)">
      <el-empty description="데이터가 없습니다." :image-size="400" style="height: 100%" />
    </template>

    <AddContentDialog
      v-model="isOpenDialog"
      :mode="mode"
      :menu-id="targetItemId"
      :parent-id="menuId"
      @update:success="reload"
    />
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, watch } from 'vue'
  import draggable from 'vuedraggable'

  import { InsideCollapse } from '@/components/common/collapse'
  import AddContentDialog from '@/components/admin/content/AddContentDialog.vue'

  import CommonUtil from '@/utils/commonUtil'

  import { Content } from '@/models/api/admin/content'

  import { getContentList } from '@/services/admin/content'
  import { deleteContent, updatePriority } from '@/api/admin/content'

  const props = withDefaults(
    defineProps<{
      menuId?: number
    }>(),
    {},
  )

  const isOpenDialog = ref<boolean>(false)
  const targetItemId = ref<number>()
  const mode = ref<'ADD' | 'EDIT'>('ADD')
  const contents = ref<Content[]>([])
  const isActivePriority = ref<boolean>(false)
  const contentRefs = ref<Map<number, InstanceType<typeof InsideCollapse>>>(new Map())

  const isDisabled = computed<boolean>(() => !props.menuId)
  const isPriority = computed<boolean>(() => contents.value.length > 1)

  const setContentRef = (el: any, id: number, index: number) => {
    if (el) {
      contentRefs.value.set(id, el)
    } else {
      contentRefs.value.delete(id)
    }
  }

  async function changePrioritySave() {
    CommonUtil.confirm(`저장 하시겠습니까?`, '저장')
      .then(async () => {
        await updatePriority({
          menuId: props.menuId!,
          ids: contents.value.map((item) => item.id),
        })
      })
      .then(async () => {
        CommonUtil.successMessage('저장 성공')
        await reload()
      })
  }

  async function changePriorityCancel() {
    await reload()
  }

  async function loadData(menuId?: number) {
    if (CommonUtil.isEmpty(menuId)) {
      contents.value = []
    } else {
      contents.value = await getContentList(menuId!)
    }
  }

  function handleButtonClick(type: 'EDIT' | 'DELETE', menuId: number) {
    switch (type) {
      case 'EDIT': {
        mode.value = 'EDIT'
        targetItemId.value = menuId
        isOpenDialog.value = true
        break
      }

      case 'DELETE': {
        CommonUtil.confirm(`컨텐츠를 삭제 하시겠습니까?`, '삭제')
          .then(async () => {
            await deleteContent(menuId)
          })
          .then(async () => {
            await reload()
            CommonUtil.successMessage('컨텐츠 삭제 성공')
          })
        break
      }
    }
  }

  async function reload() {
    await loadData(props.menuId)
    isActivePriority.value = false
  }

  watch(
    () => props.menuId,
    async (menuId: number) => {
      await loadData(menuId)

      if (isActivePriority.value) isActivePriority.value = false
    },
  )

  watch(
    () => isActivePriority.value,
    (active: boolean) => {
      if (active) {
        contentRefs.value.forEach((item) => {
          item.off()
        })
      }
    },
  )
</script>

<style scoped lang="scss">
  @import '@/assets/css/referencePage.css';

  .customCard-header {
    height: auto !important;
    align-items: center;
    margin-bottom: 10px;
  }

  .btn-group {
    > .button {
      width: 80px;
    }

    :not(:disabled):hover {
      opacity: 0.8;
      transition: 0.3s;
    }

    :not(:first-child) {
      margin-left: 10px;
    }

    &.is-disabled {
      > button {
        cursor: not-allowed;
      }
    }
  }

  :deep(.el-button) {
    margin-left: 3px !important;
  }

  .priority {
    display: flex;
    margin-bottom: 5px;
    border-radius: 6px;
    border: 1px dashed rgb(192, 204, 218);
  }

  .item-move {
    padding: 5px;
    height: auto;
    display: flex;
    align-items: center;

    .drag-handle {
      cursor: pointer;
    }
  }

  .ghost {
    opacity: 0.6;
    background: #c8ebfb;
  }
</style>
