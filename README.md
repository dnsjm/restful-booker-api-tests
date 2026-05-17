# 🧪 Restful Booker API Test Suite

[![API Tests](https://github.com/dnsjm/restful-booker-api-tests/actions/workflows/api-tests.yml/badge.svg)](https://github.com/dnsjm/restful-booker-api-tests/actions/workflows/api-tests.yml)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Playwright](https://img.shields.io/badge/Playwright-2EAD33?logo=playwright&logoColor=white)
![Ajv](https://img.shields.io/badge/Ajv-Schema_Validation-23B7E5)
![Postman](https://img.shields.io/badge/Postman-Collection-FF6C37?logo=postman&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

API-layer companion to my [`playwright-saucedemo-suite`](https://github.com/dnsjm/playwright-saucedemo-suite). Same tooling stack — TypeScript + Playwright — pointed at [restful-booker](https://restful-booker.herokuapp.com), the QA community's standard practice API.

---

## ✨ Highlights

- **Typed API client layer** — `AuthClient`, `BookingClient` extending a shared `BaseClient`, mirroring the POM pattern used in the UI suite
- **Custom Playwright fixtures** — `authedBookingClient` eliminates token boilerplate from every test
- **JSON Schema validation via Ajv** — every response is contract-validated, not just spot-asserted
- **Auth strategy parity** — Cookie *and* Basic auth tested explicitly
- **Performance budgets** — explicit thresholds on `/ping`, `/auth`, and create flows
- **Real bug reports** — see [`docs/BUGS-DISCOVERED.md`](docs/BUGS-DISCOVERED.md) for how I'd file the actual quirks in this API
- **Postman collection included** — runs in CI via Newman so both tools are exercised on every push
- **GitHub Actions** — push + PR + nightly cron, smoke / regression matrix, separate Newman + lint jobs

---

## 📁 Project Structure

```
restful-booker-api-tests/
├── api/                          # Typed API clients (POM analog)
│   ├── BaseClient.ts
│   ├── AuthClient.ts
│   └── BookingClient.ts
├── schemas/                      # JSON Schema + Ajv validator
│   ├── auth.schema.ts
│   ├── booking.schema.ts
│   └── validator.ts
├── fixtures/
│   ├── auth.ts
│   ├── bookings.ts
│   └── test-fixtures.ts          # Custom Playwright fixtures
├── tests/
│   ├── smoke/
│   │   ├── auth.spec.ts
│   │   └── crud-happy-path.spec.ts
│   └── regression/
│       ├── booking-create.spec.ts
│       ├── booking-read.spec.ts
│       ├── booking-update.spec.ts
│       ├── booking-delete.spec.ts
│       ├── booking-schema.spec.ts
│       └── auth-strategies.spec.ts
├── postman/
│   └── restful-booker.postman_collection.json
├── docs/
│   ├── TEST-PLAN.md
│   ├── BUGS-DISCOVERED.md
│   └── API-COVERAGE.md
├── .github/workflows/
│   └── api-tests.yml
├── playwright.config.ts
├── tsconfig.json
└── package.json
```

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm ci

# 2. Run the full suite
npm test

# 3. View the HTML report
npm run report
```

### Targeted runs

```bash
npm run test:smoke         # critical path only
npm run test:regression    # full coverage
npm run test:debug         # step through with the Playwright inspector
npm run postman:newman     # run the Postman collection via Newman
```

---

## 📊 Coverage at a glance

| Area | Tests | Tag |
| --- | --- | --- |
| Token auth (happy + 3 invalid cases) | 4 | `@smoke` / `@regression` |
| `/ping` health + perf budget | 1 | `@smoke` |
| CRUD lifecycle (create → read → update → delete) | 1 | `@smoke` |
| Create — happy paths | 3 | `@regression` |
| Create — input validation | 4 | `@regression` |
| Read — listing, filters, 404 | 5 | `@regression` |
| Update — PUT auth, PATCH auth, semantics | 5 | `@regression` |
| Delete — auth required, idempotency | 3 | `@regression` |
| Schema contract validation per endpoint | 4 | `@regression` |
| Cookie vs Basic auth strategy parity | 2 | `@regression` |

**~32 tests**, runs end-to-end in well under 2 minutes (no browser overhead).

See [`docs/API-COVERAGE.md`](docs/API-COVERAGE.md) for the endpoint matrix.

---

## 🔬 What this suite demonstrates

- **Single-stack UI + API testing** — same Playwright tooling, same TypeScript ergonomics, same CI patterns as the UI repo.
- **Contract-first thinking** — schema validation catches the class of bugs that response-shape drift introduces, which field-by-field assertions miss.
- **Tester instinct, not just automation** — [`docs/BUGS-DISCOVERED.md`](docs/BUGS-DISCOVERED.md) documents the real quirks of this API in production-style ticket format.
- **Belt-and-suspenders tooling** — Playwright in TypeScript for the suite, plus a parallel Postman collection runnable via Newman.
---

## 📜 License

[MIT](LICENSE) © 2026 JM Dionisio

---

## 👤 Author

**JM Dionisio** — QA Lead & SDET
[GitHub @dnsjm](https://github.com/dnsjm) · [LinkedIn](https://linkedin.com/in/jm-dionisio/) · [Portfolio](https://jm-dionisio.vercel.app)

🌐 Companion project: [`playwright-saucedemo-suite`](https://github.com/dnsjm/playwright-saucedemo-suite)
