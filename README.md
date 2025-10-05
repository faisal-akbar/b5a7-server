# 📝 Portfolio & Blog Management System

A modern, scalable backend system for managing personal portfolios, blogs, and projects. Built with TypeScript, Express.js, and PostgreSQL, featuring role-based access control, image uploads, and comprehensive content management.

---

Live Demo: [Portfolio Project](https://b5a7-server.vercel.app/).

Postman Collection: [Portfolio Project Postman Collection]().

## 🧱 Features

- 🔐 **Authentication**: JWT-based authentication with refresh tokens
- 🔁 **Role-based Access Control**: `SUPER_ADMIN` and `ADMIN` roles with full access.
- 📝 **Blog Management**: Create, update, delete, and publish, draft, featured blog posts with rich text editor.
- 🚀 **Project Portfolio**: Manage project showcases with create, update, delete, and publish, draft, featured project.
- 📸 **File Uploads**: Cloudinary integration for image upload for blog and project.
- 🏷️ **Content Organization**: Tags, categories, and featured content support
- 📊 **Analytics**: View tracking and minute read time for blog.
- ⚠️ **Global Error Handling**: Comprehensive error management and validation
- 🧱 **Modular Architecture**: Scalable and maintainable codebase structure
- 🔒 **Security**: Input validation, authentication middleware, and secure file handling

## 🧩 Tech Stack

- **Node.js + Express** — Backend framework
- **TypeScript** — Type-safe development
- **PostgreSQL + Prisma** — Database with ORM
- **Zod** — Schema validation
- **JWT** — Authentication and authorization
- **Cloudinary** — Image storage and management
- **Multer** — File upload handling
- **dotenv** — Environment configuration
- **ESLint** — Code quality and linting
- **Vercel** — Deployment platform

---

## 🛠️ Getting Started

```bash
# 1. Clone the repository
git clone <repository-url>
cd b5a7-server

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env

# 4. Update .env with your configuration
PORT=5000
DATABASE_URL="postgresql://username:password@localhost:5432/portfolio_db"
NODE_ENV=development

# JWT
JWT_ACCESS_SECRET=access_secret
JWT_ACCESS_EXPIRES=3d

JWT_REFRESH_SECRET=refresh_secret
JWT_REFRESH_EXPIRES=10d

# BCRYPT
BCRYPT_SALT_ROUND=10

# SUPER ADMIN
SUPER_ADMIN_EMAIL=super@next.com
SUPER_ADMIN_PASSWORD=ph@123456

# Express Session
EXPRESS_SESSION_SECRET=express-session

# Frontend URL
FRONTEND_URL=http://localhost:3000

# CLOUDINARY
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# 5. Prisma migration
npx prisma migrate dev

# 6. Generate Prisma client
npx prisma generate

# 7. Start development server
npm run dev
```

---

## 👤 Dummy Users for Testing

### Email and password for some Admin user:

```
// ADMIN / SUPER_ADMIN
"email": "super@next.com",
"password": "ph@123456"
```

---

## 📁 Project Structure

```
b5a7-server/
├── src/
│   ├── app/
│   │   ├── config/
│   │   │   ├── cloudinary.config.ts
│   │   │   ├── db.ts
│   │   │   ├── env.ts
│   │   │   └── multer.config.ts
│   │   ├── interfaces/
│   │   │   ├── error.ts
│   │   │   ├── error.types.ts
│   │   │   ├── index.d.ts
│   │   │   └── pagination.ts
│   │   ├── middlewares/
│   │   │   ├── checkAuth.ts
│   │   │   ├── dbConnection.ts
│   │   │   ├── globalErrorHandler.ts
│   │   │   ├── notFound.ts
│   │   │   └── validateRequest.ts
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   │   ├── auth.controller.ts
│   │   │   │   ├── auth.routes.ts
│   │   │   │   └── auth.service.ts
│   │   │   ├── blog/
│   │   │   │   ├── blog.constant.ts
│   │   │   │   ├── blog.controller.ts
│   │   │   │   ├── blog.interface.ts
│   │   │   │   ├── blog.routes.ts
│   │   │   │   ├── blog.service.ts
│   │   │   │   └── blog.validation.ts
│   │   │   ├── project/
│   │   │   │   ├── project.constant.ts
│   │   │   │   ├── project.controller.ts
│   │   │   │   ├── project.interface.ts
│   │   │   │   ├── project.routes.ts
│   │   │   │   ├── project.service.ts
│   │   │   │   └── project.validation.ts
│   │   │   └── user/
│   │   │       ├── user.controller.ts
│   │   │       ├── user.routes.ts
│   │   │       ├── user.service.ts
│   │   │       └── user.validation.ts
│   │   ├── routes/
│   │   │   └── index.ts
│   │   └── utils/
│   │       ├── catchAsync.ts
│   │       ├── errorHelpers/
│   │       │   ├── AppError.ts
│   │       │   ├── handleClientError.ts
│   │       │   ├── handleValidationError.ts
│   │       │   └── handleZodError.ts
│   │       ├── jwt/
│   │       │   ├── jwt.ts
│   │       │   ├── setCookie.ts
│   │       │   └── userTokens.ts
│   │       ├── paginationHelper.ts
│   │       ├── pick.ts
│   │       ├── seedSuperAdmin.ts
│   │       └── sendResponse.ts
│   ├── app.ts
│   └── server.ts
├── prisma/
│   ├── migrations/
│   └── schema.prisma
├── package.json
├── tsconfig.json
└── vercel.json
```

---

## 👤 User Roles

| Role          | Responsibilities                            |
| ------------- | ------------------------------------------- |
| `SUPER_ADMIN` | Full system access, can create other admins |
| `ADMIN`       | Manage content, CRUD blogs and projects     |

---

## 📡 API Endpoints

### 🔐 Authentication

| Method | Endpoint              | Description       |
| ------ | --------------------- | ----------------- |
| POST   | `/auth/login`         | User login        |
| POST   | `/auth/refresh-token` | Refresh JWT token |
| POST   | `/auth/logout`        | Logout user       |

---

### 👤 Users

| Method | Endpoint             | Role                  | Description                |
| ------ | -------------------- | --------------------- | -------------------------- |
| GET    | `/user/me`           | Authenticated         | Get logged-in user profile |
| POST   | `/user/create-admin` | `ADMIN`/`SUPER_ADMIN` | Create new admin           |
| PATCH  | `/user/:id`          | Authenticated         | Update user profile        |

---

### 📝 Blogs

| Method | Endpoint                      | Role                  | Description                |
| ------ | ----------------------------- | --------------------- | -------------------------- |
| GET    | `/blog/published`             | Public                | Get all published blogs    |
| GET    | `/blog/`                      | `ADMIN`/`SUPER_ADMIN` | Get all blogs (admin view) |
| GET    | `/blog/:slug`                 | Public                | Get single blog by slug    |
| GET    | `/blog/id/:id`                | `ADMIN`/`SUPER_ADMIN` | Get blog by id             |
| GET    | `/blog/views/:slug`           | Public                | Get blog view count        |
| POST   | `/blog/views/:slug/increment` | Public                | Increment blog views       |
| POST   | `/blog/create`                | `ADMIN`/`SUPER_ADMIN` | Create new blog            |
| PATCH  | `/blog/:id`                   | `ADMIN`/`SUPER_ADMIN` | Update blog                |
| DELETE | `/blog/:id`                   | `ADMIN`/`SUPER_ADMIN` | Delete blog                |

---

### 🚀 Projects

| Method | Endpoint             | Role                  | Description                |
| ------ | -------------------- | --------------------- | -------------------------- |
| GET    | `/project/published` | Public                | Get all published projects |
| GET    | `/project/`          | `ADMIN`/`SUPER_ADMIN` | Get all projects (admin)   |
| GET    | `/project/:slug`     | Public                | Get single project by slug |
| GET    | `/project/id/:id`    | `ADMIN`/`SUPER_ADMIN` | Get project by id          |
| POST   | `/project/create`    | `ADMIN`/`SUPER_ADMIN` | Create new project         |
| PATCH  | `/project/:id`       | `ADMIN`/`SUPER_ADMIN` | Update project             |
| DELETE | `/project/:id`       | `ADMIN`/`SUPER_ADMIN` | Delete project             |

---

## 🗄️ Database Schema

### User Model

- **id**: Primary key
- **name**: User's full name
- **email**: Unique email address
- **password**: Hashed password
- **phone**: Optional phone number
- **picture**: Profile picture URL
- **role**: User role (SUPER_ADMIN, ADMIN)
- **isActive**: Account status (ACTIVE, INACTIVE, BLOCKED)
- **isVerified**: Email verification status
- **isDeleted**: Soft delete flag

### Blog Model

- **id**: Primary key
- **title**: Blog post title
- **slug**: URL-friendly identifier
- **thumbnail**: Featured image URL
- **content**: Blog post content
- **excerpt**: Short description
- **tags**: Array of tag strings
- **isFeatured**: Featured post flag
- **isPublished**: Publication status
- **views**: View count
- **authorId**: Reference to User

### Project Model

- **id**: Primary key
- **title**: Project title
- **slug**: URL-friendly identifier
- **description**: Project description
- **projectLink**: Source code link
- **liveSite**: Live demo URL
- **thumbnail**: Project image URL
- **features**: Array of feature strings
- **techStack**: Array of technology strings
- **isFeatured**: Featured project flag
- **isPublished**: Publication status
- **ownerId**: Reference to User

---
