<template>
  <ul class="result-list customScroll" ref="scrollbarRef">
    <template v-if="Object.keys(areaListItems).length">
      <ZoneListItem
        v-for="(item, index) in areaListItems"
        :key="index"
        :zone-item="item"
        ref="itemRefs"
        @click="selectAreaItem(index)"
        @re-click="selectAreaItem(index)"
      />
    </template>
    <Empty v-else />
  </ul>
</template>

<script setup lang="ts">
  import { ref, toRefs, watch } from 'vue'

  import ZoneListItem from '@/components/common/ZoneTable/ZoneListItem.vue'

  import { GisCiamsZoneDTO } from '@/api/app/gis/zone/model'

  type CompAreaListItem = InstanceType<typeof ZoneListItem> | null

  const props = withDefaults(
    defineProps<{
      areaListItems?: GisCiamsZoneDTO.Search.Row[]
    }>(),
    {
      areaListItems: () => {
        return []
      },
    },
  )

  const emits = defineEmits<{
    (e: 'item-select', type: GisCiamsZoneDTO.Search.Row): void
  }>()

  const selected = ref<CompAreaListItem>()
  const itemRefs = ref<CompAreaListItem[]>([])
  const items = toRefs(props).areaListItems

  const scrollbarRef = ref()

  // const scrollbarRef = ref<InstanceType<typeof ElScrollbar>>()

  function selectAreaItem(idx) {
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
