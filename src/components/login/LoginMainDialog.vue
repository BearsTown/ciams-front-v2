<template>
  <div class="loginModal" :class="{ active: dialogVisible }">
    <button type="button" class="btn-close" @click="emits('close-dialog')">
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M1 1L13 13" stroke="black" stroke-width="2" stroke-linecap="round" />
        <path d="M13 1L0.999999 13" stroke="black" stroke-width="2" stroke-linecap="round" />
      </svg>
    </button>

    <div class="form">
      <div :class="valid ? 'form-group' : 'form-group has-error'">
        <!-- error validation class: has-error -->
        <label class="form-label">아이디</label>
        <input
          type="text"
          class="customInput"
          placeholder="아이디를 입력해 주세요"
          v-model="loginForm.username"
          ref="usernameInput"
          maxlength="20"
        />
        <label class="form-label">비밀번호</label>
        <div class="pw-wrap">
          <input
            type="password"
            class="customInput"
            placeholder="비밀번호를 입력해 주세요"
            v-model="loginForm.password"
            ref="passwordInput"
            maxlength="50"
            block
            @keyup.enter="login"
          />
          <button type="button" class="btn-pw">
            <!-- <img src="@/assets/img/ico_pwHide.png" alt="비밀번호숨김" /> -->
            <!-- <img src="../assets/img/ico_pwOpen.png" alt="비밀번호보임" /> -->
          </button>
        </div>

        <div class="form-feedback">
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="9" cy="9" r="8.4" stroke="#D71920" stroke-width="1.2" />
            <path
              d="M6.33203 6.67188L11.6654 12.0052"
              stroke="#D71920"
              stroke-width="1.2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M11.668 6.67188L6.33464 12.0052"
              stroke="#D71920"
              stroke-width="1.2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <span class="feedback-text">
            아이디(로그인 전용 아이디) 또는 비밀번호를 잘못 입력했습니다.
            <br />
            입력하신 내용을 다시 확인해주세요.
          </span>
        </div>
      </div>
      <button type="button" class="btn-login" @click="login">로그인</button>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { useAuthStore } from '@/stores/auth'
  import { computed, reactive, ref } from 'vue'

  import CommonUtil from '@/utils/commonUtil'

  import { useGlobalStore } from '@/stores/app'

  const props = withDefaults(
    defineProps<{
      isVisible: boolean
    }>(),
    {
      isVisible: false,
    },
  )

  const emits = defineEmits<{
    (e: 'close-dialog'): void
  }>()

  const dialogVisible = computed({
    get() {
      return props.isVisible
    },
    set(isVisible) {
      return isVisible
    },
  })

  const valid = ref(true)

  const loginForm = reactive<{
    username: string
    password: string
  }>({
    username: '',
    password: '',
  })

  function init() {
    loginForm.username = ''
    loginForm.password = ''
  }

  function validationCheck() {
    let result = false

    if (loginForm.username.trim().length != 0 && loginForm.password.trim().length != 0) {
      result = true
    }

    return result
  }

  function login() {
    valid.value = validationCheck()
    if (valid.value) {
      const store = useAuthStore()
      // let loading = CommonUtil.loading('')
      useGlobalStore().loadingOn()
      store
        .logIn(loginForm)
        .then(() => {
          init()
          emits('close-dialog')
        })
        .catch((err) => {
          loginForm.password = ''

          if (
            err.response.data.error_description &&
            err.response.data.error_description.indexOf('locked') > -1
          ) {
            CommonUtil.errorMessage('사용자 계정이 잠겼습니다. 관리자에게 문의하십시오.')
          } else if (
            err.response.data.error_description &&
            err.response.data.error_description.indexOf('account approval') > -1
          ) {
            CommonUtil.errorMessage('관리자 승인이 필요한 계정입니다.')
          } else if (
            err.response.data.error_description &&
            err.response.data.error_description.indexOf('Invalid password') > -1
          ) {
            CommonUtil.errorMessage('패스워드가 일치하지 않습니다.')
          } else if (
            err.response.data.error_description &&
            err.response.data.error_description.indexOf('LoginIdNotFound') > -1
          ) {
            CommonUtil.errorMessage('일치하는 사용자 정보가 없습니다.')
          } else {
            CommonUtil.errorMessage('로그인 처리 중 에러가 발생했습니다.')
          }
        })
        .finally(() => {
          // loading.close()
          useGlobalStore().loadingOff()
        })
    } else {
      return false
    }
  }
</script>
<style scoped>
  @import '@/assets/css/mainPage.css';
</style>
