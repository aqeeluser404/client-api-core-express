
import { toCookieExpression } from './timeExpressions.js';

// ─── Environment Variables ─────────────────────────────────────────────

const isProduction = process.env.NODE_ENV === 'production';
const userInterval = process.env.AUTH_COOKIE_AGE || '1m'
const cookieExpression = toCookieExpression(userInterval)

// ─── Cookie Utilities ─────────────────────────────────────────────

export function setAuthCookie(res, token) {
  res.cookie('token', token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'None',
    maxAge: cookieExpression,
    path: '/',
  });
}

export function clearAuthCookie(res) {
  res.clearCookie('token', {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'None',
    path: '/'
  })
}