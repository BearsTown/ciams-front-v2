import archiveService from '@/api/app/archive/archiveService'
import { defineStore } from 'pinia'
import { reactive, toRefs } from 'vue'
import Archive from '@/api/app/archive/model'

export const useArchiveStore = defineStore('useArchiveStore', () => {
  const state = reactive({
    searchItem: {
      title: '',
      categoryId: '',
      hidden: null,
      size: 15,
      pageNo: 1,
    },
    archiveItem: {
      title: '',
      viewType: 'list',
      total: 0,
      list: [],
    },
  } as {
    searchItem: {
      title: string
      categoryId: string
      hidden: null | boolean
      size: number
      pageNo: number
    }
    archiveItem: {
      title: string
      viewType: string
      total: number
      list: Archive.ArchiveFile[]
    }
  })

  async function getCategoryList() {
    try {
      const { data } = await archiveService.getCategory()
      return data
    } catch (e) {
      return []
    }
  }

  async function getArchiveList(param: Archive.SearchParam) {
    try {
      const { data }: any = await archiveService.getArchive(param)
      const find = Object.keys(param).find((key) => key === 'isPage')
      if (find === undefined || (!!find && param[find])) {
        state.archiveItem.total = data.page.totalCount
      }
      if (data.list.length > 0) {
        for (const obj of data.list) {
          if (obj.archiveFiles.length > 0) {
            const filter = obj.archiveFiles.filter(
              (subObj: Archive.File) => subObj.typeCode === 'archiveImg',
            )
            if (filter.length > 0) {
              obj.imgFileId = filter[0].id
            } else {
              obj.imgFileId = ''
            }
          } else {
            obj.imgFileId = ''
          }
        }
        state.archiveItem.list = data.list
      } else {
        state.archiveItem.list = []
      }
    } catch (e) {}
  }

  async function getDetailArchive(id: string) {
    try {
      const { data }: any = await archiveService.getArchiveDetail(id)
      return data
    } catch (e) {
      return {}
    }
  }

  function archiveItemReset() {
    state.searchItem.title = ''
    state.searchItem.categoryId = ''
    state.searchItem.hidden = null
    state.searchItem.size = 9
    state.searchItem.pageNo = 1
    state.archiveItem.title = ''
    state.archiveItem.viewType = 'card'
    state.archiveItem.total = 0
    state.archiveItem.list = []
  }

  return {
    ...toRefs(state),
    getCategoryList,
    getArchiveList,
    getDetailArchive,
    archiveItemReset,
  }
})
