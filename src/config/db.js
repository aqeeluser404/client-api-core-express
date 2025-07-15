
// ─── Dependencies ─────────────────────────────────────────────

import mongoose from 'mongoose';

// ─── Environment Variables ─────────────────────────────────────────────

const MONGODB_URL = process.env.MONGODB_URL

// ─── Function ─────────────────────────────────────────────
    
export async function connect() {
  try {
    await mongoose.connect(MONGODB_URL)
    console.log('Successfully connected to MongoDB')
  } catch (error) {
    console.error('MongoDB connection error:', error)
    throw error
  }
}

export async function close() {
  try {
    await mongoose.connection.close()
    console.log('Disconnect from MongoDB')
  } catch (error) {
    console.error('Error disconnecting from MongoDB: ', error)
    throw error
  }
}