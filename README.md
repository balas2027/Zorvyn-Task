# Finance Dashboard UI Assignment

Frontend project for a finance dashboard assignment focused on UI clarity, interactivity, state handling, and responsive design.

---

## Tech Stack

* React + Vite
* Tailwind CSS + custom theme tokens
* Recharts (visualizations)
* MUI Drawer (advanced transaction filters)
* Context API + local component state
* Node.js + Express.js (Backend)
* MongoDB (DataBase)

---

## Run Instructions

### Install dependencies

```bash
npm install
```

### Start development server

```bash
npm run dev
```

---

## Build Production Bundle

```bash
npm run build
```

---

## Lint the Codebase

```bash
npm run lint
```

---

## Assignment Feature Mapping

### 1. Dashboard Overview

* Summary cards: Total Balance, Income, Expenses
* Time-based chart: Income vs Expense trend
* Categorical chart: Category-wise pie visualization

---

### 2. Transactions Section

* Tabular transaction listing with Date, Amount, Category, Type
* Search by transaction name
* Sorting by date
* Filter drawer with Type, Category, Min/Max amount, Date range, Year
* Pagination support

---

### 3. Basic Role-Based UI (Frontend Simulated)

* Role selector in top navbar (`Admin` / `Viewer`)
* `Viewer` mode is read-only
* `Admin` mode can create/edit/delete transactions

---

### 4. Insights Section

* Highest spending category card
* Current month vs previous month comparison
* Auto-generated observation text based on spending trend
* Existing summary metrics and chart remain available

---

### 5. State Management

* Dashboard data managed via Context (`DataDashboardContext`)
* Transaction filters, pagination, search, and form mode managed locally
* Selected role persisted in `localStorage`

---

### 6. UI and UX

* Responsive dashboard across desktop, tablet, and mobile breakpoints
* Empty states for no data scenarios
* Action notifications shown top-right for create, edit, delete, sign-in, and sign-up

---

## Project Structure (Important Files)

* `src/pages/Dashboard.jsx` – main shell, nav state, role toggle
* `src/components/dashboard/MainDashBoard.jsx` – overview cards, charts, and recent activity
* `src/components/dashboard/Transaction/` – transaction list, form, and filter logic
* `src/components/dashboard/Insights.jsx` – analytics and insight cards
* `src/api/UserDashboardData.jsx` – dashboard provider with API/mock switching
* `src/components/common/ActionNotifier.jsx` – toast notification UI provider
* `src/hooks/useActionNotifier.js` – notification hook

---

## Assumptions

* Backend endpoints may or may not be available during evaluation
* For assignment demonstration, frontend behavior takes priority over persistence guarantees
* Role simulation is intentionally UI-level only (no backend authorization)

---

## Known Limitations

* Confirm dialogs for destructive actions still use browser `window.confirm`
* Backend service and MongoDB must be running for live data operations

---

## Reusable Components Summary

Total reusable components created: **18**

Component name list:

1. `Login`
2. `Signup`
3. `ActionNotifierProvider`
4. `PageLoader`
5. `SideNavbar`
6. `MainDashBoard`
7. `MiniBarChart`
8. `BarChart`
9. `PieChartCard`
10. `Insights`
11. `Profile`
12. `Settings`
13. `Calender`
14. `CalenderSidebar`
15. `CalenderRowView`
16. `Transaction`
17. `TransactionForm`
18. `TransactionList`

---

## Backend Overview

Backend is built with **Node.js + Express + MongoDB (Mongoose)** and provides APIs for authentication, profile/settings, categories, transactions, and dashboard summaries.

---

### Backend Run Instructions

```bash
cd backend
npm install
npm run dev
```

---

### Main Backend Features

* User register and login
* User profile and account settings update
* Password change and account deletion
* Category management (including add category from frontend popup)
* Income and expense insertion
* Transaction CRUD, filters, pagination, and search
* Dashboard summary API

---

### Important Backend APIs (High Level)

* `POST /api/register`
* `POST /api/login`
* `GET /api/summary/:userId`
* `GET /api/categories`
* `POST /api/categories`
* `GET /api/transactions/:userId`
* `PUT /api/transactions/:userId/:transactionId`
* `DELETE /api/transactions/:userId/:transactionId`
* `GET /api/users/:userId/profile`
* `PUT /api/users/:userId/profile`
* `PUT /api/users/:userId/settings`
* `PUT /api/users/:userId/password`
* `DELETE /api/users/:userId`

---

### Backend File Structure

```text
backend/
	model.js
	server.js
	package.json
	package-lock.json
```
