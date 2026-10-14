# SmartSpend Backend & Database (Student 2 Workspace)

**Student 2 Role:** Backend Engineer & Database Architect  
**Branch:** `student2-backend`

---

## 📌 Responsibilities
1. **Express REST API Architecture**: Modular architecture with routes, controllers, middleware, and config.
2. **Database Modeling**: Mongoose models for `User`, `Income`, `Expense`, `Budget`, `SavingsGoal`, and `ShoppingItem`.
3. **Authentication & Security**:
   - Password hashing with `bcryptjs`.
   - JWT stateless token issuance and verification middleware.
   - Validation middleware for sanitizing inputs, email validation, and positive amount checks.
4. **Data Persistence Engine**:
   - High-performance MongoDB connection (`mongoose`).
   - Resilient automatic local persistent datastore (`.data/smartspend.json`) ensuring 100% zero-configuration out-of-the-box demo execution even if a standalone MongoDB daemon is not running on the evaluator's machine.
5. **Demonstration Dataset**:
   - Automatic seeding with realistic user records, expenses, incomes, budgets, and shopping wishlists.

---

## 🚀 How to Run Backend

```bash
cd student2-backend
npm install
npm run seed     # Pre-populates realistic demo data
npm start        # Starts server on http://localhost:5000
```

### Pre-configured Demo Account:
- **Email:** `demo@smartspend.com`
- **Password:** `password123`

---

## 📡 REST API Reference

### 1. Authentication (`/api/auth`)
| Method | Endpoint | Description | Protected |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register new user account | No |
| `POST` | `/api/auth/login` | Login user and issue JWT | No |
| `GET` | `/api/auth/profile` | Get logged-in user profile | Yes (Bearer Token) |
| `PUT` | `/api/auth/profile` | Update profile / change password | Yes (Bearer Token) |

### 2. Incomes (`/api/incomes`)
| Method | Endpoint | Description | Protected |
|---|---|---|---|
| `GET` | `/api/incomes` | List incomes (filters: `category`, `search`, `startDate`, `endDate`) | Yes |
| `POST` | `/api/incomes` | Add new income record | Yes |
| `GET` | `/api/incomes/:id` | Get specific income details | Yes |
| `PUT` | `/api/incomes/:id` | Update income record | Yes |
| `DELETE` | `/api/incomes/:id` | Delete income record | Yes |

### 3. Expenses (`/api/expenses`)
| Method | Endpoint | Description | Protected |
|---|---|---|---|
| `GET` | `/api/expenses` | List expenses (filters: `category`, `paymentMethod`, `search`, dates) | Yes |
| `POST` | `/api/expenses` | Add new expense record | Yes |
| `GET` | `/api/expenses/:id` | Get specific expense details | Yes |
| `PUT` | `/api/expenses/:id` | Update expense record | Yes |
| `DELETE` | `/api/expenses/:id` | Delete expense record | Yes |

### 4. Budgets (`/api/budgets`)
| Method | Endpoint | Description | Protected |
|---|---|---|---|
| `GET` | `/api/budgets` | Get current monthly budget & category limits | Yes |
| `POST` | `/api/budgets` | Set or update monthly budget & category allocations | Yes |
| `GET` | `/api/budgets/status` | Real-time usage tracking, percentage & warning levels | Yes |

### 5. Savings Goals (`/api/savings`)
| Method | Endpoint | Description | Protected |
|---|---|---|---|
| `GET` | `/api/savings` | List user savings goals with progress % & behind-schedule indicators | Yes |
| `POST` | `/api/savings` | Create new savings target | Yes |
| `PUT` | `/api/savings/:id` | Edit goal details | Yes |
| `POST` | `/api/savings/:id/contribute` | Add deposit / contribution to goal | Yes |
| `DELETE` | `/api/savings/:id` | Remove goal | Yes |

### 6. Shopping Planner (`/api/shopping`)
| Method | Endpoint | Description | Protected |
|---|---|---|---|
| `GET` | `/api/shopping` | List shopping items (filters: `category`, `priority`, `price`, `search`, sort) | Yes |
| `POST` | `/api/shopping` | Add product to shopping wishlist | Yes |
| `PUT` | `/api/shopping/:id` | Update product details | Yes |
| `PATCH` | `/api/shopping/:id/toggle-purchased` | Toggle item between planned and purchased | Yes |
| `DELETE` | `/api/shopping/:id` | Remove item | Yes |
| `GET` | `/api/shopping/budget-impact` | Calculate financial impact vs available balance & budget | Yes |

### 7. Analytics & Dashboard (`/api/analytics`)
| Method | Endpoint | Description | Protected |
|---|---|---|---|
| `GET` | `/api/analytics/dashboard` | KPI summaries, active multi-factor alerts, recent transactions | Yes |
| `GET` | `/api/analytics/charts` | 6-month Income vs Expense trends, Category donut breakdown, etc. | Yes |
