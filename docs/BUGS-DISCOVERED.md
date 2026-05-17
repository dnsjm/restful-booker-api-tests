# Bugs & API Quirks Discovered in restful-booker

restful-booker is a deliberately imperfect API designed for QA practice. This document treats its real-world quirks as if they were genuine production bugs and walks through how I'd file, prioritize, and recommend fixes for each. The goal isn't to "find" the bugs — they're well-known — but to show how I structure bug reports and advocate for fixes.

---

## BUG-001 · Bad credentials return 200 OK with a `reason` field instead of 401

| Field | Value |
| --- | --- |
| Severity | High (security + client integration) |
| Endpoint | `POST /auth` |
| Steps | Submit `{ username: "admin", password: "wrong" }` |
| Expected | `401 Unauthorized` with no token |
| Actual | `200 OK` with body `{ "reason": "Bad credentials" }` |
| Impact | Clients relying on the HTTP status code to detect auth failures will incorrectly treat a rejected login as successful. Forces every consumer to inspect the body, which is a fragile contract. |
| Recommendation | Return `401` and a structured error envelope (`{ error: { code: "invalid_credentials", message: "..." } }`). |

---

## BUG-002 · DELETE responds with `201 Created`

| Field | Value |
| --- | --- |
| Severity | Medium (REST contract violation) |
| Endpoint | `DELETE /booking/:id` |
| Steps | Issue a `DELETE` with a valid `Cookie: token=...` |
| Expected | `204 No Content` or `200 OK` |
| Actual | `201 Created` |
| Impact | Violates the RFC 9110 expectation for DELETE responses. Surprising to anyone building dashboards or alerts that map `2xx` semantics. |
| Recommendation | Standardize on `204 No Content` for successful deletes. |

---

## BUG-003 · Double-DELETE returns `405 Method Not Allowed` instead of `404`

| Field | Value |
| --- | --- |
| Severity | Low |
| Endpoint | `DELETE /booking/:id` |
| Steps | DELETE a booking, then DELETE it again |
| Expected | `404 Not Found` (resource no longer exists) |
| Actual | `405 Method Not Allowed` |
| Impact | `405` semantically means "this method is not supported on this resource" — confusing when the issue is actually that the resource was deleted. |
| Recommendation | Return `404` for missing resources regardless of method. |

---

## BUG-004 · Permissive input validation on `POST /booking`

| Field | Value |
| --- | --- |
| Severity | High |
| Endpoint | `POST /booking` |
| Steps | Submit a payload missing `firstname` |
| Expected | `400 Bad Request` with a field-level error |
| Actual | `500 Internal Server Error` (or in some cases a 200 with `null` fields) |
| Impact | Server crashes on malformed input rather than rejecting it cleanly; logs fill with stack traces from preventable bad requests. |
| Recommendation | Schema-validate the body at the route boundary and return structured 400s. |

---

## BUG-005 · Cookie auth and Basic auth are silently treated as equivalent

| Field | Value |
| --- | --- |
| Severity | Medium |
| Endpoint | `PUT/PATCH/DELETE /booking/:id` |
| Steps | Authenticate using `Cookie: token=...` *or* `Authorization: Basic ...` |
| Expected | The API documentation should call out both clearly, or one should be deprecated |
| Actual | Both work, but the docs only mention the Cookie strategy by default |
| Impact | Inconsistent docs invite client divergence; some teams will roll their own Basic-auth integration without realizing they could share a token. |
| Recommendation | Pick one canonical strategy and deprecate the other in the docs. |

---

## BUG-006 · Inconsistent `additionalneeds` handling

| Field | Value |
| --- | --- |
| Severity | Low |
| Endpoint | `POST /booking`, `GET /booking/:id` |
| Steps | Create a booking without `additionalneeds`, then fetch it |
| Expected | Field is either omitted or returned as `null` consistently |
| Actual | Sometimes echoed back, sometimes stripped — varies by request |
| Impact | Schema validators that mark the field as required-but-nullable fail intermittently. |
| Recommendation | Pick a single representation (recommended: always present, `null` when empty) and enforce it. |

---

## How I'd file these in production

Each entry above would become a ClickUp / Jira ticket with:

- Severity + Priority justified by integration impact (number of consumers affected, security implications, observability noise)
- Reproducible curl command + Sentry trace ID where applicable
- Suggested response shape and HTTP status, written as a unit-test acceptance criterion
- A note on which existing test in this suite would have caught the regression had the bug been introduced today

That's the same pattern I use day-to-day at Wilson Works when filing API defects.
