const router = require('express').Router();
const Testimonial = require('../models/Testimonial');

// GET /api/testimonials
router.get('/', async (req, res, next) => {
  try {
    const testimonials = await Testimonial.find().sort({ order: 1 });
    res.json(testimonials);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
