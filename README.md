# Stackvine — MERN Stack

A full-stack agency website built with **MongoDB · Express · React · Node.js**.

## Prerequisites
- Node.js 18+
- MongoDB running locally (`mongod`) **OR** a MongoDB Atlas connection string

## Quick Start

### 1. Start MongoDB
```bash
# Make sure MongoDB is running locally
mongod
```

### 2. Install & seed the backend
```bash
cd server
npm install
npm run seed       # Creates admin account + seeds DB with projects/jobs/testimonials/stats
npm run dev        # Starts API server on http://localhost:5000
```

### 3. Start the frontend
```bash
cd client
npm install
npm run dev        # Starts Vite dev server on http://localhost:5173
```

Open http://localhost:5173

## Admin Panel
Navigate to **http://localhost:5173/admin**

Default credentials:
- Email: `admin@stackvine.io`
- Password: `stackvine123`

> ⚠️ Change the password after first login by editing `server/utils/seed.js` and re-running `npm run seed`.

## API Endpoints

### Public
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/contact` | Submit contact form |
| POST | `/api/careers/apply` | Submit job application |
| GET | `/api/projects` | Get all projects |
| GET | `/api/testimonials` | Get all testimonials |
| GET | `/api/jobs` | Get active jobs |
| GET | `/api/stats` | Get stat counters |

### Admin (JWT required)
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/admin/auth/login` | Get JWT token |
| GET | `/api/admin/contacts` | View all contacts |
| PATCH | `/api/admin/contacts/:id/read` | Mark read/unread |
| DELETE | `/api/admin/contacts/:id` | Delete contact |
| GET | `/api/admin/applications` | View all applications |
| GET/POST/PUT/DELETE | `/api/admin/projects` | Manage projects |
| GET/POST/PUT/DELETE | `/api/admin/jobs` | Manage job listings |
| GET | `/api/admin/stats` | View stats |
| PATCH | `/api/admin/stats/:key` | Update stat value |

## Environment Variables
Copy `server/.env.example` to `server/.env` and fill in:
- `MONGO_URI` — MongoDB connection string
- `JWT_SECRET` — Secret for signing JWTs
- `MAIL_USER` / `MAIL_PASS` — Gmail SMTP for email notifications (optional)

## Project Structure
```
├── client/          React + Vite frontend
│   └── src/
│       ├── components/   All page sections + admin panel
│       ├── hooks/        useReveal, useCounter
│       └── api/          Axios instance
└── server/          Node.js + Express API
    ├── models/       Mongoose schemas
    ├── routes/       API routes (public + admin)
    ├── middleware/   JWT auth, error handler
    └── utils/        Mailer, seed script
```
