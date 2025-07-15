
// ─── Dependencies ─────────────────────────────────────────────

import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const orderSchema = new Schema({}, {
    strict: false,
    collection: 'Order',
    timestamps: true
})

export default model('Order', orderSchema);