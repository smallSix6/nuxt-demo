<template>
<div>
<p>About Page</p>
<!-- a 链接，刷新导航，走服务端渲染 -->
<h2>a链接</h2>
<a href="/">首页</a>

<!-- router-link  导航连接组件 -->
<h2>router-link</h2>
<router-link to='/'>首页</router-link>

<!-- 编程式导航 -->
<button @click="onClick">首页</button>
</div>
</template>

<script>
export default {
name: "aboutPage",
methods: {

  onClick() {
    this.$router.push('/')
  }
}
}
</script>

<style scoped>
</style>