<template>
  <div class="urbanInfo active" style="display: flex; flex-direction: column">
    <div style="display: flex; flex-direction: column; height: 100%">
      <div class="container" style="height: 54px">
        <div
          class="row"
          style="
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
          "
        >
          <div
            class="title"
            style="align-items: center; display: flex; font-weight: 700; padding-bottom: 0"
          >
            <SvgIcon name="loc" style="color: #7aaad1; margin-right: 3px" />
            {{ overview ? `${overview.zoneName}` : '' }}
          </div>
          <div>
            <div
              v-if="overview"
              class="tag"
              :style="{ 'background-color': tagColor(overview.mngType) }"
            >
              {{ overview.mngType }}
            </div>
          </div>
        </div>
      </div>

      <div class="container customScroll" style="margin-top: 8px; flex: 1; padding: 5px">
        <div class="">
          <template v-for="item in overview?.baseDescs" :key="item">
            <InsideCollapse :title="item?.category" :is-open="true">
              <template #content>
                <ul class="">
                  <template v-for="(desc, idx) in item?.list" :key="idx">
                    <li style="line-height: 1.5; letter-spacing: -0.28px; color: #616161">
                      ∘ {{ desc }}
                    </li>
                  </template>
                </ul>
              </template>
            </InsideCollapse>
          </template>

          <template v-for="item in overview?.zoneDescs" :key="item">
            <InsideCollapse :title="item?.category" :is-open="true">
              <template #content>
                <ul class="">
                  <template v-for="(desc, idx) in item?.list" :key="idx">
                    <li style="line-height: 1.5; letter-spacing: -0.28px; color: #616161">
                      ∘ {{ desc }}
                    </li>
                  </template>
                </ul>
              </template>
            </InsideCollapse>
          </template>

          <InsideCollapse title="주요도입산업" :is-open="true">
            <template #content>
              <table class="customTable">
                <colgroup>
                  <col style="width: 25%" />
                  <col />
                </colgroup>
                <thead>
                  <tr>
                    <th scope="col" style="text-align: center">산업분류</th>
                    <th scope="col" style="text-align: center">업종명</th>
                  </tr>
                </thead>
                <tbody>
                  <template v-for="industry in overview?.zoneIndustries" :key="industry">
                    <tr v-for="(item, idx) in industry.list" :key="idx">
                      <td
                        v-if="idx === 0"
                        :rowspan="industry.list.length"
                        style="vertical-align: middle"
                      >
                        {{ industry.category }}
                      </td>
                      <td style="text-align: left">{{ item.industryName }}</td>
                    </tr>
                  </template>
                </tbody>
              </table>
            </template>
          </InsideCollapse>

          <template v-for="item in overview?.zoneImages" :key="item">
            <InsideCollapse :title="item?.category" :is-open="true">
              <template #content>
                <template v-for="img in item?.list" :key="img">
                  <div>
                    <Suspense>
                      <AsyncImage :id="img.id" />
                      <template #fallback>Loading...</template>
                    </Suspense>
                    <div style="width: 100%; text-align: center; padding: 7px">
                      <span style="text-align: center; font-size: 15px; font-weight: bold">
                        <span>{{ img.title }}</span></span
                      >
                    </div>
                  </div>
                </template>
              </template>
            </InsideCollapse>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, onBeforeMount, onMounted } from 'vue'
  import { storeToRefs } from 'pinia'

  import SvgIcon from '@/components/common/SvgIcon.vue'
  import { InsideCollapse } from '@/components/common/collapse'
  import Table from '@/components/app/menu-1/sub-1/left/Table.vue'
  import AsyncImage from '@/views/app/menu-3/sub-1/right/AsyncImage.vue'

  import { getImage as getImageAxios } from '@/api/app/menu-3/sub-1'

  import { useMenu3Sub1Store } from '@/stores/app/menu-3/sub-1'

  const menu3Sub1Store = useMenu3Sub1Store()
  const { overview } = storeToRefs(menu3Sub1Store)

  // const tjdwkd = computed(() => overview?.value?.itaResult === '성장')
  // const dbwl = computed(() => overview?.value?.itaResult === '유지')
  // const thlxhl = computed(() => overview?.value?.itaResult === '쇠퇴')

  /**
   * - ToDo: DB 관리 변경
   *
   * @param mngType
   */
  function tagColor(mngType: string) {
    switch (mngType) {
      case '산업관리형':
        return '#6fad47'
      case '산업정비형':
        return '#ed7d31'
      case '산업혁신형':
        return '#5b9bd5'
      case '산업혁신·정비형':
        return '#cc66ff'
      default:
        return '#ffffff'
    }
  }

  async function getImage(id: number) {
    const response = await getImageAxios(id)
    const imageBlob = new Blob([response.data], { type: response.headers['content-type'] })

    return computed(() => {
      return URL.createObjectURL(imageBlob)
    })
  }

  onBeforeMount(() => {})

  onMounted(async () => {})

  defineExpose({})
</script>

<style scoped lang="scss">
  :deep(.border-box-round) {
    background: #fff;
    border-radius: 8px;
    padding: 5px 15px !important;
    margin: 0 0 5px 0 !important;
  }

  .title {
    font-size: 17px;
    padding-bottom: 10px;
  }

  .customScroll {
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    margin-top: 8px;
  }

  .tag {
    width: 105px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    //border: 1px solid #9e9e9e;
    font-size: 12px;
    font-weight: 600;
    color: white;
    box-shadow: 3px 3px 3px 0 rgba(0, 0, 0, 0.12);
  }

  .customTable tr > td:not([rowspan]) {
    border-left: 1px solid #e0e0e0;
  }
</style>
