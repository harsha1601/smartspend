# SmartSpend Frontend & Personal Finance Dashboard (Student 1 Workspace)

**Student 1 Role:** Frontend Engineer & Dashboard Lead  
**Branch:** `student1-frontend`

---

## 📌 Responsibilities
1. **Application Shell & Layout**:
   - Modern, responsive sidebar navigation with brand badges and mobile drawer.
   - Top navigation bar with active notifications bell, currency tags, and user avatar.
   - Protected route middleware (`ProtectedRoute`) integrating with JWT `AuthContext`.
2. **Landing / Home Page (`LandingPage.jsx`)**:
   - Responsive hero section, value proposition, and feature showcase.
   - 1-click live demo login launcher for evaluation and presentations.
   - GitHub collaboration architecture overview.
3. **Authentication Flows (`Login.jsx`, `Register.jsx`)**:
   - Secure login and registration forms with client-side validation.
   - Instant 1-click demo account auto-filler (`demo@smartspend.com` / `password123`).
4. **Personal Finance Dashboard (`Dashboard.jsx`)**:
   - 5 KPI summary stat cards: Total Income, Total Expenses, Current Net Balance, Monthly Budget cushion, Total Savings.
   - Visual budget consumption meter with real-time over-budget warnings.
   - Recent transactions feed combining both inflows and outflows.
   - Expense breakdown donut chart.
   - Quick action modals for logging income and expenses on the fly.
5. **Income Management UI (`IncomePage.jsx`)**:
   - Add/Edit/Delete modals with category selection.
   - Filter by categories and live keyword search.
6. **Expense Tracking UI (`ExpensePage.jsx`)**:
   - Add/Edit/Delete modals with payment methods and category tags.
   - Search, category filter pills, and aggregated summary stats.
7. **Monthly Budget UI (`BudgetPage.jsx`)**:
   - Overall monthly spending limit configuration.
   - Category-wise spending limits with visual progress meters and status tags (`Normal`, `Warning`, `Exceeded`).
8. **Savings Goals UI (`SavingsGoalsPage.jsx`)**:
   - Progress bars with target deadlines.
   - Quick deposit modal to contribute funds directly to any goal.
   - Behind-schedule flags.
9. **Financial Analytics & Charts (`AnalyticsPage.jsx`)**:
   - 6-month historical Income vs. Expense trend bar chart.
   - Net monthly surplus savings line chart.
   - Category expense distribution donut chart.
   - Planned shopping wishlist expenditure by category.
10. **User Profile & Preferences (`ProfilePage.jsx`)**:
    - Display settings, currency selector (USD, EUR, GBP, INR), monthly target budget, and password change.

---

## 🚀 How to Run Frontend

```bash
cd student1-frontend
npm install
npm run dev
```

The frontend will start on `http://localhost:5173` with Vite hot-module replacement and automatically proxy API calls to the backend on port 5000.
