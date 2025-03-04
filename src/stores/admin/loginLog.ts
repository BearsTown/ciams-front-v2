import { defineStore } from 'pinia'
import { reactive, toRefs } from 'vue'
import { getList } from '@/api/admin/loginLog'
import { pageObject } from '@/js/common'
import { merge } from 'lodash-es'
import LoginLog from '@/api/admin/loginLog/model'
interface Istate {
  list: LoginLog.Row[]
  group: LoginLog.Group[]
  optionData: [string | number][]
  startDate: string
  endDate: string
  pageInfo: PageInfo
}

export const useLoginLogStore = defineStore('loginLog', () => {
  const pageObj = pageObject()

  const state = reactive({
    list: [],
    group: [],
    optionData: [],
    startDate: '',
    endDate: '',
    pageInfo: pageObj.pageInfo,
  } as Istate)

  function getloginLogList() {
    return new Promise<void>((resolve, reject) => {
      const data = merge(
        {},
        {
          startDate: state.startDate,
          endDate: state.endDate,
        },
        pageObj.pageInfo,
      )

      getList(data)
        .then((res) => {
          console.log(res.data)
          state.list = res.data.list
          state.group = res.data.group

          const dayArry = getDatesStartToLast(state.startDate, state.endDate)
          const searchArray = res.data.group.map((res) => [res.day, res.cnt])
          const optionResult: any[] = []
          for (const i of dayArry) {
            let _val
            for (const j of searchArray) {
              if (i == j[0]) {
                _val = j[1]
              }
            }
            optionResult.push([i, _val ? _val : 0])
          }

          console.log(optionResult)

          state.optionData = optionResult
          pageObj.setPageData(res.data.page)
          resolve()
        })
        .catch(reject)
    })
  }

  function setDate(start, end) {
    state.startDate = start
    state.endDate = end
  }

  /**
   * 날짜와 날짜 간격 계산
   * @param {*} startDate
   * @param {*} lastDate
   */
  function getDatesStartToLast(startDate, lastDate) {
    const regex = RegExp(/^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/)
    if (!(regex.test(startDate) && regex.test(lastDate))) return 'Not Date Format'
    const result: string[] = []
    const curDate = new Date(startDate)
    while (curDate <= new Date(lastDate)) {
      const newLocal = curDate.toISOString().split('T')[0]
      result.push(newLocal)
      curDate.setDate(curDate.getDate() + 1)
    }
    return result
  }

  return {
    ...toRefs(state),
    getloginLogList,
    setDate,
  }
})
