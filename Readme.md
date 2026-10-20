# RateMyStore

A full-stack web application where users can view registered stores, submit and update ratings (1–5), and where store owners can track their store's ratings.

## Live Links

- **Live App:** https://store-rating-app-5gb3.vercel.app
- **Backend API:** https://store-rating-api-o075.onrender.com
- **Repository:** https://github.com/Pranjali2005/store-rating-app

## Tech Stack

- **Frontend:** React (Vite) + Tailwind CSS
- **Backend:** Node.js + Express.js
- **Database:** MongoDB (MongoDB Atlas)
- **Auth:** JWT-based authentication, password hashing with bcrypt
- **Deployment:** Frontend on Vercel, Backend on Render

## Features

### Authentication
- User registration (Name, Email, Address, Password) and login
- Role-based redirect after login
- Logout

### Normal User
- View all registered stores
- Search stores by name
- View each store's name, address, and average rating
- Submit a rating (1–5) for a store
- Update a previously submitted rating
- View their own submitted rating per store

### Store Owner
- View dashboard with their store's name and average rating
- View list of users who rated their store, with individual ratings

## Validation Rules

| Field    | Rule                                                              |
|----------|--------------------------------------------------------------------|
| Name     | 20–60 characters                                                  |
| Address  | Max 400 characters                                                |
| Password | 8–16 characters, at least one uppercase letter and one special char |
| Email    | Must be valid email format                                        |
| Rating   | Whole number, 1–5, one rating per user per store (updatable)      |

## Project Structure

```
store-rating-app/
├── client/     # React (Vite) frontend
├── server/     # Node/Express backend
└── README.md
```

## Setup Instructions (Local Development)

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas connection string (or local MongoDB instance)

### Backend

```bash
cd server
npm install
```

Create a `.env` file in `server/` (see [Environment Variables](#environment-variables) below), then:

```bash
npm start
```

### Frontend

```bash
cd client
npm install
npm run dev
```

The frontend will run on `http://localhost:5173` by default and the backend on the port set in `.env`.

## Environment Variables

Create a `.env` file inside `server/` with the following keys (values are secrets — not committed to this repo):

```
MONGO_URI=
JWT_SECRET=
PORT=
```

## Test Credentials

> Use these accounts to log in directly without registering. All seeded demo accounts share the same password.

**Normal Users**
- `user1@example.com` / `Test@1234`
- `user2@example.com` / `Test@1234`
- `user3@example.com` / `Test@1234`

**Store Owners**
- `owner1@example.com` / `Test@1234`
- `owner2@example.com` / `Test@1234`
- `owner3@example.com` / `Test@1234`

## API Overview

| Method | Endpoint                     | Access       | Description                          |
|--------|-------------------------------|--------------|---------------------------------------|
| POST   | `/api/auth/register`          | Public       | Register a new user                   |
| POST   | `/api/auth/login`             | Public       | Login and receive JWT                 |
| GET    | `/api/stores`                 | Normal User  | List all stores (supports search)     |
| POST   | `/api/stores/:id/rate`        | Normal User  | Submit or update a rating             |
| GET    | `/api/owner/dashboard`        | Store Owner  | View store's average rating + raters  |

## Notes

- Passwords are hashed before being stored.
- Backend enforces role-based authorization independently of frontend route guarding.
- Users cannot view or modify another user's rating.