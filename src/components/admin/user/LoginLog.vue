<template>
  <div style="width: 100%; height: 100%">
    <div class="l-header">
      <span class="header-title">접속자 통계</span>
      <div class="right">
        <div class="search">
          <el-date-picker
            ref="c_date"
            v-model="searchDate"
            type="daterange"
            unlink-panels
            range-separator="To"
            start-placeholder="시작일"
            end-placeholder="종료일"
            :shortcuts="shortcuts"
            value-format="YYYY-MM-DD"
            @change="searchLog"
          />
        </div>
      </div>
    </div>
    <div class="content-wrap">
      <div class="content download">
        <div class="customCard customScroll scrollY">
          <VueEchart :option="option" view-type="CHART" position="ETC" />
        </div>
        <div class="customCard customScroll scrollY">
          <!-- <el-col :span="12" style="display: flex; flex-direction: column; height: 100%"> -->
          <div class="grid-content ep-bg-purple-light" style="height: 100%">
            <el-table
              style="flex: 1 1 0%; height: 100%"
              empty-text="데이터가 없습니다."
              :header-row-style="{ cursor: 'pointer', height: '60px' }"
              :row-style="{ cursor: 'pointer', height: '50px' }"
              :data="list"
              border
              scrollbar-always-on
            >
              <el-table-column label="아이디" prop="loginId" align="center" />
              <el-table-column label="접속시간" prop="loginDate" align="center" />
            </el-table>
          </div>
        </div>
      </div>
    </div>
    <div class="l-footer">
      <span class="num">총 {{ pageInfo.totalCount }}건</span>
      <div class="customPagination">
        <el-pagination
          @current-change="getActivePage"
          style="padding: 0"
          layout="prev, pager, next"
          :total="pageInfo.totalCount"
          :page-size="pageInfo.pageSize"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref, Ref } from 'vue'
  import VueEchart from '@/components/chart/VueEchart.vue'
  import { useLoginLogStore } from '@/stores/admin/loginLog'
  import { storeToRefs } from 'pinia'

  const store = useLoginLogStore()
  const { list, pageInfo, optionData } = storeToRefs(store)
  const c_date = ref()

  let searchDate: Ref<string[]> = ref([])
  let option = ref({})

  const shortcuts = [
    {
      text: '최근 1주',
      value: () => {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
        return [start, end]
      },
    },
    {
      text: '최근 1달',
      value: () => {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
        return [start, end]
      },
    },
    {
      text: '최근 3달',
      value: () => {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
        return [start, end]
      },
    },
  ]

  function change() {
    let data = optionData.value

    option.value = {
      tooltip: {
        trigger: 'axis',
      },
      xAxis: {
        type: 'category',
        data: data.map((item) => item[0]),
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          data: data.map((item) => item[1]),
          type: 'line',
          smooth: 0.6,
          //symbol: 'none',
          lineStyle: {
            color: '#5470C6',
            width: 3,
          },
        },
      ],
    }
  }

  function getActivePage(curPage) {
    store.pageInfo.pageNo = curPage
    searchLog()
  }

  function searchLog() {
    store.setDate(searchDate.value[0], searchDate.value[1])
    store.getloginLogList().then((res) => {
      console.log(res)
      change()
    })
  }

  function getToDate(_day?) {
    let date = new Date()
    if (_day != null) {
      date.setTime(date.getTime() + 3600 * 1000 * 24 * _day)
    }
    var year = date.getFullYear()
    var month = ('0' + (date.getMonth() + 1)).slice(-2)
    var day = ('0' + date.getDate()).slice(-2)

    return year + '-' + month + '-' + day
  }

  onMounted(() => {
    searchDate.value = [getToDate(-7), getToDate()]
    searchLog()
  })
</script>

<style scoped>
  @import '@/assets/css/referencePage.css';

  #reference .content.download .customCard {
    width: calc(100% / 2 - 16px);
    flex: 1;
    margin: 0 8px;
  }

  :deep th.el-table__cell.is-leaf {
    border-top: 1px solid #e0e0e0;
    background-color: #f4f4f4;
  }
</style>

<style scoped>
  .page {
    text-align: center;
    padding: 15px 10px;
    background-color: white;
  }
  .totalLabel {
    float: left;
    font-size: 14px;
    line-height: 30px;
  }
</style>
