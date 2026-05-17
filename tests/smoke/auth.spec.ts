import { test, expect } from '../../fixtures/test-fixtures';
import { ADMIN_CREDENTIALS, INVALID_CREDENTIALS } from '../../fixtures/auth';
import { authTokenSchema } from '../../schemas/auth.schema';
import { expectMatchesSchema } from '../../schemas/validator';
import { PERFORMANCE_BUDGETS } from '../../fixtures/bookings';

test.describe('Authentication @smoke', () => {
  test('POST /auth with valid credentials returns a token', async ({ authClient }) => {
    const response = await authClient.createToken(ADMIN_CREDENTIALS);
    expect(response.status()).toBe(200);

    const body = await response.json();
    expectMatchesSchema(body, authTokenSchema, 'auth token response');
    expect((body as { token: string }).token).toMatch(/^[a-z0-9]+$/i);
  });

  test('POST /auth response time stays within budget @regression', async ({ authClient }) => {
    const start = Date.now();
    const response = await authClient.createToken(ADMIN_CREDENTIALS);
    const elapsed = Date.now() - start;

    expect(response.status()).toBe(200);
    expect(elapsed).toBeLessThan(PERFORMANCE_BUDGETS.auth);
    test.info().annotations.push({ type: 'perf', description: `auth took ${elapsed}ms` });
  });

  for (const { case: scenario, credentials } of INVALID_CREDENTIALS) {
    test(`POST /auth with ${scenario} does not return a token @regression`, async ({ authClient }) => {
      const response = await authClient.createToken(credentials);
      // restful-booker returns 200 with { reason: "Bad credentials" } rather than 401.
      // This is documented in docs/BUGS-DISCOVERED.md as BUG-001.
      const body = (await response.json()) as { token?: string; reason?: string };
      expect(body.token).toBeUndefined();
      expect(body.reason).toBeTruthy();
    });
  }
});

test.describe('Health check @smoke', () => {
  test('GET /ping returns 201 Created', async ({ authClient }) => {
    const start = Date.now();
    const response = await authClient.ping();
    const elapsed = Date.now() - start;

    expect(response.status()).toBe(201);
    expect(elapsed).toBeLessThan(PERFORMANCE_BUDGETS.ping);
  });
});
