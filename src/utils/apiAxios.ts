import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig } from 'axios'

export abstract class AbstractApiAxios<T> {
  private readonly axiosInstance: AxiosInstance

  protected constructor(options: AxiosRequestConfig) {
    this.axiosInstance = axios.create(options)
  }

  getAxios(): AxiosInstance {
    return this.axiosInstance
  }

  get<T>(url: string, config: AxiosRequestConfig = {}): Promise<T> {
    return this.axiosInstance.get(url, config)
  }

  post<T>(url: string, data?: object | string, config: AxiosRequestConfig = {}): Promise<T> {
    return this.axiosInstance.post(url, data, config)
  }

  put<T>(url: string, data?: object | string, config: AxiosRequestConfig = {}): Promise<T> {
    return this.axiosInstance.put(url, data, config)
  }

  delete<T>(url: string, config: AxiosRequestConfig = {}): Promise<T> {
    return this.axiosInstance.delete(url, config)
  }
}
