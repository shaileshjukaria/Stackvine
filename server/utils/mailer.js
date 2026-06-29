const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

/**
 * Send contact form notification email
 */
const sendContactEmail = async ({ name, email, company, service, message }) => {
  if (!process.env.MAIL_USER) return; // Skip if email not configured

  const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
      <h2 style="color:#6C63FF;">New Contact Form Submission — Stackvine</h2>
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:8px;font-weight:bold;">Name</td><td style="padding:8px;">${name}</td></tr>
        <tr><td style="padding:8px;font-weight:bold;">Email</td><td style="padding:8px;">${email}</td></tr>
        <tr><td style="padding:8px;font-weight:bold;">Company</td><td style="padding:8px;">${company || '—'}</td></tr>
        <tr><td style="padding:8px;font-weight:bold;">Service</td><td style="padding:8px;">${service || '—'}</td></tr>
      </table>
      <h3>Message</h3>
      <p style="background:#f5f5f5;padding:16px;border-radius:8px;">${message}</p>
    </div>
  `;

  await transporter.sendMail({
    from: `"Stackvine" <${process.env.MAIL_USER}>`,
    to: process.env.MAIL_TO,
    subject: `New enquiry from ${name}`,
    html,
  });
};

/**
 * Send job application notification email
 */
const sendApplicationEmail = async ({ name, email, role }) => {
  if (!process.env.MAIL_USER) return;

  await transporter.sendMail({
    from: `"Stackvine" <${process.env.MAIL_USER}>`,
    to: process.env.MAIL_TO,
    subject: `New job application: ${role} — ${name}`,
    html: `<p><b>${name}</b> (${email}) applied for <b>${role}</b>.</p>`,
  });
};

module.exports = { sendContactEmail, sendApplicationEmail };
