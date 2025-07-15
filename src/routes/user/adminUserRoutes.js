
// ─── Dependencies ─────────────────────────────────────────────

import { Router } from 'express'
// import { verifyJwt, authorizeRoute } from '../../middleware/authentication.js'
import { verifyJwt, requireAdmin } from '../../middleware/authentication.js';
import {
  createUserController,
  findAllUsersController,
  // findUsersLoggedInController,
  // findUsersFrequentlyLoggedInController,
  deleteUserController
} from '../../controllers/userControllers.js'
const router = Router();

// ─── Middleware ─────────────────────────────────────────────

// router.use(verifyJwt);
// router.use(requireAdmin);
// router.use(authorizeRoute);

// ─── Routes ─────────────────────────────────────────────
    
router.post('/', createUserController)
router.get('/', findAllUsersController)
// router.get('/logged-in', findUsersLoggedInController)
// router.get('/frequently-logged-in', findUsersFrequentlyLoggedInController)
router.delete('/:id', deleteUserController)

export const adminUserRoutes = { prefix: '/admin/users', router }
