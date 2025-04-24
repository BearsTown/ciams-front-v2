<template>
  <div style="width: 100%">
    <div class="customCard-header" style="height: 30px">
      <div class="title">접근 권한 종류</div>
      <div class="btn-group">
        <!-- <button type="button" class="btn-green" @click="addRow">추가</button> -->
      </div>
    </div>
    <div style="font-size: 12px; margin-bottom: 10px; color: red">
      ※권한코드 및 메뉴코드는 공통코드관리에서 관리합니다.
    </div>
  </div>

  <table class="customTable">
    <colgroup>
      <col width="30%" />
      <col width="50%" />
    </colgroup>
    <thead>
      <tr>
        <th scope="col">코드명</th>
        <th scope="col">권한명</th>
      </tr>
    </thead>
  </table>
  <!-- 데이터 없을때 -->
  <div v-if="codeList && codeList.length == 0" class="no-data" style="height: 99px">
    데이터가 존재하지 않습니다.
  </div>

  <table class="customTable body">
    <colgroup>
      <col width="30%" />
      <col width="50%" />
    </colgroup>
    <tbody>
      <tr
        v-for="(element, index) in codeList"
        :key="index"
        style="cursor: pointer"
        @click="selectType(element)"
      >
        <td :class="selectObj?.code == element?.code ? 'seleted' : ''">{{ element.code }}</td>
        <td style="display: flex; justify-content: space-between">
          <div :class="selectObj?.code == element?.code ? 'seleted' : ''">
            {{ element.codeName }}
          </div>
          <!-- <div>
            <el-button link type="primary" size="small" @click.prevent="modifyRow(element)">
              <el-icon><Tools /></el-icon>
            </el-button>
          </div> -->
        </td>
      </tr>
    </tbody>
  </table>

  <!-- <ConfigTypeDialog
    :type="dialogType"
    :config="selectConfig"
    :visible="dialogVisible"
    @close-dialog="closeDialog"
  /> -->
</template>
<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useCodeStore } from '@/stores/admin/code'
  import commonUtil from '@/utils/commonUtil'
  // import ConfigTypeDialog from './ConfigTypeDialog.vue'

  const codeStore = useCodeStore()
  // const { codeList } = storeToRefs(configStore)
  const codeList = ref([])
  const selectObj = ref()

  const emits = defineEmits<{
    (e: 'selectType', obj?: {}): void
  }>()

  const dialogVisible = ref(false)
  const dialogType = ref('ADD')
  const selectConfig = ref()

  function selectType(obj) {
    if (obj) {
      selectObj.value = obj
      emits('selectType', obj)
    }
  }

  function addRow() {
    dialogType.value = 'ADD'
    selectConfig.value = {}
    dialogVisible.value = true
  }

  function modifyRow(row) {
    dialogType.value = 'MOD'
    selectConfig.value = row
    dialogVisible.value = true
  }

  // function closeDialog(status: boolean) {
  //   if (status) {
  //     codeStore.getCodeList('G0005')
  //   }
  //   dialogVisible.value = false
  // }

  onMounted(() => {
    codeStore.getCodeList('R0100').then((res) => {
      console.log(res)
      codeList.value = res
    })
  })
</script>
<style scoped>
  @import '@/assets/css/referencePage.css';

  .seleted {
    font-weight: bold;
    color: #7AAAD1;
  }
</style>
