import { defineStore } from 'pinia'
import { reactive, toRefs } from 'vue'

import userService from '@/api/admin/user'
import { pageObject } from '@/js/common'

import { merge } from 'lodash-es'

interface Istate {
  userList: []
  keyword: string
  lock: null | boolean
  roleYn: null | 'Y' | 'N'
  pageInfo: PageInfo
}

export const useUsersStore = defineStore('users', () => {
  const pageObj = pageObject()

  const state = reactive({
    userList: [],
    keyword: '',
    lock: null,
    roleYn: null,
    pageInfo: pageObj.pageInfo,
  } as Istate)

  function getUserList() {
    return new Promise<void>((resolve, reject) => {
      const data = merge(
        {},
        {
          keyword: state.keyword,
          lock: state.lock,
          roleYn: state.roleYn,
        },
        pageObj.pageInfo,
      )

      userService
        .getList(data)
        .then((res) => {
          console.log(res.data)
          state.userList = res.data.list
          pageObj.setPageData(res.data.page)
          resolve()
        })
        .catch(reject)
    })
  }

  function initPassword(loginId) {
    return new Promise((resolve, reject) => {
      userService.initPassword(loginId).then(resolve).catch(reject)
    })
  }

  function updateLock(param) {
    return new Promise((resolve, reject) => {
      userService.updateLock(param).then(resolve).catch(reject)
    })
  }

  function updateApprove(param) {
    return new Promise((resolve, reject) => {
      userService.updateApprove(param).then(resolve).catch(reject)
    })
  }

  function modifyUser(user) {
    return new Promise((resolve, reject) => {
      userService
        .modifyUser(user)
        .then((res) => {
          resolve(res)
        })
        .catch(reject)
    })
  }

  function deleteUser(users) {
    return new Promise((resolve, reject) => {
      userService
        .deleteUser(users)
        .then((res) => {
          resolve(res)
        })
        .catch(reject)
    })
  }

  return {
    ...toRefs(state),
    getUserList,
    initPassword,
    updateLock,
    updateApprove,
    modifyUser,
    deleteUser,
  }
})
