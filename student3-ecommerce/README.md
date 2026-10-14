# SmartSpend E-Commerce Planning, Testing & Documentation (Student 3 Workspace)

**Student 3 Role:** E-Commerce Engineer, QA Lead & Technical Documentarian  
**Branch:** `student3-ecommerce`

---

## 📌 Responsibilities
1. **E-Commerce Shopping Planner**:
   - Wishlist management: Add, edit, remove planned purchases.
   - Financial attributes: Unit price, quantity, priority rating (`High`, `Medium`, `Low`), expected purchase dates, product links, and notes.
   - Status toggle: Mark items as fulfilled/purchased or return to planned state.
   - Planned vs purchased summary tallies.
2. **Product Search & Filtering Engine**:
   - Live debounce search by keyword across product titles and notes.
   - Multi-category filtering (`Electronics`, `Clothing`, `Home & Kitchen`, `Books`, etc.).
   - Price range filters (`minPrice` to `maxPrice`).
   - Priority-based filtering.
   - Sorting options: Price ascending/descending, target date, priority.
3. **Budget Impact Analysis**:
   - Real-time comparison between total planned shopping cost and current monthly remaining budget.
   - Warning banners and alerts when planned purchases threaten budget boundaries.
4. **Automated Testing Suite**:
   - 22 automated integration test cases covering Auth, Finance, Shopping, and Analytics.
5. **Engineering Documentation**:
   - Master architecture, API specifications, Git branching guidelines, and Issue/PR templates.

---

## 🧪 How to Run Automated Tests

```bash
cd student3-ecommerce
npm test
```

This runs the automated test runner `tests/run-all-tests.js` and outputs the test report.

---

## 📂 Documentation Directory
- [API Documentation](file:///c:/Users/Aishwarya/OneDrive/Desktop/smartspend/student3-ecommerce/docs/API_DOCUMENTATION.md)
- [GitHub Workflow & Git Commands](file:///c:/Users/Aishwarya/OneDrive/Desktop/smartspend/student3-ecommerce/docs/GITHUB_WORKFLOW.md)
- [Team Allocation Matrix](file:///c:/Users/Aishwarya/OneDrive/Desktop/smartspend/student3-ecommerce/docs/TEAM_ALLOCATION.md)
- [QA Test Report](file:///c:/Users/Aishwarya/OneDrive/Desktop/smartspend/student3-ecommerce/docs/TEST_REPORT.md)
