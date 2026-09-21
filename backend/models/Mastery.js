const mongoose = require('mongoose');

const masterySchema = new mongoose.Schema({
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
    index: true,
  },
  probability: {
    type: Number,
    required: true,
    min: 0.0,
    max: 1.0,
    default: 0.30,
  },
  pTransition: {
    type: Number,
    default: 0.15,
  },
  pGuess: {
    type: Number,
    default: 0.20,
  },
  pSlip: {
    type: Number,
    default: 0.10,
  },
  consecutiveCorrect: {
    type: Number,
    default: 0,
  },
  consecutiveIncorrect: {
    type: Number,
    default: 0,
  },
  currentDifficulty: {
    type: Number,
    default: 2,
    min: 1,
    max: 5,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

masterySchema.index({ studentId: 1, conceptId: 1 }, { unique: true });

module.exports = mongoose.model('Mastery', masterySchema);
