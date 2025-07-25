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
            <td style="text-align: left">특정업종의 산업입지계수가 1이상인 공업지역</td>
          </tr>
          <tr>
            <td style="text-align: left">
              지역특화업종 밀집지역, 산업기반정비ㆍ지원기능이 필요한 지역
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
            <td style="text-align: left">공공지원을 통한 산업환경 체계적 정비</td>
          </tr>
          <tr>
            <td style="text-align: left">대규모 개발단위 지양, 지역산업생태계 활성화</td>
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
            <td style="text-align: left">대항면</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { API_INFO_CIAMS } from '@/config/config'

  const prefixPath = API_INFO_CIAMS.PREFIX + '/api/v1/file/image/'
  const imgSrc = prefixPath + '859e3a82-c6df-40df-942c-0036847aff06'
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
