// ─── Dependencies ─────────────────────────────────────────────

import cron from 'node-cron'
import { checkTokens } from './checkTokens.js'
import { handleControllerError } from '../../utils/errorUtils.js'
import { toCronExpression } from '../../utils/timeExpressions.js'

// ─── Environment Variables ─────────────────────────────────────────────

const userInterval = process.env.TOKEN_CRON_SCHEDULE || '1m'
const cronExpression = toCronExpression(userInterval)

// ─── Function ─────────────────────────────────────────────

export function initCrons() {
  cron.schedule(cronExpression, async () => {
    try {
      await checkTokens()
      // await checkExpiredRentals()
    } catch (err) {
      return handleControllerError(res, err)
    }
  })
}