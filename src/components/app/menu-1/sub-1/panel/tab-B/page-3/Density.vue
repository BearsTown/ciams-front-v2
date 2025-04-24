<template>
  <div class="detail">
    <div class="header-title">{{ title }}</div>

    <div class="top">
      <el-tabs tab-position="top" v-model="activeYear" @tab-change="tabChangeListener">
        <el-tab-pane v-for="year in years" :label="`${year}년`" :name="year" :key="year"
          ><el-image
            :src="getImageUrl(year)"
            fit="scale-down"
            :preview-src-list="[getImageUrl(year)]"
            :preview-teleported="true"
            :zoom-rate="1.2"
        /></el-tab-pane>
      </el-tabs>
    </div>

    <el-divider border-style="dashed" style="margin: 10px 0" />

    <div class="bottom customScroll">
      <div class="text-wrap">
        <template v-for="(note, idx) in notes" :key="note">
          - {{ note }}
          <br v-if="idx < notes.length - 1" />
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, onActivated, onBeforeMount, onMounted, ref } from 'vue'

  import { useGlobalStore } from '@/stores/app'
  import { useMenu1Sub2store } from '@/stores/app/menu-1/sub-2'

  import { useCmmConfigStore } from '@/stores/config/cmmConfig'
  import { useMenu1_2_3Store } from '@/stores/app/menu-1/sub-2/tab-c'
  import { getDensityInfos } from '@/api/app/menu-1/sub-1/tab-b/page-3'
  import { API_INFO_CIAMS } from '@/config/config'
  import { Density } from '@/api/app/menu-1/sub-1/tab-b/model'

  const globalStore = useGlobalStore()
  const cmmConfigStore = useCmmConfigStore()
  const menu1sub2store = useMenu1Sub2store()
  const menu1_2_3Store = useMenu1_2_3Store()

  const state = menu1_2_3Store.state

  const props = withDefaults(
    defineProps<{
      title: string
      type: 'ALL' | 'TYPE1'
    }>(),
    {
      title: '',
    },
  )

  const activeYear = ref()
  const infos = ref<Density[]>([])
  // const years = ref([])
  const years = computed(() => infos?.value.map((info) => info.year))
  const notes = ref<string[]>([])
  const yearImage = computed(() => {
    return infos?.value.reduce((acc, info) => {
      acc[info.year] = info.image
      return acc
    }, {})
  })

  const prefixPath = `${API_INFO_CIAMS.PREFIX}/api/v1/file/image/`
  const getImageUrl = (year: string): string => {
    const imageId = yearImage.value[year]
    return imageId ? `${prefixPath}${imageId}` : ''
  }

  function tabChangeListener() {}

  onMounted(async () => {
    // const rawData = await test_getMenu1_1_3Data(props.type)

    const { data: rawData } = await getDensityInfos(props.type)

    infos.value = rawData.infos

    notes.value = rawData.notes
    activeYear.value = years.value[years.value.length - 1]

    // tabChangeListener(activeYear.value)
  })

  onBeforeMount(() => {})

  onActivated(() => {})
</script>

<style scoped lang="scss">
  :deep(.el-tabs__header) {
    margin-bottom: 5px;
  }

  .header-title {
    text-align: center;
    margin: 8px 0;
    color: #212121;
    font-size: 15px;
    font-weight: 700;
    letter-spacing: -0.02em;
  }

  .detail {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: #fff;
    border-radius: 8px;

    .top {
      flex: 1;
      //flex: 0 1 auto;
    }

    .bottom {
      height: 200px;
    }
  }

  .customScroll {
    height: max-content;
    overflow-y: auto;
  }
  .text-wrap {
    color: #616161;
    font-size: 15px;
    font-weight: 400;
    line-height: 1.5;
  }
</style>
