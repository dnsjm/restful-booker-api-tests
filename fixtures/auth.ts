import type { AuthCredentials } from '../api/AuthClient';

/**
 * Default admin credentials for restful-booker.
 * Documented publicly on the project's homepage — not secrets.
 */
export const ADMIN_CREDENTIALS: AuthCredentials = {
  username: 'admin',
  password: 'password123',
};

export const INVALID_CREDENTIALS: Array<{
  case: string;
  credentials: AuthCredentials;
}> = [
  {
    case: 'wrong password',
    credentials: { username: 'admin', password: 'wrong' },
  },
  {
    case: 'unknown user',
    credentials: { username: 'ghost', password: 'password123' },
  },
  {
    case: 'empty username',
    credentials: { username: '', password: 'password123' },
  },
];
