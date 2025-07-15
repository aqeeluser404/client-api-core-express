
// ─── Dependencies ─────────────────────────────────────────────

import axios from 'axios';
import User from '../../models/userModel.js';
import { verifyToken } from '../../utils/authUtils.js';
import { handleControllerError } from '../../utils/errorUtils.js';

// ─── Environment Variables ─────────────────────────────────────────────

const {
  NODE_ENV,
  BACKEND_LIVE,
  BACKEND_DEV,
  API_VERSION
} = process.env;

const isProduction = NODE_ENV === 'production';
const backend = isProduction ? BACKEND_LIVE : BACKEND_DEV;

if (!backend) 
  throw new Error('Backend URL is not defined in environment variables.');

// ─── Function ─────────────────────────────────────────────
    
export async function checkTokens() {
  console.log('[CRON] Running login token checks...')
  const users = await User.find({ 'loginInfo.isLoggedIn': true })

  for (const user of users) {
    const token = user.loginInfo.loginToken
    if (!token) 
        continue
    try {
      verifyToken(token);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        user.loginInfo.isLoggedIn = false
        user.loginInfo.loginToken = null
        await user.save()
        try {
          await axios.post(`${backend}${API_VERSION}/auth/logout/${user._id}`)
        } catch (err) {
          return handleControllerError(res, err)
        }
      }
    }
  }
}