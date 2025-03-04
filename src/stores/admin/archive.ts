import { defineStore } from 'pinia'
import { reactive, toRefs } from 'vue'

import { pageObject } from '@/js/common'

import { merge } from 'lodash-es'
import archiveService from '@/api/admin/archive'
import Archive from '@/api/admin/archive/model'
import { v4 as uuidV4 } from 'uuid'

export const useArchiveStore = defineStore('archive', () => {
  const pageObj = pageObject()

  const state = reactive({
    categoryList: [],
    selectedCategory: {},
    archiveList: [],
    search: {
      categoryId: '',
      keyword: '',
      hidden: null,
    },
    pageInfo: pageObj.pageInfo,
    reload: '',
  } as unknown as {
    categoryList: Archive.ArchiveCategory[]
    selectedCategory: Archive.ArchiveCategory
    archiveList: Archive.ArchiveDetail[]
    search: {
      categoryId: string
      keyword: string
      hidden: null | boolean
    }
    pageInfo: PageInfo
    reload: string
  })

  function getCategoryList() {
    return new Promise<Archive.ArchiveCategory[]>((resolve, reject) => {
      archiveService
        .getCategory()
        .then((res) => {
          state.categoryList = res.data
          resolve(res.data)
        })
        .catch(reject)
    })
  }

  function addCategory(params) {
    return new Promise<Archive.ArchiveCategory[]>((resolve, reject) => {
      archiveService
        .addCategory(params)
        .then((res) => {
          resolve(res.data)
        })
        .catch(reject)
    })
  }

  function deleteCategory(categoryId) {
    return new Promise<void>((resolve, reject) => {
      archiveService
        .deleteCategory(categoryId)
        .then(() => {
          resolve()
        })
        .catch(reject)
    })
  }

  function modifyCategory(params) {
    return new Promise<void>((resolve, reject) => {
      archiveService
        .modifyCategory(params)
        .then((res) => {
          resolve(res.data)
        })
        .catch(reject)
    })
  }

  function getArchiveDetail(archiveId: string) {
    return new Promise<Archive.ArchiveDetail>((resolve, reject) => {
      archiveService
        .getArchiveDetail(archiveId)
        .then((res) => {
          resolve(res.data)
        })
        .catch(reject)
    })
  }

  function getArchiveList() {
    return new Promise<void>((resolve, reject) => {
      const params = merge(
        {},
        {
          categoryId: state.search.categoryId,
          title: state.search.keyword,
          hidden: state.search.hidden,
        },
        pageObj.pageInfo,
      )

      archiveService
        .getArchive(params)
        .then((res) => {
          state.archiveList = res.data.list
          pageObj.setPageData(res.data.page)
          resolve(res.data)
        })
        .catch(reject)
    })
  }

  function addArchive(params) {
    return new Promise<object>((resolve, reject) => {
      archiveService
        .addArchive(params)
        .then((res) => {
          resolve(res.data)
        })
        .catch(reject)
    })
  }

  function modifyArchive(params) {
    return new Promise<Archive.ArchiveDetail>((resolve, reject) => {
      archiveService
        .modifyArchive(params)
        .then((res) => {
          resolve(res.data)
        })
        .catch(reject)
    })
  }

  function deleteArchive(ids) {
    return new Promise<void>((resolve, reject) => {
      archiveService
        .deleteArchive(ids)
        .then(() => {
          resolve()
        })
        .catch(reject)
    })
  }

  function modifyHidden(param) {
    return new Promise<void>((resolve, reject) => {
      archiveService
        .modifyHidden(param)
        .then(() => {
          resolve()
        })
        .catch(reject)
    })
  }

  function reloadAction() {
    state.reload = uuidV4()
  }

  return {
    ...toRefs(state),
    addArchive,
    modifyArchive,
    deleteArchive,
    getArchiveList,
    modifyHidden,
    getArchiveDetail,
    addCategory,
    modifyCategory,
    deleteCategory,
    getCategoryList,
    reloadAction,
  }
})
