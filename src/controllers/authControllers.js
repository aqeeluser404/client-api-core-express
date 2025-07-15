
// ─── Dependencies ─────────────────────────────────────────────

import { registerUserService, loginUserService, logoutUserService } from "../services/authService.js";
import { findUserByTokenService } from "../services/userService.js";
import { handleDuplicateSession } from "../services/sessionService.js";
import { clearAuthCookie, setAuthCookie } from "../utils/cookieUtils.js";
import { sendSuccess } from "../utils/responseUtils.js";
import { handleControllerError } from "../utils/errorUtils.js";

// ─── Auth Controllers ─────────────────────────────────────────────
  
export async function registerUserController(req, res) {
    try {
        const userDetails = req.body;
        await registerUserService(userDetails);
        sendSuccess(res, {}, 'User registered successfully')
    } catch (err) {
        return handleControllerError(res, err);
    }
}

export async function loginUserController(req, res) {
    try {
        const { username, email, password } = req.body;
        const token = await loginUserService(username, email, password);
        const user = await findUserByTokenService(token);

        // session config
        await handleDuplicateSession(user, token, res, {
            forceSingleSession: true
        });
        
        // update new login session
        await user.updateLoginStatus(token);
        setAuthCookie(res, token);
        
        sendSuccess(res, {}, 'Login successful');
    } catch (err) {
        return handleControllerError(res, err);
    }
}

export async function logoutUserController(req, res) {
    try {
        const { id } = req.params;
        await logoutUserService(id);
        clearAuthCookie(res);
        sendSuccess(res, {}, 'User logged out successfully');
    } catch (err) {
        return handleControllerError(res, err);
    }
}

