<template>
  <div style="font-size: 14px; word-break: break-all">
    <div v-if="element.detailList.length > 0 && !element.isType">
      <div v-for="obj in element.detailList" :key="obj.planContentDetailId">
        <div class="text-wrap">{{ obj.contents }}</div>
        <div class="map-box" v-for="img in obj.fileList" :key="img.id">
          <el-image
            style="max-width: 100%"
            :src="prefixPath + img.id"
            :preview-src-list="[prefixPath + img.id]"
            :preview-teleported="true"
            :zoom-rate="1.2"
            :initial-index="4"
            fit="cover"
          >
            <template #error>
              <img src="/assets/image/no-image.png" title="이미지 없음" />
            </template>
          </el-image>
        </div>
      </div>
    </div>
    <table class="customTable" v-if="element.detailList.length > 0 && element.isType">
      <colgroup>
        <col width="14%" />
        <col width="86%" />
      </colgroup>
      <tbody>
        <tr v-for="obj in element.detailList" :key="obj.planContentDetailId">
          <th>{{ obj.typeName }}</th>
          <td colspan="3">
            {{ obj.contents }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script setup lang="ts">
  import PlanContent from '@/api/app/planContent/model'
  import { API_INFO_CIAMS } from '@/config/config'

  const props = withDefaults(
    defineProps<{
      element: PlanContent.Search.Row
    }>(),
    {},
  )

  const prefixPath = API_INFO_CIAMS.PREFIX + '/api/v1/file/down/'
</script>
<style scoped>
  .customTable th {
    padding: 6px 10px;
    /* text-align: left; */
    font-size: 14px;
    line-height: 1.4;
    text-align: center;
    vertical-align: middle;
  }
  .customTable td {
    min-width: 40px;
    padding: 8px 7px;
    text-align: left;
    scroll-snap-align: start;
    background-clip: padding-box;
    word-break: break-all;
    font-size: 14px;
    letter-spacing: -0.02em;
    line-height: 1.5;
  }
</style>
