const router = require('express').Router();
const Job = require('../models/Job');

// GET /api/jobs
router.get('/', async (req, res, next) => {
  try {
    const jobs = await Job.find({ active: true }).sort({ order: 1 });
    res.json(jobs);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
