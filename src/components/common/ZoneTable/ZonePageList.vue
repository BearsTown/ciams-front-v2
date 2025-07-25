<template>
  <ul class="result-list customScroll">
    <template v-if="Object.keys(areaListItems).length">
      <li
        v-for="(item, index) in areaListItems"
        :key="index"
        @click="selectAreaItem(item)"
        @re-click="selectAreaItem(item)"
        :class="{ active: item.zoneNo === selected?.zoneNo }"
      >
        <div class="address-title" style="display: flex; justify-content: space-between">
          <b>{{ item.zoneName }}</b>
          <ZoneItemTag :tag-category="getTag(item)" />
        </div>
        <div class="address-text">면적 : {{ zoneArea(item.zoneArea) }}</div>
        <div class="address-text">용도지역 : {{ item.useDist }}</div>
        <div class="address-text">사업체수 : {{ item.baseCsC }}개</div>
      </li>
    </template>
    <Empty v-else />
  </ul>
</template>

<script setup lang="ts">
  import { computed, ref, toRefs, watch } from 'vue'

  import { TagCategory } from '@/types/common'
  import { CiamsZoneDTO } from '@/api/app/zone/model'
  import CommonUtil from '@/utils/commonUtil'
  import ZoneItemTag from '@/components/common/ZoneTable/ZoneItemTag.vue'

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

  const selected = ref<CiamsZoneDTO.Search.Row>()
  const items = toRefs(props).areaListItems

  const zoneArea = computed(() => (area: number) => {
    return `${CommonUtil.comma(area.toFixed(0))}㎡`
  })

  function getTag(item: CiamsZoneDTO.Search.Row) {
    return props.category?.list?.find((tag) => tag.value === item[props.category?.name])
  }

  function selectAreaItem(item) {
    if (selected.value) {
      selected.value = undefined
    }

    selected.value = item

    emits('item-select', selected.value!)
  }

  const emits = defineEmits<{
    (e: 'item-select', type: CiamsZoneDTO.Search.Row): void
  }>()

  watch(
    () => items.value,
    () => {
      if (selected.value) {
        selected.value = undefined
      }
    },
  )
</script>

<style scoped lang="scss">
  .urbanInfo .result-list {
    padding: 6px;
  }
</style>
