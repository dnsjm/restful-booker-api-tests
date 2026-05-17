import { APIRequestContext, APIResponse } from '@playwright/test';

/**
 * BaseClient — shared behavior for every API client.
 * Centralizes the request context, token management, and helpers
 * for response-time tracking.
 */
export abstract class BaseClient {
  protected token?: string;

  constructor(protected readonly request: APIRequestContext) {}

  setToken(token: string): void {
    this.token = token;
  }

  protected authHeaders(): Record<string, string> {
    if (!this.token) return {};
    // restful-booker accepts both Cookie token and Basic auth; we use Cookie
    // by default. See docs/BUGS-DISCOVERED.md for the inconsistencies.
    return { Cookie: `token=${this.token}` };
  }

  /**
   * Measure response time of a request. Returns both the response and
   * elapsed milliseconds — useful for the performance-budget tests.
   */
  protected async timed<T extends APIResponse>(fn: () => Promise<T>): Promise<{ response: T; elapsedMs: number }> {
    const start = Date.now();
    const response = await fn();
    return { response, elapsedMs: Date.now() - start };
  }
}
