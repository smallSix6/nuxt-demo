## Vuex 数据流管理及Vue.js 服务端渲染（SSR）项目见：<https://github.com/smallSix6/fed-e-task-liuhuijun/tree/master/fed-e-task-03-03>

### 任务一：Vuex 状态管理
#### 1、课程目标
+ Vue 组件间通信方式回顾
+ Vuex 核心概念和基本使用回顾
+ 购物车案例
+ 模拟实现 Vuex

#### 2、组件内的状态管理流程
+ 状态管理：
  + state：驱动应用的数据源
  + view：以声明方式将 state 映射到视图
  + actions：响应在 view 上的用户输入导致的状态变化

#### 3、组件间通信方式回顾
+ 四种通信方式：
  + 父组件给子组件传值
    + 子组件通过 props 接收数据
    + 父组件中给子组件通过相应属性传值
  + 子组件给父组件传值
    + 子组件通过 this.$emit(fn, data)
    + 父组件中给子组件通过 v-on:子组件emit的函数名=父组件函数名
  + 不相关组件传值
    + 通过事件中心 eventbus 触发和注册事件
    ```js
    import Vue from 'vue'
    export default new Vue()
    ```
    + 触发 eventsbus 中的事件
    ```js
    <template>
      <div>
        <h1>Event Bus Sibling01</h1>
        <div class="number" @click="sub">-</div>
        <input type="text" style="width: 30px; text-align: center" :value="value">
        <div class="number" @click="add">+</div>
      </div>
    </template>

    <script>
    import bus from './eventbus'

    export default {
      props: {
        num: Number
      },
      created () {
        this.value = this.num
      },
      data () {
        return {
          value: -1
        }
      },
      methods: {
        sub () {
          if (this.value > 1) {
            this.value--
            bus.$emit('numchange', this.value)
          }
        },
        add () {
          this.value++
          bus.$emit('numchange', this.value)
        }
      }
    }
    </script>

    <style>
    .number {
      display: inline-block;
      cursor: pointer;
      width: 20px;
      text-align: center;
    }
    </style>
    ```
    + 注册事件
    ```js
    <template>
      <div>
        <h1>Event Bus Sibling02</h1>

        <div>{{ msg }}</div>
      </div>
    </template>

    <script>
    import bus from './eventbus'
    export default {
      data () {
        return {
          msg: ''
        }
      },
      created () {
        bus.$on('numchange', (value) => {
          this.msg = `您选择了${value}件商品`
        })
      }
    }
    </script>

    <style>

    </style>
    ```
  + 通过 ref 获取子组件
    + ref 两个作用
      + 在普通 HTML 标签上使用 ref，获取到的是 DOM
      ```js
      <template>
        <div>
          <h1>ref Child</h1>
          <input ref="input" type="text" v-model="value">
        </div>
      </template>

      <script>
      export default {
        data () {
          return {
            value: ''
          }
        },
        methods: {
          focus () {
            this.$refs.input.focus()
          }
        }
      }
      </script>

      ```
      + 在组件标签上使用 ref，获取到的是组件实例
      ```js
      <template>
        <div>
          <h1>ref Parent</h1>

          <child ref="c"></child>
        </div>
      </template>

      <script>
      import child from './04-Child'
      export default {
        components: {
          child
        },
        mounted () {
          this.$refs.c.focus()
          this.$refs.c.value = 'hello input'
        }
      }
      </script>
      ```

#### 4、Vuex 回顾
+ 什么是 Vuex:
  + Vuex 专门为 Vue.js 设计的状态管理库
  + Vuex 采用集中式的方式存储需要共享的状态
  + Vuex 的作用是进行状态管理，解决复杂组件通信，数据共享
  + Vuex 集成到了 devtools 中，提供了 time-travel 时光旅行历史回滚功能
+ 什么情况下使用 Vuex
  + 非必要的情况下不要使用 Vuex
  + 大型的单页应用程序
    + 多个视图依赖于同一状态
    + 来自不同视图的行为需要变更同一状态













#### 5、Vuex 核心概念回顾
+ Store： 是一个容器，包含着应用中的大部分状态，不能直接改变 store 中的状态，要通过 mutation 的方式改变状态。
+ State：是状态，保存在 Store 中，因为 Store 是唯一的，所以 State 也是唯一的，也称为单一状态树。这里的状态是响应式的。
+ Getter：是 Vuex 中的计算属性，方便从一个属性派生出其他的值。它内部会对计算的属性进行缓存，只有当依赖改变的时候，才会重新进行计算。
+ Mutation：状态的变换必须要通过提交 Mutation 来完成。
+ Action：和 MuTation 类似，不同的是 Action 可以进行异步的操作，内部改变状态的时候，都需要提交 Mutation。
+ Module：当 Store 太过臃肿时，可以将 Store 分成多个模块，每个模块里有 State、Mutation、Action、Getter，甚至是子模块。

