<template>
  <div class="locationInfo active">
    <div class="locationInfo-top customCard">
      <span class="title">
        <svg
          width="17"
          height="22"
          viewBox="0 0 17 22"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g id="Group 15654">
            <g id="Group 286">
              <path
                id="Exclude"
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M8.5 1C12.9625 1 17 4.33789 17 9.50021C17 12.7966 14.3969 16.6736 9.20125 21.1414C8.7975 21.4834 8.19187 21.4834 7.78812 21.1414C2.60312 16.6736 0 12.7966 0 9.50021C0 4.33789 4.0375 1 8.5 1ZM8.49944 13.2351C10.6119 13.2351 12.3244 11.5643 12.3244 9.50328C12.3244 7.44227 10.6119 5.77148 8.49944 5.77148C6.38695 5.77148 4.67444 7.44227 4.67444 9.50328C4.67444 11.5643 6.38695 13.2351 8.49944 13.2351Z"
                fill="#7AAAD1"
              />
            </g>
          </g>
        </svg>
        {{ searchAddress ? (searchAddress.address ? searchAddress.address.parcel : '') : '' }}
      </span>
      <div class="search-map-btn">
        <button v-if="naverUsed" type="button" class="btn-basic" @click="">네이버</button>
        <button type="button" class="btn-basic" @click="">이음지도</button>
      </div>
      <button type="button" class="btn-close" @click="close">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
        >
          <path
            d="M13.5 4.5L4.5 13.5M13.5 13.5L4.5 4.5"
            stroke="#212121"
            stroke-width="1.5"
            stroke-linecap="round"
          />
        </svg>
      </button>
    </div>
    <ul class="locationInfo-tab customTab">
      <li
        v-for="(item, index) in tabList.filter((a) => a.visible.value == true)"
        :key="index"
        @click.prevent="handleTabChange(item.key)"
        :class="{ active: tabCategory === item.key }"
        class="customTab-item"
      >
        {{ item.title }}
      </li>
    </ul>

    <div style="display: flex; flex-direction: column; height: 100%">
      <transition name="slide-fade" mode="out-in">
        <keep-alive>
          <component :is="tabComponent" ref="current" v-bind="{ mapType: props.mapType }" />
        </keep-alive>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia'
  import { computed, markRaw, onMounted, ref, shallowRef, watch } from 'vue'

  import Land from '@/components/common/locationInfo/land/Land.vue'
  import Topography from '@/components/common/locationInfo/land/kras/Topography.vue'
  import DetailsAside from '@/components/common/DetailsAside.vue'
  // import { useGmpssStore } from '@/stores/app'
  // import useKeyLayerStore from '@/stores/map/keyLayer'
  import { getConfig } from '@/api/app/config'
  import { useCmmConfigStore } from '@/stores/config/cmmConfig'
  import CommonUtil from '@/utils/commonUtil'
  import { MapType } from '@/enums/mapEnum'

  import { useMapStore } from '@/stores/map/map'
  import UitDrawInteraction from '@uitgis/ol-ugis-test/interaction/uitDraw'

  const props = withDefaults(
    defineProps<{
      mapType: MapType
    }>(),
    {},
  )

  const mapStore = useMapStore(props.mapType)
  const cmmConfigStore = useCmmConfigStore()
  const { searchAddress, searchAddressFeature } = storeToRefs(mapStore)

  const tab = ref()
  const current = ref()
  const tabComponent = ref()
  const detailsAsideRef = ref<typeof DetailsAside>()
  const tabCategory = ref<string>('')
  const dstplanInfo = ref({
    areaNum: '해당없음',
    areaType: '',
  })
  // const limitInfo = ref('해당없음')
  const limitInfo = ref([
    {
      text: '',
      feature: null,
    },
  ])
  const naverUsed = computed(() => false)

  const searchEitherMap = (type: 'naver' | 'eum', searchValue) => {
    switch (type) {
      case 'naver': {
        // window.open(
        //   (cmmConfig.state?.NAVER_SEARCH_URL?.confValue ?? 'https://map.naver.com/p/search/') +
        //     searchValue,
        // )
        break
      }
      case 'eum': {
        window.open('https://www.eum.go.kr/web/mp/mpMapDet.jsp?detType=luLand&pnu=' + searchValue)
      }
    }
  }

  const tabList = shallowRef([
    {
      key: 'KRAS',
      title: '토지정보',
      content: Land,
      visible: ref(true),
    },
    // {
    //   key: 'TOPOGRAPHY',
    //   title: '지형정보',
    //   content: Topography,
    //   visible: ref(false),
    // },
  ])

  function exclusionVisibleChange(data) {
    if (detailsAsideRef.value) detailsAsideRef.value.openCollapse(true)
  }

  function handleTabChange(key) {
    const find = tabList.value.find((item) => key === item.key)
    if (find) {
      tabCategory.value = find.key
      tabComponent.value = markRaw(find.content)
    }
  }

  async function loadConfig() {
    try {
      await cmmConfigStore.loadCmmConfig()
      const vworldKey = computed(() => cmmConfigStore.mapConfigState['NAVER_SEARCH_URL'].confValue)
      // vworldKey.value = cmmConfigStore.mapConfigState['VWORLD_KEY'].confValue
    } catch (err) {
      CommonUtil.errorMessage(err)
    }
  }

  // watch(searchAddressFeature, async () => {
  // if (currentType === 'analysis' && mapStore.getCurrentMapKey() === currentType) {
  //   await getWfsDstplan()
  //   await getWfsLimit()
  // }
  // })

  // let _watch
  // onActivated(() => {
  //   _watch = watch(searchAddressFeature, async () => {
  //     await getWfsDstplan()
  //     await getWfsLimit()
  //   })
  // })

  // onDeactivated(() => {
  //   if (_watch) {
  //     _watch()
  //   }
  // })

  // onMounted(() => {
  //   handleTabChange('KRAS')
  //   tab.value = 'KRAS'
  // })

  function close() {
    mapStore.locationInfoVisible = false
  }

  const visible = computed(() => mapStore.locationInfoVisible)

  watch(visible, () => {
    if (!visible.value) {
      const draw = mapStore.interactionManager?.getInteraction(
        'location-info',
      ) as UitDrawInteraction
      draw.clear()
    }
  })

  onMounted(async () => {
    await loadConfig()

    handleTabChange('KRAS')
    // tab.value = 'PLAN'

    const tabs = [
      // {
      //   key: 'INCENTIVE',
      //   code: 'INCENTIVE_INFO_USE',
      // },
      // {
      //   key: 'BUILD',
      //   code: 'KRAS_BUILD_USE',
      // },
      // {
      //   key: 'BDREG',
      //   code: 'BUILD_REG_USE',
      // },
      {
        key: 'TOPOGRAPHY',
        code: 'SYSTEM_TOPOGRAPHY',
      },
    ]

    for (let o of tabs) {
      const ft = tabList.value.find((tab) => tab.key === o.key)
      try {
        const config = await getConfig(o.code)
        ft!.visible.value = config.data.used
      } catch (e) {
        ft!.visible.value = false
      }
    }
  })

  defineExpose({
    exclusionVisibleChange,
  })
</script>

<style lang="scss">
  @import '@/assets/css/locationInfo.css';

  .locationInfo {
    top: 0;
    z-index: 10;
    position: absolute;
    background: #f4f4f4;
    font-family: 'Pretendard', sans-serif;

    .locationInfo-top {
      align-items: center;
      justify-content: space-between;
    }

    .locationInfo-content {
      .customCard {
        padding: 0;
      }

      .customTable.use-plan tr th {
        text-align: center;
      }
    }
    .search-map-btn {
      position: absolute;
      right: 40px;

      .btn-basic {
        height: 24px;
        padding: 0 7px;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 500;
        letter-spacing: -0.24px;
        background: #44619b;
        color: #fff;
        margin-right: 5px;
      }
    }
  }
</style>
