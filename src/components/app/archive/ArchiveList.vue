<template>
  <div class="customCard">
    <table class="customTable">
      <colgroup>
        <col width="11%" />
        <col width="55%" />
        <col width="10%" />
        <col width="17%" />
        <col width="7%" />
      </colgroup>
      <thead>
        <tr>
          <th scope="col">번호</th>
          <th scope="col">제목</th>
          <th scope="col">작성자</th>
          <th scope="col">작성일자</th>
          <th scope="col">조회수</th>
        </tr>
      </thead>
    </table>

    <table v-if="props.list.length > 0" class="customTable body">
      <colgroup>
        <col width="11%" />
        <col width="55%" />
        <col width="10%" />
        <col width="17%" />
        <col width="7%" />
      </colgroup>
      <tbody>
        <tr
          v-for="(item, index) in props.list"
          :key="item.archiveId"
          @click="clickRow(item)"
          :style="{ cursor: 'pointer' }"
        >
          <td>{{ calculateIndex(index) }}</td>
          <td>{{ item.title }}</td>
          <td>{{ item.regUser || '-' }}</td>
          <td>{{ item.regDate }}</td>
          <td>{{ item.numOfRead }}</td>
        </tr>
      </tbody>
    </table>
    <div v-else class="no-data" style="height: 99px">데이터가 존재하지 않습니다.</div>
  </div>
</template>

<script setup lang="ts">
  import { Archive } from '@/api/app/archive/model'

  const props = defineProps({
    list: Array,
    page: Number,
  })
  const emits = defineEmits(['clickRow'])

  function clickRow(row: Archive.ArchiveData) {
    emits('clickRow', row)
  }

  function calculateIndex(index: number) {
    return (props.page - 1) * 10 + index + 1
  }
</script>

<style scoped></style>
