# Himate Nest Server

Himate Nest Server is a modern backend service developed based on the NestJS framework, providing comprehensive user management, real-time communication, file management, music services, and more. It adopts a modular architecture design, supporting multi-environment configuration and internationalization.

## 📋 Project Overview

Himate Nest Server is the backend service for the Himate application, offering the following core features:

- Complete user authentication and authorization system
- Real-time communication (WebSocket) and server push (SSE)
- File upload and management
- Music services and metadata management
- Friend and group management
- Message system
- Multi-environment configuration support
- Internationalization support
- Automatic API documentation generation

## 🛠 Technology Stack

### Core Framework
- **NestJS 10.x** - Progressive Node.js framework
- **TypeScript** - Type-safe JavaScript superset

### HTTP Server
- **Fastify** - High-performance Node.js web server

### Database
- **MySQL** - Relational database
- **TypeORM** - Object-oriented database mapping tool

### Caching and Queuing
- **Redis** - High-performance cache database
- **Bull** - Redis-based message queue

### Authentication and Authorization
- **JWT** - JSON Web Token authentication
- **Passport** - Authentication middleware

### Real-time Communication
- **Socket.IO** - WebSocket real-time communication
- **SSE** - Server-Sent Events

### API Documentation
- **Swagger** - Automatic API documentation generation

### Other Tools
- **class-validator** - Data validation
- **i18n** - Internationalization support
- **Bcrypt** - Password encryption
- **sharp** - Image processing

## 📁 Project Structure

```
himate_nest_server/
├── config/                 # Configuration files
│   ├── env.ts             # Environment configuration
│   └── file_dir.ts        # File directory configuration
├── sql/                   # Database scripts
├── src/                   # Source code
│   ├── common/            # Common tools and configuration
│   │   ├── bull/          # Task queue consumers
│   │   ├── constants/     # Constant definitions
│   │   ├── context/       # Context
│   │   ├── dto/           # Data transfer objects
│   │   ├── factories/     # Factory classes
│   │   ├── filters/       # Exception filters
│   │   ├── interceptor/   # Interceptors
│   │   ├── middleware/    # Middleware
│   │   ├── response/      # Response handling
│   │   ├── subscriber/    # Database subscribers
│   │   └── utils/         # Utility functions
│   ├── core/              # Core functionality modules
│   │   ├── auth/          # Authentication and authorization
│   │   ├── captcha/       # Captcha
│   │   ├── email/         # Email services
│   │   ├── music-api/     # Music API
│   │   ├── redis/         # Redis services
│   │   ├── socket/        # WebSocket services
│   │   ├── sse/           # SSE services
│   │   └── upload/        # File upload
│   ├── modules/           # Business modules
│   │   ├── app-package/   # Application package management
│   │   ├── favorites/     # Favorites management
│   │   ├── file/          # File management
│   │   ├── group/         # Group management
│   │   ├── group-member/  # Group member management
│   │   ├── mate/          # Friend management
│   │   ├── message/       # Message management
│   │   ├── message-read-records/ # Message read records
│   │   ├── music/         # Music management
│   │   ├── music-extra/   # Music additional information
│   │   ├── session/       # Session management
│   │   └── user/          # User management
│   ├── app.controller.ts  # Application controller
│   ├── app.module.ts      # Application module
│   └── app.service.ts     # Application service
├── test/                  # Test files
├── .env                   # Environment variables
├── main.ts                # Application entry
├── nest-cli.json          # Nest CLI configuration
├── package.json           # Project dependencies
└── tsconfig.json          # TypeScript configuration
```

## 🚀 Quick Start

### Environment Requirements
- Node.js >= 18.x
- MySQL >= 5.7
- Redis >= 6.x

### Install Dependencies

```bash
yarn
```

### Environment Configuration

1. Copy and modify the environment variable file

```bash
cp .env.example .env
```

2. Modify the configuration items in the `.env` file

```env
# Server configuration
PORT=3000
NODE_ENV=local

# Database configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=password
DB_DATABASE=himate

# Redis configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=24h
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key
REFRESH_TOKEN_EXPIRES_IN=7d

# Email configuration
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=user@example.com
EMAIL_PASSWORD=email_password
EMAIL_FROM=Himate <user@example.com>

# Rate limiting configuration
THROTTLE_TTL=60000
THROTTLE_LIMIT=100
```

### Start the Service

#### Development Environment

```bash
yarn dev
```

#### Production Environment

```bash
yarn build
yarn start:prod
```

### API Documentation

After starting the service, access the following address to view the API documentation:

```
http://localhost:3000/swagger
```

## 🏗 Core Functionality Modules

### Authentication Module (AuthModule)

Provides complete user authentication and authorization functionality:
- JWT authentication
- Role permission management
- Refresh token mechanism
- Public route decorator

### Email Module (EmailModule)

Provides email sending services:
- Verification code emails
- Notification emails
- Template emails

### File Upload Module (UploadModule)

Provides file upload and management functionality:
- Single file upload
- Multiple file upload
- File type validation
- File size limitation
- Thumbnail generation

### Real-time Communication Module (SocketModule)

Provides WebSocket real-time communication functionality:
- Private messages
- Group messages
- Message push
- Connection management

### Music API Module (MusicApiModule)

Provides music-related API services:
- Music search
- Music metadata retrieval
- Music playback links

## 🏗 Business Modules

### User Module (UserModule)

User information management:
- User registration and login
- User profile management
- User avatar and background images
- User status management

### Session Module (SessionModule)

Session management:
- Session creation and destruction
- Session status management
- Session message records

### Friend Module (MateModule)

Friend relationship management:
- Friend requests
- Friend lists
- Friend status
- Friend groups

### Group Module (GroupModule)

Group management:
- Group creation and management
- Group member management
- Group permissions
- Group announcements

### Message Module (MessageModule)

Message system:
- Text messages
- Image messages
- Audio messages
- Message status

### Music Module (MusicModule)

Music management:
- Music upload
- Music metadata
- Music classification
- Music favorites

## 🔧 Configuration Management

### Environment Configuration

The project supports multi-environment configuration, switched via the `NODE_ENV` environment variable:

- `local` - Local development environment
- `prod` - Production environment
- `test` - Test environment

### File Directory Configuration

File upload and static resource directory configurations are in `config/file_dir.ts`:

```typescript
export const FILE_DIR = {
  UPLOAD: path.resolve('./uploads'),
  THUMBNAIL: path.resolve('./thumbnail'),
  RECYCLE_BIN: path.resolve('./recycle_bin'),
};
```

## 🌐 Internationalization Support

The project implements internationalization using `nestjs-i18n`:

- Supports Chinese and English
- Switch languages via the request header `x-custom-lang`
- Automatically switches based on browser language

## 🔒 Security Measures

- JWT token authentication
- Password encryption storage
- API rate limiting
- Input data validation
- SQL injection protection
- XSS protection
- CORS configuration

## 📈 Performance Optimization

- Database connection pooling
- Redis caching
- Asynchronous task queuing
- Response data compression
- Static resource caching

### Open Source License

This project is open source under the MIT License. You can freely use, modify, and distribute the code of this project as long as you follow the terms of the license.

### Related Projects
- **Frontend**: [Himate React Native App](https://gitee.com/zyz1720/himate_app_rn)
- **Backend**: [Himate React Backend](https://gitee.com/zyz1720/himate_backend_react)