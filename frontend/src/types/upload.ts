export interface UploadApiRes {
  code: number
  data: {
    fileName: string
    fileSize: number
    fileUrl: string
  }
  message: string
}
