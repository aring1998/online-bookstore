export interface LoginApiParams {
  username: string
  password: string
}
export interface UpdateAccountApiParams {
  email?: string
  profilePhotoUrl?: string
}
export interface AccountApiRes {
  auth: number
  id: number
  username: string
  email: string
  profilePhotoUrl: string
  token: string
}
export interface RegisterApiParams extends LoginApiParams {
  email?: string
}
