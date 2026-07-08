require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const adminIpGuard = require('./middleware/adminIpGuard');

const app = express();

// ── DB Connection Middleware ──────────────────────────────
// Called per-request in serverless (cached via global in db.js — no overhead)
app.use(async (req, res, next) => {
  try { await connectDB(); next(); }
  catch (err) { next(err); }
});

// ── Security Headers (Helmet) ─────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: false, // Disabled to not break dev; enable in production with proper config
}));

// ── CORS ──────────────────────────────────────────────────
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    // Allow requests with no origin (mobile, curl, Postman)
    if (!origin) return cb(null, true);
    // Allow explicitly whitelisted origins
    if (allowedOrigins.includes(origin)) return cb(null, true);
    // Allow any *.vercel.app subdomain (preview deployments)
    if (/\.vercel\.app$/.test(origin)) return cb(null, true);
    cb(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

app.use(express.json({ limit: '10kb' })); // Prevent large payload attacks
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// ── Global Rate Limiter ───────────────────────────────────
// Max 100 requests per 15 minutes per IP for all routes
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', globalLimiter);

// ── Stricter limiter for form submissions ─────────────────
// Max 5 contact/apply submissions per hour per IP
const formLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { error: 'Too many submissions. Please wait an hour before trying again.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// ── Public Routes ─────────────────────────────────────────
app.use('/api/contact', formLimiter, require('./routes/contact'));
app.use('/api/careers', formLimiter, require('./routes/careers'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/testimonials', require('./routes/testimonials'));
app.use('/api/jobs', require('./routes/jobs'));
app.use('/api/stats', require('./routes/stats'));

// ── Admin Routes (IP-guarded + JWT) ──────────────────────
app.use('/api/admin', adminIpGuard);
app.use('/api/admin/auth', require('./routes/admin/auth'));
app.use('/api/admin/contacts', require('./routes/admin/contacts'));
app.use('/api/admin/applications', require('./routes/admin/applications'));
app.use('/api/admin/projects', require('./routes/admin/projects'));
app.use('/api/admin/jobs', require('./routes/admin/jobs'));
app.use('/api/admin/stats', require('./routes/admin/stats'));
app.use('/api/admin/testimonials', require('./routes/admin/testimonials'));

// ── Health check ──────────────────────────────────────────
app.get('/api/health', (req, res) => res.json({
  status: 'ok',
  timestamp: new Date(),
  db: 'atlas',
}));

// 404 catch-all for unknown API routes
app.use('/api/*', (req, res) => res.status(404).json({ error: 'API route not found' }));

// Error handler (must be last)
app.use(errorHandler);

// ── Local dev: start server when run directly ─────────────
// On Vercel: the app is exported below and Vercel calls it as a serverless fn
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Stackvine server running on http://localhost:${PORT}`);
    if (process.env.NODE_ENV === 'production') {
      const ips = process.env.ADMIN_ALLOWED_IPS || 'any';
      console.log(`🔐 Admin IP whitelist: ${ips}`);
    }
  });
}

// Export for Vercel serverless
module.exports = app;
