<template>
  <ul class="result-list customScroll" ref="scrollbarRef">
    <template v-if="Object.keys(planZoneListItems).length">
      <PlanZoneListItem
        v-for="(item, index) in planZoneListItems"
        :key="index"
        :planZone-item="item"
        ref="itemRefs"
        @click="selectPlanZoneItem(index)"
        @re-click="selectPlanZoneItem(index)"
      />
    </template>
    <Empty v-else />
  </ul>
</template>

<script setup lang="ts">
  import { ref, toRefs, watch } from 'vue'

  import PlanZoneListItem from '@/components/app/menu-3/PlanZoneTable/PlanZoneListItem.vue'

  import { PlanZone } from '@/api/app/planZone/model'

  type CompPlanZoneListItem = InstanceType<typeof PlanZoneListItem> | null

  const props = withDefaults(
    defineProps<{
      planZoneListItems?: PlanZone.Search.Row[]
    }>(),
    {
      planZoneListItems: () => {
        return []
      },
    },
  )

  const emits = defineEmits<{
    (e: 'item-select', type: PlanZone.Search.Row): void
  }>()

  const selected = ref<CompPlanZoneListItem>()
  const itemRefs = ref<CompPlanZoneListItem[]>([])
  const items = toRefs(props).planZoneListItems

  const scrollbarRef = ref()

  // const scrollbarRef = ref<InstanceType<typeof ElScrollbar>>()

  function selectPlanZoneItem(idx) {
    // 한번더 클릭시 액션 발생하도록
    // if (selected.value === itemRefs.value[idx]) {
    //   return
    // }

    if (selected.value) {
      selected.value.setActive(false)
    }

    selected.value = itemRefs.value[idx]
    selected.value!.setActive(true)

    emits('item-select', selected.value!.getSelectedData)
  }

  watch(
    () => items.value,
    () => {
      // scrollbarRef.value!.setScrollTop(0)

      if (selected.value) {
        selected.value.setActive(false)
        selected.value = null
      }
    },
  )
</script>

<style scoped lang="scss">
  .urbanInfo .result-list {
    padding: 6px;
  }
</style>
