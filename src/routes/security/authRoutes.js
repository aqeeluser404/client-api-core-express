
// ─── Dependencies ─────────────────────────────────────────────

import { Router } from 'express'
import { loginLimiter } from '../../middleware/loginLimiter.js';
import { 
    registerUserController,
    loginUserController,
    logoutUserController
} from '../../controllers/authControllers.js'
const router = Router()

// ─── Routes ─────────────────────────────────────────────
    
router.post('/login', loginLimiter, loginUserController);
router.post('/register', registerUserController);
router.post('/logout/:id', logoutUserController);

export const authRoutes = { prefix: '/auth', router }