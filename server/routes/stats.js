const router = require('express').Router();
const Stat = require('../models/Stat');

// GET /api/stats
router.get('/', async (req, res, next) => {
  try {
    const stats = await Stat.find();
    res.json(stats);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
