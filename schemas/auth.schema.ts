import type { JSONSchemaType } from 'ajv';

export interface AuthTokenResponse {
  token: string;
}

export const authTokenSchema: JSONSchemaType<AuthTokenResponse> = {
  type: 'object',
  properties: {
    token: { type: 'string', minLength: 1 },
  },
  required: ['token'],
  additionalProperties: false,
};

export interface AuthErrorResponse {
  reason: string;
}

export const authErrorSchema: JSONSchemaType<AuthErrorResponse> = {
  type: 'object',
  properties: {
    reason: { type: 'string', minLength: 1 },
  },
  required: ['reason'],
  additionalProperties: false,
};
