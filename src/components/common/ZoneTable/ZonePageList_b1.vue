<template>
  <ul class="result-list customScroll">
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
  import { onMounted, ref, toRefs, watch } from 'vue'

  import ZoneListItem from '@/components/common/ZoneTable/ZoneListItem.vue'

  import { TagCategory } from '@/types/common'
  import { CiamsZoneDTO } from '@/api/app/zone/model'

  type CompAreaListItem = InstanceType<typeof ZoneListItem> | null

  interface Category {
    name: string
    title: string
    list: TagCategory[]
  }

  const props = withDefaults(
    defineProps<{
      category: Category
      areaListItems?: CiamsZoneDTO.Search.Row[]
    }>(),
    {
      areaListItems: () => {
        return []
      },
    },
  )

  const emits = defineEmits<{
    (e: 'item-select', type: CiamsZoneDTO.Search.Row): void
  }>()

  const selected = ref<CompAreaListItem>()
  const itemRefs = ref<CompAreaListItem[]>([])
  const items = toRefs(props).areaListItems

  function selectAreaItem(idx) {
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
      if (selected.value) {
        selected.value.setActive(false)
        selected.value = null
      }
    },
  )

  onMounted(() => {
    console.log(props.category)
  })
</script>

<style scoped lang="scss">
  .urbanInfo .result-list {
    padding: 6px;
  }
</style>
