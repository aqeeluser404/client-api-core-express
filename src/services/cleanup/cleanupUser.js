
// ─── Dependencies ─────────────────────────────────────────────

import Order from "../../models/orderModel.js";
import Rental from "../../models/rentalModel.js";

export async function deleteUserOrders(user) {
    const orders = await Order.find({ user: user._id })
    for (const order of orders)
        await Order.deleteOne({ _id: order._id })
}

export async function deleteUserRentals(user) {
    const rentals = await Rental.find({ user: user._id })
    for (const rental of rentals)
        await Rental.deleteOne({ _id: rental._id })
}