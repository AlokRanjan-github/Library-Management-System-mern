# Library Management System

A Library Management System (LMS) built with the **MERN stack** that allows students to borrow and return books and administrators to manage library operations efficiently. The system provides REST APIs, JWT-based authentication, role-based access control, and CRUD operations for smooth library management.

---

## Table of Contents
- [Library Management System](#library-management-system)
  - [Table of Contents](#table-of-contents)
  - [Problem Statement](#problem-statement)
    - [Students can:](#students-can)
    - [Administrators can:](#administrators-can)
  - [Features](#features)
  - [High-Level Architecture](#high-level-architecture)
  - [Actors / User Roles](#actors--user-roles)
    - [1. Student](#1-student)
    - [2. Administrator](#2-administrator)
  - [System Modules](#system-modules)
    - [1. Authentication Module](#1-authentication-module)
    - [2. Student Module](#2-student-module)
    - [3. Book Management Module](#3-book-management-module)
    - [4. Borrow Management Module](#4-borrow-management-module)
  - [Database Design](#database-design)
    - [Tables](#tables)
      - [Users](#users)
      - [Books](#books)
      - [Borrow Records](#borrow-records)
    - [ER Diagram:](#er-diagram)
  - [Authentication Design](#authentication-design)
    - [Flow:](#flow)
    - [Role-based access:](#role-based-access)
  - [Book Borrow \& Return Flow](#book-borrow--return-flow)
    - [Borrow Book](#borrow-book)
    - [Return Book](#return-book)
  - [Error Handling](#error-handling)
  - [Security Measures](#security-measures)
  - [Technologies \& Tools Used](#technologies--tools-used)
  - [API Endpoints](#api-endpoints)
    - [Authentication](#authentication)
    - [Book Management](#book-management)
    - [Borrow Mechanics](#borrow-mechanics)
    - [Student Specific](#student-specific)
    - [Admin Specific](#admin-specific)

---

## Problem Statement
Build a system to manage a library where:

### Students can:
- Register/Login
- View available books
- Borrow books
- View borrowed books
- Check due dates and fines

### Administrators can:
- Add, update, and delete books
- Manage students
- Track borrowed books and returns
- Update stock

The system should expose REST APIs with JSON responses and enforce role-based access control.

---

## Features
- **User Authentication & Authorization (JWT)**
- **CRUD operations** for books and users
- **Borrow & return books** with due date and fine calculation
- **Role-based access**: Student vs Admin
- **RESTful APIs** with proper error handling

---

## High-Level Architecture
```
Client (React) 
      │
      ▼
REST API
      │
      ▼
Backend Server (Node.js + Express)
  - Authentication (JWT)
  - Business Logic
      │
      ▼
Database (MongoDB)
```

**Services Used:**
- **API Testing** → Postman
- **Deployment** → Docker / Cloud
- **CI/CD** → GitHub Actions

---

## Actors / User Roles
### 1. Student
- Register/Login
- View available books
- Borrow books
- View borrowed books and due dates
- Check fines

### 2. Administrator
- Add, update, delete books
- Manage students
- Track borrow history
- Manage book returns

---

## System Modules
### 1. Authentication Module
- User registration
- Login
- JWT token generation
- Role verification

### 2. Student Module
- View available books
- Borrow books
- View borrowed books and due dates

### 3. Book Management Module
- Add, update, delete books
- Search books

### 4. Borrow Management Module
- Borrow book
- Return book
- Calculate due date and fine

---

## Database Design
### Tables

#### Users
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | PK | User ID |
| `name` | String | User name |
| `email` | String | Email address |
| `password` | String | Hashed password |
| `role` | Enum | student / admin |
| `created_at` | Date | Creation timestamp |

#### Books
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | PK | Book ID |
| `title` | String | Book title |
| `author` | String | Book author |
| `isbn` | String | Book ISBN |
| `category` | String | Book category |
| `total_copies` | Number | Total copies in library |
| `available_copies` | Number | Copies currently available |
| `created_at` | Date | Creation timestamp |

#### Borrow Records
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | PK | Borrow record ID |
| `user_id` | FK | References Users |
| `book_id` | FK | References Books |
| `borrow_date` | Date | Borrowed date |
| `due_date` | Date | Due date |
| `return_date` | Date | Returned date |
| `fine_amount` | Number | Fine if returned late |
| `status` | Enum | borrowed / returned |

### ER Diagram:
`Users 1 ──── N BorrowRecords N ──── 1 Books`
- One user can borrow multiple books.
- One book can be borrowed multiple times.
- `BorrowRecords` connects both users and books.

---

## Authentication Design
### Flow:
1. User logs in with email and password.
2. Backend verifies credentials.
3. JWT token is generated.
4. Token is sent to the client.
5. Client sends token with `Authorization: Bearer <token>` in every API request.
6. Middleware verifies token and grants access based on role.

### Role-based access:
- **Student** → limited APIs
- **Admin** → full control

---

## Book Borrow & Return Flow
### Borrow Book
1. Student selects a book.
2. API request to `/api/books/borrow`.
3. Backend checks authentication and availability.
4. Creates `BorrowRecord`.
5. Decreases `available_copies`.
6. Returns success response.

### Return Book
1. Student returns a book via `/api/books/return`.
2. Backend finds borrow record.
3. Calculates fine if late.
4. Updates `return_date`.
5. Increases `available_copies`.

---

## Error Handling
| Error | Status Code | Example Response |
| :--- | :--- | :--- |
| Unauthorized | 401 | `{ "status": "error", "message": "Unauthorized" }` |
| Book Not Found | 404 | `{ "status": "error", "message": "Book not found" }` |
| Book Not Available | 400 | `{ "status": "error", "message": "Book not available" }` |
| Invalid Input | 422 | `{ "status": "error", "message": "Invalid input" }` |
| Server Error | 500 | `{ "status": "error", "message": "Internal server error" }` |

---

## Security Measures
- Password hashing using **bcrypt**
- **JWT-based** authentication
- **Role-based** authorization

---

## Technologies & Tools Used 
- **Frontend**: React
- **Backend**: Node.js + Express
- **Database**: MongoDB
- **Authentication**: JWT
- **Testing**: Postman
- **Deployment**: Docker / Cloud
- **CI/CD**: GitHub Actions

---

## API Endpoints

### Authentication
- `POST /api/auth/register` → Register new user
- `POST /api/auth/login` → Login and receive JWT token
- `GET /api/auth/profile` → Get user profile (Protected)
- `PUT /api/auth/profile` → Update user profile (Protected)

### Book Management
- `GET /api/books` → Get all books
- `GET /api/books/:id` → Get book by ID
- `POST /api/books` → Add new book (**Admin**)
- `PUT /api/books/:id` → Update book (**Admin**)
- `DELETE /api/books/:id` → Delete book (**Admin**)

### Borrow Mechanics
- `POST /api/books/borrow` → Borrow a book (Student)
- `POST /api/books/return` → Return a book (Student)

### Student Specific
- `GET /api/student/books` → View available books
- `GET /api/student/borrowed` → View borrowed books
- `GET /api/student/fines` → Check fines

### Admin Specific
- `GET /api/admin/students` → Manage users / students
- `GET /api/admin/borrowed-books` → Track borrow history
- `GET /api/admin/overdue` → Check overdue books
- `GET /api/admin/categories` → Manage book categories
