<script setup lang="ts">
import api from '@/utils/api'
import { reactive, ref, watch } from 'vue'
import { Md5 } from 'ts-md5'
import useStore from '@/store'
import { LoginApiParams, RegisterApiParams, AccountApiRes } from './types/account'
import { FormInstance } from 'element-plus'
import pattern from '@/utils/pattern'
const active = ref(0)
const emits = defineEmits(['show'])
const props = defineProps({
  visiable: {
    type: Boolean,
    defult: false
  }
})
const loginFormRef = ref<FormInstance>()
const loginForm = reactive({
  username: 'admin',
  password: '123456'
})
const loginFormRules = reactive({
  username: [
    { required: true, message: '请输入' },
    { min: 4, max: 32, message: '长度在4~32' }
  ],
  password: [
    { required: true, message: '请输入' },
    { min: 6, max: 32, message: '长度在6~32' }
  ]
})
async function login(FormEl: FormInstance) {
  FormEl.validate(async vaild => {
    if (vaild) {
      const { data } = await api.post<LoginApiParams, AccountApiRes>('user/login', {
        ...loginForm,
        password: Md5.hashStr(loginForm.password)
      })
      success(data)
    }
  })
}

const registerFormRef = ref<FormInstance>()
const registerForm = reactive({
  username: '',
  password: '',
  email: ''
})
const registerFormRules = reactive({
  ...loginFormRules,
  email: [
    {
      pattern: pattern.email,
      message: '邮箱格式不正确'
    }
  ]
})
async function register(FormEl: FormInstance) {
  FormEl.validate(async vaild => {
    if (vaild) {
      const { data } = await api.post<RegisterApiParams, AccountApiRes>('user/register', {
        ...registerForm,
        password: Md5.hashStr(registerForm.password)
      })
      success(data)
    }
  })
}

function success(data: AccountApiRes) {
  useStore().user().userInfo = data
  useStore().user().token = data.token
  emits('show')
  localStorage.setItem('token', data.token)
}

watch(props, (val) => {
  if (val.visiable) {
    document.documentElement.onkeydown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !active.value) {
        login(loginFormRef.value!)
      }
    }
  } else document.documentElement.onkeydown = null
})
</script>

<template>
  <el-dialog v-model="visiable" v-bind="$attrs" width="30vw">
    <div class="account-wrap" v-loading="useStore().common().loading">
      <div class="account-bar">
        <span :class="{ active: !active }" @click="active = 0">登录</span>
        <span> / </span>
        <span :class="{ active: active }" @click="active = 1">注册</span>
      </div>
      <el-form :model="loginForm" :rules="loginFormRules" label-width="70px" v-show="!active" ref="loginFormRef">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="loginForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="loginForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width: 120px" @click="login(loginFormRef!)">登 录</el-button>
        </el-form-item>
      </el-form>
      <el-form :model="registerForm" :rules="registerFormRules" label-width="70px" v-show="active" ref="registerFormRef">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="registerForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="registerForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="registerForm.email"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width: 120px" @click="register(registerFormRef!)">注 册</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-dialog>
</template>

<style lang="scss" scoped>
.account-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-flow: column nowrap;
  .account-bar {
    font-size: 26px;
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    color: #666;
    .active {
      font-weight: 900;
    }
    span {
      cursor: pointer;
      &:nth-child(2) {
        margin: 0 20px;
        cursor: unset;
      }
    }
  }
}
</style>
