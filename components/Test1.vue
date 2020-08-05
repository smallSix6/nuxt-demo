<template>
<div>
<h1>test1Page</h1>
<!-- <p>{{foo}}</p> -->
</div>
</template>

<script>
export default {
  async asyncData (context) {
    // 可以访问到 context 对象
    console.log(context.params)
    return {
      // 这个数据对象在子组件中使用的话会报错
      foo: 'bar'
    }
  }
}
</script>

<style scoped>
</style>