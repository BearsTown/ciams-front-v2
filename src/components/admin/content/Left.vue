<template>
  <div style="width: 100%; height: 100%; overflow: hidden; display: flex; flex-direction: column">
    <div class="customCard-header" style="height: 30px">
      <div class="title">메뉴 목록</div>
      <div class="btn-group">
        <el-button type="primary" class="button" @click="handleAddClick"> 추가</el-button>
      </div>
    </div>

    <div class="customScroll scrollY" style="flex: 1">
      <el-tree
        ref="treeRef"
        node-key="id"
        default-expand-all
        :highlight-current="false"
        :expand-on-click-node="false"
        :data="menuList"
        :props="defaultProps"
        :current-node-key="currentNodeKey"
        @node-click="handleNodeClick"
        style="width: 100%; height: 100%"
      >
        <template #default="{ node, data }">
          <div
            :class="[
              'custom-tree-node',
              {
                'current-highlight': currentNodeKey === data.id && data.level > 0,
              },
            ]"
          >
            <span class="custom-tree-node-label" :title="node.label">{{ node.label }}</span>
            <div class="">
              <el-button link v-if="data.level === 0" @click.stop="handleButtonClick('ADD', data)">
                <el-icon>
                  <Plus />
                </el-icon>
              </el-button>
              <el-button link @click.stop="handleButtonClick('EDIT', data)">
                <el-icon>
                  <EditPen />
                </el-icon>
              </el-button>
              <el-button type="danger" link @click.stop="handleButtonClick('DELETE', data)">
                <el-icon>
                  <Delete />
                </el-icon>
              </el-button>
            </div>
          </div>
        </template>
      </el-tree>
    </div>

    <AddContentMenuDialog
      v-model="isOpenDialog"
      :mode="mode"
      :menu-id="targetData.menuId"
      :parent-id="targetData.parentId"
      :parent-title="targetData.parentTitle"
      @update:success="reload"
    />
  </div>
</template>

<script setup lang="ts">
  import { onMounted, reactive, ref } from 'vue'
  import { ElTree } from 'element-plus'

  import AddContentMenuDialog from '@/components/admin/content/AddContentMenuDialog.vue'

  import CommonUtil from '@/utils/commonUtil'

  import { ContentMenu } from '@/models/services/admin/content-menu'

  import { deleteContentMenu } from '@/api/admin/content-menu'
  import { getContentMenuList } from '@/services/admin/content-menu'

  const props = withDefaults(
    defineProps<{
      menuId: number
      menuTitle: string
    }>(),
    {},
  )

  const mode = ref<'ADD' | 'EDIT'>('ADD')
  const isOpenDialog = ref<boolean>(false)
  const menuList = ref<ContentMenu[]>([])
  const treeRef = ref<InstanceType<typeof ElTree>>()
  const currentNodeKey = ref<number | null>(null)

  const targetData = reactive<{
    menuId?: number
    parentId?: number
    parentTitle?: string
  }>({
    parentId: props.menuId,
    parentTitle: props.menuTitle,
  })

  const defaultProps = {
    label: 'title',
    children: 'children',
  }

  const emits = defineEmits<{
    (e: 'item-select', menuId: number | null): void
  }>()

  function handleAddClick() {
    mode.value = 'ADD'
    targetData.parentId = props.menuId
    targetData.parentTitle = props.menuTitle
    isOpenDialog.value = true
  }

  function handleButtonClick(type: 'ADD' | 'EDIT' | 'DELETE', data: any) {
    switch (type) {
      case 'ADD': {
        mode.value = 'ADD'
        targetData.parentId = data.id
        targetData.parentTitle = data.title
        isOpenDialog.value = true
        break
      }
      case 'EDIT': {
        mode.value = 'EDIT'
        targetData.menuId = data.id
        targetData.parentId = data.parentId
        targetData.parentTitle = data.title
        isOpenDialog.value = true
        break
      }

      case 'DELETE': {
        CommonUtil.confirm(`메뉴를 삭제 하시겠습니까?`, '삭제')
          .then(async () => {
            await deleteContentMenu(data.id)
          })
          .then(async () => {
            CommonUtil.successMessage('메뉴 삭제 성공')
            await reload()
          })
        break
      }
    }
  }

  function handleNodeClick(data: ContentMenu, node: any) {
    if (data.level > 0) {
      currentNodeKey.value = data.id
      emits('item-select', data.id)
    } else {
      if (node.childNodes && node.childNodes.length > 0) {
        node.expanded = !node.expanded
      }
    }
  }

  async function reload() {
    await loadData(props.menuId)
    currentNodeKey.value = null
    emits('item-select', null)
  }

  async function loadData(menuId: number) {
    if (CommonUtil.isEmpty(menuId)) return

    menuList.value = await getContentMenuList(props.menuId)
  }

  onMounted(async () => {
    await loadData(props.menuId)
  })
</script>

<style scoped lang="scss">
  @import '@/assets/css/referencePage.css';

  .customCard {
    padding: 10px;
  }

  .customCard-header {
    height: auto !important;
    align-items: center;
    margin-bottom: 10px;
  }

  .btn-group {
    > button {
      color: #fff;
      width: 60px;
      background-color: #7aaad1;
    }

    :not(:disabled):hover {
      opacity: 0.8;
      transition: 0.3s;
    }

    :not(:first-child) {
      margin-left: 10px;
    }
  }

  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    overflow: auto;
    justify-content: space-between;
    font-size: 14px;

    &.current-highlight {
      color: #7aaad1;
      font-weight: bold;
    }

    :deep(.el-button) {
      margin-left: 3px !important;
    }
  }

  .custom-tree-node-label {
    flex: 1;
    overflow: hidden;
    white-space: nowrap;
    display: inline-block;
    text-overflow: ellipsis;
  }
</style>
