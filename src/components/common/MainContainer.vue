<template>
  <div style="width: 100%; height: 100%; display: flex; position: relative">
    <!-- //////////////////// 좌측 drawer -->
    <div
      v-show="layoutSelected?.left?.visible?.status"
      class="map-leftDrawer"
      :class="{ active: layoutSelected?.left?.collapse?.status }"
    >
      <!-- 좌측 drawer: 토글 버튼 -->
      <button
        type="button"
        class="btn-drawerToggle"
        @click="layoutSelected?.left?.collapse?.toggle"
        :class="{ active: layoutSelected?.left?.collapse?.status }"
      >
        <SvgIcon name="drawer" size="12" />
      </button>

      <!-- 좌측 drawer: 내용 -->
      <div class="leftDrawer-content">
        <router-view
          name="left"
          v-slot="{ Component }"
          style="width: 100%; height: 100%; display: flex; flex-direction: column"
        >
          <keep-alive>
            <component :is="Component" />
          </keep-alive>
        </router-view>
      </div>
    </div>

    <div class="map-content">
      <router-view name="center" v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </div>

    <!-- //////////////////// 우측 drawer -->
    <div
      v-show="layoutSelected?.right?.visible?.status"
      class="map-rightDrawer"
      :class="{
        active: layoutSelected?.right?.collapse?.status,
      }"
    >
      <!-- 우측 drawer: 토글 버튼 -->
      <button
        type="button"
        class="btn-drawerToggle"
        @click="layoutSelected?.right?.collapse?.toggle"
        :class="{ active: layoutSelected?.right?.collapse?.status }"
      >
        <SvgIcon name="drawer" size="12" />
      </button>

      <!-- 우측 drawer: 내용 -->
      <div class="rightDrawer-content">
        <router-view name="right" v-slot="{ Component }">
          <keep-alive>
            <component :is="Component" />
          </keep-alive>
        </router-view>

        <router-view name="locationInfo" v-slot="{ Component }">
          <keep-alive>
            <component :is="Component" />
          </keep-alive>
        </router-view>
        <!--        <OpenApi v-show="visible" />-->
      </div>
    </div>

    <div
      class="panel"
      v-show="layoutSelected?.panel?.visible?.status"
      :class="{ active: layoutSelected?.left?.collapse?.status }"
    >
      <router-view name="panel" v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, onActivated } from 'vue'
  import { storeToRefs } from 'pinia'

  import OpenApi from '@/components/common/locationInfo'

  import { useGlobalStore } from '@/stores/app'
  import { useMapStore } from '@/stores/map/map'

  const globalStore = useGlobalStore()

  const { layoutSelected, currentMapType } = storeToRefs(globalStore)

  // const mapStore = useMapStore(currentMapType.value)

  const visible = computed(() => {
    const mapStore = useMapStore(currentMapType.value)
    return mapStore.locationInfoVisible
  })

  onActivated(() => {
    layoutSelected.value?.left?.collapse?.on()
  })

  defineExpose({})
</script>

<style scoped lang="scss">
  .map-leftDrawer {
    border: none;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);

    > button {
      box-shadow: 4px 2px 4px rgba(0, 0, 0, 0.1);
    }

    .btn-drawerToggle {
      left: 100%;
    }

    .leftDrawer-content > div {
      display: block;
    }
  }

  .map-rightDrawer {
    z-index: 21;
    border: none;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);

    > button {
      box-shadow: -4px 2px 4px rgba(0, 0, 0, 0.1);
    }

    .btn-drawerToggle {
      right: 100%;
    }
  }

  .panel {
    right: 0;
    z-index: 20;
    width: 100%;
    height: 100%;
    position: absolute;
    transition: 0.3s;
  }

  .panel.active {
    transition: 0.3s;
    width: calc(100% - 355px);
  }
</style>

<style>
  .modalAddClass {
    left: 70% !important;
  }
</style>
