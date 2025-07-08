<template>
  <div class="customScroll" style="height: 100%">
    <div class="border-box-square" style="">
      <div style="margin: 8px 0">지정기준</div>
      <table class="customTable">
        <colgroup>
          <col />
        </colgroup>
        <thead>
          <tr>
            <th scope="col" style="text-align: center">내용</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="text-align: left">필수 규모 : 10,000㎡ 이상</td>
          </tr>
          <tr>
            <td style="text-align: left">미개발지역</td>
          </tr>
          <tr>
            <td style="text-align: left">
              신규 지정된 공업지역 또는 미개발지역으로 개발이 지연되고 있는 지역
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="border-box-square" style="">
      <div style="margin: 8px 0">정비방향</div>
      <table class="customTable">
        <colgroup>
          <col />
        </colgroup>
        <thead>
          <tr>
            <th scope="col" style="text-align: center">내용</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="text-align: left">
              산업기반이 부족한 지역의 지원기반시설 정비ㆍ확충 및 입주지원을 통한 산업입지 촉진
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="border-box-square" style="">
      <el-image
        style="width: 100%"
        :src="imgSrc"
        fit="scale-down"
        :preview-src-list="[imgSrc]"
        :preview-teleported="true"
        :zoom-rate="1.2"
      />
    </div>

    <div class="border-box-square" style="">
      <div style="margin: 8px 0">적용구역</div>
      <table class="customTable">
        <colgroup>
          <col />
        </colgroup>
        <thead>
          <tr>
            <th scope="col" style="text-align: center">내용</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="text-align: left">대광3</td>
          </tr>
          <tr>
            <td style="text-align: left">대광6</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onActivated, onBeforeMount, onMounted } from 'vue'

  import Table from '@/components/app/menu-1/sub-1/left/Table.vue'

  import { API_INFO_CIAMS } from '@/config/config'

  import { useGlobalStore } from '@/stores/app'
  import { useMenu3Sub2Page1Store } from '@/stores/app/menu-3/sub-2/page-1'

  const globalStore = useGlobalStore()
  const menu3Sub2Page1Store = useMenu3Sub2Page1Store()

  const prefixPath = API_INFO_CIAMS.PREFIX + '/api/v1/file/image/'
  const imgSrc = prefixPath + '1c7149c9-8e2b-4675-af60-b79830cf4290'

  onMounted(async () => {})

  onBeforeMount(() => {})

  onActivated(() => {})
</script>

<style scoped lang="scss">
  .border-box-square:first-child {
    margin: 0;
  }

  .header-title {
    margin: 8px 0;
    color: #212121;
    font-size: 15px;
    font-weight: 700;
    letter-spacing: -0.02em;
  }

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
</style>
