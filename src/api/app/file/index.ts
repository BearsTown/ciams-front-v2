import { AxiosRequestConfig } from 'axios'

import { ResultData } from '@/api/app/model'
import { ciamsAxiosInstance as http } from '@/api/app'
import FileDto, { File } from '@/api/app/file/model'

const prefix = '/api/v1/file'

export function downLoadFile(id: string) {
  const config: AxiosRequestConfig = {
    responseType: 'blob',
  }
  return http.get<ResultData<BlobPart>>(`${prefix}/down/${id}`, config)
}

export function searchFileList(params: FileDto.Search.Params) {
  const config: AxiosRequestConfig = {
    params,
  }
  return http.get<ResultData<FileDto.Search.Result>>(`${prefix}/list`, config)
}

export function uploadTempFile(data: FormData) {
  const config: AxiosRequestConfig = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }
  return http.post<ResultData<FileDto.TempFile[]>>(`${prefix}/temp`, data, config)
}

export function deleteFile(id: string) {
  return http.get<ResultData<FileDto.Search.Result>>(`${prefix}/delete/${id}`)
}

export function pdfFile(id: string) {
  const config: AxiosRequestConfig = {
    responseType: 'blob',
  }
  return http.get<ResultData<Blob>>(`${prefix}/pdf/${id}`, config)
}

export function uploadEditorImage(data: FormData) {
  const config: AxiosRequestConfig = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }
  return http.post<ResultData<File[]>>(`${prefix}/upload-editor`, data, config)
}
