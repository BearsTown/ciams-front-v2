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
            <td style="text-align: left">주거, 근생 등 용도혼재지역</td>
          </tr>
          <tr>
            <td style="text-align: left">
              산업활성화와 주거환경 개선 등 계획적 정비가 동시에 필요한 지역
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
            <td style="text-align: left">주거와 산업의 공생 유도</td>
          </tr>
          <tr>
            <td style="text-align: left">준공업지역 내 복합산업공간 정비 유도</td>
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
            <td style="text-align: left">대광1</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onActivated, onBeforeMount, onMounted } from 'vue'

  import { useGlobalStore } from '@/stores/app'
  import { useMenu3Sub2Page1Store } from 'src/stores/app/menu-3/sub-2/page-1'
  import { API_INFO_CIAMS } from '@/config/config'
  import Table from '@/components/app/menu-1/sub-1/left/Table.vue'

  const globalStore = useGlobalStore()
  const menu3Sub2Page1Store = useMenu3Sub2Page1Store()

  const prefixPath = API_INFO_CIAMS.PREFIX + '/api/v1/file/image/'
  const imgSrc = prefixPath + 'baccb948-7029-414d-8c41-4e4d683920ce'

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
