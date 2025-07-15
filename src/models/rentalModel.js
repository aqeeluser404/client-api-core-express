
// ─── Dependencies ─────────────────────────────────────────────

import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const rentalSchema = new Schema({}, {
    strict: false,
    collection: 'Rental',
    timestamps: true
})

export default model('Rental', rentalSchema);