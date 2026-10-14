# GitHub Team Collaboration & Branching Workflow

**SmartSpend: Personal Finance & E-Commerce Planning Suite**  
**Course Project Guide:** Team Collaboration Using GitHub  
**Author:** Student 3 (E-Commerce, QA & Documentation Lead)

---

## 1. Branching Strategy

Our team utilizes a feature-branch workflow rooted on `main`:

```
main (Production-Ready Codebase)
  │
  ├── student1-frontend   (Student 1: Landing, Dashboard, Income/Expense/Budget UI, Charts)
  │
  ├── student2-backend    (Student 2: Express Server, MongoDB, Auth, REST APIs, Validation)
  │
  └── student3-ecommerce  (Student 3: Shopping Planner, Product Search, Test Suite, Docs)
```

---

## 2. Step-by-Step GitHub Lifecycle

### Step 1: Clone Repository & Create Student Branches
```bash
# Clone the repository
git clone https://github.com/your-org/smartspend.git
cd smartspend

# Ensure main is up to date
git checkout main
git pull origin main

# Create and switch to your designated student branch
# For Student 1:
git checkout -b student1-frontend

# For Student 2:
git checkout -b student2-backend

# For Student 3:
git checkout -b student3-ecommerce
```

---

### Step 2: Implement Features & Commit with Semantic Messages
Use conventional semantic commit prefixes:
- `feat:` New user-facing feature or API endpoint
- `fix:` Bug fix or validation correction
- `test:` Adding or updating automated tests
- `docs:` Documentation or README updates
- `refactor:` Code refactoring without changing functionality

#### Example Commits:
```bash
git commit -m "feat: create personal finance dashboard cards and charts"
git commit -m "feat: implement shopping planner and priority filters"
git commit -m "feat: add income and expense CRUD REST APIs"
git commit -m "fix: validate positive amounts for expense records"
git commit -m "test: add integration test suite for authentication and shopping"
git commit -m "docs: complete API specification and GitHub team workflow"
```

---

### Step 3: Push Student Branch to GitHub
```bash
git push -u origin <your-student-branch>
```

---

### Step 4: Open Pull Request (PR)
1. On GitHub, navigate to **Pull Requests** > **New Pull Request**.
2. Select base: `main` and compare: `<your-student-branch>`.
3. Fill out the **Pull Request Template** referencing the associated GitHub Issue ID (e.g., `Closes #3`).
4. Request a review from at least one peer student.

---

### Step 5: Peer Code Review Checklist
Before approving, the assigned peer student verifies:
- [ ] Code follows modular folder separation (`student1-frontend/`, `student2-backend/`, `student3-ecommerce/`).
- [ ] Automated tests pass (`npm test` in `student3-ecommerce/`).
- [ ] No hardcoded database credentials or JWT secrets in code (use `.env`).
- [ ] All forms have client & server-side validation.
- [ ] UI is responsive across desktop and mobile.

---

### Step 6: Merge Pull Request into `main`
Once approved:
1. Merge using **Squash and Merge** or **Create a Merge Commit**.
2. Delete the remote branch if finished, or keep it synced for iterative development:
```bash
git checkout main
git pull origin main
```
