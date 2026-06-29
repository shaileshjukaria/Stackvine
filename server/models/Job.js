const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title:      { type: String, required: true },
  type:       { type: String, enum: ['Remote', 'Hybrid', 'On-site'], default: 'Remote' },
  department: { type: String, required: true },
  location:   { type: String, default: 'India' },
  active:     { type: Boolean, default: true },
  order:      { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);
