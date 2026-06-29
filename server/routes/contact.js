const router = require('express').Router();
const { body, validationResult } = require('express-validator');
const Contact = require('../models/Contact');
const { sendMail } = require('../utils/mailer');

const validate = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 100 }),
  body('email').trim().isEmail().withMessage('Valid email required').normalizeEmail(),
  body('message').trim().notEmpty().withMessage('Message is required').isLength({ max: 2000 }),
  body('service').optional().trim().isLength({ max: 100 }),
  body('company').optional().trim().isLength({ max: 100 }),
];

// POST /api/contact
router.post('/', validate, async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  try {
    const { name, email, company, service, message } = req.body;

    // Save to MongoDB
    const contact = await Contact.create({ name, email, company, service, message });

    // ── Email notification to admin ─────────────────────────
    // Uncomment and configure MAIL_USER + MAIL_PASS in .env to activate
    /*
    await sendMail({
      to: process.env.MAIL_TO || 'hello@stackvine.io',
      subject: `🚀 New Contact from ${name}${service ? ` — ${service}` : ''}`,
      html: `
        <h2>New contact submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
        ${company ? `<p><strong>Company:</strong> ${company}</p>` : ''}
        ${service ? `<p><strong>Service:</strong> ${service}</p>` : ''}
        <p><strong>Message:</strong></p>
        <blockquote style="border-left:3px solid #6C63FF;padding-left:12px;color:#555">${message.replace(/\n/g,'<br>')}</blockquote>
        <hr>
        <p style="color:#999;font-size:12px">Submitted at ${new Date().toLocaleString('en-IN', {timeZone:'Asia/Kolkata'})}</p>
      `,
    });

    // ── Auto-reply to sender ────────────────────────────────
    await sendMail({
      to: email,
      subject: `Thanks for reaching out, ${name.split(' ')[0]}! — Stackvine`,
      html: `
        <h2>We got your message!</h2>
        <p>Hi ${name.split(' ')[0]},</p>
        <p>Thanks for reaching out to Stackvine. We've received your message and will get back to you within 24 hours.</p>
        <p>Here's a summary of what you sent us:</p>
        <blockquote style="border-left:3px solid #6C63FF;padding-left:12px;color:#555">${message.replace(/\n/g,'<br>')}</blockquote>
        <p>In the meantime, feel free to browse our work or follow us on LinkedIn.</p>
        <p>— The Stackvine Team</p>
      `,
    });
    */

    res.status(201).json({ success: true, id: contact._id });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
