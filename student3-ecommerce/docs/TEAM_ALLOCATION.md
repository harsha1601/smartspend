# Team Allocation & Responsibility Matrix

**Project:** SmartSpend: Personal Finance & E-Commerce Planning Suite  
**Collaboration Model:** 3-Student Collaborative Engineering  

---

## 👥 Student 1: Frontend & Dashboard Lead

- **Dedicated Folder:** `student1-frontend/`
- **Git Branch:** `student1-frontend`
- **Core Deliverables:**
  - Landing / Homepage with hero section and feature showcase
  - Modern responsive layout (Sidebar, Navbar, Mobile navigation drawer)
  - Authentication UI (Login and Register pages with client-side form validation)
  - Finance Dashboard:
    - Summary Cards (Total Income, Total Expense, Net Balance, Budget Remaining, Savings)
    - Recent transactions chronological table with badges
    - Monthly spending distribution charts
    - Visual budget progress bars
  - Income Management UI (Add/Edit/Delete modals, category filters, history table)
  - Expense Management UI (Add/Edit/Delete modals, category badges, payment methods)
  - Budget Management UI (Monthly budget limits setup & visual progress)
  - Savings Goals UI (Goal progress bars, deposit modal, deadline status)
  - Analytics Page (Interactive Income vs Expense bar charts, category donut charts)
  - Profile Page (User settings, preferred currency, password reset)

---

## 👥 Student 2: Backend & Database Architect

- **Dedicated Folder:** `student2-backend/`
- **Git Branch:** `student2-backend`
- **Core Deliverables:**
  - Express.js REST API server & middleware pipeline
  - Database schema models:
    - `User` (Secure credentials, profile attributes)
    - `Income` (Financial inflows, sources, categories)
    - `Expense` (Outflows, payment methods, categories)
    - `Budget` (Monthly allocations, category spending caps)
    - `SavingsGoal` (Targets, accumulation, deadlines)
    - `ShoppingItem` (Planned purchases, quantities, priority ratings)
  - Security Architecture:
    - Password encryption using `bcryptjs`
    - Stateless JWT authentication middleware
    - Input sanitization & validation middleware
    - CORS, security headers, and error handling
  - Automatic dual database engine (MongoDB + Zero-setup embedded fallback datastore)
  - Realistic seed dataset generator (`seedData.js`)

---

## 👥 Student 3: E-Commerce, QA & Documentation Lead

- **Dedicated Folder:** `student3-ecommerce/`
- **Git Branch:** `student3-ecommerce`
- **Core Deliverables:**
  - E-Commerce Shopping Planner:
    - Planned purchases wishlist management
    - Priority-based queueing (High, Medium, Low)
    - Target purchase date and direct store URL linking
    - Real-time planned total outlay calculation
    - Toggle purchase fulfillment status
  - Product Search and Filtering Engine:
    - Live multi-field text search
    - Category pills & dropdown filters
    - Price boundary range filtering (Min / Max)
    - Multi-attribute sorting (Price asc/desc, target date soonest, priority)
  - Budget Impact Analysis Calculator:
    - Compares planned wishlist outlays against current monthly remaining budget
    - Flags warnings when planned purchases exceed discretionary balance
  - Automated Integration & Contract Test Suite:
    - Auth suite (`auth.test.js`)
    - Finance suite (`finance.test.js`)
    - Shopping suite (`shopping.test.js`)
    - Analytics suite (`analytics.test.js`)
    - Master test orchestrator (`run-all-tests.js`)
  - Complete Documentation:
    - API Specification (`API_DOCUMENTATION.md`)
    - GitHub Workflow & PR Guide (`GITHUB_WORKFLOW.md`)
    - QA Test Report (`TEST_REPORT.md`)
    - Root Project README and templates
