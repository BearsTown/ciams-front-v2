<template>
  <div class="container customScroll" style="background-color: #eee; border-radius: 4px">
    <div class="set-wrap">
      <template v-if="type === 'radio'">
        <el-radio-group v-model="selectedListKeys[0]" @change="handleSelectionChange">
          <el-radio-button v-for="item in dataList" :key="item[keyName]" :label="item[keyName]"
            >{{ item[titleName] }}
          </el-radio-button>
        </el-radio-group>
      </template>

      <template v-else-if="type === 'multi'">
        <!-- <el-checkbox-group v-model="selectedListKeys" @change="handleSelectionChange">
          <el-checkbox-button key="all" label="all" class="set-item">전체 </el-checkbox-button>
          <el-checkbox-button
            v-for="item in dataList"
            :key="item[keyName]"
            :label="item[keyName]"
            class="set-item"
            >{{ item[titleName] }}
          </el-checkbox-button>
        </el-checkbox-group> -->
        <label v-if="allButtonUsed" :class="allSelected ? 'set-item active' : 'set-item'" for="all">
          전체
          <input type="checkbox" id="all" value="all" v-model="allSelected" style="display: none" />
        </label>

        <label
          :class="multiSelected.includes(item[titleName]) ? 'set-item active' : 'set-item'"
          v-for="item in dataList"
          :for="item[titleName]"
          :key="item[titleName]"
        >
          {{ item[titleName]
          }}<input
            type="checkbox"
            :id="item[titleName]"
            :value="item[titleName]"
            v-model="multiSelected"
            @change="handleSelectionChange"
            style="display: none"
          />
        </label>

        <div class="select-control" style="padding: 0px; margin: 0px">
          &nbsp;
          <!-- <el-button @click="selectAll">전체</el-button> -->
          <!-- <el-button @click="selectReverse">반전</el-button> -->
          <!-- <el-button @click="clearSelection">해제</el-button> -->
        </div>
      </template>

      <template v-else-if="type === 'list'">
        <el-tree
          ref="listRef"
          node-key="key"
          :data="dataList"
          :props="{ label: 'title' }"
          show-checkbox
          @check-change="handleSelectionChange"
        />

        <div class="select-control">
          <el-button @click="selectAll">전체</el-button>
          <el-button @click="selectReverse">반전</el-button>
          <el-button @click="clearSelection">해제</el-button>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
  import { onMounted, ref, toRefs, watch } from 'vue'

  import { useSelection } from '@/hooks/useSelection'
  import { computed } from 'vue'

  const props = defineProps({
    type: {
      type: String,
      default: 'multi',
    },
    keyName: {
      type: String,
      default: '',
    },
    valueName: {
      type: String,
      default: '',
    },
    titleName: {
      type: String,
      default: '',
    },
    requestApi: {
      type: Function,
      default: () => {},
    },
    allButtonUsed: {
      type: Boolean,
      default: false,
    },
    buttonWidthCnt: {
      type: Number,
      default: 3,
    },
    maxHeight: {
      type: String,
      default: '240px',
    },
  })
  const emits = defineEmits(['selection-change', 'selection-all', 'selection-mount-end'])

  const {
    dataList,
    selectedList,
    selectionChange,
    allList,
    requestApi,
    isSelectedAll,
    selectAll: useSelectAll,
    selectReverse,
    clearSelection: useClearSelection,
    selectedListKeys,
  } = useSelection(props.requestApi, props.keyName)

  onMounted(async function () {
    await requestApi()
    emits('selection-mount-end')
  })

  watch(
    () => selectedList.value,
    () => {
      emits('selection-change', selectedList.value, allSelected.value)
    },
  )

  const listRef = ref()
  const allSelected = computed({
    get: () => {
      return isSelectedAll.value
    },
    set: (e) => {
      // multiSelected.value = e ? dataList.value.map((a) => a.title) : []
      // handleSelectionChange()
      isSelectedAll.value = !isSelectedAll.value
      if (e) {
        emits('selection-change', dataList.value, allSelected.value)
        // selectedList.value = []
        multiSelected.value = []
      } else {
        emits('selection-change', [], allSelected.value)
      }
    },
  })
  const multiSelected = ref([])

  function handleSelectionChange(list) {
    switch (props.type) {
      case 'radio': {
        list = [list]
        break
      }
      case 'multi': {
        list = [list]
        break
      }
      case 'list': {
        // list = list.map((data) => data.key)
        list = listRef.value.getCheckedKeys()
        break
      }
    }

    if (props.type === 'multi') {
      isSelectedAll.value = false
      selectionChange(multiSelected.value)
    } else {
      selectionChange(list)
    }
  }

  function selectAll(a) {
    useSelectAll()
    listRefresh()

    if (props.type === 'multi') {
      multiSelected.value = dataList.value.map((a) => a.title)
    }

    emits('selection-all', a)
  }

  function clearSelection() {
    useClearSelection()
    listRefresh()

    if (props.type === 'multi') {
      multiSelected.value = []
    }
  }

  function listRefresh() {
    if (props.type === 'list') {
      listRef.value.setCheckedNodes(selectedList.value)
    }
  }

  function reRequestApi() {
    requestApi()
  }

  function setSelectionChange(list) {
    selectionChange(list)
  }

  defineExpose({
    ...toRefs({}),
    dataList,
    selectAll,
    selectedList,
    clearSelection,
    reRequestApi,
    setSelectionChange,
  })
</script>
<style scoped lang="scss">
  .set-item {
    width: calc((100% / v-bind(buttonWidthCnt)) - 6px);
    min-height: 38px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    margin: 3px;
    padding: 6px;
    background-color: #fff;
    border-radius: 4px;
    word-break: break-all;
    font-size: 14px;
    font-weight: 500;
    letter-spacing: -0.02em;
    line-height: 1.21;
    color: #616161;
  }

  .set-item:not(.disabled):hover {
    cursor: pointer;
    border-color: #52b597;
    color: #52b597;
  }

  .set-item:not(.disabled).active {
    background: #52b597;
    border-color: #52b597;
    color: #fff;
  }

  .set-wrap {
    max-height: v-bind(maxHeight) !important;
    display: flex;
    flex-wrap: wrap;
    padding: 8px;
    border-radius: 4px;
    background-color: #eee;
  }
  // @import '@/assets/css/zoningSetting.css';
</style>
<style scoped lang="scss">
  .el-radio-group {
    display: block;

    :deep(.el-radio-button) {
      width: 100%;
      min-width: 70px;
      max-width: 95px;

      .el-radio-button__inner {
        width: 100%;
        padding: 8px;
      }
    }
  }

  .el-checkbox-group {
    flex-wrap: wrap;
    align-items: center;
    display: inline-flex;

    :deep(.el-checkbox-button) {
      margin: 2px;
      width: 100%;
      min-width: 70px;
      max-width: 140px;

      .el-checkbox-button__inner {
        width: 100%;
        padding: 8px;
        border: 0;
        //       border-radius: var(--el-border-radius-base);
      }
    }
  }

  .select-control {
    display: flex;
    justify-content: flex-end;
    margin: 10px 3px 0px 3px;

    & > .el-button {
      margin-left: 6px;
      background-color: var(--el-color-info-light-7);
    }
  }
</style>
