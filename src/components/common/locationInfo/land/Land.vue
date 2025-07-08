<template>
  <div class="locationInfo-content land">
    <ul class="customTab top">
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

    <keep-alive>
      <component :is="tabComponent" ref="currentTab" v-bind="{ mapType: props.mapType }" />
    </keep-alive>
  </div>
</template>

<script setup lang="ts">
  import { markRaw, onMounted, ref, shallowRef } from 'vue'

  import KrasInfo from '@/components/common/locationInfo/land/KrasInfo.vue'
  import KgeoInfo from '@/components/common/locationInfo/land/KgeoInfo.vue'
  import PublicInfo from '@/components/common/locationInfo/land/PublicInfo.vue'

  import { MapType } from '@/enums/mapEnum'

  import { getConfig } from '@/api/app/config'

  const props = withDefaults(
    defineProps<{
      mapType: MapType
    }>(),
    {},
  )

  const tabComponent = ref()
  const tabCategory = ref<string>('')

  const tabList = shallowRef([
    {
      key: 'KRAS',
      title: 'KRAS',
      content: KrasInfo,
      visible: ref(false),
    },
    {
      key: 'KGEO',
      title: 'K-Geo',
      content: KgeoInfo,
      visible: ref(false),
    },
    {
      key: 'GODATA',
      title: '공공데이터포털',
      content: PublicInfo,
      visible: ref(false),
    },
  ])

  function handleTabChange(key: string) {
    const find = tabList.value.find((item) => key === item.key)
    if (find) {
      tabCategory.value = find.key
      tabComponent.value = markRaw(find.content)
    }
  }

  onMounted(async () => {
    let isLoad = false

    const tabs = [
      {
        key: 'KGEO',
        code: 'KGEO_API_USE',
      },
      {
        key: 'KRAS',
        code: 'KRAS_USE',
      },
      {
        key: 'GODATA',
        code: 'GODATA_KEY',
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

      if (!isLoad && ft!.visible.value) {
        handleTabChange(ft!.key)
        isLoad = true
      }
    }
  })
</script>
