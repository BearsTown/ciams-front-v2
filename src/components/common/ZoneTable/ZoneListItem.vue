<template>
  <li class="" :class="{ active: isActive }">
    <div class="address-title" style="display: flex; justify-content: space-between">
      <b>{{ zoneItem.zoneName }}</b>
      <div class="list-item-tag" style="background-color: rgb(144, 205, 42)">산업혁신·정비형</div>
    </div>
    <div class="address-text">면적 : {{ zoneArea }}</div>
    <div class="address-text">용도지역 : {{ zoneItem.useDist }}</div>
    <div class="address-text">사업체수 : {{ zoneItem.baseCsC }}개</div>
  </li>
</template>

<script setup lang="ts">
  import { computed, toRefs } from 'vue'

  import CommonUtil from '@/utils/commonUtil'
  import { useBoolean } from '@/hooks/useBoolean'

  import { CiamsZoneDTO } from '@/api/app/zone/model'

  import { useGlobalStore } from '@/stores/app'

  const globalStore = useGlobalStore()

  const props = withDefaults(
    defineProps<{
      isActive?: boolean
      zoneItem: CiamsZoneDTO.Search.Row
    }>(),
    {
      isActive: false,
    },
  )

  const emits = defineEmits<{
    (e: 're-click'): void
  }>()

  const { zoneItem } = toRefs(props)
  const { status: isActive } = useBoolean(props.isActive)

  function setActive(active: boolean) {
    isActive.value = active
  }

  const getSelectedData = computed(() => {
    return zoneItem.value
  })

  const zoneArea = computed(() => {
    return `${CommonUtil.comma(zoneItem.value.zoneArea.toFixed(0))}㎡`
  })

  defineExpose({
    setActive,
    getSelectedData,
  })
</script>

<style scoped lang="scss">
  .item {
    width: 100%;
    height: 70px;
    transition: 0.3s;
    cursor: pointer;

    &:hover {
      opacity: 0.95;
      background-color: var(--ugis-color-temp-2);
    }

    .num {
      width: 25px;
      height: 25px;
      font-size: 11px;
      border-radius: 30px;
      align-items: center;
      display: inline-flex;
      justify-content: center;
      color: var(--el-color-white);
      background-color: var(--ugis-color-temp-2);
    }

    .content {
      .title {
        font-weight: bold;
      }

      :deep(.el-text) {
        font-size: 12px;
        color: var(--el-text-color-regular);
      }
    }

    .etc {
      height: 100%;
      display: flex;
      flex-direction: column;

      div:nth-child(1) {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: end;
      }

      div:nth-child(2) {
        flex: 1;
        font-size: 12px;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
    }
  }

  .is-active {
    color: var(--ugis-color-white);
    background-color: var(--ugis-color-temp-2);
    border-color: var(--el-color-primary-light-7);

    &:hover {
      background-color: var(--ugis-color-temp-2);
    }

    .num {
      color: var(--ugis-color-temp-2);
      background-color: var(--ugis-color-white);
    }

    .content {
      :deep(.el-text) {
        color: var(--ugis-color-white);
      }
    }
  }

  :deep .el-popper > .el-popover {
    min-width: 50px !important;
  }

  .list-item-tag {
    width: 90px;
    height: 20px;
    color: white;
    display: flex;
    font-size: 11px;
    border-radius: 4px;
    align-items: center;
    justify-content: center;
    box-shadow: 3px 3px 3px 0 rgba(0, 0, 0, 0.12);
  }
</style>
