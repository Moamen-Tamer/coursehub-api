import express from 'express';
import type { Express } from 'express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { env } from '../config/env.js';
import tenant from '../routes/tenants.js';
import auth from '../routes/auth.js';
import course from '../routes/courses.js';
import enrollment from '../routes/enrollments.js';
import assignment from '../routes/assignments.js';
import submission from '../routes/submissions.js';
import { logger } from '../middleware/logger.js';
import { notFound } from '../middleware/notFound.js';
import { errorHandler } from '../middleware/error.js';
import { limiter } from '../middleware/limiter.js';
import { authenticateToken } from '../middleware/authentication.js';
import { setTenantContext } from '../middleware/setTenantContext.js';
import analytics from '../routes/analytics.js';
import { authorize } from '../middleware/authorization.js';

const app: Express = express();
const port: number = env.serverPort;

// body parser middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// general middlewares
app.use(helmet());
app.use(logger);

// limiter
app.use(limiter);

// routes
app.use('/api/tenants', tenant);
app.use('/api/auth', auth);
app.use('/api/courses', authenticateToken, setTenantContext, course);
app.use('/api/enrollments', authenticateToken, setTenantContext, authorize('student'), enrollment);
app.use('/api/assignments', authenticateToken, setTenantContext, assignment);
app.use('/api/submissions', authenticateToken, setTenantContext, submission);
app.use('/api/analytics', authenticateToken, setTenantContext, authorize('admin', 'instructor'), analytics)

// error handlers
app.use(notFound);
app.use(errorHandler);

// server
app.listen(port, () => console.log(`server is running on port ${port}`));
