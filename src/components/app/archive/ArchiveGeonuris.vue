<template>
  <div class="container">
    <div class="l-header">
      <span class="header-title">GeoNURIS Maple</span>
    </div>
    <div class="content">
      <div class="customCard maple">
        <table class="customTable">
          <colgroup>
            <col width="55%" />
            <col width="45%" />
          </colgroup>
          <thead>
            <tr>
              <th scope="col">실행링크</th>
              <th scope="col">첨부파일</th>
            </tr>
          </thead>
        </table>

        <!-- 데이터 없을때 -->
        <!-- <div class="no-data" style="height:99px">데이터가 존재하지 않습니다.</div> -->

        <!-- 데이터 있을때 -->
        <table class="customTable body">
          <colgroup>
            <col width="55%" />
            <col width="45%" />
          </colgroup>
          <tbody>
            <tr>
              <td class="hover-point" @click="linkMaple">GeoNURIS Maple</td>
              <td class="file">
                <!-- <div class="hover-point row">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="21"
                    viewBox="0 0 20 21"
                    fill="none"
                  >
                    <path
                      d="M3.3335 13.1703L3.3335 16.2438C3.3335 16.7095 3.50909 17.1562 3.82165 17.4856C4.13421 17.815 4.55814 18 5.00016 18H15.0002C15.4422 18 15.8661 17.815 16.1787 17.4856C16.4912 17.1562 16.6668 16.7095 16.6668 16.2438V13.1703M10.0011 3V12.9521M10.0011 12.9521L13.8106 9.14941M10.0011 12.9521L6.19157 9.14941"
                      stroke="#9E9E9E"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  GeoNURIS Maple Menual.pdf
                </div> -->
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import tokenUtil from '@/utils/tokenUtil'

  function linkMaple() {
    const accessToken = tokenUtil.getAccessToken()
    const url = window.location.origin + '/ciams'
    const mapleUrl = `maple://${url}/oauth/check_token?${accessToken}`

    window.open(mapleUrl)
  }
</script>
<style scoped lang="scss">
  .hover-point:hover {
    color: #52b597;
    cursor: pointer;
  }
</style>
