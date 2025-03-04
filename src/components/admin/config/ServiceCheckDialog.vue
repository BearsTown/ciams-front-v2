<template>
  <el-dialog
    v-model="dialogVisible"
    @close="emits('close-dialog', false)"
    width="50%"
    top="10vh"
    title="서비스 정보"
  >
    <el-scrollbar style="height: 500px">
      <!-- <el-table
      :data="data"
      table-layout="auto"
      style="width: 100%"
      max-height="300"
      :header-row-style="{ cursor: 'pointer', height: '20px', fontSize: '15px' }"
      :row-style="{ cursor: 'pointer', height: '20px', fontSize: '13px' }"
      empty-text="조회된 데이터가 없습니다"
      scrollbar-always-on
    >
      <el-table-column v-for="item in keys" :key="item" :prop="item" align="center" :label="item" />
    </el-table> -->

      <table class="customTable">
        <colgroup>
          <col width="45%" />
          <col width="10%" />
          <col width="25%" />
          <col width="10%" />
          <col width="10%" />
        </colgroup>
        <thead>
          <tr>
            <th scope="col" v-for="item in keys" :key="item" :prop="item">{{ item }}</th>
          </tr>
        </thead>
      </table>

      <table class="customTable body">
        <colgroup>
          <col width="45%" />
          <col width="10%" />
          <col width="25%" />
          <col width="10%" />
          <col width="10%" />
        </colgroup>
        <tbody>
          <tr v-for="item in data" :key="item" :prop="item">
            <td v-for="_item in keys" :key="_item" :prop="_item">
              {{ item[_item] }}
            </td>
          </tr>
        </tbody>
      </table>

      <table class="customTable" style="margin-top: 10px">
        <colgroup>
          <col width="30%" />
          <col width="30%" />
          <col width="20%" />
          <col width="10%" />
          <col width="10%" />
        </colgroup>
        <thead>
          <tr>
            <th scope="col" v-for="item in mapKeys" :key="item" :prop="item">{{ item }}</th>
          </tr>
        </thead>
      </table>

      <table class="customTable body">
        <colgroup>
          <col width="30%" />
          <col width="30%" />
          <col width="20%" />
          <col width="10%" />
          <col width="10%" />
        </colgroup>
        <tbody>
          <tr v-for="item in mapData" :key="item" :prop="item">
            <td v-for="_item in mapKeys" :key="_item" :prop="_item">
              {{ item[_item] }}
            </td>
          </tr>
        </tbody>
      </table>
    </el-scrollbar>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="emits('close-dialog')">닫기</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
  import { computed, ref, toRefs, watch } from 'vue'
  import commonUtil from '@/utils/commonUtil'
  import Config from '@/api/admin/config/model'

  const props = withDefaults(
    defineProps<{
      visible: boolean
      data: {}
      keys: {}
      mapData: {}
      mapKeys: {}
    }>(),
    {
      visible: false,
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
    (e: 'close-dialog'): void
  }>()
</script>

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
</style>
