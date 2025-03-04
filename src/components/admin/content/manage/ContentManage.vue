<template>
  <div style="text-align: right; padding: 5px">
    <!-- <el-button type="primary" size="small" @click="addPop('BASIC')">일반추가 </el-button> -->
    <el-button type="primary" size="small" @click="addPop('DETAIL')">추가 </el-button>
  </div>
  <div v-if="dataList.length == 0" style="text-align: center; font-size: 10pt; width: 100%">
    <Empty />
  </div>
  <div style="display: flex; flex-direction: column; height: 100%; width: 700px">
    <el-scrollbar style="padding: 5px">
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
                <template #content> <Content :element="element" /></template>
              </InsideCollapse>
            </div>
            <div
              style="
                display: flex;
                justify-content: center;
                flex-direction: column;
                width: 100px;
                text-align: center;
              "
            >
              <div v-if="element.isRoadPlan">
                <el-tag type="warning">도로계획</el-tag>
              </div>
              <!-- <div style="padding-top: 5px">
                <el-button type="warning" size="small" @click="delAllContent(element)">
                  <el-icon><Delete /></el-icon>전체삭제
                </el-button>
              </div> -->
              <div style="padding-top: 5px">
                <el-button type="warning" size="small" @click="addAllContent(element)">
                  전체 구역 추가
                </el-button>
              </div>
              <div style="padding-top: 5px">
                <el-button type="danger" size="small" @click="delAllContent(element)">
                  <el-icon><Delete /></el-icon>삭제
                </el-button>
              </div>
              <div style="padding-top: 5px">
                <el-button type="success" size="small" @click="modifyPop(element)">
                  <el-icon><EditPen /></el-icon>수정
                </el-button>
              </div>
            </div>
          </div>
        </template>
      </draggable>
    </el-scrollbar>
    <ModifyContentDialog
      :visible="modifyDialogVisible"
      :category="props.category"
      :type="modifyType"
      :selectItem="selectItem"
      :sortSn="dataList.length"
      @close-dialog="closeDialog"
    />

    <ModifyContentDetailDialog
      :visible="modifyDetailDialogVisible"
      :category="props.category"
      :type="modifyType"
      :selectItem="selectItem"
      :sortSn="dataList.length"
      @close-dialog="closeDetailDialog"
    />
  </div>
  <CustomLoading v-if="loading" />
</template>

<script setup lang="ts">
  import { onActivated, onMounted, ref, toRef, watch } from 'vue'
  import type { Ref } from 'vue'
  import { InsideCollapse } from '@/components/common/collapse'
  import Content from '@/components/common/Content.vue'
  import draggable from 'vuedraggable'
  import { planContentLinkSelect, planContentLinkAddArea } from '@/api/app/planContentLink'
  import { planContentList, planContentDelete } from '@/api/app/planContent'
  import PlanContent from '@/api/app/planContent/model'
  import { cloneDeep } from 'lodash-es'
  import ModifyContentDialog from './ModifyContentDialog.vue'
  import ModifyContentDetailDialog from './ModifyContentDetailDialog.vue'
  import { API_INFO_CIAMS } from '@/config/config'
  import commonUtil from '@/utils/commonUtil'
  import CustomLoading from '@/components/CustomLoading.vue'

  const props = withDefaults(
    defineProps<{
      category: string
    }>(),
    {
      category: 'INFRA',
    },
  )
  const modifyType: Ref<'ADD' | 'MOD'> = ref('ADD') //'ADD', 'MOD'
  const modifyDialogVisible = ref(false)
  const modifyDetailDialogVisible = ref(false)
  const prefixPath = API_INFO_CIAMS.PREFIX + '/api/v1/file/down/'

  const rules = {
    title: [{ required: true, message: '제목을 입력하세요', trigger: 'blur' }],
  }
  const dataList = ref([] as PlanContent.Search.Row[])
  const selectItem = ref({} as PlanContent.Search.Row)
  const loading = ref(false)

  function addPop(type: 'BASIC' | 'DETAIL') {
    if ('BASIC' == type) {
      modifyDialogVisible.value = true
    } else {
      modifyDetailDialogVisible.value = true
    }
    modifyType.value = 'ADD'
  }

  function modifyPop(item) {
    if (item.detailList.length > 0) {
      modifyDetailDialogVisible.value = true
    } else {
      modifyDialogVisible.value = true
    }
    selectItem.value = cloneDeep(item)
    modifyType.value = 'MOD'
  }

  function delContent(item: PlanContent.PlanContentModel) {
    commonUtil.confirm('삭제하시겠습니까?', '삭제').then(() => {
      if (item.planContentId) {
        planContentLinkSelect({ planContentId: item.planContentId }).then((res) => {
          if (res.data.length > 0) {
            commonUtil.errorMessage(`이미 추가된 컨턴츠 구역이 존재 합니다. 확인 후 삭제하십시오.`)
          } else {
            planContentDelete('planContent', item.planContentId)
              .then(() => {
                commonUtil.successMessage(`삭제되었습니다.`)
                getList()
              })
              .catch((err) => {
                console.log(err)
                commonUtil.errorMessage('오류가 발생했습니다.')
              })
          }
        })
      }
    })
  }

  function delAllContent(item: PlanContent.PlanContentModel) {
    commonUtil
      .confirm('삭제하시겠습니까?<br>(이미 추가된 구역별 컨텐츠도 삭제됩니다 )', '삭제', true)
      .then(() => {
        if (item.planContentId) {
          planContentDelete('all', item.planContentId)
            .then(() => {
              commonUtil.successMessage('삭제되었습니다')
              getList()
            })
            .catch((err) => {
              console.log(err)
              commonUtil.errorMessage('오류가 발생했습니다.')
            })
        }
      })
  }

  function getList() {
    planContentList({
      category: props.category,
    }).then((res) => {
      dataList.value = res.data
      console.log(dataList.value)
    })
  }

  function closeDialog(status: boolean) {
    if (status) {
      getList()
    }
    modifyDialogVisible.value = false
  }
  function closeDetailDialog(status: boolean) {
    if (status) {
      getList()
    }
    modifyDetailDialogVisible.value = false
  }

  function addAllContent(item: PlanContent.PlanContentModel) {
    commonUtil
      .confirm('전체 구역에 추가 하시겠습니까?<br>(이미 추가된 구역은 제외됩니다. )', '추가', true)
      .then(() => {
        if (item.planContentId) {
          loading.value = true
          planContentLinkAddArea(item.planContentId)
            .then(() => {
              commonUtil.successMessage('추가되었습니다')
              getList()
            })
            .catch((err) => {
              console.log(err)
              commonUtil.errorMessage('오류가 발생했습니다.')
            })
            .finally(() => {
              loading.value = false
            })
        }
      })
  }

  onMounted(() => {
    getList()
  })

  watch(props, () => {
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
