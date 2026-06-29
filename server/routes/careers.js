const router = require('express').Router();
const multer = require('multer');
const { body, validationResult } = require('express-validator');
const Application = require('../models/Application');
const { sendMail } = require('../utils/mailer');

// ── Multer — memory storage, 5 MB limit, allowed types ───────
const ALLOWED_MIME = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (req, file, cb) => {
    if (ALLOWED_MIME.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF, DOC, and DOCX files are allowed.'));
    }
  },
});

// Text-field validation (runs after multer parses the form)
const validate = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 100 }),
  body('email').trim().isEmail().withMessage('Valid email required').normalizeEmail(),
  body('role').trim().notEmpty().withMessage('Role is required').isLength({ max: 100 }),
  body('message').optional().trim().isLength({ max: 1000 }),
];

// POST /api/careers/apply  (multipart/form-data)
router.post('/apply', upload.single('resume'), validate, async (req, res, next) => {
  // Handle multer errors (wrong file type, too large)
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  try {
    const { name, email, role, message } = req.body;

    const applicationData = {
      name,
      email,
      role,
      message: message || '',
    };

    // Attach resume if uploaded
    if (req.file) {
      applicationData.resume = {
        data:        req.file.buffer,
        contentType: req.file.mimetype,
        filename:    req.file.originalname,
        size:        req.file.size,
      };
    }

    const application = await Application.create(applicationData);

    // ── Email notification to admin ─────────────────────────
    // Uncomment and set MAIL_USER + MAIL_PASS in .env to activate
    /*
    const hasResume = !!req.file;
    await sendMail({
      to: process.env.MAIL_TO || 'hello@stackvine.io',
      subject: `👤 New Application: ${role} from ${name}`,
      html: `
        <h2>New job application</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
        <p><strong>Role:</strong> ${role}</p>
        ${message ? `<p><strong>Cover note:</strong></p><blockquote style="border-left:3px solid #6C63FF;padding-left:12px;color:#555">${message.replace(/\n/g,'<br>')}</blockquote>` : ''}
        <p><strong>Resume:</strong> ${hasResume ? `Attached (${req.file.originalname})` : 'Not uploaded'}</p>
        <p><a href="http://localhost:5000/api/careers/resume/${application._id}" style="background:#6C63FF;color:#fff;padding:8px 16px;border-radius:6px;text-decoration:none">Download Resume</a></p>
        <hr>
        <p style="color:#999;font-size:12px">Applied at ${new Date().toLocaleString('en-IN', {timeZone:'Asia/Kolkata'})}</p>
      `,
    });

    await sendMail({
      to: email,
      subject: `We've received your application, ${name.split(' ')[0]}! — Stackvine`,
      html: `
        <h2>Application received! 🎉</h2>
        <p>Hi ${name.split(' ')[0]},</p>
        <p>Thanks for applying for the <strong>${role}</strong> position at Stackvine.</p>
        <p>We review all applications personally and will be in touch within 3–5 business days if your profile is a good match.</p>
        <p>— The Stackvine Team</p>
      `,
    });
    */

    res.status(201).json({ success: true, id: application._id });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
