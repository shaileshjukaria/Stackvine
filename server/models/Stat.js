const mongoose = require('mongoose');

const statSchema = new mongoose.Schema({
  key:    { type: String, required: true, unique: true },
  value:  { type: Number, required: true },
  suffix: { type: String, default: '' },
  label:  { type: String, required: true },
});

module.exports = mongoose.model('Stat', statSchema);
