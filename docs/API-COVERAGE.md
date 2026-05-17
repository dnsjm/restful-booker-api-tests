# API Coverage Matrix

| Endpoint | Method | Happy path | Schema validated | Auth | Negative cases | Perf budget |
| --- | --- | --- | --- | --- | --- | --- |
| `/ping` | GET | ✅ | — | — | — | ✅ |
| `/auth` | POST | ✅ | ✅ | — | ✅ (3 cases) | ✅ |
| `/booking` | GET | ✅ | ✅ | — | filters | — |
| `/booking/:id` | GET | ✅ | ✅ | — | 404 missing | — |
| `/booking` | POST | ✅ | ✅ | — | ✅ (4 cases) | — |
| `/booking/:id` | PUT | ✅ | — | ✅ Cookie + Basic | 403 unauth | — |
| `/booking/:id` | PATCH | ✅ | — | ✅ | 403 unauth, empty body | — |
| `/booking/:id` | DELETE | ✅ | — | ✅ | 403 unauth, double-delete | — |

**Totals**
- Endpoints covered: **7/7** (100%)
- Smoke tests: **6**
- Regression tests: **~26**
- Schema contract tests: **4**
- Auth strategy tests: **2**
- Performance-budget assertions: **2**
