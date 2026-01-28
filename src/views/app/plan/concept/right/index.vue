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
              :style="{ 'background-color': tagColor(overview.mngCd) }"
            >
              {{ overview.mngType }}
            </div>
          </div>
        </div>
      </div>

      <div class="container customScroll" style="margin-top: 8px; flex: 1; padding: 5px">
        <div class="">
          <template v-for="item in info?.baseDescs" :key="item">
            <InsideCollapse :title="item?.category" :is-open="true">
              <template #content>
                <ul class="">
                  <template v-for="(desc, idx) in item?.list" :key="idx">
                    <li style="line-height: 1.5; letter-spacing: -0.28px; color: #616161">
                      ㆍ{{ desc }}
                    </li>
                  </template>
                </ul>
              </template>
            </InsideCollapse>
          </template>

          <template v-for="item in info?.zoneDescs" :key="item">
            <InsideCollapse :title="item?.category" :is-open="true">
              <template #content>
                <ul class="">
                  <template v-for="(desc, idx) in item?.list" :key="idx">
                    <li style="line-height: 1.5; letter-spacing: -0.28px; color: #616161">
                      ㆍ{{ desc }}
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
                  <template v-for="industry in info?.zoneIndustries" :key="industry">
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

          <template v-for="item in info?.zoneImages" :key="item">
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
  import { computed, ref, watch } from 'vue'

  import SvgIcon from '@/components/common/SvgIcon.vue'
  import { InsideCollapse } from '@/components/common/collapse'
  import AsyncImage from '@/views/app/plan/concept/right/AsyncImage.vue'

  import { CiamsZoneDTO } from '@/api/app/zone/model'
  import { ConceptDto } from '@/models/api/app/plan/concept'
  import { getImage as getImageAxios, getMenu3Sub1Info } from '@/api/app/plan/concept'

  import { usePlanConceptStore } from '@/stores/app/plan/concept'

  const planConceptStore = usePlanConceptStore()

  const state = planConceptStore.state
  const info = ref<ConceptDto.Info.Find.Result>()
  const overview = computed<CiamsZoneDTO.Overview.Find.Result | undefined>(() => state.overview)

  function tagColor(itaReCd: string) {
    return state.tags?.find((tag) => tag.value === itaReCd)?.color ?? '#b2b2b2'
  }

  async function getImage(id: number) {
    const response = await getImageAxios(id)
    const imageBlob = new Blob([response.data], { type: response.headers['content-type'] })

    return computed(() => {
      return URL.createObjectURL(imageBlob)
    })
  }

  watch(
    () => overview.value,
    async () => {
      if (overview.value?.zoneNo) {
        const { data } = await getMenu3Sub1Info(overview.value?.zoneNo)

        const orders1 = ['기본방향', '공간관리방안']
        const orders2 = ['위치도', '현황사진', '기본구상']
        info.value = {
          ...data,
          zoneDescs: [...data.zoneDescs].sort(
            (a, b) => orders1.indexOf(a.category) - orders1.indexOf(b.category),
          ),
          zoneImages: [...data.zoneImages].sort(
            (a, b) => orders2.indexOf(a.category) - orders2.indexOf(b.category),
          ),
        }
      } else {
        info.value = undefined
      }
    },
  )
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
