import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import useStore from '@/store'
import { ElMessage } from 'element-plus'

interface Res<T> {
  code: number
  data: T
  message: string
}

// 创建axios实例
const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 30000,
  validateStatus: status => {
    // 允许返回所有状态码，不会遇到错误就停止
    return status >= 200 && status <= 600
  }
})

// 请求拦截
instance.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    useStore().common().loading = true
    config.headers && (config.headers.token = useStore().user().token)
    return config
  },
  (err: AxiosError) => {
    console.log(err)
  }
)
// 响应拦截
instance.interceptors.response.use(
  (res: AxiosResponse) => {
    useStore().common().loading = false
    if (res.status < 200 || res.status >= 400) {
      ElMessage.error(`网络请求错误，错误：${res.statusText}`)
      throw new Error(res.statusText)
    }
    if (res.data.code !== 0) {
      ElMessage.error(res.data.message || '网络请求错误')
      throw new Error(res?.data?.message)
    } else {
      if (res.data.message) ElMessage.success(res.data.message)
    }
    return res
  },
  (err: AxiosError) => {
    console.error(err)
  }
)
// 封装get/post方法
const api = {
  async get<T, K>(url: string, params?: T): Promise<Res<K>> {
    const res = await instance.get<Res<K>>(url, { params })
    return res.data
  },
  async post<T, K>(url: string, data?: T): Promise<Res<K>> {
    const res = await instance.post(url, data)
    return res.data
  }
}

export default api
