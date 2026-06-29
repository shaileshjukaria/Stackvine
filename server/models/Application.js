const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  name:    { type: String, required: true, trim: true },
  email:   { type: String, required: true, trim: true, lowercase: true },
  role:    { type: String, required: true },
  message: { type: String, default: '' },
  read:    { type: Boolean, default: false },

  // Resume file stored as binary in MongoDB
  // Max size enforced by multer (5 MB). Formats: PDF, DOC, DOCX
  resume: {
    data:        { type: Buffer },
    contentType: { type: String },   // e.g. 'application/pdf'
    filename:    { type: String },   // original file name from applicant
    size:        { type: Number },   // bytes
  },

}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);
