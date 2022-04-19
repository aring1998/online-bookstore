<template>
  <div class="footer-bar-wrap">
    <div class="footer-bar">
      <div class="line"></div>
      <p>该站点API免费开放，欢迎自取训练</p>
      <a href="https://online-bookstore.aring.cc/swagger" target="_blank">访问接口文档</a>
      <a href="https://gitee.com/aring1998/online-bookstore" target="_blank">访问项目源码</a>
    </div>
  </div>
</template>

<style lang="scss">
.footer-bar-wrap {
  font-size: 12px;
  padding-bottom: 30px;
  margin-top: 20px;
  .footer-bar {
    display: flex;
    flex-flow: column nowrap;
    max-width: $max-width;
    margin: 0 auto;
    box-sizing: border-box;
    padding: 0 30px;
    .line {
      height: 1px;
      width: 100%;
      margin: 0 auto;
      background-color: #a0a0a080;
      margin-bottom: 20px;
    }
    p {
      color: #888;
      text-align: right;
      margin: 4px 0;
    }
    a {
      text-align: right;
      margin: 4px 0;
      text-decoration: none;
      &:hover {
        text-decoration: underline;
      }
    }
  }
}

@media screen and (max-width: 480px) {
  .footer-bar-wrap {
    .footer-bar {
      padding: 0 10px;
    }
  }
}
</style>