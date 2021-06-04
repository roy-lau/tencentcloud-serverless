# wechat-official-accounts 微信公众号

### 目录结构

```
    ├─api       # 接口
    ├─config    # 配置文件
    ├─controllers # 控制器
    ├─database      # 数据库
    │  └─schema
    ├─decorator     # 装饰器
    ├─middleware    # 中间件
    ├─routes        # 路由
    ├─wechat        # 微信相关
    └─lib           # 微信相关的 lib
```

### 腾讯云无服务器开发

```sh
    # 本地开发
    yarn serve
    # serverless 删除
    yarn sls:remove
    # serverless 查看信息
    yarn sls:info
    # serverless 开发
    yarn sls:dev
    # serverless 部署
    yarn sls:deploy
```