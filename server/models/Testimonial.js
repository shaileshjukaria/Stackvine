const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  quote:   { type: String, required: true },
  author:  { type: String, required: true },
  role:    { type: String, required: true },
  initials:{ type: String, required: true },
  stars:   { type: Number, default: 5, min: 1, max: 5 },
  order:   { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Testimonial', testimonialSchema);
