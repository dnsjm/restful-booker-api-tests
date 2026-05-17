import Ajv, { ErrorObject } from 'ajv';
import addFormats from 'ajv-formats';
import { expect } from '@playwright/test';

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

/**
 * Assert that `data` matches the provided JSON schema.
 * Fails the test with a readable error if validation fails.
 */
export function expectMatchesSchema<T>(data: unknown, schema: object, label = 'response'): asserts data is T {
  const validate = ajv.compile(schema);
  const valid = validate(data);
  if (!valid) {
    const errors = (validate.errors ?? []).map(formatError).join('\n');
    expect.soft(valid, `${label} did not match schema:\n${errors}\n\nReceived:\n${JSON.stringify(data, null, 2)}`).toBe(
      true,
    );
    throw new Error(`Schema validation failed for ${label}`);
  }
}

function formatError(err: ErrorObject): string {
  const path = err.instancePath || '(root)';
  return `  • ${path} ${err.message ?? ''}`;
}
