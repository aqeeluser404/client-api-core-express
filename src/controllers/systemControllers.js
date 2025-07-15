
// ─── Dependencies ─────────────────────────────────────────────

import { verifyToken } from '../utils/authUtils.js'
import { clearAuthCookie } from '../utils/cookieUtils.js'
import { sendSuccess, sendExists, sendNotFound, sendRaw } from "../utils/responseUtils.js";
import { handleControllerError } from "../utils/errorUtils.js";

// ─── System Controllers ─────────────────────────────────────────────

export function rootController(req, res) {
  return sendSuccess(res, {}, 'Backend is running');
}

export function healthController(req, res) {
  return sendSuccess(res, { status: 'UP' }, 'Health check passed');
}

export function checkTokenController(req, res) {
  const token = req.cookies.token;
    if (token) {
      return sendExists(res, true)
    } else {
      return sendExists(res, false)
    }
}

export function getTokenController(req, res) {
  const token = req.cookies.token;
  if (!token) {
    // return sendNotFound(res, 'No token found in cookie', 401)
    return sendRaw(res, null);
  }
  try {
    verifyToken(token);
    return sendRaw(res, token)
  } catch (err) {
    // return handleControllerError(res, err)
    return sendRaw(res, null);
  }
}

export function removeTokenController(req, res) {
  clearAuthCookie(res);
  return sendSuccess(res, {}, 'Token removed');
}