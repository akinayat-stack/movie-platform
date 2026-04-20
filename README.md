# Simple Full-Stack App

Frontend: React + Redux + React Router + Axios + Material UI.
Backend: Node.js + Express + MongoDB + JWT.

## Structure

- `backend` for API and database models.
- `src` for React frontend.

## Backend setup

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

## Frontend setup

```bash
npm install
npm run dev
```

## Features

- JWT authentication (`admin`, `user`).
- Role-based route protection.
- One-to-many models: Category -> Products.
- Full CRUD for categories and products.
- Redux store with exactly 2 reducers: `authReducer`, `dataReducer`.
- Notifications for auth and CRUD actions.
- Confirmation modal for delete actions.
