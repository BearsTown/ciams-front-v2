import { ref } from 'vue'
import { defineStore } from 'pinia'
import JSEncrypt from 'jsencrypt'

import User from '@/api/app/user/model'
import { getRsaPublicKey } from '@/api/auth'
import { useAuthStore } from '@/stores/auth'
import { changePassword as apiChangePassword, register as apiRegister } from '@/api/app/user'

export const useUserStore = defineStore('userStore', () => {
  const userInfo = ref()
  async function register(user) {
    const { data: rsa } = await getRsaPublicKey()
    const encrypt = new JSEncrypt()
    encrypt.setPublicKey(rsa)
    user.password = encrypt.encrypt(user.password)

    // const { data: result } = await apiRegister(user)
    return await apiRegister(user)
  }

  async function changePassword(param: User.PwdChange) {
    const auth = useAuthStore()
    const loginId = auth.userName

    const { data: rsa } = await getRsaPublicKey()
    const encrypt = new JSEncrypt()
    encrypt.setPublicKey(rsa)

    param.loginId = loginId
    param.curPassword = encrypt.encrypt(param.curPassword).toString()
    param.newPassword = encrypt.encrypt(param.newPassword).toString()

    return await apiChangePassword(param)
  }

  return {
    register,
    changePassword,
    userInfo,
  }
})
