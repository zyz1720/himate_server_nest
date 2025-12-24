# Himate Nest Server

Himate Nest Server 是一个基于 NestJS 框架开发的现代化后端服务，提供了完整的用户管理、实时通信、文件管理、音乐服务等功能，采用模块化架构设计，支持多环境配置和国际化。

## 📋 项目概述

Himate Nest Server 是 Himate 应用的后端服务，提供以下核心功能：

- 完整的用户认证和授权系统
- 实时通信（WebSocket）和服务器推送（SSE）
- 文件上传和管理
- 音乐服务和元数据管理
- 好友和群组管理
- 消息系统
- 多环境配置支持
- 国际化支持
- API 文档自动生成

## 🛠 技术栈

### 核心框架
- **NestJS 10.x** - 渐进式 Node.js 框架
- **TypeScript** - 类型安全的 JavaScript 超集

### HTTP 服务器
- **Fastify** - 高性能的 Node.js Web 服务器

### 数据库
- **MySQL** - 关系型数据库
- **TypeORM** - 面向对象的数据库映射工具

### 缓存和队列
- **Redis** - 高性能缓存数据库
- **Bull** - 基于 Redis 的消息队列

### 认证和授权
- **JWT** - JSON Web Token 认证
- **Passport** - 身份验证中间件

### 实时通信
- **Socket.IO** - WebSocket 实时通信
- **SSE** - 服务器发送事件

### API 文档
- **Swagger** - API 文档自动生成

### 其他工具
- **class-validator** - 数据验证
- **i18n** - 国际化支持
- **Bcrypt** - 密码加密
- **sharp** - 图像处理

## 📁 项目结构

```
himate_nest_server/
├── config/                 # 配置文件
│   ├── env.ts             # 环境配置
│   └── file_dir.ts        # 文件目录配置
├── sql/                   # 数据库脚本
├── src/                   # 源代码
│   ├── common/            # 通用工具和配置
│   │   ├── bull/          # 任务队列消费者
│   │   ├── constants/     # 常量定义
│   │   ├── context/       # 上下文
│   │   ├── dto/           # 数据传输对象
│   │   ├── factories/     # 工厂类
│   │   ├── filters/       # 异常过滤器
│   │   ├── interceptor/   # 拦截器
│   │   ├── middleware/    # 中间件
│   │   ├── response/      # 响应处理
│   │   ├── subscriber/    # 数据库订阅器
│   │   └── utils/         # 工具函数
│   ├── core/              # 核心功能模块
│   │   ├── auth/          # 认证和授权
│   │   ├── captcha/       # 验证码
│   │   ├── email/         # 邮件服务
│   │   ├── music-api/     # 音乐API
│   │   ├── redis/         # Redis服务
│   │   ├── socket/        # WebSocket服务
│   │   ├── sse/           # SSE服务
│   │   └── upload/        # 文件上传
│   ├── modules/           # 业务模块
│   │   ├── app-package/   # 应用包管理
│   │   ├── favorites/     # 收藏管理
│   │   ├── file/          # 文件管理
│   │   ├── group/         # 群组管理
│   │   ├── group-member/  # 群组成员管理
│   │   ├── mate/          # 好友管理
│   │   ├── message/       # 消息管理
│   │   ├── message-read-records/ # 消息阅读记录
│   │   ├── music/         # 音乐管理
│   │   ├── music-extra/   # 音乐附加信息
│   │   ├── session/       # 会话管理
│   │   └── user/          # 用户管理
│   ├── app.controller.ts  # 应用控制器
│   ├── app.module.ts      # 应用模块
│   └── app.service.ts     # 应用服务
├── test/                  # 测试文件
├── .env                   # 环境变量
├── main.ts                # 应用入口
├── nest-cli.json          # Nest CLI 配置
├── package.json           # 项目依赖
└── tsconfig.json          # TypeScript 配置
```

## 🚀 快速开始

### 环境要求
- Node.js >= 18.x
- MySQL >= 5.7
- Redis >= 6.x

