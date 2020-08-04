// Nuxt.js 配置文件
module.exports = {
  router: {
    // 应用的根 URL。举个例子，如果整个单页面应用的所有资源可以通过 /app/ 来访问，那么 base 配置项的值需要设置为 '/app/'
    base: '/app/',
    // routes: 一个数组，路由配置表
    // resolve: 解析路由组件路劲
    extendRoutes(routes, resolve) {
      routes.push({
        name: '/hello',
        path: 'hello',
        component: resolve(__dirname, 'pages/about.vue') // 匹配到 /hello 时加载 about.vue 组件
      })
    }
  }
}