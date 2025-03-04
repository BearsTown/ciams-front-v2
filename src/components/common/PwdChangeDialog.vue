<template>
  <CustomModal @close="closeDialog" v-if="dialogVisible" class="pwChangeModal">
    <div class="customModal-header">
      <span class="modal-title">비밀번호 변경</span>
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
    </div>
    <div class="form">
      <div :class="validate1('currentPwd') != '' ? 'form-group has-error' : 'form-group'">
        <!-- error validation class: has-error -->
        <span class="required-text">(<b>*</b>)표시 필수 입력</span>
        <label class="form-label required pw">현재 비밀번호 </label>
        <input
          type="password"
          class="customInput"
          placeholder="현재 비밀번호를 입력해 주세요"
          v-model="pwdForm.currentPwd"
          autocomplete="off"
          maxlength="50"
          @keyup="validate1('currentPwd')"
        />

        <div class="form-feedback" v-if="validate1('currentPwd') != ''">
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
          <span class="feedback-text">{{ validate1('currentPwd') }}</span>
        </div>
      </div>

      <!-- error validation class: has-error -->
      <!-- success validation class: has-success -->
      <div :class="validate2('pass') != '' ? 'form-group has-error' : 'form-group'">
        <!-- error validation class: has-error -->
        <label class="form-label required">새 비밀번호</label>
        <div class="pw-wrap">
          <input
            type="password"
            class="customInput"
            placeholder="새 비밀번호를 입력해 주세요"
            v-model="pwdForm.pass"
            autocomplete="off"
            maxlength="50"
            @keyup="validate2('pass')"
          />
          <!-- <button type="button" class="btn-pw"> -->
          <!-- <img src="@/assets/img/ico_pwHide.png" alt="비밀번호숨김" /> -->
          <!-- <img src="../assets/img/ico_pwOpen.png" alt="비밀번호보임" /> -->
          <!-- </button> -->
        </div>

        <div class="form-feedback" v-if="validate2('pass') != ''">
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
          <span class="feedback-text">{{ validate2('pass') }}</span>
        </div>

        <!-- has-success -->
        <!-- <div class="form-feedback">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M9 16.6667C13.2342 16.6667 16.6667 13.2342 16.6667 9C16.6667 4.76582 13.2342 1.33333 9 1.33333C4.76582 1.33333 1.33333 4.76582 1.33333 9C1.33333 13.2342 4.76582 16.6667 9 16.6667ZM9 18C13.9706 18 18 13.9706 18 9C18 4.02944 13.9706 0 9 0C4.02944 0 0 4.02944 0 9C0 13.9706 4.02944 18 9 18Z" fill="#58AA47"/>
              <path d="M5.40137 8.69531L8.28137 11.6953L12.6014 7.19531" stroke="#58AA47" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span class="feedback-text">비밀번호가 일치합니다.</span>
          </div>  -->
      </div>

      <div :class="validate3('checkPass') != '' ? 'form-group has-error' : 'form-group'">
        <!-- error validation class: has-error -->
        <label class="form-label required">새 비밀번호 확인</label>
        <input
          type="password"
          class="customInput"
          placeholder="비밀번호를 재입력하세요"
          v-model="pwdForm.checkPass"
          autocomplete="off"
          maxlength="50"
          @keyup="validate3('checkPass')"
        />

        <div class="form-feedback" v-if="validate3('checkPass') != ''">
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
          <span class="feedback-text">{{ validate3('checkPass') }}</span>
        </div>
      </div>

      <button type="button" class="btn-reload" @click="reset">
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clip-path="url(#clip0_585_83483)">
            <path
              d="M9.99967 5.0026V7.5026L13.333 4.16927L9.99967 0.835938V3.33594C6.31634 3.33594 3.33301 6.31927 3.33301 10.0026C3.33301 11.3109 3.71634 12.5276 4.36634 13.5526L5.58301 12.3359C5.20801 11.6443 4.99967 10.8443 4.99967 10.0026C4.99967 7.24427 7.24134 5.0026 9.99967 5.0026ZM15.633 6.4526L14.4163 7.66927C14.783 8.36927 14.9997 9.16094 14.9997 10.0026C14.9997 12.7609 12.758 15.0026 9.99967 15.0026V12.5026L6.66634 15.8359L9.99967 19.1693V16.6693C13.683 16.6693 16.6663 13.6859 16.6663 10.0026C16.6663 8.69427 16.283 7.4776 15.633 6.4526V6.4526Z"
              fill="#737A89"
            />
          </g>
          <defs>
            <clipPath id="clip0_585_83483">
              <rect width="20" height="20" fill="white" />
            </clipPath>
          </defs>
        </svg>
        초기화
      </button>
      <button type="button" class="btn-apply" @click="changePasswordF">비밀번호 변경</button>
      <button type="button" class="btn-apply cancel" @click="emits('close-dialog')">취소</button>
    </div>
  </CustomModal>
</template>
<script setup lang="ts">
  import { toRefs, ref, reactive, computed } from 'vue'
  import { useUserStore } from '@/stores/user'
  import { FormInstance, FormRules } from 'element-plus'
  import commonUtil from '@/utils/commonUtil'

  import CustomModal from '@/components/CustomModal.vue'

  interface ChangePwd {
    currentPwd: string
    pass: string
    checkPass: string
  }

  const props = withDefaults(
    defineProps<{
      isVisible: boolean
    }>(),
    {
      isVisible: false,
    },
  )

  const dialogVisible = computed({
    get() {
      return props.isVisible
    },
    set(isVisible) {
      return isVisible
    },
  })

  const emits = defineEmits<{
    (e: 'close-dialog'): void
  }>()

  const pwdForm = reactive<ChangePwd>({
    currentPwd: '',
    pass: '',
    checkPass: '',
  })

  const store = useUserStore()
  const passwdRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,20}$/

  function validate1(key) {
    if (pwdForm[key].trim().length == 0) {
      return '필수 정보입니다'
    } else {
      return ''
    }
  }

  function validate2(key) {
    if (pwdForm[key].trim().length == 0) {
      return '필수 정보입니다'
    } else if (!passwdRegex.test(pwdForm[key])) {
      return '비밀번호는 8~20자리 영문 대·소문자, 숫자 및 특수문자를 조합해주세요.'
    } else {
      return ''
    }
  }

  function validate3(key) {
    if (pwdForm[key].trim().length == 0) {
      return '필수 정보입니다'
    } else if (!(pwdForm['pass'] == pwdForm[key])) {
      return '새 패스워드와 일치하지 않습니다.'
    } else {
      return ''
    }
  }

  function changePasswordF() {
    let valid = validate1('currentPwd') + validate2('pass') + validate3('checkPass') == ''
    if (valid) {
      const obj = {
        curPassword: pwdForm.currentPwd,
        newPassword: pwdForm.pass,
      }

      store
        .changePassword(obj)
        .then(() => {
          commonUtil.successMessage('패스워드가 변경되었습니다.')
          emits('close-dialog')
        })
        .catch((err) => {
          console.log(err)
          if (err.response.status === 401) {
            commonUtil.errorMessage('현재 패스워드가 불일치 합니다.')
          } else {
            commonUtil.errorMessage('회원가입 처리 중 에러가 발생했습니다.')
          }
        })
    } else {
      return false
    }
  }

  function reset() {
    Object.keys(pwdForm).forEach((key) => {
      pwdForm[key] = ''
    })
  }

  function closeDialog() {
    reset()
    emits('close-dialog')
  }
</script>
