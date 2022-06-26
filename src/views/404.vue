<template>
  <div class="404" style="text-align: center">
    <meta http-equiv="refresh" content="3; URL=/dashboard" />
    <br />
    <h1>404</h1>
    <br />
    <h2>页面找不到了</h2>
    <br />
    <div class="picture">
      <img src="@/assets/logo-wide.png" alt="logo-wide" />
    </div>
    <br />
    <h3>3秒后自动跳转到首页......</h3>
  </div>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
.picture {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;

  img {
    height: 100%;
  }
}
</style>
