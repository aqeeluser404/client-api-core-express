
// ─── Dependencies ─────────────────────────────────────────────

import rateLimit from "express-rate-limit";

// ─── Function ─────────────────────────────────────────────

export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: {
        message: 'Too many login attempts from this IP. Please try again after 15 minutes.'
    },
    standardHeaders: true,
    legacyHeaders: false
});