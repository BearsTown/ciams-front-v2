<template>
  <div style="display: flex; width: 100%; height: 100%; flex-direction: column">
    <template v-for="(item, index) in statusList" :key="item.id">
      <MenuCollapse
        class="menuButton"
        ref="childRefs"
        :title="item.title"
        type=""
        :is-open="false"
        :is-child="item.children?.length > 0"
        @open-change="(isOpen: boolean) => handleCustomEvent(isOpen, item, index)"
      >
        <template #content>
          <template v-for="child in item.children" :key="child.id">
            <ActiveButton
              ref="activeBtnChildRefs"
              :title="child.title"
              :is-active="selectedItem?.id === child?.id"
              @change:active="(isActive: boolean) => handleStatusGroupChange(isActive, child)"
            />
          </template>
        </template>
      </MenuCollapse>

      <el-divider
        v-if="index < statusList.length - 1"
        style="margin: 10px 0"
        border-style="dashed"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
  import { nextTick, onMounted, ref } from 'vue'
  import { storeToRefs } from 'pinia'

  import ActiveButton from '@/components/common/ActiveButton.vue'
  import MenuCollapse from '@/components/common/collapse/MenuCollapse.vue'

  import { Style } from 'ol/style'

  import { GeneralDataDto } from '@/models/api/app/basic/loc/general/general'

  import { getGeneralDataItems } from '@/api/app/basic/loc/general'
  import { useBoolean } from '@/hooks/useBoolean'

  import { useGlobalStore } from '@/stores/app'
  import { useBasicLocGeneralStore } from '@/stores/app/basic/loc/general'

  const basicLocGeneralStore = useBasicLocGeneralStore()

  const globalStore = useGlobalStore()
  const { layoutSelected } = storeToRefs(globalStore)

  const { selectedMenu, selectedItem } = storeToRefs(basicLocGeneralStore)

  const { status: isActive, toggle } = useBoolean(false)

  const statusList = ref<GeneralDataDto.DataItem[]>([])

  const params = ref({
    title: '',
    menu: '',
  })

  const childRefs = ref<MenuCollapse[]>([])
  const activeBtnChildRefs = ref<ActiveButton[]>([])

  function handleCustomEvent(isOpen: boolean, menu: object, index: number) {
    if (!isOpen) return

    childRefs.value.forEach((child, i) => {
      if (i !== index && child?.setOpen) {
        child.setOpen(false)
      }
    })

    selectedMenu.value = menu
  }

  function handleStatusGroupChange(isActive: boolean, item: object) {
    if (!isActive) return

    console.log(`item ${item}; ${isActive}`)
    basicLocGeneralStore.setStatusGroup(selectedMenu.value!, item)
  }

  async function load() {
    const { data } = await getGeneralDataItems()

    statusList.value = [
      {
        id: 999,
        children: [],
        title: '상위 및 관련계획',
      },
      ...data,
    ]

    await nextTick()

    childRefs.value[1]?.setOpen(true)
    selectedItem.value = statusList.value[1]?.children?.[0]
  }

  onMounted(async () => {
    await load()
  })
</script>

<style lang="scss">
  .zoningSetting .zoningSetting-top .customSelect {
    border: 0;
  }

  .zoningSetting-top.customCard .customSelect-value {
    font-size: 14px;
    border: 0;
    padding: 0;
  }

  .zoningSetting .customTab-item:not(.disabled).active {
    background: #7aaad1;
    color: #fff;
  }
</style>

<style scoped lang="scss">
  .zoningSetting-tab {
    margin: 0;
  }

  .customTab {
    display: flex;
    padding: 10px 0 10px 0;
    justify-content: space-between;

    .customTab-item {
      flex: 1;
      padding: 0;
      margin-left: 10px;
      background-color: white;
    }

    .customTab-item:first-child {
      margin-left: 0;
      margin-right: 0;
    }
  }

  .menuButton {
    //overflow-y: hidden;

    &:not(:first-child) {
      //margin-top: 8px;
    }
  }
</style>
