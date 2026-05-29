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

Grid of supplier cards, each showing the supplier name and current available balance (sum of unused coupons).

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

## API

Talks to a FastAPI backend. Base URL configured via environment variable. Some endpoints may not be available yet and will be integrated as the backend is completed.

| Method | Endpoint                    | Description                          |
|--------|-----------------------------|--------------------------------------|
| GET    | `/suppliers`                | All suppliers with available balance |
| GET    | `/suppliers/{id}/coupons`   | Coupons for a supplier               |
| POST   | `/coupons`                  | Add a coupon manually                |
| PATCH  | `/coupons/{id}/use`         | Mark a coupon as used                |

## Design

- Mobile-first
- No design system yet — TBD

## Project Structure

```
src/
├── api/          # API client and typed request functions
├── components/   # Shared UI components
├── pages/        # Screen-level components (Main, Supplier, CouponViewer, AddCoupon, Login)
├── store/        # Global state (auth token, selected supplier)
└── types/        # Shared TypeScript types (Supplier, Coupon, User)
```

## Getting Started

```bash
npm install
npm run dev
```
