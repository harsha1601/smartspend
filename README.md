# SmartSpend: Personal Finance & E-Commerce Planning Suite

[![Node.js](https://img.shields.io/badge/Node.js-v20+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-blue.svg)](https://reactjs.org/)
[![Express](https://img.shields.io/badge/Backend-Express.js-black.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB%20%2F%20Mongoose-brightgreen.svg)](https://www.mongodb.com/)
[![Tests](https://img.shields.io/badge/Tests-22%2F22%20Passing-success.svg)](student3-ecommerce/docs/TEST_REPORT.md)
[![GitHub Team Collaboration](https://img.shields.io/badge/Collaboration-3--Student%20Team-indigo.svg)](#-team-member-responsibilities--folder-breakdown)

> A modern, full-stack personal finance and e-commerce planning web application that unifies day-to-day income and expense tracking, category-based budgeting, savings goal milestones, and shopping wishlist budgeting into one cohesive dashboard.

---

## 📑 Table of Contents
1. [Project Overview & Problem Statement](#-project-overview--problem-statement)
2. [Objectives](#-objectives)
3. [Technology Stack](#-technology-stack)
4. [Team Member Responsibilities & Folder Breakdown](#-team-member-responsibilities--folder-breakdown)
5. [System Architecture](#-system-architecture)
6. [Database Schema Models](#-database-schema-models)
7. [Core Features](#-core-features)
8. [REST API Documentation](#-rest-api-documentation)
9. [Installation & Setup Guide](#-installation--setup-guide)
10. [How to Run Frontend](#-how-to-run-frontend)
11. [How to Run Backend](#-how-to-run-backend)
12. [Automated Test Suite](#-automated-test-suite)
13. [GitHub Collaboration Workflow](#-github-collaboration-workflow)
14. [Default Demonstration Account](#-default-demonstration-account)
15. [Future Enhancements](#-future-enhancements)

---

## 🎯 Project Overview & Problem Statement

### Problem Statement
Managing personal finances while simultaneously planning consumer purchases is fragmented. Most individuals track income and monthly expenditures in one app (or spreadsheet) while saving planned purchases across various e-commerce wishlists (Amazon, Best Buy, etc.). This separation leads to impulse purchases, budget deficits, and delayed savings goals because users cannot evaluate whether an upcoming planned purchase fits within their current monthly discretionary budget.

### The Solution: SmartSpend
SmartSpend bridges this gap by directly integrating an **E-Commerce Shopping Planner** with a **Personal Finance & Budgeting Suite**. As users plan products to purchase, SmartSpend calculates the real-time financial impact against current disposable balances and monthly category spending caps, warning users before budget limits are breached.

---

## 🚀 Objectives
- Provide a centralized dashboard displaying net balance, total income, total expenses, savings accumulations, and queued shopping outlays.
- Offer full CRUD operations for Incomes, Expenses, Budgets, Savings Goals, and Shopping Items.
- Calculate dynamic budget utilization and issue visual alerts when approaching (80%+) or exceeding (100%+) limits.
- Deliver an E-Commerce planner with multi-attribute filtering (category, price range, priority rating) and live search.
- Implement secure stateless authentication using JWT and bcrypt password encryption.
- Structure the project into isolated workspaces divided among 3 students to showcase real-world GitHub team collaboration.

---

## 🛠 Technology Stack

| Layer | Technologies Used |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, Chart.js, React-ChartJS-2, React Router v6 |
| **Backend** | Node.js (v20+), Express.js, RESTful APIs, JSON Web Tokens (JWT), Bcrypt.js |
| **Database** | MongoDB & Mongoose ODM (with automatic resilient local persistence fallback) |
| **Testing** | Node.js HTTP integration test suite (22 automated test cases, 100% pass rate) |
| **Version Control** | Git & GitHub (Feature branching, PR templates, code review checklists) |

---

## 👥 Team Member Responsibilities & Folder Breakdown

Each student's deliverables are divided into dedicated folders:

```
smartspend/
├── student1-frontend/      # Student 1: React UI, Dashboard, Finance Management, Charts
├── student2-backend/       # Student 2: Express Server, MongoDB Models, REST APIs, Auth
├── student3-ecommerce/     # Student 3: Shopping Planner, Product Search, Test Suite, Docs
├── .github/                # GitHub Issue & Pull Request Templates
├── start-all.js            # Unified launcher running frontend & backend concurrently
├── package.json            # Root project orchestrator
└── README.md               # Master project documentation
```

### 👤 Student 1 – Frontend & Dashboard (`student1-frontend`)
*Branch:* `student1-frontend`
- **Homepage & Shell:** Responsive landing page, sidebar navigation drawer, top navbar with notification dropdown.
- **Personal Finance Dashboard:** 5 core KPI summary cards, budget progress meter, recent transactions feed, doughnut chart.
- **Finance UI:**
  - Income Management UI (`IncomePage.jsx`) with category and search filters.
  - Expense Management UI (`ExpensePage.jsx`) with payment methods and category pills.
  - Budget Management UI (`BudgetPage.jsx`) with category spending caps and warning badges.
  - Savings Goals UI (`SavingsGoalsPage.jsx`) with progress meters and quick deposit modals.
  - Analytics & Visualizations (`AnalyticsPage.jsx`) with Chart.js 6-month trends and donuts.
  - User Profile & Preferences (`ProfilePage.jsx`) with multi-currency options (USD, EUR, GBP, INR).

### 👤 Student 2 – Backend & Database (`student2-backend`)
*Branch:* `student2-backend`
- **Express Server & Middleware:** Modular REST routing, CORS, logging with Morgan, centralized error handling.
- **Database Modeling:** 6 Mongoose models (`User`, `Income`, `Expense`, `Budget`, `SavingsGoal`, `ShoppingItem`).
- **Authentication & Security:** JWT issuance and verification, password hashing with bcrypt, input sanitization and positive amount validation.
- **Resilient Datastore Engine:** High-performance MongoDB connection with automatic local persistence fallback (`.data/smartspend.json`) guaranteeing instant demo execution.
- **Realistic Seed Dataset:** Automated seed generator (`seedData.js`) pre-populating transactions, budgets, goals, and wishlist items.

### 👤 Student 3 – E-Commerce, Testing & Documentation (`student3-ecommerce`)
*Branch:* `student3-ecommerce`
- **E-Commerce Shopping Planner:** Component (`ShoppingPlanner.jsx`) with priority queueing (`High`, `Medium`, `Low`), quantity adjustments, purchase fulfillment toggle, and store links.
- **Product Search & Filtering:** Component (`ProductSearch.jsx`) with live keyword search, category pills, price range boundaries (Min/Max), and price/date sorting.
- **Budget Impact Calculator:** Real-time analysis comparing planned wishlist outlays against remaining monthly budget.
- **Automated Test Suite:** 22 automated end-to-end integration tests (`tests/run-all-tests.js`).
- **Comprehensive Documentation:** API Specifications, GitHub Workflow Guide, Team Allocation Matrix, and QA Test Report.

---

## 🏗 System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│               STUDENT 1: REACT FRONTEND (Vite)                  │
│   Landing Page │ Dashboard │ Incomes │ Expenses │ Budgets       │
│   Savings Goals │ Analytics (Chart.js) │ Profile Settings       │
└────────────────┬───────────────────────────────┬────────────────┘
                 │                               │
                 │ [Direct Component Mount]      │ [REST API Calls / JSON]
                 ▼                               ▼
┌─────────────────────────────────┐   ┌───────────────────────────┐
│   STUDENT 3: E-COMMERCE SUITE   │   │ STUDENT 2: BACKEND SERVER │
│ • Shopping Planner Wishlist     │   │ • Express.js REST API     │
│ • Product Search & Filtering    │   │ • JWT Auth Middleware     │
│ • Budget Impact Alert Engine    │   │ • Input Sanitization      │
│ • Automated Test Runner (22/22) │   │ • Realistic Data Seeder   │
└─────────────────────────────────┘   └─────────────┬─────────────┘
                                                    │
                                                    ▼
                                      ┌───────────────────────────┐
                                      │    PERSISTENCE LAYER      │
                                      │ • MongoDB & Mongoose ODM  │
                                      │ • Local Fallback Store    │
                                      └───────────────────────────┘
```

---

## 🗄 Database Schema Models

### 1. `User`
- `name`: String (required)
- `email`: String (required, unique, lowercase)
- `password`: String (hashed with bcryptjs)
- `monthlyBudgetLimit`: Number (default: 3000)
- `currency`: String (default: 'USD')
- `avatar`: String

### 2. `Income`
- `userId`: String / ObjectId (ref: User)
- `title`: String (required)
- `amount`: Number (required, min > 0)
- `category`: Enum (`Salary`, `Freelance`, `Investments`, `Business`, `Side Hustle`, `Gifts`, `Other`)
- `date`: String (YYYY-MM-DD)
- `description`: String

### 3. `Expense`
- `userId`: String / ObjectId (ref: User)
- `title`: String (required)
- `amount`: Number (required, min > 0)
- `category`: Enum (`Food`, `Travel`, `Education`, `Shopping`, `Bills`, `Entertainment`, `Healthcare`, `Other`)
- `date`: String (YYYY-MM-DD)
- `paymentMethod`: Enum (`Credit Card`, `Debit Card`, `Cash`, `Bank Transfer`, `UPI/Digital`)
- `notes`: String

### 4. `Budget`
- `userId`: String / ObjectId
- `month`: Number (1–12)
- `year`: Number (e.g., 2026)
- `totalBudget`: Number
- `categoryBudgets`: Array of `{ category: String, limit: Number }`

### 5. `SavingsGoal`
- `userId`: String / ObjectId
- `title`: String (required)
- `targetAmount`: Number (required)
- `currentAmount`: Number (default: 0)
- `targetDate`: String (YYYY-MM-DD)
- `category`: Enum (`Emergency Fund`, `Vacation`, `Gadgets`, `Vehicle`, `Education`, `Home`, `Other`)
- `status`: Enum (`In Progress`, `Completed`, `On Hold`)

### 6. `ShoppingItem`
- `userId`: String / ObjectId
- `name`: String (required)
- `category`: Enum (`Electronics`, `Clothing`, `Home & Kitchen`, `Books & Media`, `Health & Beauty`, `Fitness & Sports`, `Other`)
- `price`: Number (required)
- `quantity`: Number (default: 1)
- `priority`: Enum (`High`, `Medium`, `Low`)
- `expectedDate`: String
- `isPurchased`: Boolean (default: false)
- `productUrl`: String
- `notes`: String

---

## 📡 REST API Documentation

### Base URL: `http://localhost:5000/api`

| Group | Method | Endpoint | Description | Auth |
|---|---|---|---|---|
| **Auth** | `POST` | `/auth/register` | Register new user | Public |
| **Auth** | `POST` | `/auth/login` | Login and obtain JWT | Public |
| **Auth** | `GET` | `/auth/profile` | Get authenticated user info | Bearer |
| **Auth** | `PUT` | `/auth/profile` | Update profile and password | Bearer |
| **Income** | `GET` | `/incomes` | List incomes (filters: `category`, `search`) | Bearer |
| **Income** | `POST` | `/incomes` | Create income record | Bearer |
| **Income** | `PUT` | `/incomes/:id` | Edit income record | Bearer |
| **Income** | `DELETE` | `/incomes/:id` | Delete income record | Bearer |
| **Expense** | `GET` | `/expenses` | List expenses (filters: `category`, `paymentMethod`, `search`) | Bearer |
| **Expense** | `POST` | `/expenses` | Log new expense | Bearer |
| **Expense** | `PUT` | `/expenses/:id` | Edit expense | Bearer |
| **Expense** | `DELETE` | `/expenses/:id` | Delete expense | Bearer |
| **Budget** | `GET` | `/budgets` | Fetch current monthly budget limits | Bearer |
| **Budget** | `POST` | `/budgets` | Set or update monthly budget allocations | Bearer |
| **Budget** | `GET` | `/budgets/status` | Real-time budget utilization % and alerts | Bearer |
| **Savings** | `GET` | `/savings` | List savings goals with progress % | Bearer |
| **Savings** | `POST` | `/savings` | Create new savings target | Bearer |
| **Savings** | `POST` | `/savings/:id/contribute` | Add deposit towards goal | Bearer |
| **Savings** | `DELETE` | `/savings/:id` | Remove savings goal | Bearer |
| **Shopping** | `GET` | `/shopping` | List items (search, category, price, priority, sort) | Bearer |
| **Shopping** | `POST` | `/shopping` | Add product to shopping wishlist | Bearer |
| **Shopping** | `PATCH` | `/shopping/:id/toggle-purchased` | Toggle planned vs purchased | Bearer |
| **Shopping** | `DELETE` | `/shopping/:id` | Remove product | Bearer |
| **Shopping** | `GET` | `/shopping/budget-impact` | Budget deficit & impact analysis | Bearer |
| **Analytics** | `GET` | `/analytics/dashboard` | KPI totals, active alerts & recent transactions | Bearer |
| **Analytics** | `GET` | `/analytics/charts` | 6-month trends and category distributions | Bearer |

*(Full request/response JSON payloads are available in [`student3-ecommerce/docs/API_DOCUMENTATION.md`](student3-ecommerce/docs/API_DOCUMENTATION.md))*

---

## 💻 Installation & Setup Guide

### Prerequisites
- **Node.js** (v18.0.0 or higher recommended)
- **npm** (v9.0.0 or higher)
- **MongoDB** (Optional: the app automatically connects to local MongoDB or MongoDB Atlas if configured in `.env`; if MongoDB is not running, it automatically activates the built-in local persistent store for instant demo execution!)

### Quick Start (All-in-One)
```bash
# Clone the repository
git clone https://github.com/your-org/smartspend.git
cd smartspend

# Install backend dependencies
cd student2-backend && npm install && cd ..

# Install frontend dependencies
cd student1-frontend && npm install && cd ..

# Run both servers concurrently with one command:
npm run dev
```

Visit **http://localhost:5173** in your browser.

---

## 🖥 How to Run Frontend

```bash
cd student1-frontend
npm install
npm run dev
```
- Runs on: `http://localhost:5173`
- Configured with Vite HMR and automatic proxying to backend `http://localhost:5000/api`.

---

## ⚙️ How to Run Backend

```bash
cd student2-backend
npm install
npm run seed      # Pre-populates realistic demonstration data
npm start         # Starts backend API on http://localhost:5000
```
- Health Check: `http://localhost:5000/api/health`

---

## 🧪 Automated Test Suite

Student 3 engineered 22 automated integration tests verifying authentication, financial CRUD, shopping calculations, and analytical KPIs.

```bash
cd student3-ecommerce
npm test
```

### Execution Summary:
```
================================================================
📊 FINAL TEST EXECUTION SUMMARY
================================================================
Total Test Cases Executed : 22
Passed                    : 22 ✅
Failed                    : 0 
Success Rate              : 100.0%
================================================================
✨ ALL SYSTEM & API CONTRACT TESTS PASSED WITH ZERO ERRORS!
```

---

## 🌿 GitHub Collaboration Workflow

The project is structured according to professional GitHub team collaboration best practices:

```
                  ┌──────────────────────┐
                  │     main branch      │
                  └──────────▲───────────┘
                             │
            ┌────────────────┼────────────────┐
            │ (Pull Request) │ (Pull Request) │ (Pull Request)
            │                │                │
┌───────────────────┐ ┌───────────────┐ ┌───────────────────┐
│ student1-frontend │ │student2-backend│ │student3-ecommerce │
└───────────────────┘ └───────────────┘ └───────────────────┘
```

1. **Main Branch Protection:** Production-ready code lives on `main`. Direct commits to `main` are restricted.
2. **Student Feature Branches:**
   - `student1-frontend`
   - `student2-backend`
   - `student3-ecommerce`
3. **Semantic Commits:**
   - `feat: create personal finance dashboard cards and charts`
   - `feat: implement shopping planner and priority filters`
   - `feat: add income and expense CRUD REST APIs`
   - `fix: validate positive amounts for expense records`
   - `test: add integration test suite for authentication and shopping`
   - `docs: complete API specification and GitHub team workflow`
4. **Pull Requests & Code Reviews:** Pull requests are created using the `.github/PULL_REQUEST_TEMPLATE.md` and reviewed by a peer student before merging into `main`.

---

## 🔑 Default Demonstration Account

For instant presentation or evaluation, a pre-populated demo account is available with 6 months of realistic transactions, budgets, goals, and wishlist items:

- **Email:** `demo@smartspend.com`
- **Password:** `password123`
- *(Or click the **"⚡ 1-Click Demo Login"** button on the Login or Landing page)*

---

## 🔮 Future Enhancements
- **Bank Account Integration:** Plaid / Open Banking API sync for automated bank feeds.
- **AI Financial Advisor:** LLM-powered recommendations on discretionary spending adjustments.
- **Barcode & Receipt Scanning:** OCR scanning of physical grocery receipts into expenses.
- **Price Drop Alerts:** Webhooks tracking live Amazon/eBay price drops on planned wishlist items.
- **Export Reports:** PDF & CSV statement exports for tax filing and financial accounting.
