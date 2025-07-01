<template>
  <div v-if="props.list.length > 0" class="card-list">
    <div
      class="card"
      v-for="card in props.list"
      :key="card.archiveId"
      :title="card.title"
      @click="clickCard(card)"
    >
      <div class="img-wrap">
        <img
          style="object-fit: contain"
          :src="prefixPath + card.imgFileId"
          @error="replaceByDefault"
        />
      </div>
      <div class="card-title">{{ card.title }}</div>
      <div class="card-bottom">
        <div class="row">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M7.52118 2.529C6.41553 2.529 5.51923 3.4253 5.51923 4.53094C5.51923 5.63659 6.41553 6.53289 7.52118 6.53289C8.62682 6.53289 9.52312 5.63659 9.52312 4.53094C9.52312 3.4253 8.62682 2.529 7.52118 2.529ZM4.66992 4.53094C4.66992 2.95624 5.94647 1.67969 7.52118 1.67969C9.09588 1.67969 10.3724 2.95624 10.3724 4.53094C10.3724 6.10565 9.09588 7.3822 7.52118 7.3822C5.94647 7.3822 4.66992 6.10565 4.66992 4.53094Z"
              fill="#757575"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M3.16615 10.1277C4.04787 9.18564 5.48185 8.47656 7.68229 8.47656C9.88273 8.47656 11.3167 9.18564 12.1984 10.1277C13.069 11.0578 13.3646 12.1766 13.3646 12.9456C13.3646 13.1801 13.1745 13.3702 12.9399 13.3702H2.42466C2.19012 13.3702 2 13.1801 2 12.9456C2 12.1766 2.29554 11.0578 3.16615 10.1277ZM2.88542 12.5209H12.4792C12.3908 11.9758 12.1294 11.2968 11.5784 10.708C10.8828 9.9649 9.68796 9.32587 7.68229 9.32587C5.67662 9.32587 4.48179 9.9649 3.78622 10.708C3.23514 11.2968 2.97379 11.9758 2.88542 12.5209Z"
              fill="#757575"
            />
          </svg>
          <span class="text">{{ card.regUser || '-' }}</span>
        </div>
        <div class="row">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
          >
            <circle cx="7.5" cy="7.5" r="5.5" stroke="#757575" />
            <path
              d="M7.50002 4.07031L7.5 8.35603H10.9286"
              stroke="#757575"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <span class="text">{{ card.regDate || '-' }}</span>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="no-data" style="height: 99px">데이터가 존재하지 않습니다.</div>
</template>

<script setup lang="ts">
  import { Archive } from '@/api/app/archive/model'

  import { API_INFO_CIAMS } from '@/config/config'

  const props = defineProps({
    list: Array,
  })
  const emits = defineEmits(['clickCard'])
  const prefixPath = API_INFO_CIAMS.PREFIX + '/api/v1/file/down/'

  function clickCard(card: Archive.ArchiveData) {
    emits('clickCard', card)
  }

  function replaceByDefault(e) {
    // e.target.src = '/assets/image/no-image.png'
    if (!e.target.dataset.errorHandled) {
      e.target.dataset.errorHandled = 'true'
      e.target.src = '/assets/image/no-image.png'
    }
  }
</script>

<style scoped lang="scss">
  #reference .card .card-title {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .card-list {
    .card {
      &:hover {
        cursor: pointer;
        transition: box-shadow 0.2s;
        box-shadow: var(--el-box-shadow);
      }
    }
  }
</style>
