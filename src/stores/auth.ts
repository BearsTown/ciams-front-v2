import { ref } from 'vue'
import { findIndex } from 'lodash-es'
import { defineStore } from 'pinia'
import JSEncrypt from 'jsencrypt'

import {
  checkToken as apiCheckToken,
  getRsaPublicKey,
  login,
  refreshToken as apiRefreshToken,
} from '@/api/auth'
import router from '@/router'
import { Token } from '@/api/auth/model'
import TokenUtil from '@/utils/tokenUtil'
import { getSessionUser } from '@/api/app/user'
import { getMenu } from '@/api/app/access'

export const useAuthStore = defineStore('authStore', () => {
  const isLoggedIn = ref(false)
  const userName = ref('')
  const logInStatus = ref('check')
  const path = ref('/')
  const isAdmin = ref(false)
  const userInfo = ref()
  const menuInfo = ref([])

  /**
   * 로그인 처리
   * @param {Object} user 로그인 사용자 정보
   */
  async function logIn(user) {
    const { data: rsa } = await getRsaPublicKey()
    const encrypt = new JSEncrypt()
    encrypt.setPublicKey(rsa)

    const { data: token } = await login({
      username: user.username,
      password: encrypt.encrypt(user.password),
      // grant_type: 'client_credentials',
      grant_type: 'password',
    })

    TokenUtil.saveToken(token)
    await checkToken()
  }

  /**
   * access_token 유효성 체크
   */
  async function checkToken() {
    const access_token = TokenUtil.getAccessToken()
    if (!access_token) {
      logInErrorStatus('notLoggedIn')
    } else {
      // try {
      //   const { data } = await apiCheckToken(access_token)
      //   await logInSuccess(data)
      // } catch (e) {
      //   logInErrorStatus('accessTokenExpired')
      // }
      try {
        const { data } = await apiCheckToken(access_token)
        if (!data.active) {
          logInErrorStatus('accessTokenExpired')
        } else {
          await logInSuccess(data)
        }
      } catch (e) {
        // console.log('accessTokenExpired')
        logInErrorStatus('accessTokenExpired')
      }
    }
  }

  /**
   * refresh token을 이용하여 token 재발급
   */
  async function refreshToken() {
    const refresh_token = TokenUtil.getRefreshToken()
    if (!refresh_token) {
      logInErrorStatus('notLoggedIn')
    } else {
      try {
        const { data } = await apiRefreshToken({
          grant_type: 'refresh_token',
          refresh_token: refresh_token,
        })

        TokenUtil.saveToken(data)

        if (isLoggedIn.value) {
          await logInSuccess()
        } else {
          await checkToken()
        }
      } catch (e) {
        logOut('sessionExpired')
      }
    }
  }

  function logInErrorStatus(status) {
    logInStatus.value = status
    isLoggedIn.value = false
  }

  async function logInSuccess(token?: Token.Check) {
    if (token) {
      userName.value = token.user_name
      isAdmin.value = findIndex(token.authorities, (role) => role.authority === 'ROLE_ADMIN') > -1
      //사용자 정보조회
      await getUserInfo()
      //메뉴 정보조회
      await getMenuInfo()
    }

    isLoggedIn.value = true
    logInStatus.value = 'success'
  }

  function setPath(_path) {
    path.value = _path
  }

  function logOut(type: 'sessionExpired' | 'loginOutAction') {
    TokenUtil.removeToken()
    isLoggedIn.value = false
    router.push('/')
    window.localStorage.setItem('isLogOutAction', type)
  }

  async function getUserInfo() {
    //사용자 정보조회
    const _userInfo = await getSessionUser()
    userInfo.value = _userInfo.data
  }

  async function getMenuInfo() {
    //사용자 정보조회
    const _menuInfo = await getMenu()
    menuInfo.value = _menuInfo.data
  }

  return {
    isLoggedIn,
    userName,
    logInStatus,
    path,
    isAdmin,
    logIn,
    checkToken,
    refreshToken,
    logInErrorStatus,
    logInSuccess,
    setPath,
    logOut,
    getUserInfo,
    getMenuInfo,
    userInfo,
    menuInfo,
  }
})
