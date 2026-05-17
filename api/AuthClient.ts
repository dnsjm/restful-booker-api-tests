import { APIRequestContext, APIResponse } from '@playwright/test';
import { BaseClient } from './BaseClient';

export interface AuthCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}

export class AuthClient extends BaseClient {
  constructor(request: APIRequestContext) {
    super(request);
  }

  async createToken(credentials: AuthCredentials): Promise<APIResponse> {
    return this.request.post('/auth', { data: credentials });
  }

  /**
   * Convenience: log in and store the token on this client.
   * Returns the raw token for callers that want to share it.
   */
  async login(credentials: AuthCredentials): Promise<string> {
    const response = await this.createToken(credentials);
    const body = (await response.json()) as AuthResponse;
    if (!body.token) {
      throw new Error(`Login failed: ${JSON.stringify(body)}`);
    }
    this.setToken(body.token);
    return body.token;
  }

  async ping(): Promise<APIResponse> {
    return this.request.get('/ping');
  }
}
