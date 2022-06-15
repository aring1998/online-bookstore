<script setup lang="ts">
import { AccountApiRes, UpdateAccountApiParams } from '@/components/top-bar/components/types/account'
import useStore from '@/store'
import { UploadApiRes } from '@/types/upload'
import api from '@/utils/api'
import { ref } from 'vue'
import { EditPen } from '@element-plus/icons-vue'
import Receiving from './components/Receiving.vue'
async function uploadSuccess(res: UploadApiRes) {
  if (res.code === 0) {
    const userInfo = await api.post<UpdateAccountApiParams, AccountApiRes>('user/update', {
      profilePhotoUrl: res.data.fileUrl
    })
    useStore().user().userInfo.profilePhotoUrl = userInfo.data?.profilePhotoUrl
  }
}

const tabName = ref('account')
</script>

<template>
  <div class="profile-page base-wrap">
    <div class="main-info">
      <div class="img-wrap" v-loading="useStore().common().loading">
        <img :src="useStore().user().userInfo?.profilePhotoUrl || 'https://source.aring.cc/upload/1655174261683-190412010715630.jpg'" alt="" />
        <div class="upload-tips">
          <el-upload
            class="avatar-uploader"
            action="https://online-bookstore.aring.cc/api/upload"
            :headers="{
              token: useStore().user().token
            }"
            :show-file-list="false"
            :on-success="uploadSuccess"
            accept=".jpg, .jpeg, .png, .gif"
          >
            <template #trigger>
              <span>点击上传</span>
            </template>
          </el-upload>
        </div>
      </div>
      <div class="desc">
        <p>{{ useStore().user().userInfo.username }}</p>
        <p style="font-size: 12px">{{ useStore().user().userInfo.email }}</p>
      </div>
    </div>
    <div class="other-info">
      <el-tabs v-model="tabName">
        <el-tab-pane label="账号信息" name="account">
          <div class="form-item">
            <label for="email">邮箱</label>
            <el-input name="email" v-model="useStore().user().userInfo.email" disabled>
              <template #append>
                <el-button :icon="EditPen" />
              </template>
            </el-input>
          </div>
          <div class="form-item">
            <label for="email">登录密码</label>
            <el-input name="email" value="123456" type="password" disabled>
              <template #append>
                <el-button :icon="EditPen" />
              </template>
            </el-input>
          </div>
        </el-tab-pane>
        <el-tab-pane label="收货地址" name="receiving">
          <Receiving></Receiving>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.profile-page {
  display: flex;
  padding-top: 30px;
  .main-info {
    display: flex;
    flex-flow: column;
    margin-right: 30px;
    min-width: 200px;
    align-items: center;
    .img-wrap {
      border-radius: 50%;
      border: 2px gray solid;
      overflow: hidden;
      position: relative;
      height: 100px;
      width: 100px;
      cursor: pointer;
      &:hover {
        .upload-tips {
          display: flex;
        }
      }
      img {
        width: 100%;
      }
      .upload-tips {
        display: none;
        position: absolute;
        height: 100%;
        width: 100%;
        background-color: rgba($color: #000000, $alpha: 0.6);
        top: 0;
        left: 0;
        color: #fff;
        font-size: 14px;
        justify-content: center;
        align-items: center;
        span {
          padding: 10px;
        }
        input {
          display: none;
        }
      }
    }
    .desc {
      text-align: center;
    }
  }
  .other-info {
    .form-item {
      margin: 10px 0;
      label {
        display: inline-block;
        margin-bottom: 4px;
      }
    }
  }
}
</style>
