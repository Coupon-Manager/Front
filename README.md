# Coupon Manager — Frontend

React + TypeScript frontend for managing supermarket coupon codes received via SMS and email.

## Stack

- **Framework:** React + TypeScript
- **Build tool:** Vite
- **Styling:** Tailwind CSS (shadcn/ui may be added later — it builds on Tailwind, no migration needed)
- **Auth storage:** JWT stored in `localStorage`, attached to all API requests
- **HTTP:** native `fetch`

## Screens

### Main Screen

Grid of supplier cards, each showing the supplier logo (if available) and current available balance (sum of unused coupons). Includes a button to trigger email import.

### Supplier Screen

List of all coupons for a selected supplier. Used coupons are grayed out. Sortable by value.

### Coupon Viewer Screen

Displays the coupon code in large text format for manual entry at checkout. Shows a placeholder if the code has not yet been parsed.

Actions:
- **Mark Used** — prompts confirmation before marking the coupon as used
- **Back**

### Add Coupon Screen

Manual entry form for adding a new coupon (calls `POST /coupons`).

### Login Screen

Email + password login. JWT stored in `localStorage` and attached to all API requests.

### Register Screen

Email + password registration.

## API

Talks to a FastAPI backend. Base URL configured via environment variable. Some endpoints may not be available yet and will be integrated as the backend is completed.

| Method | Endpoint                    | Description                          |
|--------|-----------------------------|--------------------------------------|
| POST   | `/auth/register`            | Register a new user                  |
| POST   | `/auth/login`               | Login, returns JWT                   |
| GET    | `/suppliers`                | All suppliers with available balance |
| GET    | `/suppliers/{id}/coupons`   | Coupons for a supplier               |
| POST   | `/coupons`                  | Add a coupon manually                |
| PATCH  | `/coupons/{id}/use`         | Mark a coupon as used                |
| POST   | `/import/email`             | Trigger email import                 |

## Design

- Mobile-first
- No design system yet — TBD

## Project Structure

```
src/
├── api/          # API client and typed request functions
├── components/   # Shared UI components
├── pages/        # Screen-level components (Main, Supplier, CouponViewer, AddCoupon, Login, Register)
├── store/        # Global state (auth token, selected supplier)
└── types/        # Shared TypeScript types (Supplier, Coupon, User)
```

## Roadmap

| # | Stage | Status |
|---|-------|--------|
| 1 | Project scaffold — Vite + React + TS + Tailwind + folder structure | ✅ |
| 2 | TypeScript types — Supplier, Coupon, User | ✅ |
| 3 | API client — base fetch wrapper + typed endpoint functions | ⬜ |
| 4 | Auth store — JWT in localStorage, login/logout | ⬜ |
| 5 | Login screen | ⬜ |
| 6 | Register screen | ⬜ |
| 7 | Routing — protected routes, redirect to login | ⬜ |
| 8 | Main screen — supplier cards grid, logo, email import button | ⬜ |
| 9 | Supplier screen — coupon list, sortable, used grayed out | ⬜ |
| 10 | Coupon Viewer screen — large code, Mark Used, Back | ⬜ |
| 11 | Add Coupon screen — manual entry form | ⬜ |

## Getting Started

```bash
npm install
npm run dev
```
