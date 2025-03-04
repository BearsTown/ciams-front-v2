<template>
  <div
    v-if="props.item.planAreaId != '' && props.item.planId != ''"
    style="text-align: right; padding: 5px"
  >
    <span style="float: left; font-weight: bold">
      {{ props.item.planAreaName }}
      <el-badge :value="dataList.length" />
    </span>
    <el-button type="primary" size="small" v-if="!isEdit" @click="addPop">추가 </el-button>
    <el-button
      type="success"
      size="small"
      v-if="!isEdit && dataList.length > 1"
      @click="isEdit = true"
      >순서 편집
    </el-button>
    <el-button type="primary" size="small" v-if="isEdit" @click="changeCodePriority"
      >편집완료
    </el-button>
  </div>
  <div v-if="dataList.length == 0" style="text-align: center; font-size: 10pt; width: 100%">
    <Empty />
  </div>
  <div style="display: flex; flex-direction: column; height: 100%; width: 700px">
    <el-scrollbar
      v-if="props.item.planAreaId != '' && props.item.planId != ''"
      style="padding: 5px"
    >
      <draggable v-model="dataList" handle=".handle" item-key="planContentId" style="width: 100%">
        <template #item="{ element }">
          <div
            style="
              display: flex;
              border: 1px dashed #c0ccda;
              padding: 5px;
              margin: 5px;
              border-radius: 6px;
            "
          >
            <div class="planningDetail-content customCard">
              <InsideCollapse :title="element.title" :is-open="element.isOpen" style="width: 556px">
                <template #content>
                  <Content :element="element" />
                </template>
              </InsideCollapse>
            </div>
            <div
              v-if="!isEdit"
              style="
                display: flex;
                justify-content: center;
                flex-direction: column;
                width: 100px;
                text-align: center;
              "
            >
              <div v-if="element.isRoadPlan" style="padding-bottom: 10px">
                <el-tag type="warning">도로계획</el-tag>
              </div>
              <div>
                <el-button type="danger" size="small" @click="delContent(element)">
                  <el-icon><Delete /></el-icon>삭제
                </el-button>
              </div>
            </div>
            <div
              v-if="isEdit"
              style="
                display: flex;
                justify-content: center;
                flex-direction: column;
                width: 100px;
                text-align: center;
              "
            >
              <span style="cursor: pointer" class="handle">
                <el-icon size="25"><DCaret /></el-icon>
              </span>
            </div>
          </div>
        </template>
      </draggable>
    </el-scrollbar>
    <AddContentDialog
      :visible="modifyDialogVisible"
      :category="props.category"
      :planId="props.item.planId"
      :planAreaId="props.item.planAreaId"
      :list="dataList"
      @close-dialog="closeDialog"
    />
  </div>
</template>

<script setup lang="ts">
  import { Plan } from '@/api/app/plan/model'
  import { planContentAreaList } from '@/api/app/planContent'
  import type PlanContent from '@/api/app/planContent/model'
  import { changePriority, planContentLinkDelete } from '@/api/app/planContentLink'
  import Content from '@/components/common/Content.vue'
  import { InsideCollapse } from '@/components/common/collapse'
  import { API_INFO_CIAMS } from '@/config/config'
  import commonUtil from '@/utils/commonUtil'
  import type { Ref } from 'vue'
  import { onActivated, onMounted, ref, watch } from 'vue'
  import draggable from 'vuedraggable'
  import AddContentDialog from './AddContentDialog.vue'

  const props = withDefaults(
    defineProps<{
      // selectLinkVer: { ver: string; planContentLinkId: string } | null | undefined
      item: Plan.Search.Row
      category: string
    }>(),
    {
      category: 'INFRA',
    },
  )
  const modifyType: Ref<'ADD' | 'MOD'> = ref('ADD') //'ADD', 'MOD'
  const modifyDialogVisible = ref(false)
  const isEdit = ref(false)

  const prefixPath = API_INFO_CIAMS.PREFIX + '/api/v1/file/down/'

  const dataList = ref([] as PlanContent.Search.Row[])
  const planContentLinkId = ref('')

  function addPop() {
    modifyType.value = 'ADD'
    modifyDialogVisible.value = true
  }

  /**
   * 삭제
   */
  function delContent(item: PlanContent.Search.Row) {
    commonUtil.confirm('삭제하시겠습니까?', '삭제').then(() => {
      if (item.planContentLinkId) {
        planContentLinkDelete(item.planContentLinkId, item.planContentId)
          .then(() => {
            commonUtil.successMessage(`삭제되었습니다.`)
            getList()
          })
          .catch((err) => {
            commonUtil.errorMessage(`오류가 발생했습니다.`)
            console.log(err)
          })
      }
    })
  }

  /**
   * 순서변경
   */
  function changeCodePriority() {
    let cnt = 1
    const list = dataList.value.map((obj) => {
      return {
        planContentLinkId: obj.planContentLinkId,
        planContentId: obj.planContentId,
        sortSn: cnt++,
      }
    })

    changePriority(list)
      .then(() => {
        commonUtil.successMessage(`수정되었습니다.`)
        isEdit.value = false
      })
      .catch((err) => {
        commonUtil.errorMessage(`오류가 발생했습니다.`)
        console.log(err)
      })
  }

  function getList() {
    planContentAreaList({
      // planContentLinkId: planContentLinkId.value,
      planId: props.item.planId,
      planAreaId: props.item.planAreaId,
      category: props.category,
    }).then((res) => {
      console.log('res')
      console.log(res)
      dataList.value = res.data
    })
  }

  function closeDialog(status: boolean) {
    if (status) {
      getList()
    }
    modifyDialogVisible.value = false
  }

  watch(props, () => {
    // if (props.selectLinkVer) {
    //   planContentLinkId.value = props.selectLinkVer.planContentLinkId
    // }
    getList()
  })

  onActivated(() => {
    getList()
  })

  onMounted(() => {
    getList()
  })
</script>

<style scoped>
  @import '@/assets/css/planningDetail.css';
</style>
<style scoped>
  /* .area-c {
     display: flex;
     flex-direction: column;
     border-radius: 5px;
     padding: 10px;
     margin: 5px;
     background-color: rgb(187, 187, 187);
     border: 0px;
     cursor: pointer;
   }
   .area-c-title {
     color: white;
     font-weight: bold;
     font-size: 15px;
   }

   .area-c-content {
     background-color: white;
     padding: 10px;
     margin: 5px;
     border-radius: 5px;
   }

   .active {
     background-color: var(--ugis-color-temp-3);
     border: 2px solid var(--ugis-color-temp-1);
   }

   .ct-left {
     width: 10%;
     background-color: var(--ugis-color-temp-3);
     color: white;
     font-weight: bold;
     margin-top: 4px;
     margin-bottom: 4px;
     padding: 4px;
     text-align: center;
     display: flex;
     align-items: center;
   }
   .ct-right {
     width: 90%;
     margin: 4px;
     padding: 4px;
     word-break: break-all;
   } */

  .customTable th {
    padding: 6px 10px;
    /* text-align: left; */
    font-size: 14px;
    line-height: 1.4;
    text-align: center;
    vertical-align: middle;
  }

  .customTable td {
    padding: 6px 10px;
    text-align: left;
    font-size: 14px;
    line-height: 1.4;
    font-weight: 400;
  }
</style>