#### 6、State
+ store/index.js 中定义 store
```js
export default new Vuex.Store({
  state: {
    count: 0,
    msg: 'Hello Vuex'
  },
  mutations: {},
  actions: {},
  modules: {}
})
```
+ App.vue 文件中引入 store
```js
<template>
  <div id="app">
    <h1>Vuex - Demo</h1>
    <!-- count：{{ count }} <br>
    msg: {{ msg }} -->
    <!-- count：{{ $store.state.count }} <br>
    msg: {{ $store.state.msg }} -->
    count: {{ num }} <br>
    msg: {{ message }}
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  computed: {
    // count: state => state.count
    // ...mapState(['count', 'msg'])
    ...mapState({ num: 'count', message: 'msg' })
  }
}
</script>
```
#### 7、Getter
+ 用法：
```js
export default new Vuex.Store({
  state: {
    count: 0,
    msg: 'Hello Vuex'
  },
  getters: {
    reverseMsg (state) {
      return state.msg.split('').reverse().join('')
    }
  },
  mutations: {},
  actions: {},
  modules: {}
})
```
```js
<template>
  <div id="app">
    <h1>Vuex - Demo</h1>
    reverseMsg: {{ reverseMsg }}
  </div>
</template>
<script>
import { mapState, mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters(['reverseMsg'])
  }
}
</script>
```

#### 8、Mutation
```js
<template>
  <div id="app">
    <h1>Vuex - Demo</h1>
    <!-- count：{{ count }} <br>
    msg: {{ msg }} -->
    <!-- count：{{ $store.state.count }} <br>
    msg: {{ $store.state.msg }} -->
    count: {{ num }} <br>
    msg: {{ message }}
    <h2>Getter</h2>
    reverseMsg: {{ reverseMsg }}
    <h2>Mutation</h2>
    <!-- <button @click="$store.commit('increate', 2)">Mutation</button> -->
    <button @click="increate(3)">Mutation</button>
  </div>
</template>
<script>
import { mapState, mapGetters, mapMutations } from 'vuex'
export default {
  computed: {
    // count: state => state.count
    // ...mapState(['count', 'msg'])
    ...mapState({ num: 'count', message: 'msg' }),
    ...mapGetters(['reverseMsg'])
  },
  methods: {
    ...mapMutations(['increate'])
  }
}
</script>
```
```js
export default new Vuex.Store({
  state: {
    count: 0,
    msg: 'Hello Vuex'
  },
  getters: {
    reverseMsg (state) {
      return state.msg.split('').reverse().join('')
    }
  },
  mutations: {
    increate (state, payload) {
      state.count += payload
    }
  },
  actions: {},
  modules: {}
})
```

#### 9、Action
```js
<template>
  <div id="app">
    <h1>Vuex - Demo</h1>
    count: {{ num }} <br>
    <!-- <div @click="$store.dispatch('increateAsync', 5)">Action</div> -->
    <div @click="increateAsync(6)">Action</div>
  </div>
</template>
<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
export default {
  computed: {
    // count: state => state.count
    // ...mapState(['count', 'msg'])
    ...mapState({ num: 'count', message: 'msg' }),
    ...mapGetters(['reverseMsg'])
  },
  methods: {
    ...mapMutations(['increate']),
    ...mapActions(['increateAsync'])
  }
}
</script>
```
```js
export default new Vuex.Store({
  state: {
    count: 0,
    msg: 'Hello Vuex'
  },
  getters: {
    reverseMsg (state) {
      return state.msg.split('').reverse().join('')
    }
  },
  mutations: {
    increate (state, payload) {
      state.count += payload
    }
  },
  actions: {
    increateAsync (context, payload) {
      setTimeout(() => {
        context.commit('increate', payload)
      }, 2000)
    }
  },
  modules: {}
})
```

