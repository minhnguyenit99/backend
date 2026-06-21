# 🚀 Task Management API

A secure and scalable REST API built with **NestJS**, **Prisma**, and **PostgreSQL** that powers a role-based task management application.

The API allows administrators to create and assign tasks to one or more users while enforcing strict role-based permissions. It manages authentication, users, tasks, and task assignments through a clean, modular architecture.

---

## ✨ Features

* 🔐 JWT authentication and authorization
* 👥 Role-Based Access Control (Admin & Client)
* ✅ Create, update, delete, and assign tasks
* 👤 User management
* 🔄 Many-to-many task assignments using Prisma relations
* 🗄️ PostgreSQL database with Prisma ORM
* ⚠️ Centralized exception handling and validation
* 📦 Modular NestJS architecture

---

## 🛠️ Tech Stack

* **Framework:** NestJS
* **Language:** TypeScript
* **ORM:** Prisma
* **Database:** PostgreSQL
* **Authentication:** JWT
* **Validation:** class-validator
* **Package Manager:** npm

---

## 📂 Project Structure

```text
src/
├── auth/           # Authentication & JWT
├── users/          # User module
├── posts/          # Task module
├── prisma/         # Prisma service
├── common/         # Guards, decorators, filters
└── main.ts
```

---

## 🚀 Getting Started

### Prerequisites

* Node.js 20+
* PostgreSQL
* npm

### Installation

```bash
git clone <repository-url>

cd backend

npm install
```

### Environment Variables

Create a `.env` file.

```env
DATABASE_URL
DIRECT_URL
NEXT_PUBLIC_SUPABASE_URL
```

### Database

```bash
npx prisma migrate dev

npx prisma generate
```

### Run the Server

```bash
# Development
npm run start:dev

# Production
npm run start:prod
```

The API will be available at:

```text
http://localhost:3000
```

---

## 📌 API Capabilities

* User authentication
* Role-based authorization
* User management
* Task CRUD operations
* Assign multiple users to a task
* Retrieve tasks by user
* Update task status
