# Subscription Management Dashboard

A full-stack SaaS admin dashboard for managing subscriptions — built with the MERN stack.

---

## Tech Stack

| Layer      | Technologies                                                 |
| ---------- | ------------------------------------------------------------ |
| Frontend   | React 18 (Vite), Redux Toolkit, React Router v6, CSS Modules |
| Backend    | Node.js, Express.js                                          |
| Database   | MongoDB + Mongoose                                           |
| Auth       | JWT (Access + Refresh Tokens)                                |
| Validation | Yup (client + server)                                        |

---

## Project Structure

```
subscription-dashboard/
├── client/               # React frontend (Vite)
│   └── src/
│       ├── components/   # Navbar, ProtectedRoute
│       ├── pages/        # Login, Register, Plans, Dashboard, Admin
│       ├── store/        # Redux slices (auth, subscription)
│       ├── styles/       # Global CSS design system
│       └── utils/        # Axios instance with token refresh
└── server/               # Express backend
    ├── config/           # DB connection, JWT helpers
    ├── controllers/      # Auth, Subscription, Plan logic
    ├── middleware/        # JWT auth, role guards, Yup validation
    ├── models/           # User, Plan, Subscription (Mongoose)
    ├── routes/           # Auth, Plan, Subscription, Admin routes
    └── seed/             # DB seeder (4 plans + admin user)
```

---

## Setup & Run

### Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)

### 1. Clone & install

```bash
git clone https://github.com/GOKULMASIVE/subscription-dashboard-task.git
cd subscription-dashboard-task

# Install server deps
cd server && npm install

# Install client deps
cd ../client && npm install
```

### 2. Configure environment

```bash
cd server
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secrets
```

### 3. Seed the database

```bash
cd server
npm run seed
```

This creates 4 plans (Starter, Pro, Business, Enterprise) and an admin account:

- **Email:** `admin@demo.com`
- **Password:** `Admin@123`

### 4. Run both servers

```bash
# Terminal 1 – Backend (http://localhost:5000)
cd server && npm run dev

# Terminal 2 – Frontend (http://localhost:5173)
cd client && npm run dev
```

---

## API Reference

| Method | Endpoint                   | Auth  | Description                   |
| ------ | -------------------------- | ----- | ----------------------------- |
| POST   | `/api/auth/register`       | —     | Register user                 |
| POST   | `/api/auth/login`          | —     | Login                         |
| POST   | `/api/auth/refresh`        | —     | Refresh access token          |
| POST   | `/api/auth/logout`         | —     | Logout                        |
| GET    | `/api/auth/me`             | User  | Get current user              |
| GET    | `/api/plans`               | User  | List all plans                |
| POST   | `/api/subscribe/:planId`   | User  | Subscribe to plan             |
| GET    | `/api/my-subscription`     | User  | Get active subscription       |
| GET    | `/api/admin/subscriptions` | Admin | All subscriptions (paginated) |

---

## Features

- JWT authentication with silent access-token refresh
- Role-based route guards (user / admin)
- Yup validation on both client and server
- Subscription progress tracker with days remaining
- Admin dashboard with status filter + pagination
- Responsive design with CSS Modules

---

## Author

**Gokul S**
Email: sgokulsw06@gmail.com  
GitHub: https://github.com/GOKULMASIVE
