require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('../config/db');

const Admin = require('../models/Admin');
const Project = require('../models/Project');
const Testimonial = require('../models/Testimonial');
const Job = require('../models/Job');
const Stat = require('../models/Stat');

const seed = async () => {
  await connectDB();

  // ── Admin ────────────────────────────────────────
  await Admin.deleteMany({});
  const hash = await bcrypt.hash('Shailesh@Jukaria745', 12);
  await Admin.create({ email: 'shailesh07jukaria@gmail.com', passwordHash: hash });
  console.log('✅ Admin created — shailesh07jukaria@gmail.com');

  // ── Stats ────────────────────────────────────────
  await Stat.deleteMany({});
  await Stat.insertMany([
    { key: 'projects', value: 12, suffix: '+', label: 'Projects Built' },
    { key: 'years',    value: 3,  suffix: '',  label: 'Years Building' },
    { key: 'stacks',   value: 5,  suffix: '+', label: 'Tech Stacks' },
    { key: 'delivery', value: 100,suffix: '%', label: 'On-time Delivery' },
  ]);
  console.log('✅ Stats seeded');

  // ── Projects ──────────────────────────────────────
  await Project.deleteMany({});
  await Project.insertMany([
    {
      title: 'Imaginova',
      description: 'An AI-powered image generation platform with user authentication, subscription payments via Razorpay, and cloud storage. Built for creators who want studio-quality AI art without the complexity.',
      tags: ['AI', 'SaaS', 'Payments'],
      stack: ['React', 'Node.js', 'MongoDB', 'Cloudinary', 'Razorpay', 'OpenAI'],
      link: 'https://imaginova-ai.vercel.app',
      codeFile: 'imaginova/api/generate.js',
      codeLines: [
        "import OpenAI from 'openai'",
        "import { uploadToCloud } from '../utils'",
        '',
        'export const generateImage = async (req, res) => {',
        '  const { prompt, size } = req.body',
        "  const image = await openai.images.generate({",
        "    model: 'dall-e-3', prompt, size",
        '  })',
        '  const url = await uploadToCloud(image)',
        '  res.json({ url, credits: user.credits - 1 })',
        '}',
      ],
      order: 1,
      reversed: false,
    },
    {
      title: 'Client Project',
      description: 'Details of this project are kept confidential under NDA. Delivered on time with full client satisfaction.',
      tags: ['Confidential', 'NDA'],
      stack: ['MERN Stack'],
      link: '',
      codeFile: 'confidential/index.js',
      codeLines: [
        '// This project is under NDA',
        '// Details are kept confidential',
        '',
        '// Stack: MERN + custom integrations',
        '// Status: Delivered ✓',
        '// Client: Satisfied ✓',
      ],
      order: 2,
      reversed: true,
    },
  ]);
  console.log('✅ Projects seeded');

  // ── Testimonials ──────────────────────────────────
  await Testimonial.deleteMany({});
  await Testimonial.insertMany([
    {
      quote: 'Stackvine shipped our MVP in 5 weeks — clean code, zero drama. We raised our first round 3 months later.',
      author: 'Gagan',
      role: 'Team @ TransFi',
      initials: 'G',
      stars: 5,
      order: 1,
    },
    {
      quote: 'The AI chatbot they built cut our support tickets by 60%. Genuinely impressive technical work, and they kept us in the loop every step.',
      author: 'Shaurya',
      role: 'Team @ PW',
      initials: 'S',
      stars: 5,
      order: 2,
    },
    {
      quote: "Our SaaS was stuck in scope-creep hell before Stackvine. They re-scoped, rebuilt the backend, and launched in 4 weeks. I wish I'd hired them first.",
      author: 'Manas',
      role: 'Founder @ Propel',
      initials: 'M',
      stars: 5,
      order: 3,
    },
  ]);
  console.log('✅ Testimonials seeded');

  // ── Jobs ──────────────────────────────────────────
  await Job.deleteMany({});
  await Job.insertMany([
    { title: 'Full Stack Developer', type: 'Remote', department: 'Engineering', location: 'India', active: true, order: 1 },
    { title: 'UI/UX Designer', type: 'Remote', department: 'Design', location: 'India', active: true, order: 2 },
    { title: 'AI / ML Engineer', type: 'Remote', department: 'AI Research', location: 'India', active: true, order: 3 },
  ]);
  console.log('✅ Jobs seeded');

  console.log('\n🎉 Database seeded successfully!');
  process.exit(0);
};

seed().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