### 安装依赖

```bash
yarn
```

### 环境配置

1. 复制并修改环境变量文件

```bash
cp .env.example .env
```

2. 修改 `.env` 文件中的配置项

```env
# 服务器配置
PORT=3000
NODE_ENV=local

# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=password
DB_DATABASE=himate

# Redis配置
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT配置
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=24h
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key
REFRESH_TOKEN_EXPIRES_IN=7d

# 邮箱配置
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=user@example.com
EMAIL_PASSWORD=email_password
EMAIL_FROM=Himate <user@example.com>

# 限流配置
THROTTLE_TTL=60000
THROTTLE_LIMIT=100
```

### 启动服务

#### 开发环境

```bash
yarn dev
```

#### 生产环境

```bash
yarn build
yarn start:prod
```

### API 文档

启动服务后，访问以下地址查看 API 文档：

```
http://localhost:3000/swagger
```

## 📦 核心功能模块

### 认证模块 (AuthModule)

提供完整的用户认证和授权功能：
- JWT 认证
- 角色权限管理
- 刷新令牌机制
- 公开路由装饰器

### 邮件模块 (EmailModule)

提供邮件发送服务：
- 验证码邮件
- 通知邮件
- 模板邮件

### 文件上传模块 (UploadModule)

提供文件上传和管理功能：
- 单文件上传
- 多文件上传
- 文件类型验证
- 文件大小限制
- 缩略图生成

### 实时通信模块 (SocketModule)

提供 WebSocket 实时通信功能：
- 私聊消息
- 群聊消息
- 消息推送
- 连接管理

### 音乐API模块 (MusicApiModule)

提供音乐相关的 API 服务：
- 音乐搜索
- 音乐元数据获取
- 音乐播放链接

## 🏗 业务模块

### 用户模块 (UserModule)

用户信息管理：
- 用户注册和登录
- 用户资料管理
- 用户头像和背景图
- 用户状态管理

### 会话模块 (SessionModule)

会话管理：
- 会话创建和销毁
- 会话状态管理
- 会话消息记录

### 好友模块 (MateModule)

好友关系管理：
- 好友请求
- 好友列表
- 好友状态
- 好友分组

### 群组模块 (GroupModule)

群组管理：
- 群组创建和管理
- 群组成员管理
- 群组权限
- 群组公告

### 消息模块 (MessageModule)

消息系统：
- 文本消息
- 图片消息
- 音频消息
- 消息状态

### 音乐模块 (MusicModule)

音乐管理：
- 音乐上传
- 音乐元数据
- 音乐分类
- 音乐收藏

## 🔧 配置管理

### 环境配置

项目支持多环境配置，通过 `NODE_ENV` 环境变量切换：

- `local` - 本地开发环境
- `prod` - 生产环境
- `test` - 测试环境

### 文件目录配置

文件上传和静态资源目录配置在 `config/file_dir.ts` 中：

```typescript
export const FILE_DIR = {
  UPLOAD: path.resolve('./uploads'),
  THUMBNAIL: path.resolve('./thumbnail'),
  RECYCLE_BIN: path.resolve('./recycle_bin'),
};
```

## 🌐 国际化支持

项目使用 `nestjs-i18n` 实现国际化：

- 支持中文和英文
- 通过请求头 `x-custom-lang` 切换语言
- 支持自动根据浏览器语言切换


## 🔒 安全措施

- JWT 令牌认证
- 密码加密存储
- 接口限流
- 输入数据验证
- SQL 注入防护
- CORS 配置

## 📈 性能优化

- 数据库连接池
- Redis 缓存
- 异步任务队列
- 响应数据压缩
- 静态资源缓存

### 开源协议

本项目基于 MIT 开源协议开源，您可以在遵守协议的前提下自由使用、修改和分发本项目的代码。

### 关联项目
- **前端**: [Himate React Native App](https://gitee.com/zyz1720/himate_app_rn)
- **后台管理**: [Himate React Backend](https://gitee.com/zyz1720/himate_backend_react)