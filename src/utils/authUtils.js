
// ─── Dependencies ─────────────────────────────────────────────

import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import ms from 'ms';

// ─── Environment Variables ─────────────────────────────────────────────

const JWT_SECRET = process.env.JWT_SECRET
const AUTH_TOKEN_EXPIRY = process.env.AUTH_TOKEN_EXPIRY
const VERIFICATION_TOKEN_EXPIRY = process.env.VERIFICATION_TOKEN_EXPIRY

// ─── Auth Utilities ─────────────────────────────────────────────

export async function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(password, hash) {
  return bcrypt.compare(password, hash);
}

export function generateVerificationToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: VERIFICATION_TOKEN_EXPIRY });
}

export function generateAuthToken(user) {
  return jwt.sign({ _id: user._id, userType: user.userType }, JWT_SECRET, { expiresIn: AUTH_TOKEN_EXPIRY });
}

export function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}