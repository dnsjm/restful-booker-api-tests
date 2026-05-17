# Test Plan — restful-booker API Suite

## 1. Objective

Validate the [restful-booker](https://restful-booker.herokuapp.com) public API across authentication and the full booking lifecycle (CRUD). Serves as the API-layer counterpart to my SauceDemo UI suite, demonstrating that I can drive both layers from a single tooling stack (Playwright + TypeScript).

## 2. Scope

### In scope

- `POST /auth` token generation (happy + invalid credential paths)
- `GET /ping` health check + response-time budget
- `GET /booking` listing with filters (firstname, lastname, dates)
- `GET /booking/:id` single-resource fetch (existing + 404)
- `POST /booking` create — happy path + input validation
- `PUT /booking/:id` full update — auth required, replaces the resource
- `PATCH /booking/:id` partial update — auth required, merges fields
- `DELETE /booking/:id` delete — auth required, idempotency
- JSON-schema validation per endpoint via Ajv
- Cookie vs Basic auth strategy parity
- Response-time budgets on critical paths

### Out of scope

- Load / stress / soak testing
- Mocking (the API itself is the SUT)
- UI tests (covered separately in `playwright-saucedemo-suite`)

## 3. Test design strategy

| Layer | Approach |
| --- | --- |
| Architecture | Typed API client classes (POM analog) + custom Playwright fixtures |
| Data | Centralized payloads in `fixtures/` — typed, single source of truth |
| Tagging | `@smoke` for critical path, `@regression` for full coverage |
| Schema | JSON Schema + Ajv contract validation per endpoint |
| Failure artifacts | Trace retention on failure |
| Parallelism | 4 workers in CI; tests are isolated by per-test booking creation |

## 4. Entry / Exit criteria

**Entry**: restful-booker is reachable (`GET /ping` returns 201); Node 20+ available.

**Exit**:
- 100% of `@smoke` tests pass.
- ≥95% of `@regression` tests pass; failures are triaged and either fixed or documented in `BUGS-DISCOVERED.md` as API quirks.
- HTML report and Newman summary archived as CI artifacts.

## 5. Risks & mitigations

| Risk | Mitigation |
| --- | --- |
| Heroku cold-start latency on first request | Generous response-time budgets (3–5s) |
| Shared public dataset can drift mid-test | Every test creates its own booking; assertions never depend on pre-existing data |
| API quirks (200s on bad input, 201 on DELETE) | Documented in `BUGS-DISCOVERED.md`; assertions allow the actual behavior but fail loudly if it changes |
| Free-tier downtime | CI retries ×2 on failure |

## 6. Reporting

- Playwright HTML report (`playwright-report/`)
- JSON results (`test-results/results.json`)
- Newman CLI summary for the Postman collection
- GitHub Actions step-summary via `github` reporter
