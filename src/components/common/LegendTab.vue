<template>
  <div class="popup-header">
    <ul class="">
      <template v-for="(tab, idx) in legendTabs" :key="tab.id">
        <li
          @click="activeDetailTab(mapType, idx)"
          class="customTab-item"
          :class="{ active: tab.id === 'id-legend-tab-' + (detailTab + 1) }"
          v-if="tab.used"
        >
          {{ tab.title }}
        </li>
      </template>
    </ul>
    <button @click="activeTab" type="button" class="btn-close">
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M16.114 8.99884C16.114 9.41305 15.7782 9.74884 15.364 9.74884L2.63604 9.74884C2.22183 9.74884 1.88604 9.41305 1.88604 8.99884C1.88604 8.58463 2.22183 8.24884 2.63604 8.24884L15.364 8.24884C15.7782 8.24884 16.114 8.58463 16.114 8.99884Z"
          fill="#212121"
        />
      </svg>
    </button>
  </div>
  <div class="tree-wrap" style="height: auto">
    <template v-for="group in legendTabs[detailTab]?.children" :key="group">
      <div class="tree" v-if="group.used" :class="{ active: group.visible }">
        <div class="tree-header">
          <span class="tree-title">{{ group.title }}</span>
          <button type="button" class="btn-treeToggle" @click="group.visible = !group.visible">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              data-v-7c7b1d9a=""
            >
              <g id="chevron-down" data-v-7c7b1d9a="">
                <path
                  id="Vector"
                  d="M7 10L12.0008 14.58L17 10"
                  stroke="#424242"
                  stroke-width="1.2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  data-v-7c7b1d9a=""
                />
              </g>
            </svg>
          </button>
        </div>
        <!-- 격자분석 -->
        <template v-if="group.id === 'legend-group-004'">
          <div class="tree-list">
            <div class="grid-wrap">
              <template v-for="item in group.children" :key="item">
                <template v-if="item.visible">
                  <div class="grid-item" :style="{ 'border-bottom': item.css }">
                    <template v-for="_item in item.text" :key="_item[0]">
                      <span class="grud-num">
                        {{ _item }}
                        <!-- <img
                      :src="item.img"
                      style="margin-top: 2px; width: 20px; height: 20px; margin-right: 5px"
                      /> -->
                      </span>
                    </template>
                  </div>
                </template>
              </template>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="tree-list">
            <template v-for="item in group.children" :key="item">
              <template v-if="item.visible">
                <div class="tree-item">
                  <span class="box" style="background: none">
                    <img
                      v-if="item.img"
                      :src="item.img"
                      style="margin-top: 2px; width: 20px; height: 20px; margin-right: 5px"
                    />
                    <svg
                      v-else-if="item.color"
                      style="margin-top: 2px; width: 20px; height: 20px; margin-right: 5px"
                    >
                      <rect width="100%" height="100%" :fill="item.color" />
                    </svg>
                  </span>
                  <span class="text">{{ item.title }}</span>
                </div>
              </template>
            </template>
          </div>
        </template>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
  import { MapType } from '@/enums/mapEnum'
  import { LegendTab } from '@/hooks/useLegends'
  import { ref, watch } from 'vue'

  const props = withDefaults(
    defineProps<{
      legendTabs: LegendTab[]
      legendTreeActive: boolean
      activeTab: () => void
      mapType: MapType
      activeDetailTab: (...args: any) => void
      detailTab: number
    }>(),
    {
      legendTabs: () => [],
      legendTreeActive: false,
    },
  )
  const curIdx = ref(0)

  watch(
    () => props.legendTreeActive,
    (newVal) => {
      isOnHandle(newVal)
    },
  )

  function isOnHandle(isOn: boolean) {
    props.legendTabs.forEach((obj) => {
      const children = obj.children
      if (!!children && children.length > 0) {
        children.forEach((subObj) => {
          return (subObj.visible = isOn)
        })
      }
    })
  }
</script>

<style scoped lang="scss">
  :deep .el-tabs__content {
    padding: 5px;
  }
</style>
