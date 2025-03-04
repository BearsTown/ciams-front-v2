import { reactive } from 'vue'

function pageObject() {
  const pageInfo: PageInfo = reactive({
    pageNo: 1,
    pageSize: 15,
    totalCount: 0,
    currentPageSize: 15,
  })

  function setPageData(page) {
    pageInfo.pageNo = page.pageNo
    pageInfo.pageSize = page.size
    pageInfo.totalCount = page.totalCount
  }

  return {
    pageInfo,
    setPageData,
  }
}

export { pageObject }
