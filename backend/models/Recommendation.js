const mongoose = require('mongoose');

const recommendationSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
    index: true,
  },
  conceptId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Concept',
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
  priority: {
    type: Number,
    default: 1, // 1 = highest
  },
  difficulty: {
    type: Number,
    min: 1,
    max: 5,
    default: 1,
  },
  type: {
    type: String,
    enum: ['gap_recovery', 'concept_advancement', 'micro_practice', 'review'],
    default: 'gap_recovery',
  },
  resolved: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Recommendation', recommendationSchema);
