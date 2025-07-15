
// ─── Dependencies ─────────────────────────────────────────────

import { Router } from 'express'
import {
  rootController,
  healthController,
  checkTokenController,
  getTokenController,
  removeTokenController
} from '../../controllers/systemControllers.js';
const router = Router()

// ─── Routes ─────────────────────────────────────────────
    
router.get('/', rootController)
router.get('/health', healthController)
router.get('/check-token', checkTokenController)
router.get('/get-token', getTokenController)
router.post('/remove-token', removeTokenController)

export const systemRoutes = { prefix: '/system', router }