
// ─── Dependencies ─────────────────────────────────────────────

import { clearAuthCookie } from "../utils/cookieUtils.js";

// ─── Auth Services ─────────────────────────────────────────────

export async function handleDuplicateSession(user, token, res, options = {}) {
  const { forceSingleSession = true } = options;

  if (!forceSingleSession) return;

  const isNewSession = user.loginInfo.isLoggedIn && user.loginInfo.loginToken !== token;

  if (forceSingleSession && isNewSession) {
    await user.logout();
    clearAuthCookie(res);
  }
}
