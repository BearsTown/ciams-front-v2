<template>
  <el-dialog
    v-model="dialogVisible"
    @close="emits('close-dialog', false)"
    width="800"
    top="10vh"
    title="컨텐츠 추가"
  >
    <el-scrollbar style="height: 500px">
      <div style="display: flex; justify-content: center; align-items: center">
        <el-scrollbar style="padding: 5px">
          <div
            v-for="element in dataList"
            :key="element.planContentId"
            handle=".handle"
            item-key="planContentId"
            style="width: 100%"
          >
            <div
              style="
                display: flex;
                border: 1px dashed #c0ccda;
                padding: 5px;
                margin: 5px;
                border-radius: 6px;
                cursor: pointer;
              "
              :class="checked(element.planContentId)"
            >
              <div
                style="
                  display: flex;
                  justify-content: center;
                  flex-direction: column;
                  width: 100px;
                  text-align: center;
                "
              >
                <div style="height: 100%">
                  <label
                    class="customCheckbox"
                    style="display: flex; justify-content: center; cursor: pointer; height: 100%"
                    :class="{ active: '' }"
                    :for="element.planContentId"
                  >
                    <input
                      type="checkbox"
                      v-model="selectContentIds"
                      :value="element.planContentId"
                      :id="element.planContentId"
                    />
                    <span class="customCheckbox-text"></span>
                  </label>
                  <!-- <label
                    :for="element.planContentId"
                    style="display: flex; justify-content: center; cursor: pointer; height: 100%"
                    class="el-checkbox__inner"
                  >
                    <input
                      type="checkbox"
                      v-model="selectContentIds"
                      :value="element.planContentId"
                      :id="element.planContentId"
                    />
                  </label> -->
                  <!-- <el-button type="danger" size="small" @click="selectItem(element)">
                    선택
                  </el-button> -->
                </div>
              </div>
              <div class="planningDetail-content customCard">
                <div v-if="element.isRoadPlan" style="padding-bottom: 10px">
                  <el-tag type="warning">도로계획</el-tag>
                </div>
                <InsideCollapse :title="element.title" :is-open="false" style="width: 556px">
                  <template #content>
                    <Content :element="element" />
                  </template>
                </InsideCollapse>
              </div>
            </div>
          </div>
        </el-scrollbar>
        <div v-if="dataList.length == 0" style="text-align: center; font-size: 10pt">
          <Empty />
        </div>
      </div>
    </el-scrollbar>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="emits('close-dialog', false)">취소</el-button>
        <el-button type="primary" @click="modify(modifyRef)">추가</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
  import { Ref, computed, ref, toRefs, watch } from 'vue'
  import { InsideCollapse } from '@/components/common/collapse'
  import { planContentList } from '@/api/app/planContent'
  import { planContentLinkAdd } from '@/api/app/planContentLink'
  import PlanContent from '@/api/app/planContent/model'
  import { API_INFO_CIAMS } from '@/config/config'
  import commonUtil from '@/utils/commonUtil'
  import Content from '@/components/common/Content.vue'

  const props = withDefaults(
    defineProps<{
      visible: boolean
      category: string
      planAreaId: string
      planId: string
      list?: PlanContent.Search.Row[]
    }>(),
    {
      visible: false,
      planAreaId: '',
      planId: '',
      category: 'INFRA',
      sortSn: 0,
    },
  )

  const dialogVisible = computed({
    get() {
      return props.visible
    },
    set(visible) {
      return visible
    },
  })

  const emits = defineEmits<{
    (e: 'close-dialog', status: boolean): void
  }>()

  const { visible, planAreaId, planId } = toRefs(props)
  // const planAreaId = toRefs(props).planAreaId
  // const planId = toRefs(props).planId

  const prefixPath = API_INFO_CIAMS.PREFIX + '/api/v1/file/down/'
  const dataList = ref([] as PlanContent.Search.Row[])
  const selectContentIds = ref([]) as Ref<any[]>

  const modifyRef = ref()
  const addForm = ref({
    ver: '',
    planAreaId: '',
    planId: '',
    sortSn: 0,
    planContentIds: [] as any,
    category: '',
  })

  function modify(formName) {
    if (selectContentIds.value.length == 0) {
      commonUtil.errorMessage('선택된 컨텐츠가 없습니다.')
      return
    }

    Object.assign(addForm.value, {
      planAreaId: planAreaId.value,
      planId: planId.value,
      planContentIds: selectContentIds.value,
      category: props.category,
    })

    commonUtil.confirm('추가 하시겠습니까?', '컨텐츠 추가').then(() => {
      planContentLinkAdd(addForm.value)
        .then(() => {
          commonUtil.successMessage('추가했습니다.')
          emits('close-dialog', true)
        })
        .catch((err) => {
          commonUtil.errorMessage('오류가 발생했습니다.')
          console.log(err)
        })
    })
  }

  function getList() {
    planContentList({
      category: props.category,
    }).then((res) => {
      dataList.value = res.data

      if (props.list) {
        let checkPlanContentId = props.list.map((a) => {
          return a.planContentId
        })

        dataList.value = dataList.value.filter((a) => !checkPlanContentId.includes(a.planContentId))
      }
    })
  }

  function checked(target) {
    // prodArr에 해당 값이 포함되어있는지 확인하여 checked라는 클래스를 동적으로 부여한다.
    const index = selectContentIds.value.indexOf(target)
    return index >= 0 ? { checked: true } : { checked: false }
  }

  watch(visible, () => {
    selectContentIds.value = []
    getList()
  })
</script>
<style scoped>
  @import '@/assets/css/planningDetail.css';
</style>
<style scoped>
  .attachFile {
    border: 1px solid #c0ccda;
    padding: 8px 15px;
    margin-right: 10px;
    border-radius: 6px;
    line-height: 30px;
    font-weight: bold;
  }
  .upload-form {
    cursor: pointer;
    border: 1px dashed #c0ccda;
    padding: 8px 10px;
    border-radius: 6px;
  }

  .upload-form:hover {
    border: 1px dashed #409eff;
  }

  .el-icon-close {
    color: #909399;
  }
  .el-icon-close:hover {
    color: #409eff;
  }

  .file-preview-wrapper {
    padding: 10px;
    position: relative;
  }

  .file-preview-wrapper > img {
    position: relative;
    width: 100px;
    height: 100px;
    z-index: 10;
  }
  .file-img-box {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width: 100px;
    height: 100px;
  }
  .file-close-button {
    position: absolute;
    /* align-items: center; */
    line-height: 18px;
    z-index: 99;
    font-size: 18px;
    right: 5px;
    top: 10px;
    color: #fff;
    font-weight: bold;
    background-color: #666666;
    width: 20px;
    height: 20px;
    text-align: center;
    cursor: pointer;
  }

  .checked {
    border: 2px solid #7AAAD1 !important;
  }
</style>
