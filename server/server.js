import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import { connectDB } from './config/db.js';
import { errorHandler } from './middleware/error.js';
import { sendResponse } from './utils/response.js';

import authRoutes from './routes/authRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import opportunityRoutes from './routes/opportunityRoutes.js';
import metaRoutes from './routes/metaRoutes.js';
import assessmentRoutes from './routes/assessmentRoutes.js';
import skillsRoutes from './routes/skillsRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import internshipRoutes from './routes/internshipRoutes.js';
import learningRoutes from './routes/learningRoutes.js';
import portfolioRoutes from './routes/portfolioRoutes.js';
import documentRoutes from './routes/documentRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import facultyRoutes from './routes/facultyRoutes.js';
import collabRoutes from './routes/collabRoutes.js';
import institutionRoutes from './routes/institutionRoutes.js';
import integrationRoutes from './routes/integrationRoutes.js';
import aiRoutes from './routes/aiRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:3000';

// Connect Database
connectDB();

// Security Headers & Middlewares
app.use(helmet());
app.use(
  cors({
    origin: [CLIENT_ORIGIN, 'http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(mongoSanitize());
app.use(morgan('dev'));

// Rate limiting on authentication routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 auth requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    data: null,
    message: 'Too many authentication attempts from this IP, please try again after 15 minutes',
  },
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  return sendResponse(
    res,
    200,
    true,
    {
      status: 'healthy',
      service: 'SkillSetu API',
      version: '3.0.0 (Phase 3 Full Ecosystem)',
      disciplinesSupported: 11,
      timestamp: new Date().toISOString(),
    },
    'SkillSetu backend service is up and running'
  );
});

// Mount Routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/meta', metaRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/opportunities', opportunityRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/skills', skillsRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/internships', internshipRoutes);
app.use('/api/learning', learningRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/faculty-opportunities', facultyRoutes);
app.use('/api/collaboration', collabRoutes);
app.use('/api/institution', institutionRoutes);
app.use('/api/integrations', integrationRoutes);
app.use('/api/ai', aiRoutes);

// Fallback 404 Route
app.use('*', (req, res) => {
  return sendResponse(res, 404, false, null, `Route ${req.originalUrl} not found`);
});

// Central Error Handling Middleware
app.use(errorHandler);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[SkillSetu Server]: Running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

export default app;
