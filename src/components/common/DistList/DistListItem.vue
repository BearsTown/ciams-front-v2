<template>
  <li class="" :class="{ active: isActive }">
    <div class="address-title">
      <b>{{ distItem.distName }}</b>
    </div>
    <div class="address-text">면적 : {{ distArea }}</div>
  </li>
</template>

<script setup lang="ts">
  import { computed, ref, toRefs } from 'vue'

  import CommonUtil from '@/utils/commonUtil'
  import { useBoolean } from '@/hooks/useBoolean'

  import { GisCiamsDistDTO } from '@/api/app/gis/dist/model'

  import { useAuthStore } from '@/stores/auth'

  const auth = useAuthStore()

  const props = withDefaults(
    defineProps<{
      isActive?: boolean
      distItem: GisCiamsDistDTO.Search.Row
    }>(),
    {
      isActive: false,
    },
  )

  const emits = defineEmits<{
    (e: 're-click'): void
  }>()

  const { distItem } = toRefs(props)
  const { status: isActive } = useBoolean(props.isActive)

  const distArea = computed(() => {
    return `${CommonUtil.comma(distItem.value.distArea.toFixed(0))}㎡`
  })

  const dialogVisible = ref(false)

  function setActive(active: boolean) {
    isActive.value = active
  }

  const getSelectedData = computed(() => {
    return distItem.value
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
</style>
