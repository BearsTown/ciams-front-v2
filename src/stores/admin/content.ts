import { defineStore } from 'pinia'
import { reactive, toRefs } from 'vue'
import userService from '@/api/admin/user'
import { pageObject } from '@/js/common'

import { merge } from 'lodash-es'

interface Istate {
  dataList: []
  keyword: string
  pageInfo: PageInfo
}

export const useUsersStore = defineStore('users', () => {
  const pageObj = pageObject()

  const state = reactive({
    dataList: [],
    keyword: '',
    pageInfo: pageObj.pageInfo,
  } as Istate)

  function getList() {
    return new Promise<void>((resolve, reject) => {
      const data = merge(
        {},
        {
          keyword: state.keyword,
        },
        pageObj.pageInfo,
      )

      userService
        .getList(data)
        .then((res) => {
          console.log(res.data)
          state.dataList = res.data.list
          pageObj.setPageData(res.data.page)
          resolve()
        })
        .catch(reject)
    })
  }

  return {
    ...toRefs(state),
    getList,
  }
})
