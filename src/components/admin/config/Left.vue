<template>
  <div style="width: 100%">
    <div class="customCard-header">
      <div class="title">설정 구분</div>
      <div class="btn-group">
        <button type="button" class="btn-green" @click="addRow">추가</button>
      </div>
    </div>
  </div>

  <table class="customTable">
    <colgroup>
      <col width="17%" />
      <col width="83%" />
    </colgroup>
    <thead>
      <tr>
        <th scope="col">순서</th>
        <th scope="col">설정명</th>
      </tr>
    </thead>
  </table>
  <!-- 데이터 없을때 -->
  <div v-if="typeList && typeList.length == 0" class="no-data" style="height: 99px">
    데이터가 존재하지 않습니다.
  </div>

  <table class="customTable body">
    <colgroup>
      <col width="17%" />
      <col width="83%" />
    </colgroup>
    <tbody>
      <tr v-for="(element, index) in typeList" :key="index" style="cursor: pointer">
        <td>{{ index + 1 }}</td>
        <td style="display: flex; justify-content: space-between">
          <div @click="selectType(element)" :class="selectObj?.id == element?.id ? 'seleted' : ''">
            {{ element.confName }}
          </div>
          <div>
            <el-button link type="primary" size="small" @click.prevent="modifyRow(element)">
              <el-icon><Tools /></el-icon>
            </el-button>
          </div>
        </td>
      </tr>
    </tbody>
  </table>

  <ConfigTypeDialog
    :type="dialogType"
    :config="selectConfig"
    :visible="dialogVisible"
    @close-dialog="closeDialog"
  />
</template>
<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useAdminConfigStore } from '@/stores/admin/config'
  import ConfigTypeDialog from './ConfigTypeDialog.vue'

  const configStore = useAdminConfigStore()
  const { typeList } = storeToRefs(configStore)
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

  function closeDialog(status: boolean) {
    if (status) {
      configStore.getConfTypeList()
    }
    dialogVisible.value = false
  }

  onMounted(() => {
    configStore.getConfTypeList()
  })
</script>
<style scoped>
  @import '@/assets/css/referencePage.css';

  .seleted {
    font-weight: bold;
    color: #7aaad1;
  }
</style>
