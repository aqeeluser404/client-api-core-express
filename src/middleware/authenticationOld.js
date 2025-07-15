
// ─── Dependencies ─────────────────────────────────────────────

import { pathToRegexp, match as pathMatch } from 'path-to-regexp';
import { verifyToken } from '../utils/authUtils.js'


// ─── Route Access Rules ─────────────────────────────────────────────
    // methods: {
    //   DELETE: ['superadmin'] 
    // }
export const routeAccessRules = {
  '/admin/users/:id': {  // Removed the ? from :id?
    default: ['admin', 'superadmin'],
  },
  '/admin': {  // Simplified from /admin/*
    default: ['superadmin']
  },
  '/users': {  // Simplified from /users/*
    default: ['user', 'admin', 'superadmin']
  }
};
// ─── Middleware Functions ─────────────────────────────────────────────
    
export const verifyJwt = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) 
    return res.status(401).json({ message: 'Access Denied: No token provided' });
  try {
    const verified = verifyToken(token)
    req.user = {
      _id: decoded._id,
      userType: decoded.userType // This is critical!
    };
    next();
  } catch {
    return res.status(400).json({ message: 'Invalid or expired token' });
  }
};

export const requireRoles = (...allowedRoles) => (req, res, next) => {
  const userRole = req.user?.userType;
  if (!userRole || !allowedRoles.includes(userRole)) 
    return res.status(403).json({ message: 'Forbidden: insufficient permissions' });
  next();
};


export const authorizeRoute = (req, res, next) => {
  try {
    const reqMethod = req.method.toUpperCase();
    const fullPath = req.baseUrl + req.path;

    // Find matching route rule
    const matchedRule = Object.entries(routeAccessRules).find(([pattern]) => {
      const matcher = pathMatch(pattern, { decode: decodeURIComponent });
      return !!matcher(fullPath);
    });

    if (!matchedRule) {
      return res.status(403).json({ message: 'Forbidden: no rule defined for this route' });
    }

    const [, rules] = matchedRule;
    const allowedRoles = (rules.methods?.[reqMethod]) || rules.default || [];
    const userRole = req.user?.userType;

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ message: 'Forbidden: insufficient permissions' });
    }

    next();
  } catch (err) {
    console.error('Authorization error:', err);
    return res.status(500).json({ message: 'Internal server error during authorization' });
  }
};