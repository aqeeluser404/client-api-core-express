
// ─── Dependencies ─────────────────────────────────────────────

import app from './app.js';
import { connect } from './config/db.js';

// ─── Environment Variables ─────────────────────────────────────────────

const {
    PORT,
    NODE_ENV,
    BACKEND_LIVE,
    BACKEND_DEV,
} = process.env;

const isProduction = NODE_ENV === 'production';
const backend = isProduction ? BACKEND_LIVE : BACKEND_DEV;

if (!backend) 
  throw new Error('Backend URL is not defined in environment variables.');

// ─── Function ─────────────────────────────────────────────

connect()
    .then(() => {
        app.listen(PORT, (error) => {
            if (error) 
                console.error('Failed to start server:', error)
            else
                console.log(`Server started on ${backend}`)
        })
    })
    .catch((err) => {
        console.error('Startup failed due to DB error.')
        process.exit(1)
    })