# Scripts Directory

## Test Suite

### Running Tests

```bash
pnpm test
```

Or run directly:
```bash
npx tsx scripts/run-tests.ts
```

### Test Structure

| File | Description |
|------|-------------|
| `run-tests.ts` | Main test orchestrator |
| `tests/unit-tests.ts` | Unit tests for utility functions |
| `tests/integration-tests.ts` | Integration tests for API routes |

### Test Categories

1. **Unit Tests** - Test utility functions in isolation
   - Input validation (email, phone, URL, HTML sanitization)
   - Property description parsing
   - Subscription plan features
   - Currency formatting
   - Date utilities

2. **Integration Tests** - Test API route behavior
   - Properties API validation
   - Search API validation
   - Contact form validation
   - Booking validation
   - Newsletter subscription

3. **TypeScript Check** - Compiler validation

4. **ESLint Check** - Code quality analysis

5. **Accessibility Check** - A11y static analysis

6. **Build Validation** - Build integrity checks

7. **Security Check** - Vulnerability scanning

## Test Output

Tests produce a summary showing:
- Pass/fail status for each category
- Error count and details
- Warning count
- Total execution time

Example output:
```
╔════════════════════════════════════════════════════════════╗
║        VALAR TRAVEL - COMPREHENSIVE TEST SUITE             ║
╚════════════════════════════════════════════════════════════╝

PASS - Unit Tests (245ms)
     Tests: 25/25 passed
PASS - Integration Tests (180ms)
     Tests: 20/20 passed
PASS - TypeScript Check (3200ms)
PASS - ESLint Check (1500ms)
...

========================================
Overall: 7/7 test suites passed
========================================
```

---

## Database Scripts

### SSL Connection

All database scripts use Supabase client which handles SSL automatically.

### Script Types

**Setup Scripts** (run once):
- Database table creation
- Initial data seeding
- Schema migrations

**Utility Scripts** (run as needed):
- Property scraping
- Data cleanup
- Cache clearing

---

**Last Updated:** March 2026
