# Coupon App — Frontend

React + TypeScript frontend for managing supermarket coupon codes received via SMS and email.

## Stack

- **Framework:** React + TypeScript
- **Build tool:** Vite
- **Styling:** Tailwind CSS (shadcn/ui may be added later — it builds on Tailwind, no migration needed)
- **Auth storage:** JWT stored in `localStorage`, attached to all API requests
- **HTTP:** native `fetch`
- **PWA:** vite-plugin-pwa (service worker, installable on Android)

## Screens

### Main Screen

Grid of supplier cards, each showing a colour-coded initial and current available balance. Includes email import button. Total balance and last sync time shown in header.

### Supplier Screen

Two collapsible sections — Available and Used coupons. Sortable by value or date. Available and used balances in header. Colour picker to set the card colour (persisted per user in the backend).

### Coupon Viewer Screen

Displays the coupon code in large text (grouped in 4s) for manual entry at checkout. Tap to copy with haptic feedback. Toggle used/unused with confirmation.

### Login Screen

Email + password login. JWT stored in `localStorage`.

### Register Screen

Email + password registration with confirmation field. Email pre-filled when navigating from Login.

## API

Talks to a FastAPI backend. Base URL configured via environment variable.

| Method | Endpoint                    | Description                          |
|--------|-----------------------------|--------------------------------------|
| POST   | `/auth/register`            | Register a new user                  |
| POST   | `/auth/login`               | Login, returns JWT                   |
| GET    | `/suppliers`                    | All suppliers with available balance and color |
| PATCH  | `/suppliers/{id}/preference`    | Update supplier color preference             |
| GET    | `/suppliers/{id}/coupons`       | Coupons for a supplier                       |
| PATCH  | `/coupons/{id}/use`             | Mark a coupon as used/unused (toggle)        |
| POST   | `/import/email`                 | Trigger email import                         |
| GET    | `/auth/me`                      | Get current user (last sync time)            |

## Environments

| Env | API URL |
|-----|---------|
| Local | `http://localhost:8000` |
| Production | `https://api.yam-ti.com` |

Frontend is deployed at `https://app.yam-ti.com` via Cloudflare Pages.

## Design

- Mobile-first
- No design system yet — TBD (Tailwind → shadcn/ui when ready)

## Project Structure

```
src/
├── api/          # API client and typed request functions
├── components/   # Shared UI components (Toast, ColorPicker, Skeletons, EmptyState, PasswordInput)
├── pages/        # Screen-level components
├── store/        # Global state (auth token)
└── types/        # Shared TypeScript types (Supplier, Coupon, User)
```

## Roadmap

| # | Stage | Status |
|---|-------|--------|
| 1 | Project scaffold — Vite + React + TS + Tailwind | ✅ |
| 2 | TypeScript types | ✅ |
| 3 | API client | ✅ |
| 4 | Auth store — JWT in localStorage | ✅ |
| 5 | Login screen | ✅ |
| 6 | Register screen | ✅ |
| 7 | Routing — protected routes | ✅ |
| 8 | Main screen | ✅ |
| 9 | Supplier screen — two lists, sortable by value/date | ✅ |
| 10 | Coupon Viewer screen — large code, toggle used | ✅ |
| 11 | PWA — installable on Android | ✅ |
| 12 | Pull to refresh on Main and Supplier screens | 🗑️ removed |
| 13 | Logout confirmation | ✅ |
| 14 | Production deployment — Cloudflare Pages | ✅ |
| 15 | Add Coupon screen — needs design: new supplier flow, code requirement TBD | 🔲 |
| 16 | 401 auto-logout — redirect to login on expired token | ✅ |
| 17 | Refresh sync time after email import | ✅ |
| 18 | Coupon code copy button on Coupon Viewer | ✅ |
| 19 | Total balance in main screen header | ✅ |
| 20 | Toast notifications — replace inline banners | ✅ |
| 21 | Loading skeletons on main and supplier screens | ✅ |
| 22 | Empty state illustrations | ✅ |
| 23 | Supplier name in Coupon Viewer header | ✅ |
| 24 | Error toast on Supplier screen | ✅ |
| 25 | Collapsible Available / Used coupon sections | ✅ |
| 26 | "Never synced" label when no import has run | ✅ |
| 27 | Email carry-over from Login to Register screen | ✅ |
| 28 | Password confirmation field on Register | ✅ |
| 29 | Password visibility toggle on Login and Register | ✅ |
| 30 | Available balance in Supplier screen header | ✅ |
| 31 | Spinner inside Import email button | ✅ |
| 32 | Auto-refresh "Synced X ago" every 60 seconds | ✅ |
| 33 | Fix: 401 on failed login caused page reload | ✅ |
| 34 | Supplier card colour picker — persisted in backend | ✅ |
| 35 | Remove pull-to-refresh | ✅ |
| 36 | Used balance in Supplier screen header | ✅ |
| 37 | Haptic feedback on coupon code copy | ✅ |

## Getting Started

```bash
cp .env.example .env
npm install
npm run dev
```
