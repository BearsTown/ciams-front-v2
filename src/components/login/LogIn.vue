<template>
  <div class="login">
    <el-form class="login-form" :model="loginForm" :rules="rules" ref="formRef">
      <el-form-item prop="username">
        <el-input
          v-model="loginForm.username"
          placeholder="아이디"
          ref="usernameInput"
          maxlength="20"
        >
          <template #prepend>
            <el-icon>
              <User />
            </el-icon>
          </template>
        </el-input>
      </el-form-item>

      <el-form-item prop="password">
        <el-input
          v-model="loginForm.password"
          placeholder="비밀번호"
          type="password"
          ref="passwordInput"
          maxlength="50"
        >
          <template #prepend>
            <el-icon>
              <Lock />
            </el-icon>
          </template>
        </el-input>
      </el-form-item>

      <el-form-item style="float: right">
        <el-button type="primary" native-type="submit" block @click.prevent="login"
          >로그인
        </el-button>

        <!-- <el-button block @click.prevent="closeDialog">취소</el-button> -->
      </el-form-item>
    </el-form>
    <CustomLoading v-if="loading" />
  </div>
</template>

<script setup lang="ts">
  import { onMounted, reactive, ref } from 'vue'
  import { useAuthStore } from '@/stores/auth'
  import { FormInstance, FormRules } from 'element-plus'
  import CommonUtil from '@/utils/commonUtil'
  import CustomLoading from '@/components/CustomLoading.vue'

  const emits = defineEmits<{
    (e: 'close-handler', type: string): void
  }>()

  const formRef = ref<FormInstance>()

  const loginForm = reactive<{
    username: string
    password: string
  }>({
    username: '',
    password: '',
  })

  const rules = reactive<FormRules>({
    username: [
      {
        required: true,
        message: '아이디를 입력하세요.',
        trigger: 'blur',
      },
    ],
    password: [
      {
        required: true,
        message: '비밀번호를 입력하세요.',
        trigger: 'blur',
      },
    ],
  })

  const loading = ref(false)

  function login() {
    formRef.value?.validate((valid) => {
      if (valid) {
        const store = useAuthStore()
        loading.value = true
        // let loading = CommonUtil.loading('')

        store
          .logIn(loginForm)
          .then(() => {
            closeDialog()
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
            loading.value = false
          })
      } else {
        return false
      }
    })
  }

  function closeDialog() {
    emits('close-handler', 'login')
  }

  onMounted(() => {
    //글로벌변수 호출 확인
  })
</script>

<style scoped>
  .login {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
  }

  .login-button {
    width: 100%;
  }

  .login-form {
    margin: auto;
    width: 100%;
    /* box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1); */
    /* background-color: white; */
    padding: 10px;
  }

  .login-form a {
    width: 100%;
    text-decoration: none;
  }

  /* .el-button--primary {
background: #339578;
border-color: #549280;
} */
</style>
