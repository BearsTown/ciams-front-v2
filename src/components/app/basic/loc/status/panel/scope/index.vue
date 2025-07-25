<template>
  <PagePane :title="['산업현황분석', '공업지역기본계획 산업의 범위']">
    <template #center>
      <div class="container">
        <div class="center">
          <div class="left customScroll">
            <div class="container">
              <span style="margin: 5px; color: #616161">
                산업기반분석은 산업발전법 제2조에 따른 산업을 대상으로 분석(지침 제8조 제2호)
              </span>
              <span style="margin: 5px; color: #616161">
                ※「산업발전법」 제2조, 령 제2조, 별표1(산업의 범위) : 제조업, 제조업의 경쟁력 강화와
                밀접하게 관련되는 서비스업
              </span>

              <table class="customTable">
                <colgroup>
                  <col style="width: 15%" />
                  <col style="width: 25%" />
                  <col style="width: 5%" />
                  <col style="width: 55%" />
                </colgroup>
                <thead>
                  <tr>
                    <th colspan="3" style="text-align: center; vertical-align: middle">업종</th>
                    <th scope="col" style="text-align: center; vertical-align: middle">
                      한국표준산업분류 산업내용
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <template v-for="(scope, cIdx) in scopes" :key="cIdx">
                    <tr v-for="(item, iIdx) in scope.categoryItems" :key="iIdx">
                      <td
                        v-if="iIdx === 0"
                        :rowspan="scope.categoryItems.length"
                        style="text-align: center; vertical-align: middle"
                      >
                        {{ scope.category }}
                      </td>

                      <td style="text-align: center; vertical-align: middle">
                        {{ item.codeNm }}
                      </td>
                      <td style="text-align: center; vertical-align: middle">
                        {{ item.code }}
                      </td>

                      <td style="text-align: left">
                        <template v-for="(code, cIdx) in item.children" :key="cIdx">
                          {{ code.code }} {{ code.codeNm }}
                          <br v-if="cIdx < item.children.length - 1" />
                        </template>
                      </td>
                    </tr>
                  </template>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </template>
  </PagePane>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue'

  import PagePane from '@/components/common/PagePane.vue'

  import { ScopeDto } from '@/models/api/app/basic/loc/industry/scope'

  import { getScopes } from '@/api/app/basic/loc/ind-status'

  const scopes = ref<ScopeDto.Data[]>([])

  onMounted(async () => {
    const { data } = await getScopes()
    scopes.value = data
  })
</script>

<style lang="scss"></style>

<style scoped lang="scss">
  .container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;

    .center {
      flex: 1;
      height: 0px;
      display: flex;
      flex-direction: row;

      .left {
        width: 100%;
        height: 100%;

        padding: 5px;
        background: #fff;
        border-radius: 8px;
      }

      .right {
        width: 50%;

        padding: 10px;
        background: #fff;
        margin-left: 8px;
        border-radius: 8px;
      }
    }

    .bottom {
      height: 80px;
      margin-top: 8px;
      min-height: 100px;
      max-height: 150px;

      padding: 10px;
      background: #fff;
      border-radius: 8px;
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
  }

  .customTable tr > td:not([rowspan]) {
    border-left: 1px solid #e0e0e0;
  }
</style>
