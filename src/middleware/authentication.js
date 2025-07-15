
// ─── Dependencies ─────────────────────────────────────────────

import { verifyToken } from '../utils/authUtils.js'

// ─── Authentication Middleware ─────────────────────────────────────────────
  
export const verifyJwt = (req, res, next) => {
    const token = req.cookies.token
    if (!token) 
        return res.status(401).send('Access Denied')
    try {
        const verified = verifyToken(token)
        req.user = verified
        next()
    } catch {
        res.status(400).send('Invalid Token')
    }
};

export const requireAdmin = (req, res, next) => {
    if (req.user.userType !== 'admin') return res.status(403).send('Admin access required')
    next();
};