#### 10、Module
```js
import Vue from 'vue'
import Vuex from 'vuex'
import products from './modules/products'
import cart from './modules/cart'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    count: 0,
    msg: 'Hello Vuex'
  },
  getters: {
    reverseMsg (state) {
      return state.msg.split('').reverse().join('')
    }
  },
  mutations: {
    increate (state, payload) {
      state.count += payload
    }
  },
  actions: {
    increateAsync (context, payload) {
      setTimeout(() => {
        context.commit('increate', payload)
      }, 2000)
    }
  },
  modules: {
    products,
    cart
  }
})
```
+ 在 store 中添加 modules 属性，开启多个子模块，products 中的代码如下：
```js
const state = {
  products: [
    { id: 1, title: 'iPhone 11', price: 8000 },
    { id: 2, title: 'iPhone 12', price: 10000 }
  ]
}
const getters = {}
const mutations = {
  setProducts (state, payload) {
    state.products = payload
  }
}
const actions = {}

export default {
  namespaced: true,  // 开启命名空间
  state,
  getters,
  mutations,
  actions
}
```
+ App.vue 中的代码如下：
```js
<template>
  <div id="app">
    <h1>Vuex - Demo</h1>
    <!-- count：{{ count }} <br>
    msg: {{ msg }} -->
    <!-- count：{{ $store.state.count }} <br>
    msg: {{ $store.state.msg }} -->
    count: {{ num }} <br>
    msg: {{ message }}
    <h2>Getter</h2>
    reverseMsg: {{ reverseMsg }}
    <h2>Mutation</h2>
    <!-- <button @click="$store.commit('increate', 2)">Mutation</button> -->
    <button @click="increate(3)">Mutation</button>
    <!-- <div @click="$store.dispatch('increateAsync', 5)">Action</div> -->
    <div @click="increateAsync(5)">Action</div>

    <h2>Module</h2>
    products: {{ products }} <br>
    <button @click="setProducts([])">Module</button>
  </div>
</template>
<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
export default {
  computed: {
    // count: state => state.count
    // ...mapState(['count', 'msg'])
    ...mapState({ num: 'count', message: 'msg' }),
    ...mapGetters(['reverseMsg']),
    ...mapState('products', ['products'])
  },
  methods: {
    ...mapMutations(['increate', 'setProducts']),
    ...mapActions(['increateAsync']),
    ...mapMutations('products', ['setProducts'])
  }
}
</script>
```

#### 11、Vuex 严格模式
+ Vuex 中的状态的更新要通过提交 mutation 来修改，但其实在组件中还可以通过`$store.state.msg`进行修改，从语法从面来说这是没有问题的，但是这破坏了 Vuex 的约定，如果在组件中直接修改 state，devtools 无法跟踪到这次状态的修改。
+ 开启严格模式之后，如果在组件中直接修改 state 会抛出错误，但数据仍被成功修改。
+ 如何开启：在 store 中增加一个属性 strict 为 true
```js
export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
})
```
+ 注意：不要在生产模式下开启严格模式，严格模式会深度检查状态树，检查不合规的状态改变，会影响性能。
+ 我们可以在开发模式下开启严格模式，在生产模式中关闭严格模式:
+ `  strict: process.env.NODE_ENV !== 'production',`

#### 12、Vuex插件介绍
  + Vuex的插件就是一个函数
  + 这个函数接受一个store参数
+ 这个参数可以订阅一个函数，让这个函数在所有的mutation结束之后执行。
```js
const myPlugin = store => {
  // 当store初始化后调用
  store.subscribe((mutation, state) => {
    // 每次mutation之后调用
    // mutation的格式为{ type, payload }
  })
}
```
+ Store/index.js
```js
import Vue from 'vue'
import Vuex from 'vuex'
import products from './modules/products'
import cart from './modules/cart'
Vue.use(Vuex)

const myPlugin = store => {
  store.subscribe((mutation, state) => {
    if (mutation.type.startsWith('cart/')) {
      window.localStorage.setItem('cart-products', JSON.stringify(state.cart.cartProducts))
    }
  })
}

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    products,
    cart
  },
  plugins: [myPlugin]
})
```

#### 13、模拟 Vuex 的实现
```js
let _Vue = null
class Store {
  constructor (options) {
    const {
      state = {},
      getters = {},
      mutations = {},
      actions = {}
    } = options
    this.state = _Vue.observable(state)
    this.getters = Object.create(null)
    Object.keys(getters).forEach(key => {
      Object.defineProperty(this.getters, key, {
        get: () => getters[key](state)
      })
    })
    this._mutations = mutations
    this._actions = actions
  }

  commit (type, payload) {
    this._mutations[type](this.state, payload)
  }

  dispatch (type, payload) {
    this._actions[type](this, payload)
  }
}

function install (Vue) {
  _Vue = Vue
  _Vue.mixin({
    beforeCreate () {
      if (this.$options.store) {
        _Vue.prototype.$store = this.$options.store
      }
    }
  })
}

export default {
  Store,
  install
}
```



