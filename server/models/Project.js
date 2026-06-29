const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: { type: String, required: true },
  tags:        [{ type: String }],
  stack:       [{ type: String }],
  link:        { type: String, default: '' },
  codeFile:    { type: String, default: '' },
  codeLines:   [{ type: String }],
  order:       { type: Number, default: 0 },
  reversed:    { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
