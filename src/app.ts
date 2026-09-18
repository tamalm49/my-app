import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import path from 'node:path';
import './global.js';
import { errorHandler } from './middlewares/error-handler.js';
import { notFoundHandler } from './middlewares/notfound-handler.js';
import { healthCheck } from './middlewares/health.js';
import { corsOptions } from './configs/config.js';
import { requestContext } from './middlewares/request-context.js';
import { limiter } from './utils/rate-limiter.js';
import aiRouter from './routers/ai-routers.js';
import authRouter from './routers/auth-routers.js';
import { requireSession } from './utils/requires-session.js';
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.resolve(process.cwd(), 'views'));
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(limiter); // Apply rate limiting to all /api routes
app.use(requestContext);
app.get('/', (_req, res) => {
  res.send(`
    <h1>Azure AD — backend-controlled login demo</h1>
    <p><a href="/api/auth/login">Sign in with Azure AD</a></p>
    <p><a href="/dashboard">Go to dashboard</a> (will redirect to sign-in if not authenticated)</p>
  `);
});
app.use('/dashboard', requireSession, (_req, res) => {
  res.send(`
    <h1>Dashboard</h1>
    <p>Welcome to the dashboard! You are authenticated.</p>
    <p><a href="/api/auth/logout">Logout</a></p>
  `);
});

app.use('/health', healthCheck);
app.use('/api/auth', authRouter);
app.use('/api/ai', aiRouter);
app.use('/public', express.static(path.resolve(process.cwd(), 'public')));
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
