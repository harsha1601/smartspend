# SmartSpend API Specification & Integration Contract

**Document Owner:** Student 3 (E-Commerce, QA & Documentation Lead)  
**Version:** 1.0.0  
**Base URL:** `http://localhost:5000/api`

---

## 1. Authentication Standards
All protected routes require an HTTP Authorization header formatted as:
```http
Authorization: Bearer <JWT_TOKEN>
```
Standard JSON responses include:
- `success`: `true` or `false`
- `message`: Descriptive status or error message
- `data` / `summary`: Payload object

---

## 2. API Endpoints Catalog

### Authentication & Users
#### `POST /auth/register`
Creates a new account and returns a JWT token.
- **Request Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "mypassword123",
  "monthlyBudgetLimit": 3000,
  "currency": "USD"
}
```
- **Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully!",
  "token": "eyJhbGciOi...",
  "user": {
    "id": "661f0a...",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "monthlyBudgetLimit": 3000,
    "currency": "USD"
  }
}
```

#### `POST /auth/login`
- **Request Body:**
```json
{
  "email": "demo@smartspend.com",
  "password": "password123"
}
```

#### `GET /auth/profile` *(Protected)*
Returns authenticated user profile details.

---

### Income Management
#### `GET /incomes` *(Protected)*
- **Query Params:** `category`, `search`, `startDate`, `endDate`
- **Response (200 OK):**
```json
{
  "success": true,
  "count": 4,
  "totalIncome": 6520,
  "data": [
    {
      "_id": "661f0...",
      "title": "Senior Software Engineer Salary",
      "amount": 4800,
      "category": "Salary",
      "date": "2026-10-01",
      "description": "TechCorp direct deposit"
    }
  ]
}
```

#### `POST /incomes` *(Protected)*
- **Request Body:**
```json
{
  "title": "Freelance Milestone",
  "amount": 850,
  "category": "Freelance",
  "date": "2026-10-14",
  "description": "Landing page delivery"
}
```

#### `PUT /incomes/:id` & `DELETE /incomes/:id` *(Protected)*

---

### Expense Management
#### `GET /expenses` *(Protected)*
- **Query Params:** `category`, `paymentMethod`, `search`, `startDate`, `endDate`
- **Response (200 OK):** Includes `totalExpense`, count, and array of records.

#### `POST /expenses` *(Protected)*
- **Request Body:**
```json
{
  "title": "Organic Groceries",
  "amount": 145.20,
  "category": "Food",
  "date": "2026-10-14",
  "paymentMethod": "Credit Card",
  "notes": "Trader Joe's weekly trip"
}
```

---

### Budget Tracking & Spending Limits
#### `GET /budgets` *(Protected)*
Returns monthly target budget and category spending allocations.

#### `POST /budgets` *(Protected)*
Sets or updates the monthly budget.
- **Request Body:**
```json
{
  "month": 10,
  "year": 2026,
  "totalBudget": 3200,
  "categoryBudgets": [
    { "category": "Food", "limit": 600 },
    { "category": "Bills", "limit": 1400 },
    { "category": "Shopping", "limit": 350 }
  ]
}
```

#### `GET /budgets/status` *(Protected)*
Calculates real-time utilization per category, remaining funds, and status (`Normal`, `Warning`, `Exceeded`).

---

### Savings Goals
#### `GET /savings` *(Protected)*
Returns list of goals with percentage funded and schedule adherence flags.

#### `POST /savings` *(Protected)*
- **Request Body:**
```json
{
  "title": "Japan Vacation Trip",
  "targetAmount": 3500,
  "currentAmount": 2600,
  "targetDate": "2026-12-20",
  "category": "Vacation"
}
```

#### `POST /savings/:id/contribute` *(Protected)*
Adds savings deposit amount to goal and marks completed when target is reached.

---

### E-Commerce Shopping Planner
#### `GET /shopping` *(Protected)*
- **Query Params:**
  - `search`: Keyword string matching product name or notes
  - `category`: Category string
  - `priority`: `High`, `Medium`, `Low`
  - `isPurchased`: `true` or `false`
  - `minPrice`: Lower numerical bound
  - `maxPrice`: Upper numerical bound
  - `sortBy`: `price`, `date`, `priority`, `expectedDate`
  - `sortOrder`: `asc` or `desc`

#### `POST /shopping` *(Protected)*
- **Request Body:**
```json
{
  "name": "Sony WH-1000XM5 Headphones",
  "category": "Electronics",
  "price": 348.00,
  "quantity": 1,
  "priority": "High",
  "expectedDate": "2026-11-25",
  "productUrl": "https://sony.com",
  "notes": "Noise cancellation for studying"
}
```

#### `PATCH /shopping/:id/toggle-purchased` *(Protected)*
Toggles product between planned wishlist and fulfilled purchase.

#### `GET /shopping/budget-impact` *(Protected)*
Calculates whether unpurchased planned wishlist items exceed remaining monthly discretionary budget.

---

### Analytics & Visualizations
#### `GET /analytics/dashboard` *(Protected)*
Returns overall financial summary KPIs, recent chronological transactions, category distribution, and automated multi-factor alerts.

#### `GET /analytics/charts` *(Protected)*
Returns 6-month historical Income vs Expense trend data and category distributions.
