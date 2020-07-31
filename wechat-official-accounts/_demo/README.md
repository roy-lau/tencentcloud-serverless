# wechat-sell

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn run serve
```

### Compiles and minifies for production
```
yarn run build
```

### Run your tests
```
yarn run test
```

### Lints and fixes files
```
yarn run lint
```

## 安装配置 vux

* 安装
```bash
yarn add vux vux-loader
```

* 配置
> 将下面代码复制到 `vue.config.js` 中：

```js
module.exports = {
    configureWebpack: config => {
        require('vux-loader').merge(config, {
            options: {},
            plugins: ['vux-ui']
        })
    }
}
```

* 降低 `vue-loader` 版本
```
yarn add vue-loader@14.2.2 -D
```