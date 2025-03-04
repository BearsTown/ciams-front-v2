<template>
  <div id="join">
    <header>
      <h1 class="logo">
        <a href="/">{{ title }}</a>
      </h1>
    </header>
    <div class="container">
      <div class="title">회원가입</div>
      <div class="form">
        <div class="form-group">
          <div class="form-row">
            <label class="form-label required">아이디</label>
            <span class="required-text">(<b>*</b>)표시 필수 입력</span>
          </div>
          <div :class="validState['id'] ? 'has-error' : ''">
            <!-- error validation class: has-error -->
            <input
              type="text"
              v-model="user.id"
              maxlength="20"
              class="customInput"
              placeholder="아이디를 입력해주세요"
              @blur="validate('id', true)"
            />
            <div class="form-feedback" v-if="validate('id') != ''">
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
              <span class="feedback-text">{{ validate('id') }}</span>
            </div>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label required">이름</label>
          <div :class="validState['name'] ? 'has-error' : ''">
            <!-- error validation class: has-error -->
            <input
              type="text"
              v-model="user.name"
              maxlength="20"
              class="customInput"
              placeholder="이름을 입력해주세요"
              @blur="validate('name', true)"
            />
            <div class="form-feedback" v-if="validate('name') != ''">
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
              <span class="feedback-text">{{ validate('name') }}</span>
            </div>
          </div>
        </div>

        <!-- error validation class: has-error -->
        <!-- success validation class: has-success -->
        <div :class="validState['password'] ? 'form-group pw has-error' : 'form-group pw'">
          <label class="form-label required">비밀번호</label>
          <div class="pw-wrap">
            <input
              type="password"
              v-model="user.password"
              maxlength="50"
              class="customInput"
              placeholder="비밀번호를 입력해주세요"
              @blur="validate('password', true)"
            />
            <!-- <button type="button" class="btn-pw"> -->
            <!-- <img src="../assets/img/ico_pwHide.png" alt="비밀번호숨김" /> -->
            <!-- <img src="../assets/img/ico_pwOpen.png" alt="비밀번호보임" /> -->
            <!-- </button> -->
          </div>

          <label class="form-label required">비밀번호 확인</label>
          <div class="pw-wrap">
            <input
              type="password"
              v-model="user.checkPass"
              maxlength="50"
              class="customInput"
              placeholder="비밀번호를 재입력하세요"
              @blur="validate('checkPass', true)"
            />
            <!-- <button type="button" class="btn-pw"> -->
            <!-- <img src="../assets/img/ico_pwHide.png" alt="비밀번호숨김" /> -->
            <!-- <img src="../assets/img/ico_pwOpen.png" alt="비밀번호보임" /> -->
            <!-- </button> -->
          </div>

          <!-- has-error -->
          <div class="form-feedback" v-if="validate('password') != ''">
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
            <span class="feedback-text">{{ validate('password') }}</span>
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

        <div :class="validState['email'] ? 'form-group has-error' : 'form-group'">
          <label class="form-label">이메일</label>
          <div>
            <input
              type="email"
              v-model="user.email"
              maxlength="50"
              class="customInput"
              placeholder="이메일 주소를 입력해주세요"
              @blur="validate('email', true)"
            />

            <!-- has-error -->
            <div class="form-feedback" v-if="validate('email') != ''">
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
              <span class="feedback-text">{{ validate('email') }}</span>
            </div>
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

        <button type="button" class="btn-join" @click="addUser">회원가입</button>
        <!-- 버튼 활성화 class : 'active' -->
        <button type="button" class="btn-cancel" @click="goHome()">취소</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onBeforeMount, reactive, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { FormInstance } from 'element-plus'

  import { useUserStore } from '@/stores/user'
  import commonUtil from '@/utils/commonUtil'
  import { getConfig } from '@/api/app/config'

  interface UserSign {
    id: string
    name: string
    email: string
    password: string
    checkPass: string
  }

  const emits = defineEmits<{
    (e: 'close-handler', type: string): void
  }>()

  const router = useRouter()
  const store = useUserStore()

  const userRef = ref<FormInstance>()
  const user = reactive<UserSign>({
    id: '',
    name: '',
    password: '',
    checkPass: '',
    email: '',
  })

  const validState = reactive({
    id: false,
    name: false,
    password: false,
    email: false,
  })

  function validate(key, init?: boolean) {
    const regExp_id = /^[_A-Za-z0-9-]{5,20}$/
    const regExp_password = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,20}$/
    const regExp_email = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}$/i

    if (init) validState[key] = init

    let value = user[key].trim()
    if ('id' == key && validState[key]) {
      if (value.length == 0) return '필수 정보입니다'
      else if (!regExp_id.test(value))
        return '5~20자의 영문, 숫자와 특수기호(_),(-)만 사용 가능합니다.'
      else validState[key] = false
    } else if ('name' == key && validState[key]) {
      if (value.length == 0) return '필수 정보입니다'
      else validState[key] = false
    } else if ('password' == key && validState[key]) {
      if (value.length == 0) return '필수 정보입니다'
      else if (!regExp_password.test(value))
        return '비밀번호는 8~20자리 영문 대·소문자, 숫자 및 특수문자를 조합해주세요.'
      else if (user['checkPass'].trim().length == 0) return '필수 정보입니다'
      else if (!(user['checkPass'] == user[key])) return '새 패스워드와 일치하지 않습니다.'
      else validState[key] = false
    } else if ('email' == key && validState[key]) {
      if (value.length == 0) return '필수 정보입니다'
      else if (!regExp_email.test(value)) return '이메일 주소 형식을 확인하십시오.'
      else validState[key] = false
    }
    return ''
  }

  function addUser() {
    let valid = ''
    Object.keys(user).forEach((key) => {
      valid += validate(key, true)
    })
    if (valid == '') {
      store
        .register(user)
        .then(() => {
          commonUtil.successMessage('가입되었습니다.')
          goHome()
        })
        .catch((err) => {
          if (err.response.status === 409) {
            commonUtil.errorMessage(err.response.data)
          } else {
            commonUtil.errorMessage('회원가입 처리 중 에러가 발생했습니다.')
          }
        })
    } else {
      return false
    }
  }

  function reset() {
    Object.keys(user).forEach((key) => {
      user[key] = ''
    })
    Object.keys(validState).forEach((key) => {
      validState[key] = false
    })
  }

  function goHome() {
    router.push('/')
  }

  const title = ref<string>()

  onBeforeMount(async () => {
    const { data } = await getConfig('SYSTEM_NAME_KOR')
    if (data) title.value = `${data.confValue}`
  })
</script>

<style scoped>
  @import '@/assets/css/joinPage.css';

  .container {
    padding-top: 88px !important;
  }

  .container .title {
    padding-bottom: 25px !important;
    margin-bottom: 40px !important;
  }

  .container .form .form-group {
    margin-top: 12px !important;
  }

  .container .form .form-group:not(:first-child) {
    margin-top: 12px !important;
  }
</style>
