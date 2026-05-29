# Barcode Coupon Manager — Frontend

React + TypeScript frontend for managing supermarket coupon codes received via SMS and email.

## Stack

- React
- TypeScript

## Screens

### Main Screen

Grid of supplier cards, each showing the supplier name and current available balance (sum of unused coupons).

### Supplier Screen

List of all coupons for a selected supplier. Used coupons are grayed out. Sortable by value.

### Coupon Viewer Screen

Displays the coupon code in large format for manual entry at checkout. Shows a placeholder if the code has not yet been parsed.

Actions:
- **Mark Used** — prompts confirmation before marking the coupon as used
- **Back**

### Login Screen

Email + password login. JWT token stored client-side and attached to all API requests.

## API

Talks to a FastAPI backend. Base URL configured via environment variable.

| Method  | Endpoint                      | Description                      |
|---------|-------------------------------|----------------------------------|
| GET     | `/suppliers`                  | All suppliers with available balance |
| GET     | `/suppliers/{id}/coupons`     | Coupons for a supplier           |
| POST    | `/coupons`                    | Add a coupon manually            |
| PATCH   | `/coupons/{id}/use`           | Mark a coupon as used            |

## Project Structure (planned)

```
src/
├── api/          # API client and typed request functions
├── components/   # Shared UI components
├── pages/        # Screen-level components (Main, Supplier, CouponViewer, Login)
├── store/        # Global state (auth token, selected supplier)
└── types/        # Shared TypeScript types (Supplier, Coupon, User)
```

## Getting Started

```bash
npm install
npm run dev
```
