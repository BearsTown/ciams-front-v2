<template>
  <div style="width: 100%">
    <div class="customCard-header">
      <div class="title">{{ empty(selectType) }}</div>
      <div class="btn-group">
        <button type="button" class="btn-green" @click="addRow">추가</button>
      </div>
    </div>
  </div>

  <table v-if="selectType.id != 'GOSI_CONFIG'" class="customTable">
    <colgroup>
      <col style="width: 20%" />
      <col style="width: 15%" />
      <col style="width: 20%" />
      <col style="width: 15%" />
      <col style="width: 14%" />
      <col style="width: 8%" />
      <col style="width: 8%" />
    </colgroup>
    <thead>
      <tr>
        <th scope="col">설정키</th>
        <th scope="col">설정명</th>
        <th scope="col">설정내용</th>
        <th scope="col">설정값</th>
        <th scope="col">설정구분</th>
        <th scope="col">데이터타입</th>
        <th scope="col">사용여부</th>
      </tr>
    </thead>
  </table>

  <!--고시-->
  <table v-else class="customTable">
    <colgroup>
      <col width="7%" />
      <col width="15%" />
      <col width="33%" />
      <col width="15%" />
      <col width="14%" />
      <col width="8%" />
      <col width="8%" />
    </colgroup>
    <thead>
      <tr>
        <th scope="col">설정키</th>
        <th scope="col">고시명</th>
        <th scope="col">URL링크</th>
        <th scope="col">수립대상지코드</th>
        <th scope="col">설정구분</th>
        <th scope="col">사용여부</th>
        <th scope="col">서비스정보</th>
      </tr>
    </thead>
  </table>

  <!-- 데이터 없을때 -->
  <div v-if="selectConfigList && selectConfigList.length == 0" class="no-data" style="height: 99px">
    데이터가 존재하지 않습니다.
  </div>

  <table v-if="selectType.id != 'GOSI_CONFIG'" class="customTable body">
    <colgroup>
      <col style="width: 20%" />
      <col style="width: 15%" />
      <col style="width: 20%" />
      <col style="width: 15%" />
      <col style="width: 14%" />
      <col style="width: 8%" />
      <col style="width: 8%" />
    </colgroup>
    <tbody>
      <tr
        v-for="(element, index) in selectConfigList"
        :key="index"
        style="cursor: pointer"
        @click="modifyRow(element)"
      >
        <td>
          {{ element.id }}
        </td>
        <td>
          {{ element.confName }}
        </td>
        <td>
          {{ element.confDesc }}
        </td>
        <td>
          {{ element.confValue }}
        </td>
        <td>
          {{ element.confType }}
        </td>
        <td>
          {{ element.confValueType }}
        </td>
        <td style="margin: 0; padding: 0; text-align: center">
          <el-tag class="ml-2" v-if="!element.used" size="small" type="danger"> 미사용 </el-tag>
          <el-tag class="ml-2" v-else-if="element.used" size="small"> 사용 </el-tag>
        </td>
      </tr>
    </tbody>
  </table>

  <!--고시-->
  <table v-else class="customTable body">
    <colgroup>
      <col width="7%" />
      <col width="15%" />
      <col width="33%" />
      <col width="15%" />
      <col width="14%" />
      <col width="8%" />
      <col width="8%" />
    </colgroup>
    <tbody>
      <tr v-for="(element, index) in selectConfigList" :key="index" style="cursor: pointer">
        <td @click="modifyRow(element)">
          {{ element.id }}
        </td>
        <td @click="modifyRow(element)">
          {{ element.confName }}
        </td>
        <td @click="modifyRow(element)">
          {{ element.confValue }}
        </td>
        <td @click="modifyRow(element)">
          {{ element.confDesc }}
        </td>
        <td @click="modifyRow(element)">
          {{ element.confType }}
        </td>
        <td @click="modifyRow(element)" style="margin: 0; padding: 0; text-align: center">
          <el-tag class="ml-2" v-if="!element.used" size="small" type="danger"> 미사용 </el-tag>
          <el-tag class="ml-2" v-else-if="element.used" size="small"> 사용 </el-tag>
        </td>
        <td style="margin: 0; padding: 0; text-align: center">
          <el-button link type="primary" size="small" @click.prevent="linkCheck(element)">
            <el-icon size="25"><Link /></el-icon>
          </el-button>
        </td>
      </tr>
    </tbody>
  </table>

  <ConfigDialog
    :type="dialogType"
    :config="selectConfig"
    :parent-type="selectType.id"
    :visible="dialogVisible"
    @close-dialog="closeDialog"
  />
  <ServiceCheckDialog
    :visible="serviceDialogVisible"
    @close-dialog="serviceDialogVisible = false"
    :data="serviceCheckData"
    :keys="serviceCheckKeys"
    :map-data="mapLayersData"
    :map-keys="mapLayersDataKeys"
  />
</template>
<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useAdminConfigStore } from '@/stores/admin/config'
  import CommonUtil from '@/utils/commonUtil'
  import ConfigDialog from './ConfigDialog.vue'
  import ServiceCheckDialog from './ServiceCheckDialog.vue'
  const configStore = useAdminConfigStore()
  const { selectConfigList } = storeToRefs(configStore)
  const dialogType = ref('ADD')
  const selectConfig = ref()
  const dialogVisible = ref(false)

  const props = withDefaults(
    defineProps<{
      selectType: {}
    }>(),
    {},
  )

  const emits = defineEmits<{
    (e: 'selectConfig'): void
  }>()

  const serviceDialogVisible = ref(false)
  const serviceCheckData = ref()
  const serviceCheckKeys = ref()
  const mapLayersData = ref()
  const mapLayersDataKeys = ref()

  function empty(obj) {
    return obj.confName === null || obj.confName === undefined
      ? '-'
      : obj.confName + ' [ ' + obj.id + ' ] '
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

  function linkCheck(row) {
    configStore
      .checkGosiData(row.id)
      .then((res) => {
        if (res.length > 0) {
          serviceCheckData.value = res
          serviceCheckKeys.value = Object.keys(res[0])
        } else {
          serviceCheckData.value = []
          serviceCheckKeys.value = []
        }
        return configStore.getMapLayers(row.id)
      })
      .then((res) => {
        if (res.length > 0) {
          mapLayersData.value = res
          mapLayersData.value.forEach((a) => (a.planId = row.id))
          mapLayersDataKeys.value = Object.keys(res[0])
        } else {
          mapLayersData.value = []
          mapLayersDataKeys.value = []
        }
      })
      .catch((err) => {
        console.log(err)
        CommonUtil.errorMessage('오류가 발생했습니다.')
      })
      .finally(() => {
        serviceDialogVisible.value = true
      })
  }

  function closeDialog(status: boolean) {
    if (status) {
      emits('selectConfig')
    }
    dialogVisible.value = false
  }

  function tableRowClassName({ row, rowIndex }) {
    if (!row.used) {
      return 'table-row-opacity'
    }
    return ''
  }
</script>
<style scoped>
  @import '@/assets/css/referencePage.css';
</style>
<style scoped lang="scss">
  .main {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    // border-right: 1px solid rgb(224, 224, 224);
  }
  .sub-header {
    padding: 6px 15px;
    background-color: #eeeeee;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid rgb(224, 224, 224);
    border-right: 1px solid rgb(224, 224, 224);
  }
  :deep .table-row-opacity {
    opacity: 0.5;
    text-decoration: line-through;
  }
</style>
