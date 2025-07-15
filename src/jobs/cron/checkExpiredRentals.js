
// ─── Dependencies ─────────────────────────────────────────────

import Rental from '../../src/models/rentalModel.js'
import { EndRentalService } from '../../src/services/rentalService.js'
import { handleControllerError } from '../../utils/errorUtils.js'

// ─── Function ─────────────────────────────────────────────
  
export async function checkExpiredRentals() {
  console.log('[CRON] Running rental checks...')
  const now = new Date()
  const rentals = await Rental.find({ rentalEndDate: { $lte: now }, status: 'Active' })

  for (const rental of rentals) {
    try {
      await EndRentalService(rental._id)
    } catch (err) {
      return handleControllerError(res, err)
    }
  }
}
