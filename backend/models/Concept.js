const mongoose = require('mongoose');

const conceptSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  difficulty: {
    type: Number,
    min: 1,
    max: 5,
    default: 1,
  },
  masteryThreshold: {
    type: Number,
    default: 0.75,
  },
  category: {
    type: String,
    default: 'Algebra & Foundations',
  },
  orderIndex: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model('Concept', conceptSchema);
