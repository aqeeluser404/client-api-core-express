
// ─── Dependencies ─────────────────────────────────────────────

import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';

import { systemRoutes } from './routes/security/systemRoutes.js';
import { authRoutes } from './routes/security/authRoutes.js';
import { userRoutes } from './routes/user/userRoutes.js';
import { adminUserRoutes } from './routes/user/adminUserRoutes.js';

import corsOptions from './config/corsConfig.js';
import { initCrons } from './jobs/cron/index.js'
import { handleControllerError } from './utils/errorUtils.js';

const app = express();

// ─── Environment Variables ─────────────────────────────────────────────

const API_VERSION = process.env.API_VERSION

// ─── Initialize ─────────────────────────────────────────────

app.use(helmet())
app.use(morgan('dev'));
app.use(compression());
app.use(cookieParser());
app.use(express.json());

// ─── Cors Config ─────────────────────────────────────────────

app.use(cors(corsOptions))

// ─── Jobs/Cron ─────────────────────────────────────────────

initCrons()

// ─── Routes ─────────────────────────────────────────────

const routes = [ systemRoutes, authRoutes, userRoutes, adminUserRoutes ]

routes.forEach(({ prefix, router }) => {
  app.use(`${API_VERSION}${prefix}`, router);  // e.g. /v1/system
});

// ─── Error Handler ─────────────────────────────────────────────

app.use((err, req, res, next) => {
  handleControllerError(res, err, 500, 'Internal server error');
})

app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    error: 'Route not found' 
  });
});

export default app