<template>
  <li class="" :class="{ active: isActive }">
    <div class="address-title">
      <b>{{ zoneItem.zoneName }}</b>
    </div>
    <div class="address-text">면적 : {{ zoneArea }}</div>
    <div class="address-text">용도지역 : {{ zoneItem.useDist }}</div>
    <div class="address-text">사업체수 : {{ zoneItem.baseCsC }}개</div>
  </li>
</template>

<script setup lang="ts">
  import { computed, ref, toRefs } from 'vue'

  import commonUtil from '@/utils/commonUtil'

  import { GisCiamsZoneDTO } from '@/api/app/gis/zone/model'
  import { useBoolean } from '@/hooks/useBoolean'
  import { useAuthStore } from '@/stores/auth'
  import { useGlobalStore } from '@/stores/app'

  // import { usePlanAreaStore } from '@/stores/app/operation/planArea'
  // const planAreaStore = usePlanAreaStore()
  // const { modal } = storeToRefs(planAreaStore)

  const auth = useAuthStore()

  const globalStore = useGlobalStore()

  const props = withDefaults(
    defineProps<{
      isActive?: boolean
      zoneItem: GisCiamsZoneDTO.Search.Row
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

  const dialogVisible = ref(false)

  function setActive(active: boolean) {
    isActive.value = active
  }

  function cancel() {}

  const getSelectedData = computed(() => {
    return zoneItem.value
  })

  const zoneArea = computed(() => {
    return `${commonUtil.comma(zoneItem.value.zoneArea.toFixed(1))}㎡`
  })

  // watch(modal.value, () => {
  //   //계획지역 수정 후 액션
  //   if (modal.value.modifyAction && areaItem.value.rn == modal.value.selectItem.rn) {
  //     Object.assign(areaItem.value, modal.value.selectItem)
  //     emits('re-click')
  //   }
  // })

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