### 任务二：服务端渲染基础
#### 1、概述
  + SPA 单页应用
    + 优点：
      + 用户体验好
      + 开发效率高
      + 渲染性能好
      + 可维护性好  
    + 缺点：
      + 首屏渲染时间长
      + 不利于 SEO  
  + 借鉴传统的服务器渲染
    + ![](../images/传统的服务器渲染.png)
  + 客户端激活为 SPA
    + ![](../images/客户端激活SPA.png)
  + 同构应用
    + 通过服务端渲染首屏直出，解决SPA应用首屏渲染慢以及不利于SEO问题
    + 通过客户端渲染结果页面内容交互得到更好的用户体验
    + 这种方式通常称之为现代化的服务端渲染，也叫同构渲染
    + 这种方式构建的应用称之为服务端渲染应用或者是同构应用
  + 相关概念
    + 什么是渲染：把数据和模板拼接在一起。渲染的本质就是字符串的解析替换。
    + 传统的服务端渲染：将数据结合页面模板渲染为 HTML 返回给客户端
    + 客户端渲染
    + 现代化的服务端渲染（同构渲染）

#### 2、传统的服务端渲染案例
+ 地址见：../code/oldRender
+ index.js
```js
const express = require('express')
const fs = require('fs')
const template = require('art-template')

const app = express()

app.get('/', (req, res) => {
  // 1. 获取页面模板
  const templateStr = fs.readFileSync('./index.html', 'utf-8')
  console.log(templateStr)
  // 2. 获取数据
  const data = JSON.parse(fs.readFileSync('./data.json', 'utf-8'))
  console.log(data)
  // 3. 渲染：数据 + 模板 = 最终结果
  const html = template.render(templateStr, data)
  console.log(html)
  // 4. 把渲染结果发送给客户端
  res.send(html)
})

app.listen(3000, () => {
  console.log('running......')
})
```
+ index.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <p>{{message}}</p>
</body>
</html>
```
```json
{
  "message": "人善被人欺，有事不要虚，所有精神小伙全部听令。整起来！天黑路滑，这社会复杂，你往高处爬，那么就有小人来找茬，精神来自灵魂，不是动手伤人，气质来自豪横，但豪横不是进牢门，懂滴撒！散会！（@阿溪🔥）"
}
```
+ 缺点：
  + 前后端代码完全耦合在一起，不利于开发和维护
  + 前端没有足够发挥空间
  + 服务端压力大
  + 用户体验一般

#### 3、客户端渲染CSR
![](../images/客户端渲染.png)
+ 之前服务端渲染的缺点，随着客户端Ajax技术的普及得到了有效的解决，Ajax 使得客户端动态获取数据成为可能，因此，服务端渲染的工作来到了客户端。
+ 后端负责处理数据接口
+ 前端负责将接口数据渲染到页面中
+ 前端更为独立，不再受限于后端。
+ 但客户端渲染也存在一些明显的不足：
  + 首屏渲染慢：因为客户端渲染至少发起 Http 请求三次，第一次是请求页面，第二次是请求页面里的 JS 脚本，第三次是动态数据请求。
  + 不利于 SEO：因为客户端渲染的内容都是由 JS 生成的，而搜索引擎只会请求网络路径的 html，不会去将 html 里的 JS 脚本再去请求做解析处理，因此搜索引擎获取到的首屏是空的，单页应用 SEO 几乎为0。

#### 4、现代化的服务端渲染（同构渲染）
+ 同构渲染 = 后端渲染 + 前端渲染
  + 基于React、Vue等框架，客户端渲染和服务端渲染的结合
    + 在客户端执行一次，用户实现服务器端渲染（首屏直出）
    + 在客户端再执行一次，用于接管页面交互
  + 核心解决SEO和首屏渲染慢的问题
  + 拥有传统服务端渲染的优点，也有客户端渲染的优点。
+ ![](../images/同构渲染.png)
+ 如何实现同构渲染?
  + 使用Vue、React等框架的官方解决方案
    + 优点：有助于理解原理
    + 缺点：需要搭建环境
  + 使用第三方解决方案
    + React生态的Next.js
    + Vue生态的Nuxt.js

#### 5、Nuxt.js为例演示同构渲染应用
+ 流程演示，完整代码见：../code/nuxt-Test/ssr ：
  + 1、创建一个文件夹，然后进入文件夹执行`yarn init`生成包管理器
  + 2、然后执行`yarn add nuxt`安装Nuxt
  + 3、在 package.json 增加 scripts 脚本命令`"dev": "nuxt"`
  + 4、创建 pages 文件夹，在这个文件夹中创建 index.vue 文件和 about.vue 文件，nuxt 会根据 pages 路径自动生成路由。
  + 5、index.vue 中请求数据
    ```js
    <template>
      <div id="app">
        {{message}}
      </div>
    </template>
    <script>
    import axios from 'axios'
    export default {
      name: 'Home',
      components: {},
      // Nuxt 中提供一个钩子函数`asyncData()`，专门用于获取服务端渲染的数据。
      async asyncData () {
        const { data } = await axios({
          method: 'GET',
          // 注意此处的 URL 要指定当前端口，否则默认会去服务端的 80 端口去查找。
          url: 'http://localhost:3000/data.json'
        })
        // 这里返回的数据会和 `data () {}` 中的数据合并到一起给页面使用
        return data
      }
    }
    </script>
    <style scoped></style>
    ```
  + 6、一次请求就拿到了完整页面，Nuxt 的服务端渲染方案解决了首屏渲染慢的问题和 SEO 的问题
  + 7、Nuxt 生成的是 SPA 单页应用，可以通过增加路由导航看出来，Home 和 About 两个组件切换时页面没有刷新。创建一个文件夹 layouts，然后在这个文件夹中创建一个 default.vue 文件，这个文件夹名 layouts 和 其下的 default.vue 是固定的，不能更改
  ```js
  <template>
  <div>
  <!-- 路由出口 -->
    <ul>
      <li>
        <!-- 类似于 router-link，用于单页面应用导航 -->
        <nuxt-link to="/">Home</nuxt-link>
      </li>
      <li>
        <!-- 类似于 router-link，用于单页面应用导航 -->
        <nuxt-link to="/about">About</nuxt-link>
      </li>
    </ul>
  <!-- 子页面出口 -->
    <nuxt />
  </div>
  </template>

  <script>
  export default {

  }
  </script>
  <style scoped></style>
  ```

#### 6、同构渲染的问题
+ 开发条件有限
  + 浏览器特定的代码只能在某些生命周期钩子函数中使用
  + 一些外部扩展库可能需要特殊处理才能在服务端渲染应用中运行
  + 不能在服务端渲染期间操作DOM
  + 。。。
  + 某些代码操作需要区分运行环境
+ 涉及构建设置和部署的更多要求
  |      | 客户端渲染                | 同构渲染                   |
  | ---- | ----------------- | ------------------ |
  | 构建 | 仅构建客户端应用即可      | 需要构建两个端             |
  | 部署 | 可以部署在任意 web 服务器中 | 只能部署在 Node.js Server 中 |
+ 更多的服务器端负载
  + 在 Node 中渲染完整的应用程序，相比仅仅提供静态文件服务器，需要大量占用 CPU 资源
  + 如果应用在高流量环境下使用，需要准备相应的服务器负载
  + 需要更多的服务端渲染优化工作处理
  + 。。。

### 任务三：NuxtJS基础

#### 1、NuxtJS 介绍
+ Nuxt.js 是什么
  + 一个基于 Vue.js 生态的第三方开源服务端渲染应用框架
  + 它可以帮我们轻松的使用 Vue.js 技术栈构建同构应用
  + 官网：< https://zh.nuxtjs.org >
  + Github 仓库：< https://github.com/nuxt/nuxt.js >
#### 2、初始化 NuxtJS 项目
+ Nuxt.js 的三种使用方式
  + 初始化项目
    + 官方文档：< https://zh.nuxtjs.org/guide/installation >
      + 方式一：使用 create-nuxt-app
      + 方式二：手动创建
        + 项目根目录运行 `npm init -y`,并如下添加脚本
          ```js
          {
            "name": "my-app",
            "scripts": {
              "dev": "nuxt"
            }
          }
          ```
        + 安装 Nuxt: `npm install --save nuxt`
        + 新建 pages 目录
          + 此目录下新建我们的文件 index.vue 文件，作为首页
        + `npm run dev` 启动项目
  + 已有的 Node.js 服务端项目
    + 直接把 Nuxt 当作一个中间件集成到 Node Web Server 中
  + 现有的 Vue.js 项目
    + 非常熟悉 Nuxt.js
    + 至少百分之十的代码改动


