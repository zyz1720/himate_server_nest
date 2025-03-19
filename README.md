# Himate Nestjs

### 简介

[Hiamte](https://gitee.com/zyz1720/himate_rn_app)聊天应用的Nestjs后端服务

如何使用Nestjs：https://nestjs.com/



#### 项目环境

- nodejs > 18
- mysql > 5.7
- redis > 5

配置项目基础环境 项目目录.env文件

```
// 开发环境配置

// 数据库地址
DB_HOST=127.0.0.1  
// 数据库端口
DB_PORT=3306
// 数据库登录名
DB_USER=root
// 数据库登录密码
DB_PASSWORD=root
// 数据库名字
DB_DATABASE=himate

// JWT密钥
JWT_SECRET=000000
// JWT验证时间
JWT_EXPIRES_In=168h

// 邮箱类型
MAil_HOST=smtp.163.com
// 邮箱地址
MAil_USER=
// 授权码
MAil_PASSWORD=

// Redis配置
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASSWORD=

// 第三方音乐api配置
MUSIC_API=
```

.env文件主要用于作为配置示例，不建议直接配置.env文件作为您的项目环境，建议新建如.env.local这样的多个.env文件进行多环境配置

### 技术栈

#### 数据库与缓存

- TypeORM

  : 用于数据库操作的 ORM 框架。

  - 相关依赖：
    - `typeorm`
    - `mysql`

- Redis

  : 用于任务队列和缓存管理。

  - 相关依赖：
    - `bull`
    - `ioredis`

#### 认证与授权

- Passport

  : 用于身份验证。

  - 相关依赖：
    - `passport`
    - `passport-jwt`
    - `passport-local`

#### 其他工具与库

- Bcrypt

  : 用于密码加密。

  - 相关依赖：
    - `bcrypt`

- Nodemailer

  : 用于发送邮件。

  - 相关依赖：
    - `nodemailer`

- Sharp

  : 用于图像处理。

  - 相关依赖：
    - `sharp`

- Music Metadata

  : 用于音频文件元数据解析。

  - 相关依赖：
    - `music-metadata`

- UUID

  : 用于生成唯一标识符。

  - 相关依赖：
    - `uuid`

- Swagger

  : 用于 API 文档生成。

  - 相关依赖：
    - `swagger-ui-express`

### 运行项目

正确配置好基础环境和启动mysql，redis后 

安装项目依赖

```
npm install
```

启动

```
npm run start
```

### 其它

app端详见https://gitee.com/zyz1720/himate_rn_app

后台管理详见https://gitee.com/zyz1720/himate_vue_backend